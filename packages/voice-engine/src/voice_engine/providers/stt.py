"""STT factory — speech-to-text provider selection with optional fallback chain."""

from __future__ import annotations

from voice_engine.config import STTConfig, STTProvider


def _build_one(cfg: STTConfig):
    match cfg.provider:
        case STTProvider.DEEPGRAM:
            from livekit.plugins import deepgram
            return deepgram.STT(
                model=cfg.model,
                language=cfg.language,
                keyterms=cfg.keyterms or None,
                interim_results=True,
                smart_format=True,
                punctuate=True,
            )
        case STTProvider.OPENAI:
            from livekit.plugins import openai
            return openai.STT(model=cfg.model, language=cfg.language)
        case STTProvider.GOOGLE:
            from livekit.plugins import google
            return google.STT(model=cfg.model, languages=[cfg.language])
        case _:
            raise ValueError(f"Unknown STT provider: {cfg.provider}")


def build_stt(cfg: STTConfig):
    """Return a configured LiveKit STT plugin (or a FallbackAdapter chain)."""
    primary = _build_one(cfg)
    if not cfg.fallbacks:
        return primary
    from livekit.agents import stt as _stt
    alternates = [_build_one(f) for f in cfg.fallbacks]
    return _stt.FallbackAdapter([primary, *alternates])
