"""Doctor diagnostic tests — env detection, per-persona readiness, plugin imports."""

from __future__ import annotations

import os
from pathlib import Path

from voice_engine.config import load_persona
from voice_engine.doctor import (
    check_livekit_auth,
    check_livekit_env,
    check_persona,
    check_plugin_import,
    report,
)

PERSONA_DIR = Path(__file__).resolve().parent.parent / "personas"


def test_check_livekit_env_reports_missing(monkeypatch) -> None:
    for v in ("LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"):
        monkeypatch.delenv(v, raising=False)
    ok, missing = check_livekit_env()
    assert ok is False
    assert set(missing) == {"LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"}


def test_check_livekit_env_passes_when_set(monkeypatch) -> None:
    monkeypatch.setenv("LIVEKIT_URL", "wss://test")
    monkeypatch.setenv("LIVEKIT_API_KEY", "k")
    monkeypatch.setenv("LIVEKIT_API_SECRET", "s")
    ok, missing = check_livekit_env()
    assert ok is True
    assert missing == []


def test_check_livekit_auth_mints_token_with_dummy_keys(monkeypatch) -> None:
    monkeypatch.setenv("LIVEKIT_API_KEY", "APIabc123")
    monkeypatch.setenv("LIVEKIT_API_SECRET", "secret-at-least-32-chars-long-xxxxxxx")
    ok, note = check_livekit_auth()
    # Token mint is purely local (JWT signing) so dummy keys work.
    assert ok is True
    assert note == "ok"


def test_check_persona_voice_coach_missing_keys(monkeypatch) -> None:
    for v in ("DEEPGRAM_API_KEY", "OPENAI_API_KEY"):
        monkeypatch.delenv(v, raising=False)
    p = load_persona(PERSONA_DIR / "voice_coach.yaml")
    r = check_persona(p)
    assert r.ready is False
    # voice_coach v1.1: Deepgram (STT) + OpenAI (brain AND TTS).
    assert set(r.missing) == {"DEEPGRAM_API_KEY", "OPENAI_API_KEY"}


def test_check_persona_with_all_keys_present(monkeypatch) -> None:
    for v in ("DEEPGRAM_API_KEY", "OPENAI_API_KEY"):
        monkeypatch.setenv(v, "test")
    p = load_persona(PERSONA_DIR / "voice_coach.yaml")
    r = check_persona(p)
    assert r.ready is True
    assert r.missing == []


def test_check_persona_flags_placeholder_mcp() -> None:
    p = load_persona(PERSONA_DIR / "sales_agent.yaml")
    r = check_persona(p)
    assert any("placeholder URLs" in n for n in r.notes)


def test_plugin_imports_work() -> None:
    # All plugins listed in pyproject must import.
    for mod in (
        "livekit.agents",
        "livekit.plugins.deepgram",
        "livekit.plugins.anthropic",
        "livekit.plugins.openai",
        "livekit.plugins.cartesia",
        "livekit.plugins.elevenlabs",
        "livekit.plugins.silero",
    ):
        assert check_plugin_import(mod), f"{mod} failed to import"


def test_full_report_structure() -> None:
    r = report(PERSONA_DIR)
    assert "livekit_env_ok" in r
    assert "plugins" in r
    assert "personas" in r
    # All 16 personas appear in the report.
    assert len(r["personas"]) >= 16
