"""Safety / moderation tests — config wiring + noop default + builder."""

from __future__ import annotations

import pytest

from voice_engine.config import SafetyConfig
from voice_engine.safety import NoopModerator, build_moderator


def test_default_safety_disabled() -> None:
    cfg = SafetyConfig()
    assert cfg.enabled is False
    assert build_moderator(cfg) is None


def test_unknown_provider_returns_none() -> None:
    with pytest.raises(ValueError):
        SafetyConfig(enabled=True, provider="badprovider")


def test_openai_moderator_buildable_without_key() -> None:
    cfg = SafetyConfig(enabled=True, provider="openai")
    m = build_moderator(cfg)
    assert m is not None  # built — doesn't talk to network until check() called


@pytest.mark.asyncio
async def test_noop_moderator_never_blocks() -> None:
    r = await NoopModerator().check("anything")
    assert r.blocked is False
    assert r.categories == []
