"""LLM factory — the brain, with optional fallback chain."""

from __future__ import annotations

from voice_engine.config import LLMConfig, LLMProvider


def _build_one(cfg: LLMConfig):
    match cfg.provider:
        case LLMProvider.ANTHROPIC:
            from livekit.plugins import anthropic
            return anthropic.LLM(model=cfg.model, temperature=cfg.temperature)
        case LLMProvider.OPENAI:
            from livekit.plugins import openai
            return openai.LLM(model=cfg.model, temperature=cfg.temperature)
        case LLMProvider.GOOGLE:
            from livekit.plugins import google
            return google.LLM(model=cfg.model, temperature=cfg.temperature)
        case _:
            raise ValueError(f"Unknown LLM provider: {cfg.provider}")


def build_llm(cfg: LLMConfig):
    primary = _build_one(cfg)
    if not cfg.fallbacks:
        return primary
    from livekit.agents import llm as _llm
    alternates = [_build_one(f) for f in cfg.fallbacks]
    return _llm.FallbackAdapter([primary, *alternates])
