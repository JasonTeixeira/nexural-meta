"""LLM factory — the brain."""

from __future__ import annotations

from voice_engine.config import LLMConfig, LLMProvider


def build_llm(cfg: LLMConfig):
    """Return a configured LiveKit LLM plugin instance."""
    match cfg.provider:
        case LLMProvider.ANTHROPIC:
            from livekit.plugins import anthropic
            return anthropic.LLM(
                model=cfg.model,
                temperature=cfg.temperature,
            )
        case LLMProvider.OPENAI:
            from livekit.plugins import openai
            return openai.LLM(
                model=cfg.model,
                temperature=cfg.temperature,
            )
        case LLMProvider.GOOGLE:
            from livekit.plugins import google
            return google.LLM(
                model=cfg.model,
                temperature=cfg.temperature,
            )
        case _:
            raise ValueError(f"Unknown LLM provider: {cfg.provider}")
