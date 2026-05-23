"""Scenario YAML schema.

A scenario is a sequence of user lines + assertions about the agent's
response. Multiple scenarios per file.

Example (`personas/tutor.scenarios.yaml`):

  - name: socratic_for_basic_question
    persona: tutor
    steps:
      - user: "What's a stack?"
        assert:
          must_ask_clarifying_question: true
          response_under_words: 60
"""

from __future__ import annotations

from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict, Field


class Assertion(BaseModel):
    must_contain: list[str] = Field(default_factory=list)
    must_not_contain: list[str] = Field(default_factory=list)
    response_under_words: int | None = None
    must_call_tool: str | None = None
    must_ask_clarifying_question: bool | None = None
    custom_check: str | None = None
    """Plain-English instruction handed to the LLM judge."""


class ScenarioStep(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    user: str
    assert_: Assertion = Field(default_factory=Assertion, alias="assert")


class Scenario(BaseModel):
    name: str
    persona: str
    steps: list[ScenarioStep] = Field(default_factory=list)
    description: str = ""


def load_scenarios(path: str | Path) -> list[Scenario]:
    p = Path(path).expanduser().resolve()
    if not p.exists():
        raise FileNotFoundError(p)
    with p.open("r", encoding="utf-8") as f:
        raw = yaml.safe_load(f) or []
    if not isinstance(raw, list):
        raise ValueError(f"{p}: expected a list of scenarios at top level")
    return [Scenario.model_validate(s) for s in raw]
