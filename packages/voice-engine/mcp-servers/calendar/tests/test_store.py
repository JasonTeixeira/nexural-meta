"""Calendar store tests — bookings, conflicts, cancellation, slot listing."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import pytest

from calendar_mcp.store import CalendarStore


@pytest.fixture
def store(tmp_path: Path) -> CalendarStore:
    return CalendarStore(db_path=tmp_path / "test.sqlite")


def test_list_slots_returns_workday(store: CalendarStore) -> None:
    slots = store.list_slots(day="2026-06-01", duration_min=30)
    # 9-17 with 30-min slots = 16 slots
    assert len(slots) == 16
    assert slots[0].startswith("2026-06-01T09:00")
    assert slots[-1].startswith("2026-06-01T16:30")


def test_book_then_slot_disappears(store: CalendarStore) -> None:
    store.book(
        customer_name="alex",
        customer_contact="555-0001",
        starts_at="2026-06-01T10:00:00",
        duration_min=30,
    )
    slots = store.list_slots(day="2026-06-01", duration_min=30)
    assert not any(s.startswith("2026-06-01T10:00") for s in slots)
    # 9:30 also gone if it overlaps? No — 9:30+30 ends 10:00, exactly when the booking starts. So 9:30 should still appear.
    assert any(s.startswith("2026-06-01T09:30") for s in slots)


def test_double_book_raises(store: CalendarStore) -> None:
    store.book(
        customer_name="a",
        customer_contact="x",
        starts_at="2026-06-01T11:00:00",
        duration_min=30,
    )
    with pytest.raises(ValueError):
        store.book(
            customer_name="b",
            customer_contact="y",
            starts_at="2026-06-01T11:15:00",  # overlaps
            duration_min=30,
        )


def test_cancel_frees_slot(store: CalendarStore) -> None:
    b = store.book(
        customer_name="a",
        customer_contact="x",
        starts_at="2026-06-01T13:00:00",
        duration_min=30,
    )
    assert store.cancel(b.id) is True
    slots = store.list_slots(day="2026-06-01", duration_min=30)
    assert any(s.startswith("2026-06-01T13:00") for s in slots)


def test_cancel_unknown_id_returns_false(store: CalendarStore) -> None:
    assert store.cancel("bogus") is False


def test_list_my_bookings(store: CalendarStore) -> None:
    store.book(
        customer_name="a",
        customer_contact="555-0001",
        starts_at="2026-06-02T10:00:00",
        duration_min=30,
    )
    store.book(
        customer_name="a",
        customer_contact="555-0001",
        starts_at="2026-06-02T11:00:00",
        duration_min=30,
    )
    mine = list(store.list_bookings_for("555-0001"))
    assert len(mine) == 2
