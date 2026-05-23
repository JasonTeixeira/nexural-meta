"""Structured output schema tests + wiring on agent class."""

from __future__ import annotations

import pytest

from voice_engine.agent import _build_persona_agent_class
from voice_engine.config import PersonaConfig
from voice_engine.outputs import OUTPUT_SCHEMAS, SBAR, get_schema


def test_all_schemas_registered() -> None:
    for name in ("sbar", "interview_debrief", "qualified_lead", "call_message"):
        assert name in OUTPUT_SCHEMAS


def test_get_schema_unknown_raises() -> None:
    with pytest.raises(KeyError):
        get_schema("not_a_real_schema")


def test_sbar_validates() -> None:
    s = SBAR(
        patient_name="Alex Doe",
        situation="chest pain 7/10 for 1h",
        background="no relevant hx",
        assessment="patient suspects anxiety",
        recommendation="urgent telehealth",
    )
    assert s.consent_to_share is True
    assert s.red_flags == []


def test_agent_class_gets_submit_output_when_schema_set() -> None:
    p = PersonaConfig(name="x", system_prompt="y", output_schema="sbar")
    Cls = _build_persona_agent_class(p, None, None)
    assert hasattr(Cls, "submit_output")


def test_agent_class_no_submit_output_when_no_schema() -> None:
    p = PersonaConfig(name="x", system_prompt="y")
    Cls = _build_persona_agent_class(p, None, None)
    assert not hasattr(Cls, "submit_output")


def test_unknown_output_schema_silently_ignored() -> None:
    """Persona referencing a bogus schema should not crash agent class build."""
    p = PersonaConfig(name="x", system_prompt="y", output_schema="not_real")
    Cls = _build_persona_agent_class(p, None, None)
    assert not hasattr(Cls, "submit_output")
