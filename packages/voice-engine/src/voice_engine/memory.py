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
            # mem0 ≥2.0 requires filters dict, not top-level user_id kwarg.
            results = self._client.search(
                query=query,
                version="v2",
                filters={"user_id": user_id},
                limit=limit,
            )
            # v2 returns either a list of dicts OR {"results": [...]}.
            items = results.get("results", []) if isinstance(results, dict) else (results or [])
            mems: list[str] = []
            for m in items:
                if isinstance(m, dict):
                    text = m.get("memory") or m.get("text") or ""
                elif isinstance(m, str):
                    text = m
                else:
                    text = ""
                if text:
                    mems.append(text)
            if not mems:
                return ""
            return "Relevant memories from past conversations:\n- " + "\n- ".join(mems)
        except Exception as e:  # noqa: BLE001
            logger.warning("memory recall failed: %s", e)
            return ""

    async def add(self, user_id: str, messages: list[dict]) -> None:
        """Persist new memories from a finished conversation.

        PII (emails, phones, credit cards, SSNs) is redacted before write —
        memories are long-lived and you don't want PHI/PCI sitting in mem0.
        """
        if not self.cfg.enabled or not self._client:
            return
        try:
            from voice_engine.guardrails import redact_pii
            cleaned: list[dict] = []
            total: dict[str, int] = {}
            for m in messages:
                content = m.get("content") or ""
                r = redact_pii(str(content))
                for k, v in r.redactions.items():
                    total[k] = total.get(k, 0) + v
                cleaned.append({**m, "content": r.text})
            if total:
                logger.info("memory: redacted %s before write", total)
            self._client.add(cleaned, user_id=user_id, version="v2")
        except Exception as e:  # noqa: BLE001
            logger.warning("memory add failed: %s", e)
