"""Realtime (S2S) factory — end-to-end speech-to-speech models.

Used when persona.mode == realtime. The LLM IS the audio model; no separate
STT/TTS plugins. More natural prosody, lower latency, vendor-locked.
"""

from __future__ import annotations

from voice_engine.config import RealtimeConfig, RealtimeProvider


def build_realtime(cfg: RealtimeConfig):
    """Return a configured LiveKit realtime model plugin instance."""
    match cfg.provider:
        case RealtimeProvider.OPENAI:
            from livekit.plugins import openai
            return openai.realtime.RealtimeModel(
                model=cfg.model,
                voice=cfg.voice,
                temperature=cfg.temperature,
                # Semantic VAD — distinguishes "uhm…" pauses from true end-of-turn.
                turn_detection={"type": "semantic_vad", "eagerness": "auto"},
            )
        case RealtimeProvider.GOOGLE:
            from livekit.plugins import google
            return google.beta.realtime.RealtimeModel(
                model=cfg.model,
                voice=cfg.voice,
                temperature=cfg.temperature,
            )
        case _:
            raise ValueError(f"Unknown realtime provider: {cfg.provider}")
