"""Inheritance smoke tests — `extends:` resolution, deep merge, cycle detection."""

from __future__ import annotations

from pathlib import Path

import pytest

from voice_engine.config import load_persona
from voice_engine.inheritance import (
    CircularExtensionError,
    _deep_merge,
    resolve_extends,
)


def test_deep_merge_overrides_scalars() -> None:
    assert _deep_merge({"a": 1, "b": 2}, {"b": 3}) == {"a": 1, "b": 3}


def test_deep_merge_descends_into_nested_dict() -> None:
    base = {"stt": {"provider": "deepgram", "model": "nova-2"}}
    child = {"stt": {"model": "nova-3"}}
    assert _deep_merge(base, child) == {
        "stt": {"provider": "deepgram", "model": "nova-3"}
    }


def test_deep_merge_lists_are_replaced_not_appended() -> None:
    assert _deep_merge({"k": [1, 2, 3]}, {"k": [9]}) == {"k": [9]}


def test_extends_resolves_base(tmp_path: Path) -> None:
    base = tmp_path / "base.yaml"
    base.write_text(
        "name: b\nmode: cascaded\nsystem_prompt: hi\n"
        "llm:\n  provider: anthropic\n  model: claude-haiku-4-5\n"
    )
    child = tmp_path / "child.yaml"
    child.write_text(
        "extends: base.yaml\n"
        "name: c\n"
        "llm:\n  temperature: 0.9\n"
    )
    data = resolve_extends(child)
    assert data["name"] == "c"  # child wins
    assert data["llm"]["model"] == "claude-haiku-4-5"  # inherited
    assert data["llm"]["temperature"] == 0.9  # child added
    assert data["mode"] == "cascaded"  # inherited


def test_extends_chain_multi_level(tmp_path: Path) -> None:
    (tmp_path / "a.yaml").write_text("name: a\nmode: cascaded\nllm:\n  temperature: 0.1\n")
    (tmp_path / "b.yaml").write_text("extends: a.yaml\nllm:\n  temperature: 0.2\n")
    (tmp_path / "c.yaml").write_text("extends: b.yaml\nname: c\n")
    data = resolve_extends(tmp_path / "c.yaml")
    assert data["name"] == "c"
    assert data["llm"]["temperature"] == 0.2


def test_extends_cycle_rejected(tmp_path: Path) -> None:
    (tmp_path / "x.yaml").write_text("extends: y.yaml\nname: x\n")
    (tmp_path / "y.yaml").write_text("extends: x.yaml\nname: y\n")
    with pytest.raises(CircularExtensionError):
        resolve_extends(tmp_path / "x.yaml")


def test_load_persona_with_extends_validates() -> None:
    """Real base files must produce valid PersonaConfig when extended."""
    here = Path(__file__).resolve().parent.parent
    child = here / "tests" / "_tmp_child.yaml"
    child.parent.mkdir(exist_ok=True)
    try:
        child.write_text(
            "extends: ../personas/_base/cascaded.yaml\n"
            "name: extends_test\n"
            "system_prompt: |\n"
            "  Override the placeholder prompt.\n"
        )
        p = load_persona(child)
        assert p.name == "extends_test"
        assert p.mode.value == "cascaded"
        assert p.stt.provider.value == "deepgram"  # inherited
        assert p.llm.model == "claude-haiku-4-5"  # inherited
    finally:
        child.unlink(missing_ok=True)
