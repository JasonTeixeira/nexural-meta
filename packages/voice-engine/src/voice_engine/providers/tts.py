"""TTS factory — the voice, with optional fallback chain."""

from __future__ import annotations

from voice_engine.config import TTSConfig, TTSProvider


def _build_one(cfg: TTSConfig):
    match cfg.provider:
        case TTSProvider.CARTESIA:
            from livekit.plugins import cartesia
            return cartesia.TTS(model=cfg.model, voice=cfg.voice, speed=cfg.speed)
        case TTSProvider.ELEVENLABS:
            from livekit.plugins import elevenlabs
            return elevenlabs.TTS(model=cfg.model, voice_id=cfg.voice)
        case TTSProvider.OPENAI:
            from livekit.plugins import openai
            kwargs: dict = {"model": cfg.model, "voice": cfg.voice, "speed": cfg.speed}
            if cfg.instructions:
                kwargs["instructions"] = cfg.instructions
            return openai.TTS(**kwargs)
        case _:
            raise ValueError(f"Unknown TTS provider: {cfg.provider}")


def build_tts(cfg: TTSConfig):
    """Return a configured LiveKit TTS plugin (or a FallbackAdapter chain).

    Defaults: Cartesia Sonic 3 (~90ms TTFA). ElevenLabs Flash v2.5 for
    quality-first. OpenAI gpt-4o-mini-tts is prompt-steerable.
    """
    primary = _build_one(cfg)
    if not cfg.fallbacks:
        return primary
    from livekit.agents import tts as _tts
    alternates = [_build_one(f) for f in cfg.fallbacks]
    return _tts.FallbackAdapter([primary, *alternates])
