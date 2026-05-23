"""Provider fallback tests — config parsing, factory wrapping behavior."""

from __future__ import annotations

from voice_engine.config import LLMConfig, STTConfig, TTSConfig


def test_stt_config_default_has_no_fallbacks() -> None:
    assert STTConfig().fallbacks == []


def test_stt_config_accepts_fallback_list() -> None:
    cfg = STTConfig(
        provider="deepgram",
        fallbacks=[
            {"provider": "openai", "model": "whisper-1"},
        ],
    )
    assert len(cfg.fallbacks) == 1
    assert cfg.fallbacks[0].provider.value == "openai"


def test_nested_fallbacks_are_typed() -> None:
    cfg = LLMConfig(
        provider="anthropic",
        fallbacks=[{"provider": "openai", "model": "gpt-4o-mini"}],
    )
    inner = cfg.fallbacks[0]
    assert isinstance(inner, LLMConfig)
    assert inner.model == "gpt-4o-mini"


def test_tts_fallback_chain_validates() -> None:
    cfg = TTSConfig(
        provider="cartesia",
        fallbacks=[
            {"provider": "elevenlabs", "model": "eleven_flash_v2_5", "voice": "x"},
            {"provider": "openai", "model": "gpt-4o-mini-tts", "voice": "ash"},
        ],
    )
    assert len(cfg.fallbacks) == 2
