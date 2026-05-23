"""Cross-session memory via mem0.

When enabled in a persona, the engine pulls relevant memories at session
start and pushes new ones at session end. The LLM sees them as system
context — no model-specific code paths.
"""

from __future__ import annotations

import logging
import os
from typing import Any

from voice_engine.config import MemoryConfig

logger = logging.getLogger(__name__)


class MemoryStore:
    """Thin wrapper around mem0. Lazily initialised; no-op if disabled."""

    def __init__(self, cfg: MemoryConfig) -> None:
        self.cfg = cfg
        self._client: Any | None = None
        if cfg.enabled:
            if not os.getenv("MEM0_API_KEY"):
                logger.warning("memory.enabled but MEM0_API_KEY missing — memory disabled")
                self.cfg.enabled = False
                return
            try:
                from mem0 import MemoryClient
                self._client = MemoryClient()
            except ImportError:
                logger.warning("mem0 not installed — memory disabled. `pip install mem0ai`")
                self.cfg.enabled = False

    async def recall(self, user_id: str, query: str, limit: int = 5) -> str:
        """Return a formatted memory block for the system prompt, or empty string."""
        if not self.cfg.enabled or not self._client:
            return ""
        try:
            results = self._client.search(query=query, user_id=user_id, limit=limit)
            mems = [m.get("memory", "") for m in (results or []) if m.get("memory")]
            if not mems:
                return ""
            return "Relevant memories from past conversations:\n- " + "\n- ".join(mems)
        except Exception as e:  # noqa: BLE001
            logger.warning("memory recall failed: %s", e)
            return ""

    async def add(self, user_id: str, messages: list[dict]) -> None:
        """Persist new memories from a finished conversation."""
        if not self.cfg.enabled or not self._client:
            return
        try:
            self._client.add(messages, user_id=user_id)
        except Exception as e:  # noqa: BLE001
            logger.warning("memory add failed: %s", e)
