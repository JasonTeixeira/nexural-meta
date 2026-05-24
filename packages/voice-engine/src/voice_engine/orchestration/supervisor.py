"""Chat-Supervisor pattern.

A fast voice model handles every conversational turn. When it needs to
think hard, look something up, or make a decision that requires deeper
reasoning, it calls `consult_supervisor(question)` — which routes to a
slower, smarter LLM running OUT of the voice path. Meanwhile the voice
model can fill with a backchannel ("let me think on that for a second…")
so the user doesn't hear dead air.

This is what makes the engine feel both fast AND smart.

Provider is inferred from the model name:
  - claude-*  → Anthropic
  - gpt-*     → OpenAI
  - else      → defaults to OpenAI
"""

from __future__ import annotations

import logging
import os

logger = logging.getLogger(__name__)


SUPERVISOR_SYSTEM = (
    "You are the silent reasoning supervisor for a real-time voice agent. "
    "Answer the voice agent's question crisply in <=2 short sentences. "
    "Plain prose — no markdown, no lists, no preamble."
)


class SupervisorClient:
    """Thin wrapper around a heavier LLM. Provider-agnostic."""

    def __init__(
        self,
        model: str = "claude-sonnet-4-6",
        max_tokens: int = 1024,
        temperature: float = 0.4,
    ) -> None:
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self._provider = "anthropic" if model.startswith("claude") else "openai"
        self._client = None

    def _ensure_client(self):
        if self._client is not None:
            return self._client
        if self._provider == "anthropic":
            try:
                from anthropic import AsyncAnthropic
            except ImportError as e:
                raise RuntimeError("anthropic SDK required for supervisor") from e
            if not os.getenv("ANTHROPIC_API_KEY"):
                raise RuntimeError("ANTHROPIC_API_KEY missing — supervisor disabled")
            self._client = AsyncAnthropic()
        else:
            try:
                from openai import AsyncOpenAI
            except ImportError as e:
                raise RuntimeError("openai SDK required for supervisor") from e
            if not os.getenv("OPENAI_API_KEY"):
                raise RuntimeError("OPENAI_API_KEY missing — supervisor disabled")
            self._client = AsyncOpenAI()
        return self._client

    async def consult(self, question: str, context: str = "") -> str:
        """Ask the supervisor a focused question; return the plain-text answer."""
        try:
            client = self._ensure_client()
        except RuntimeError as e:
            logger.warning("supervisor unavailable: %s", e)
            return ""

        user = f"{context}\n\nQuestion: {question}" if context else question

        try:
            if self._provider == "anthropic":
                msg = await client.messages.create(
                    model=self.model,
                    max_tokens=self.max_tokens,
                    temperature=self.temperature,
                    system=SUPERVISOR_SYSTEM,
                    messages=[{"role": "user", "content": user}],
                )
                for b in msg.content or []:
                    if getattr(b, "type", None) == "text":
                        return b.text.strip()
                return ""
            else:
                msg = await client.chat.completions.create(
                    model=self.model,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    messages=[
                        {"role": "system", "content": SUPERVISOR_SYSTEM},
                        {"role": "user", "content": user},
                    ],
                )
                return (msg.choices[0].message.content or "").strip()
        except Exception as e:  # noqa: BLE001
            logger.warning("supervisor consult failed: %s", e)
            return ""
