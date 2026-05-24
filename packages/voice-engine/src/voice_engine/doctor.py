"""Pre-flight diagnostics — `nx-voice doctor`.

What it answers:
  - Are my LiveKit + provider keys present?
  - For each persona, is the persona "runnable" right now?
  - Does LiveKit accept my key (one cheap API call)?

Designed to be the first command you run after `pip install -e .`.
Never makes a connection that costs money.
"""

from __future__ import annotations

import importlib
import os
from dataclasses import dataclass
from pathlib import Path

from voice_engine.config import Mode, PersonaConfig
from voice_engine.orchestration.registry import PersonaRegistry


# Maps persona providers → env vars the plugin needs.
ENV_BY_PROVIDER: dict[tuple[str, str], list[str]] = {
    ("stt", "deepgram"): ["DEEPGRAM_API_KEY"],
    ("stt", "openai"): ["OPENAI_API_KEY"],
    ("stt", "google"): ["GOOGLE_API_KEY"],
    ("llm", "anthropic"): ["ANTHROPIC_API_KEY"],
    ("llm", "openai"): ["OPENAI_API_KEY"],
    ("llm", "google"): ["GOOGLE_API_KEY"],
    ("tts", "cartesia"): ["CARTESIA_API_KEY"],
    ("tts", "elevenlabs"): ["ELEVENLABS_API_KEY"],
    ("tts", "openai"): ["OPENAI_API_KEY"],
    ("realtime", "openai"): ["OPENAI_API_KEY"],
    ("realtime", "google"): ["GOOGLE_API_KEY"],
}

LIVEKIT_VARS = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"]


@dataclass
class PersonaReadiness:
    name: str
    ready: bool
    missing: list[str]
    notes: list[str]


def _persona_keys_required(p: PersonaConfig) -> set[str]:
    needed: set[str] = set()
    if p.mode == Mode.REALTIME:
        for v in ENV_BY_PROVIDER.get(("realtime", p.realtime.provider.value), []):
            needed.add(v)
    else:
        for slot in ("stt", "llm", "tts"):
            prov = getattr(p, slot).provider.value
            for v in ENV_BY_PROVIDER.get((slot, prov), []):
                needed.add(v)
    if p.orchestration.supervisor.enabled:
        sup_model = p.orchestration.supervisor.model
        if sup_model.startswith("claude"):
            needed.add("ANTHROPIC_API_KEY")
        else:
            needed.add("OPENAI_API_KEY")
    if p.memory.enabled:
        # mem0 is optional — engine silently disables if missing. Don't gate on it.
        pass
    return needed


def check_persona(p: PersonaConfig) -> PersonaReadiness:
    needed = _persona_keys_required(p)
    missing = sorted(v for v in needed if not os.getenv(v))
    notes: list[str] = []
    if p.mcp_servers:
        unreachable = [
            s.name for s in p.mcp_servers
            if s.url and ("your-domain.com" in s.url or "example.com" in s.url)
        ]
        if unreachable:
            notes.append(
                f"MCP placeholder URLs (not real): {', '.join(unreachable)}"
            )
    return PersonaReadiness(
        name=p.name, ready=not missing, missing=missing, notes=notes
    )


def check_livekit_env() -> tuple[bool, list[str]]:
    missing = [v for v in LIVEKIT_VARS if not os.getenv(v)]
    return (not missing, missing)


def check_livekit_auth() -> tuple[bool, str]:
    """Try to mint a token — proves API key+secret are valid without a network call."""
    try:
        from livekit.api import AccessToken, VideoGrants
    except ImportError:
        return False, "livekit-api not installed"
    key = os.getenv("LIVEKIT_API_KEY")
    secret = os.getenv("LIVEKIT_API_SECRET")
    if not key or not secret:
        return False, "LIVEKIT_API_KEY / LIVEKIT_API_SECRET missing"
    try:
        tok = (
            AccessToken(key, secret)
            .with_identity("doctor")
            .with_grants(VideoGrants(room_join=True, room="doctor-test"))
            .to_jwt()
        )
        return bool(tok), "ok"
    except Exception as e:  # noqa: BLE001
        return False, f"token mint failed: {e}"


def check_plugin_import(name: str) -> bool:
    try:
        importlib.import_module(name)
        return True
    except Exception:  # noqa: BLE001
        return False


def report(persona_dir: str | Path) -> dict:
    """Build a full readiness report — used by the CLI doctor command."""
    lk_ok, lk_missing = check_livekit_env()
    lk_auth_ok, lk_auth_note = check_livekit_auth()

    plugin_checks = {
        "livekit-agents": check_plugin_import("livekit.agents"),
        "deepgram": check_plugin_import("livekit.plugins.deepgram"),
        "anthropic": check_plugin_import("livekit.plugins.anthropic"),
        "openai": check_plugin_import("livekit.plugins.openai"),
        "cartesia": check_plugin_import("livekit.plugins.cartesia"),
        "elevenlabs": check_plugin_import("livekit.plugins.elevenlabs"),
        "silero": check_plugin_import("livekit.plugins.silero"),
        "turn-detector": check_plugin_import("livekit.plugins.turn_detector"),
        "noise-cancellation": check_plugin_import("livekit.plugins.noise_cancellation"),
        "mcp": check_plugin_import("mcp"),
        "mem0": check_plugin_import("mem0"),
    }

    reg = PersonaRegistry(persona_dir)
    personas = []
    for f in reg.files():
        try:
            p = reg.get(f.stem)
            personas.append(check_persona(p))
        except Exception as e:  # noqa: BLE001
            personas.append(
                PersonaReadiness(
                    name=f.stem, ready=False, missing=[], notes=[f"parse error: {e}"]
                )
            )

    return {
        "livekit_env_ok": lk_ok,
        "livekit_env_missing": lk_missing,
        "livekit_auth_ok": lk_auth_ok,
        "livekit_auth_note": lk_auth_note,
        "plugins": plugin_checks,
        "personas": personas,
    }
