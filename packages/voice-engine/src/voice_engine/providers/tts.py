"""TTS factory — the voice."""

from __future__ import annotations

from voice_engine.config import TTSConfig, TTSProvider


def build_tts(cfg: TTSConfig):
    """Return a configured LiveKit TTS plugin instance.

    Cartesia Sonic 3 = default. ~90ms TTFA, lowest in the industry.
    ElevenLabs Flash v2.5 = highest voice quality at sub-100ms TTFA.
    OpenAI gpt-4o-mini-tts = prompt-steerable personality via `instructions`.
    """
    match cfg.provider:
        case TTSProvider.CARTESIA:
            from livekit.plugins import cartesia
            return cartesia.TTS(
                model=cfg.model,
                voice=cfg.voice,
                speed=cfg.speed,
            )
        case TTSProvider.ELEVENLABS:
            from livekit.plugins import elevenlabs
            return elevenlabs.TTS(
                model=cfg.model,
                voice_id=cfg.voice,
            )
        case TTSProvider.OPENAI:
            from livekit.plugins import openai
            kwargs: dict = {"model": cfg.model, "voice": cfg.voice, "speed": cfg.speed}
            if cfg.instructions:
                kwargs["instructions"] = cfg.instructions
            return openai.TTS(**kwargs)
        case _:
            raise ValueError(f"Unknown TTS provider: {cfg.provider}")
