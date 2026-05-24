"""Router persona — builds a dynamic intent-classifier system prompt.

The router is just a persona whose system prompt is auto-generated from
the registry's available personas. It asks 1-2 clarifying questions, then
calls the `handoff_to(persona_name)` tool to swap the active agent.

The handoff itself is implemented in the engine (`agent.py`) by listening
for a function-call event. We keep this module declarative so the same
router definition works in cascaded or realtime mode.
"""

from __future__ import annotations

from voice_engine.config import (
    LLMConfig,
    Mode,
    PersonaConfig,
    STTConfig,
    TTSConfig,
    TurnDetectionConfig,
)
from voice_engine.orchestration.registry import PersonaRegistry


ROUTER_PROMPT_TEMPLATE = """You are the front-door voice agent for a multi-persona system.

Your only job is to figure out which specialist persona the caller needs,
then hand off. You do NOT try to solve their problem yourself.

How you handle a call:
  1. Greet briefly: "Hey — what can I help you with today?"
  2. Listen. If the intent is obvious in one sentence, hand off.
  3. If not, ask ONE clarifying question. Then hand off.
  4. To hand off, call the `handoff_to` function with the persona name.

Available specialist personas:

{persona_catalog}

Hard rules:
  - Never spend more than 2 turns choosing. If unsure, pick the closest
    match and let the specialist re-route if needed.
  - Never invent persona names. Use only the names listed above.
  - Be warm, brief, and natural — you are a receptionist, not an interview.
"""


def _format_catalog(registry: PersonaRegistry) -> str:
    lines = []
    for d in registry.describe():
        if "error" in d:
            continue
        if d["name"] == "router":
            continue  # don't list self
        lines.append(f"  - {d['name']}: {d['description']}")
    return "\n".join(lines) if lines else "  (no personas registered)"


def build_router_agent(registry: PersonaRegistry) -> PersonaConfig:
    """Generate a PersonaConfig that routes between registered personas.

    Defaults to cascaded mode for cost — the router rarely speaks more than
    2 turns per call so latency matters less than reasoning accuracy.
    """
    catalog = _format_catalog(registry)
    return PersonaConfig(
        name="router",
        description="Auto-generated front-door router across registered personas.",
        version="1.0.0",
        mode=Mode.CASCADED,
        system_prompt=ROUTER_PROMPT_TEMPLATE.format(persona_catalog=catalog),
        greeting="Hey — what can I help you with today?",
        stt=STTConfig(),
        llm=LLMConfig(provider="openai", model="gpt-4o-mini", temperature=0.3, max_tokens=200),
        tts=TTSConfig(),
        turn_detection=TurnDetectionConfig(min_endpointing_delay=0.3),
    )
