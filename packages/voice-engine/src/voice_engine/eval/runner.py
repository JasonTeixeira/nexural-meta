"""Scenario runner.

Simulates a conversation in text mode by calling the persona's LLM
directly (no audio, no WebRTC). Each step's reply is checked against the
declared assertions. The output is a structured EvalReport you can pipe
into CI.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from voice_engine.config import LLMProvider, PersonaConfig, load_persona
from voice_engine.eval.judges import JudgeResult, judge_step
from voice_engine.eval.scenarios import Scenario, ScenarioStep, load_scenarios
from voice_engine.orchestration.registry import PersonaRegistry

logger = logging.getLogger(__name__)


@dataclass
class StepResult:
    user: str
    agent: str
    judge: JudgeResult


@dataclass
class EvalResult:
    scenario: str
    persona: str
    passed: bool
    steps: list[StepResult]


@dataclass
class EvalReport:
    results: list[EvalResult] = field(default_factory=list)

    @property
    def passed(self) -> int:
        return sum(1 for r in self.results if r.passed)

    @property
    def failed(self) -> int:
        return len(self.results) - self.passed

    def summary(self) -> str:
        lines = [f"Eval: {self.passed}/{len(self.results)} scenarios passed"]
        for r in self.results:
            mark = "✓" if r.passed else "✗"
            lines.append(f"  {mark} {r.persona}/{r.scenario}")
            if not r.passed:
                for s in r.steps:
                    if not s.judge.passed:
                        lines.append(f"      USER: {s.user[:60]}")
                        lines.append(f"      AGENT: {s.agent[:80]}")
                        for f_ in s.judge.failures:
                            lines.append(f"        × {f_}")
        return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Text-mode LLM call
# ─────────────────────────────────────────────────────────────────────────────


async def _call_llm(
    persona: PersonaConfig,
    history: list[dict[str, Any]],
) -> str:
    """Call the persona's LLM with the current history. Realtime personas
    skip — text-mode eval is only meaningful for cascaded.

    Returns the assistant's reply text.
    """
    if persona.mode.value == "realtime":
        logger.info("skipping realtime persona %s in text eval", persona.name)
        return ""

    provider = persona.llm.provider
    if provider == LLMProvider.ANTHROPIC:
        from anthropic import AsyncAnthropic
        if not os.getenv("ANTHROPIC_API_KEY"):
            return ""
        client = AsyncAnthropic()
        msg = await client.messages.create(
            model=persona.llm.model,
            max_tokens=persona.llm.max_tokens,
            temperature=persona.llm.temperature,
            system=persona.system_prompt,
            messages=[{"role": h["role"], "content": h["content"]} for h in history],
        )
        for b in msg.content or []:
            if getattr(b, "type", None) == "text":
                return b.text
        return ""

    if provider == LLMProvider.OPENAI:
        from openai import AsyncOpenAI
        if not os.getenv("OPENAI_API_KEY"):
            return ""
        client = AsyncOpenAI()
        msg = await client.chat.completions.create(
            model=persona.llm.model,
            temperature=persona.llm.temperature,
            max_tokens=persona.llm.max_tokens,
            messages=[
                {"role": "system", "content": persona.system_prompt},
                *history,
            ],
        )
        return msg.choices[0].message.content or ""

    return ""


# ─────────────────────────────────────────────────────────────────────────────
# Runner
# ─────────────────────────────────────────────────────────────────────────────


async def run_scenario(scenario: Scenario, persona: PersonaConfig) -> EvalResult:
    history: list[dict[str, Any]] = []
    step_results: list[StepResult] = []
    passed = True
    for step in scenario.steps:
        history.append({"role": "user", "content": step.user})
        agent = await _call_llm(persona, history)
        history.append({"role": "assistant", "content": agent})
        judge = await judge_step(user=step.user, agent=agent, asserts=step.assert_)
        step_results.append(StepResult(user=step.user, agent=agent, judge=judge))
        if not judge.passed:
            passed = False
    return EvalResult(
        scenario=scenario.name,
        persona=persona.name,
        passed=passed,
        steps=step_results,
    )


async def run_scenario_file(
    path: str | Path,
    *,
    persona_dir: str | Path = "personas",
) -> EvalReport:
    """Run all scenarios in a YAML file. Each scenario specifies its persona by name."""
    scenarios = load_scenarios(path)
    reg = PersonaRegistry(persona_dir)
    report = EvalReport()
    for s in scenarios:
        persona = reg.get(s.persona)
        report.results.append(await run_scenario(s, persona))
    return report
