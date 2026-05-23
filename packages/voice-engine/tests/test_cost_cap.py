"""Cost cap watcher tests."""

from __future__ import annotations

from voice_engine.config import CostCapConfig
from voice_engine.cost_cap import CostCapWatcher


def test_disabled_when_cap_zero() -> None:
    w = CostCapWatcher(CostCapConfig(max_usd_per_session=0.0))
    assert not w.enabled
    w.add_cost(99.0)
    assert w.total_usd == 0.0  # ignored when disabled


def test_warns_at_threshold(caplog) -> None:
    w = CostCapWatcher(CostCapConfig(max_usd_per_session=1.0, warn_at_pct=0.8))
    with caplog.at_level("WARNING"):
        w.add_cost(0.85)
    assert any("80.00%" in r.message or "80%" in r.message or "85.00%" in r.message
               for r in caplog.records if r.levelname == "WARNING")


def test_fires_on_breach_once() -> None:
    breaches: list[float] = []
    w = CostCapWatcher(
        CostCapConfig(max_usd_per_session=0.10),
        on_breach=lambda t: breaches.append(t),
    )
    w.add_cost(0.05)
    w.add_cost(0.06)  # crosses cap
    w.add_cost(0.20)  # already fired — should NOT re-fire
    assert len(breaches) == 1
    assert breaches[0] > 0.10


def test_negative_costs_ignored() -> None:
    w = CostCapWatcher(CostCapConfig(max_usd_per_session=1.0))
    w.add_cost(-5.0)
    assert w.total_usd == 0.0
