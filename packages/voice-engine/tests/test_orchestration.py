"""Orchestration smoke tests — registry, router, supervisor wiring.

No network calls. No API keys required.
"""

from __future__ import annotations

from pathlib import Path

from voice_engine.agent import _build_persona_agent_class
from voice_engine.config import (
    OrchestrationConfig,
    PersonaConfig,
    SupervisorConfig,
)
from voice_engine.orchestration import (
    PersonaRegistry,
    SupervisorClient,
    build_router_agent,
)

PERSONA_DIR = Path(__file__).resolve().parent.parent / "personas"


def test_registry_discovers_all() -> None:
    reg = PersonaRegistry(PERSONA_DIR)
    names = reg.names()
    assert "voice_coach" in names
    assert "router" in names
    assert len(names) >= 10


def test_registry_get_loads_persona() -> None:
    reg = PersonaRegistry(PERSONA_DIR)
    p = reg.get("voice_coach")
    assert p.name == "voice_coach"


def test_router_lists_specialists() -> None:
    reg = PersonaRegistry(PERSONA_DIR)
    router = build_router_agent(reg)
    assert router.name == "router"
    # router prompt must mention at least some real personas
    for name in ("voice_coach", "tutor", "therapist"):
        assert name in router.system_prompt


def test_agent_class_gets_handoff_tool_when_targets_set() -> None:
    reg = PersonaRegistry(PERSONA_DIR)
    p = reg.get("voice_coach")
    p.orchestration.handoff_targets = ["tutor"]
    Cls = _build_persona_agent_class(p, reg, None)
    assert hasattr(Cls, "handoff_to")
    assert not hasattr(Cls, "consult_supervisor")


def test_agent_class_gets_supervisor_tool_when_enabled() -> None:
    p = PersonaConfig(
        name="t",
        system_prompt="x",
        orchestration=OrchestrationConfig(
            supervisor=SupervisorConfig(enabled=True)
        ),
    )
    Cls = _build_persona_agent_class(p, None, SupervisorClient())
    assert hasattr(Cls, "consult_supervisor")
    assert not hasattr(Cls, "handoff_to")


def test_agent_class_minimal_has_no_orchestration_tools() -> None:
    p = PersonaConfig(name="bare", system_prompt="y")
    Cls = _build_persona_agent_class(p, None, None)
    assert not hasattr(Cls, "handoff_to")
    assert not hasattr(Cls, "consult_supervisor")
