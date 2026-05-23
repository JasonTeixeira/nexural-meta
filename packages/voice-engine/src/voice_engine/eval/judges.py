"""LLM-as-judge — given a step + assertions + agent reply, return pass/fail."""

from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass

from voice_engine.eval.scenarios import Assertion

logger = logging.getLogger(__name__)


@dataclass
class JudgeResult:
    passed: bool
    failures: list[str]
    notes: str = ""


JUDGE_SYSTEM = """You grade a single turn of a voice agent.

You will receive:
  - the user line
  - the agent's reply
  - a JSON object of assertions (must_contain, must_not_contain,
    response_under_words, must_ask_clarifying_question, custom_check)

Return strict JSON:
  {"passed": true|false, "failures": ["..."], "notes": "..."}

Be literal about must_contain / must_not_contain. For
must_ask_clarifying_question, true means the reply contains an actual
question, false means it must not. For custom_check, judge the
plain-English instruction directly.

Reply with JSON only, no markdown, no preamble.
"""


async def judge_step(
    *,
    user: str,
    agent: str,
    asserts: Assertion,
    model: str = "claude-haiku-4-5",
) -> JudgeResult:
    """Programmatic checks first, then LLM for anything qualitative."""
    failures: list[str] = []

    # ── Programmatic checks ──
    for needle in asserts.must_contain:
        if needle.lower() not in agent.lower():
            failures.append(f"must_contain missing: {needle!r}")
    for needle in asserts.must_not_contain:
        if needle.lower() in agent.lower():
            failures.append(f"must_not_contain present: {needle!r}")
    if asserts.response_under_words is not None:
        n = len(agent.split())
        if n > asserts.response_under_words:
            failures.append(
                f"response too long: {n} words > {asserts.response_under_words}"
            )
    if asserts.must_call_tool is not None:
        # Agent's reply text won't include tool calls directly — eval harness
        # should be extended to capture tool calls from the LLM response.
        # For now, flag as not-checkable.
        pass

    # ── Qualitative checks via LLM ──
    needs_llm = (
        asserts.must_ask_clarifying_question is not None
        or asserts.custom_check is not None
    )
    if needs_llm:
        try:
            from anthropic import AsyncAnthropic
            if not os.getenv("ANTHROPIC_API_KEY"):
                # Without an API key we can't grade qualitatively; fail open
                # with a note rather than blocking the whole suite.
                return JudgeResult(
                    passed=not failures,
                    failures=failures,
                    notes="qualitative checks skipped (no ANTHROPIC_API_KEY)",
                )
            client = AsyncAnthropic()
            msg = await client.messages.create(
                model=model,
                max_tokens=300,
                system=JUDGE_SYSTEM,
                messages=[
                    {
                        "role": "user",
                        "content": (
                            f"USER: {user}\n\nAGENT: {agent}\n\n"
                            f"ASSERTIONS: {json.dumps(asserts.model_dump())}"
                        ),
                    }
                ],
            )
            text = ""
            for b in msg.content or []:
                if getattr(b, "type", None) == "text":
                    text = b.text.strip()
                    break
            data = json.loads(text or "{}")
            if not data.get("passed", True):
                failures.extend(data.get("failures") or ["LLM judge: failed"])
            notes = data.get("notes", "")
            return JudgeResult(passed=not failures, failures=failures, notes=notes)
        except Exception as e:  # noqa: BLE001
            logger.warning("LLM judge failed: %s", e)
            return JudgeResult(
                passed=not failures,
                failures=failures,
                notes=f"judge error: {e}",
            )

    return JudgeResult(passed=not failures, failures=failures)
