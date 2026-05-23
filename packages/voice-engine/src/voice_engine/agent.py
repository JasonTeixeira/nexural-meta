"""The engine.

One Agent class. One entrypoint function. Behaviour is driven entirely by
a PersonaConfig loaded from YAML. To ship a new voice app, write a YAML
file and point VOICE_PERSONA at it — no code changes.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

from livekit import agents
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    RoomInputOptions,
    function_tool,
)
from livekit.plugins import silero

from voice_engine.config import Mode, PersonaConfig
from voice_engine.cost_cap import CostCapWatcher
from voice_engine.memory import MemoryStore
from voice_engine.orchestration.registry import PersonaRegistry
from voice_engine.orchestration.supervisor import SupervisorClient
from voice_engine.outputs import OUTPUT_SCHEMAS
from voice_engine.providers import build_llm, build_realtime, build_stt, build_tts
from voice_engine.telemetry import (
    SessionTelemetry,
    TelemetrySink,
    default_sink_from_env,
    new_session_id,
)
from voice_engine.tools import build_mcp_servers

logger = logging.getLogger("voice_engine")


# ─────────────────────────────────────────────────────────────────────────────
# Persona-driven agent with optional handoff + supervisor tools
# ─────────────────────────────────────────────────────────────────────────────


def _build_persona_agent_class(
    persona: PersonaConfig,
    registry: PersonaRegistry | None,
    supervisor: SupervisorClient | None,
) -> type[Agent]:
    """Dynamically build an Agent subclass with the right function tools wired up.

    LiveKit's `@function_tool` decorator inspects the method at class-definition
    time, so we build a class per persona — never per session. This is cheap.
    """

    handoff_targets = list(persona.orchestration.handoff_targets) if registry else []
    supervisor_enabled = supervisor is not None and persona.orchestration.supervisor.enabled

    class _PersonaAgent(Agent):
        def __init__(self, recalled_memory: str = "") -> None:
            prompt = persona.system_prompt
            if recalled_memory:
                prompt = f"{prompt}\n\n{recalled_memory}"
            if handoff_targets:
                prompt += (
                    "\n\nIf the caller's needs are clearly outside your specialty, "
                    "call `handoff_to` with one of: " + ", ".join(handoff_targets) + "."
                )
            if supervisor_enabled:
                prompt += (
                    "\n\nFor any question that needs deeper reasoning, research, "
                    "math, or careful policy thinking, call `consult_supervisor` "
                    "with a focused question. You'll get a short expert answer back. "
                    "While you wait, fill with a brief acknowledgement ('let me think on that')."
                )
            super().__init__(instructions=prompt)
            self.persona = persona

    if supervisor_enabled:

        @function_tool
        async def consult_supervisor(self, question: str) -> str:  # noqa: ARG001
            """Ask the silent reasoning supervisor a focused question. Returns a short answer."""
            assert supervisor is not None  # for mypy
            return await supervisor.consult(question)

        setattr(_PersonaAgent, "consult_supervisor", consult_supervisor)

    if handoff_targets and registry:

        @function_tool
        async def handoff_to(self, persona_name: str) -> Agent:  # noqa: ARG001
            """Transfer the call to another specialist persona by name."""
            if persona_name not in handoff_targets:
                raise ValueError(
                    f"persona '{persona_name}' is not an allowed handoff target"
                )
            target = registry.get(persona_name)
            NextCls = _build_persona_agent_class(target, registry, supervisor)
            return NextCls()

        setattr(_PersonaAgent, "handoff_to", handoff_to)

    # ── Structured output tool ──
    if persona.output_schema and persona.output_schema in OUTPUT_SCHEMAS:
        schema_cls = OUTPUT_SCHEMAS[persona.output_schema]
        schema_name = persona.output_schema

        @function_tool
        async def submit_output(self, **kwargs) -> str:  # noqa: ARG001
            """Finalise and submit the structured deliverable for this call.

            Call this exactly once, near the end of the conversation, with
            all the fields the schema expects.
            """
            try:
                obj = schema_cls(**kwargs)
            except Exception as e:
                return f"Validation error: {e}. Please fix and resubmit."
            telemetry_sink = getattr(self, "_telemetry_sink", None)
            session_id = getattr(self, "_session_id", "unknown")
            if telemetry_sink is not None:
                telemetry_sink.record_event(
                    session_id,
                    f"output.{schema_name}",
                    {"data": obj.model_dump(mode="json")},
                )
            return "Submitted. Thank you."

        setattr(_PersonaAgent, "submit_output", submit_output)

    return _PersonaAgent


# ─────────────────────────────────────────────────────────────────────────────
# Session wiring
# ─────────────────────────────────────────────────────────────────────────────


def _user_id_for(persona: PersonaConfig, ctx: JobContext) -> str:
    strategy = persona.memory.user_id_strategy
    if strategy == "room_name":
        raw = ctx.room.name
    else:
        raw = ctx.room.name
        for p in ctx.room.remote_participants.values():
            raw = p.identity
            break
    # Namespace per app if configured — prevents cross-product memory leakage.
    app_id = persona.memory.app_id
    return f"{app_id}:{raw}" if app_id else raw


def _build_noise_cancellation(persona: PersonaConfig):
    if not persona.turn_detection.use_noise_cancellation:
        return None
    try:
        from livekit.plugins import noise_cancellation
        return noise_cancellation.BVC()
    except ImportError:
        logger.warning("noise-cancellation plugin not installed — skipping NC")
        return None


def _build_turn_detector(persona: PersonaConfig):
    if not persona.turn_detection.use_semantic_turn_detector:
        return None
    if persona.mode == Mode.REALTIME:
        return None
    try:
        from livekit.plugins.turn_detector.multilingual import MultilingualModel
        return MultilingualModel()
    except ImportError:
        logger.warning("turn-detector not installed — falling back to VAD only")
        return None


async def entrypoint(
    ctx: JobContext,
    persona: PersonaConfig,
    *,
    registry: PersonaRegistry | None = None,
    telemetry_sink: TelemetrySink | None = None,
) -> None:
    """LiveKit Agents entrypoint. Called once per room/session."""
    logger.info("starting persona=%s mode=%s", persona.name, persona.mode.value)

    await ctx.connect()

    # ── Telemetry ─────────────────────────────────────────────────
    sink = telemetry_sink if telemetry_sink is not None else default_sink_from_env()
    if not persona.recording.telemetry:
        sink.enabled = False
    session_id = new_session_id()
    identity = None
    for p in ctx.room.remote_participants.values():
        identity = p.identity
        break
    if persona.mode == Mode.REALTIME:
        stt_model = llm_model = tts_model = persona.realtime.model
        cost_key = f"{persona.realtime.provider.value}:{persona.realtime.model}"
    else:
        stt_model = persona.stt.model
        llm_model = persona.llm.model
        tts_model = persona.tts.model
        cost_key = f"{persona.llm.provider.value}:{persona.llm.model}"
    telemetry = SessionTelemetry(
        sink=sink,
        session_id=session_id,
        persona_name=persona.name,
        room_name=ctx.room.name,
        identity=identity,
        mode=persona.mode.value,
        stt_model=stt_model,
        llm_model=llm_model,
        tts_model=tts_model,
        cost_model_key=cost_key,
    )

    memory = MemoryStore(persona.memory)
    user_id = _user_id_for(persona, ctx)
    recalled = await memory.recall(user_id=user_id, query=persona.name, limit=5)

    supervisor = (
        SupervisorClient(
            model=persona.orchestration.supervisor.model,
            max_tokens=persona.orchestration.supervisor.max_tokens,
            temperature=persona.orchestration.supervisor.temperature,
        )
        if persona.orchestration.supervisor.enabled
        else None
    )

    mcp_servers = build_mcp_servers(persona.mcp_servers)
    nc = _build_noise_cancellation(persona)
    turn_detector = _build_turn_detector(persona)

    session_kwargs: dict[str, Any] = {
        "vad": silero.VAD.load(),
        "min_endpointing_delay": persona.turn_detection.min_endpointing_delay,
        "max_endpointing_delay": persona.turn_detection.max_endpointing_delay,
    }
    if turn_detector is not None:
        session_kwargs["turn_detection"] = turn_detector
    if mcp_servers:
        session_kwargs["mcp_servers"] = mcp_servers

    if persona.mode == Mode.REALTIME:
        session_kwargs["llm"] = build_realtime(persona.realtime)
    else:
        session_kwargs["stt"] = build_stt(persona.stt)
        session_kwargs["llm"] = build_llm(persona.llm)
        session_kwargs["tts"] = build_tts(persona.tts)

    session = AgentSession(**session_kwargs)

    # Cost-cap watcher hooks into the same turn flow as telemetry.
    async def _on_cap_breach(total: float) -> None:
        try:
            await session.generate_reply(
                instructions=(
                    "I'm going to have to wrap things up here. "
                    "Thanks for the conversation — bye for now."
                )
            )
        except Exception:  # noqa: BLE001
            pass
        # Schedule disconnect so the closing line can play first.
        async def _delayed_disconnect() -> None:
            import asyncio
            await asyncio.sleep(2.5)
            try:
                await ctx.shutdown(reason="cost_cap_breach")
            except Exception:  # noqa: BLE001
                pass
        import asyncio
        asyncio.create_task(_delayed_disconnect())  # noqa: RUF006

    cost_watcher = CostCapWatcher(persona.cost_cap, on_breach=_on_cap_breach)
    telemetry._cost_watcher = cost_watcher  # type: ignore[attr-defined]

    # Attach telemetry BEFORE start so we capture the greeting turn too.
    telemetry.attach(session)

    room_input_options = RoomInputOptions(noise_cancellation=nc) if nc else RoomInputOptions()

    PersonaAgentCls = _build_persona_agent_class(persona, registry, supervisor)
    agent_instance = PersonaAgentCls(recalled_memory=recalled)
    # Stash refs the structured-output tool needs.
    agent_instance._telemetry_sink = sink  # type: ignore[attr-defined]
    agent_instance._session_id = session_id  # type: ignore[attr-defined]
    await session.start(
        agent=agent_instance,
        room=ctx.room,
        room_input_options=room_input_options,
    )

    if persona.greeting:
        await session.generate_reply(instructions=f"Greet the user: {persona.greeting}")

    async def _on_shutdown() -> None:
        try:
            history = session.history.to_dict().get("items", [])
            msgs = [
                {"role": m.get("role"), "content": m.get("content")}
                for m in history
                if m.get("role") in ("user", "assistant")
            ]
            if msgs:
                await memory.add(user_id=user_id, messages=msgs)
        except Exception as e:  # noqa: BLE001
            logger.warning("shutdown memory write failed: %s", e)
        finally:
            telemetry.close()

    ctx.add_shutdown_callback(_on_shutdown)


def make_worker(
    persona: PersonaConfig,
    *,
    registry_dir: str | Path | None = None,
) -> agents.WorkerOptions:
    """Bind a persona to a LiveKit worker. One worker = one persona.

    If `registry_dir` is provided, handoff_to() can route to any persona
    in that directory.
    """
    registry = PersonaRegistry(registry_dir) if registry_dir else None

    async def _entry(ctx: JobContext) -> None:
        await entrypoint(ctx, persona, registry=registry)

    return agents.WorkerOptions(
        entrypoint_fnc=_entry,
        agent_name=persona.name,
    )


def _configure_logging() -> None:
    level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=level,
        format="%(asctime)s %(levelname)s %(name)s — %(message)s",
    )
