"""Eval harness tests — scenario parsing, programmatic checks, runner shape.

Doesn't call any LLMs (no keys assumed). Qualitative judging is mocked.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from voice_engine.eval.judges import judge_step
from voice_engine.eval.scenarios import Assertion, load_scenarios


def test_scenarios_yaml_parses() -> None:
    path = Path(__file__).resolve().parent.parent / "personas" / "voice_coach.scenarios.yaml"
    scenarios = load_scenarios(path)
    assert len(scenarios) >= 1
    s = scenarios[0]
    assert s.persona == "voice_coach"
    assert s.steps and s.steps[0].assert_


@pytest.mark.asyncio
async def test_programmatic_must_contain_fails() -> None:
    r = await judge_step(
        user="hi",
        agent="hello there",
        asserts=Assertion(must_contain=["banana"]),
    )
    assert r.passed is False
    assert any("banana" in f for f in r.failures)


@pytest.mark.asyncio
async def test_programmatic_response_length_fails() -> None:
    long = " ".join(["word"] * 50)
    r = await judge_step(
        user="hi",
        agent=long,
        asserts=Assertion(response_under_words=10),
    )
    assert r.passed is False
    assert any("too long" in f for f in r.failures)


@pytest.mark.asyncio
async def test_programmatic_pass_when_all_satisfied() -> None:
    r = await judge_step(
        user="hi",
        agent="hello and welcome friend",
        asserts=Assertion(must_contain=["hello"], must_not_contain=["bye"], response_under_words=10),
    )
    assert r.passed is True
    assert r.failures == []
