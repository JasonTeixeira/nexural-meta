"""Smoke tests — verify every shipped persona parses and provider config is coherent.

No network calls. No API keys required.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from voice_engine.config import Mode, PersonaConfig, load_persona

PERSONA_DIR = Path(__file__).resolve().parent.parent / "personas"


@pytest.fixture(scope="module")
def persona_files() -> list[Path]:
    files = sorted(PERSONA_DIR.glob("*.yaml"))
    assert files, f"no persona files found in {PERSONA_DIR}"
    return files


def test_personas_parse(persona_files: list[Path]) -> None:
    for f in persona_files:
        persona = load_persona(f)
        assert isinstance(persona, PersonaConfig)
        assert persona.name, f"{f.name}: missing name"
        assert persona.system_prompt.strip(), f"{f.name}: empty system_prompt"


def test_realtime_personas_have_realtime_config(persona_files: list[Path]) -> None:
    for f in persona_files:
        persona = load_persona(f)
        if persona.mode == Mode.REALTIME:
            assert persona.realtime.voice, f"{f.name}: realtime mode needs a voice"


def test_cascaded_personas_have_full_stack(persona_files: list[Path]) -> None:
    for f in persona_files:
        persona = load_persona(f)
        if persona.mode == Mode.CASCADED:
            assert persona.stt.provider
            assert persona.llm.provider
            assert persona.tts.provider
            assert persona.tts.voice, f"{f.name}: cascaded mode needs a TTS voice"


def test_mcp_server_exclusive_transport() -> None:
    """Each MCP server must define exactly one of url or command."""
    from pydantic import ValidationError

    from voice_engine.config import MCPServerConfig

    # url-only — ok
    MCPServerConfig(name="ok-url", url="https://x.example/mcp")
    # command-only — ok
    MCPServerConfig(name="ok-cmd", command="node", args=["server.js"])
    # both — error
    with pytest.raises(ValidationError):
        MCPServerConfig(name="bad", url="https://x", command="node")
    # neither — error
    with pytest.raises(ValidationError):
        MCPServerConfig(name="bad")
