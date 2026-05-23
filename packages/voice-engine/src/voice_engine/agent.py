"""The engine.

One Agent class. One entrypoint function. Behaviour is driven entirely by
a PersonaConfig loaded from YAML. To ship a new voice app, write a YAML
file and point VOICE_PERSONA at it — no code changes.
"""

from __future__ import annotations

import logging
import os
from typing import Any

from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, RoomInputOptions
from livekit.plugins import silero

from voice_engine.config import Mode, PersonaConfig
from voice_engine.memory import MemoryStore
from voice_engine.providers import build_llm, build_realtime, build_stt, build_tts
from voice_engine.tools import build_mcp_servers

logger = logging.getLogger("voice_engine")


class PersonaAgent(Agent):
    """Generic agent — its identity is fully expressed by persona.system_prompt
    and the MCP servers attached at session level."""

    def __init__(self, persona: PersonaConfig, recalled_memory: str = "") -> None:
        prompt = persona.system_prompt
        if recalled_memory:
            prompt = f"{prompt}\n\n{recalled_memory}"
        super().__init__(instructions=prompt)
        self.persona = persona


def _user_id_for(persona: PersonaConfig, ctx: JobContext) -> str:
    """Choose a stable per-user key for memory."""
    strategy = persona.memory.user_id_strategy
    if strategy == "room_name":
        return ctx.room.name
    # default: participant identity (first remote participant)
    for p in ctx.room.remote_participants.values():
        return p.identity
    return ctx.room.name


def _build_noise_cancellation(persona: PersonaConfig):
    if not persona.turn_detection.use_noise_cancellation:
        return None
    try:
        from livekit.plugins import noise_cancellation
        return noise_cancellation.BVC()  # Background Voice Cancellation (Krisp)
    except ImportError:
        logger.warning("livekit-plugins-noise-cancellation not installed — skipping NC")
        return None


def _build_turn_detector(persona: PersonaConfig):
    if not persona.turn_detection.use_semantic_turn_detector:
        return None
    if persona.mode == Mode.REALTIME:
        # Realtime models do their own turn detection (semantic VAD).
        return None
    try:
        from livekit.plugins.turn_detector.multilingual import MultilingualModel
        return MultilingualModel()
    except ImportError:
        logger.warning("turn-detector plugin not installed — falling back to VAD only")
        return None


async def entrypoint(ctx: JobContext, persona: PersonaConfig) -> None:
    """LiveKit Agents entrypoint. Called once per room/session."""
    logger.info("starting persona=%s mode=%s", persona.name, persona.mode.value)

    await ctx.connect()

    memory = MemoryStore(persona.memory)
    user_id = _user_id_for(persona, ctx)
    recalled = await memory.recall(user_id=user_id, query=persona.name, limit=5)

    mcp_servers = build_mcp_servers(persona.mcp_servers)
    nc = _build_noise_cancellation(persona)
    turn_detector = _build_turn_detector(persona)

    # ── Build the session: cascaded OR realtime ─────────────────────────
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

    room_input_options = RoomInputOptions(noise_cancellation=nc) if nc else RoomInputOptions()

    await session.start(
        agent=PersonaAgent(persona, recalled_memory=recalled),
        room=ctx.room,
        room_input_options=room_input_options,
    )

    if persona.greeting:
        await session.generate_reply(instructions=f"Greet the user: {persona.greeting}")

    # Persist what we learned at end of session
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

    ctx.add_shutdown_callback(_on_shutdown)


def make_worker(persona: PersonaConfig) -> agents.WorkerOptions:
    """Bind a persona to a LiveKit worker. One worker = one persona."""

    async def _entry(ctx: JobContext) -> None:
        await entrypoint(ctx, persona)

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
