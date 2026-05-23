"""SQLite-backed booking store. Trivial; swap with Google Calendar /
Cal.com / your own backend by implementing the same interface."""

from __future__ import annotations

import sqlite3
import threading
import uuid
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Iterable

_SCHEMA = """
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_contact TEXT,
    starts_at TEXT NOT NULL,
    ends_at TEXT NOT NULL,
    reason TEXT,
    created_at TEXT NOT NULL,
    cancelled_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_bookings_starts ON bookings(starts_at);
"""


@dataclass
class Booking:
    id: str
    customer_name: str
    customer_contact: str | None
    starts_at: str  # ISO-8601 UTC
    ends_at: str
    reason: str | None


class CalendarStore:
    def __init__(self, db_path: str | Path = "calendar.sqlite") -> None:
        self.db_path = Path(db_path).expanduser().resolve()
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        with self._conn() as c:
            c.executescript(_SCHEMA)

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(str(self.db_path), timeout=5.0)
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def list_slots(
        self,
        *,
        day: str,
        duration_min: int = 30,
        open_hour: int = 9,
        close_hour: int = 17,
    ) -> list[str]:
        """Return free starts (ISO-8601 UTC) on `day` (YYYY-MM-DD)."""
        day_start = datetime.fromisoformat(f"{day}T{open_hour:02d}:00:00").replace(tzinfo=timezone.utc)
        day_end = day_start.replace(hour=close_hour)
        slots: list[datetime] = []
        cursor = day_start
        while cursor + timedelta(minutes=duration_min) <= day_end:
            slots.append(cursor)
            cursor += timedelta(minutes=duration_min)

        with self._lock, self._conn() as c:
            booked = c.execute(
                "SELECT starts_at, ends_at FROM bookings WHERE cancelled_at IS NULL AND date(starts_at)=?",
                (day,),
            ).fetchall()

        def overlaps(s: datetime, e: datetime) -> bool:
            for bs, be in booked:
                bs_dt = datetime.fromisoformat(bs)
                be_dt = datetime.fromisoformat(be)
                if s < be_dt and e > bs_dt:
                    return True
            return False

        free = [s for s in slots if not overlaps(s, s + timedelta(minutes=duration_min))]
        return [s.isoformat() for s in free]

    def book(
        self,
        *,
        customer_name: str,
        customer_contact: str | None,
        starts_at: str,
        duration_min: int = 30,
        reason: str | None = None,
    ) -> Booking:
        starts = datetime.fromisoformat(starts_at)
        if starts.tzinfo is None:
            starts = starts.replace(tzinfo=timezone.utc)
        ends = starts + timedelta(minutes=duration_min)
        bid = uuid.uuid4().hex[:12]
        with self._lock, self._conn() as c:
            # collision check
            clash = c.execute(
                "SELECT 1 FROM bookings WHERE cancelled_at IS NULL AND starts_at < ? AND ends_at > ?",
                (ends.isoformat(), starts.isoformat()),
            ).fetchone()
            if clash:
                raise ValueError(f"slot conflict at {starts_at}")
            c.execute(
                """INSERT INTO bookings
                   (id, customer_name, customer_contact, starts_at, ends_at,
                    reason, created_at)
                   VALUES (?,?,?,?,?,?,?)""",
                (
                    bid,
                    customer_name,
                    customer_contact,
                    starts.isoformat(),
                    ends.isoformat(),
                    reason,
                    datetime.now(timezone.utc).isoformat(),
                ),
            )
        return Booking(
            id=bid,
            customer_name=customer_name,
            customer_contact=customer_contact,
            starts_at=starts.isoformat(),
            ends_at=ends.isoformat(),
            reason=reason,
        )

    def cancel(self, booking_id: str) -> bool:
        with self._lock, self._conn() as c:
            cur = c.execute(
                "UPDATE bookings SET cancelled_at=? WHERE id=? AND cancelled_at IS NULL",
                (datetime.now(timezone.utc).isoformat(), booking_id),
            )
            return cur.rowcount > 0

    def list_bookings_for(self, customer_contact: str) -> Iterable[Booking]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                """SELECT id, customer_name, customer_contact, starts_at, ends_at, reason
                   FROM bookings WHERE customer_contact=? AND cancelled_at IS NULL
                   ORDER BY starts_at""",
                (customer_contact,),
            ).fetchall()
        return [Booking(*r) for r in rows]
