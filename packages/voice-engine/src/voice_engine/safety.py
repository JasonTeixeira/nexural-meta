"""Pluggable moderation layer — pre + (optional) post message checks.

Default provider: OpenAI Moderation API (omni-moderation-latest). The
engine wraps each user transcript before passing to the LLM; if flagged,
the agent gives a brief redirection instead of forwarding. Logs every
decision to telemetry (event=`safety.check` / `safety.block`).

Add new providers by implementing `Moderator.check(text) -> ModerationResult`.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Protocol

from voice_engine.config import SafetyConfig

logger = logging.getLogger(__name__)


@dataclass
class ModerationResult:
    blocked: bool
    categories: list[str]
    score: float = 0.0
    raw: dict | None = None


class Moderator(Protocol):
    async def check(self, text: str) -> ModerationResult: ...  # noqa: E704


class NoopModerator:
    async def check(self, text: str) -> ModerationResult:  # noqa: ARG002
        return ModerationResult(blocked=False, categories=[])


class OpenAIModerator:
    """OpenAI Moderation API — free, fast, multi-category."""

    def __init__(self, model: str = "omni-moderation-latest") -> None:
        self.model = model
        self._client = None

    def _ensure_client(self):
        if self._client is None:
            try:
                from openai import AsyncOpenAI
            except ImportError as e:
                raise RuntimeError("openai SDK required for OpenAI moderation") from e
            if not os.getenv("OPENAI_API_KEY"):
                raise RuntimeError("OPENAI_API_KEY missing — moderation disabled")
            self._client = AsyncOpenAI()
        return self._client

    async def check(self, text: str) -> ModerationResult:
        try:
            client = self._ensure_client()
            resp = await client.moderations.create(model=self.model, input=text)
            r = resp.results[0]
            flagged = bool(r.flagged)
            cats = []
            cat_obj = getattr(r, "categories", None)
            if cat_obj is not None:
                try:
                    items = cat_obj.model_dump().items()
                except AttributeError:
                    items = cat_obj.__dict__.items()
                cats = [k for k, v in items if v]
            return ModerationResult(blocked=flagged, categories=cats, raw=r.model_dump() if hasattr(r, "model_dump") else None)
        except Exception as e:  # noqa: BLE001
            logger.warning("moderation check failed (fail-open): %s", e)
            return ModerationResult(blocked=False, categories=[])


def build_moderator(cfg: SafetyConfig) -> Moderator | None:
    """Return a configured moderator or None when disabled."""
    if not cfg.enabled or cfg.provider == "none":
        return None
    if cfg.provider == "openai":
        return OpenAIModerator()
    logger.warning("unknown safety provider: %s — disabled", cfg.provider)
    return None
