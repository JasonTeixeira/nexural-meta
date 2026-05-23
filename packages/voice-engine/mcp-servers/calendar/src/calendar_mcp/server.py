"""Calendar MCP server.

Tools exposed to voice agents:
  - list_slots(day, duration_min): find free appointment slots
  - book_slot(...): book an appointment
  - cancel_booking(booking_id): cancel
  - list_my_bookings(customer_contact): retrieve

Stdio or HTTP+SSE transport. Start with:
  calendar-mcp                          # stdio (claude / mcp clients)
  calendar-mcp --http --port 7700       # HTTP+SSE for voice-engine personas
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

from mcp.server.fastmcp import FastMCP

from calendar_mcp.store import CalendarStore

# ─────────────────────────────────────────────────────────────────────────────
# Setup
# ─────────────────────────────────────────────────────────────────────────────

mcp = FastMCP("nexural-calendar")

_store: CalendarStore | None = None


def _get_store() -> CalendarStore:
    global _store
    if _store is None:
        path = os.getenv("CALENDAR_DB", "calendar.sqlite")
        _store = CalendarStore(db_path=path)
    return _store


# ─────────────────────────────────────────────────────────────────────────────
# Tools
# ─────────────────────────────────────────────────────────────────────────────


@mcp.tool()
def list_slots(
    day: str,
    duration_min: int = 30,
    open_hour: int = 9,
    close_hour: int = 17,
) -> list[str]:
    """List free appointment start times on a given day.

    Args:
        day: ISO date string, e.g. "2026-05-23".
        duration_min: Length of the appointment in minutes.
        open_hour: First bookable hour (24h).
        close_hour: Last bookable hour (24h).

    Returns:
        Sorted ISO-8601 UTC start times.
    """
    return _get_store().list_slots(
        day=day,
        duration_min=duration_min,
        open_hour=open_hour,
        close_hour=close_hour,
    )


@mcp.tool()
def book_slot(
    customer_name: str,
    starts_at: str,
    duration_min: int = 30,
    customer_contact: str | None = None,
    reason: str | None = None,
) -> dict:
    """Book an appointment.

    Args:
        customer_name: Caller's name.
        starts_at: ISO-8601 datetime (e.g. "2026-05-23T15:00:00").
        duration_min: Length.
        customer_contact: Phone or email — used to lookup later.
        reason: Short purpose of visit.

    Returns:
        The new booking record with `id`.
    """
    b = _get_store().book(
        customer_name=customer_name,
        customer_contact=customer_contact,
        starts_at=starts_at,
        duration_min=duration_min,
        reason=reason,
    )
    return {
        "id": b.id,
        "customer_name": b.customer_name,
        "starts_at": b.starts_at,
        "ends_at": b.ends_at,
        "reason": b.reason,
    }


@mcp.tool()
def cancel_booking(booking_id: str) -> bool:
    """Cancel a booking by its ID. Returns True if it was cancelled, False if
    no active booking with that ID was found."""
    return _get_store().cancel(booking_id)


@mcp.tool()
def list_my_bookings(customer_contact: str) -> list[dict]:
    """Return all active bookings for a given phone/email contact."""
    return [
        {
            "id": b.id,
            "customer_name": b.customer_name,
            "starts_at": b.starts_at,
            "ends_at": b.ends_at,
            "reason": b.reason,
        }
        for b in _get_store().list_bookings_for(customer_contact)
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Entrypoint
# ─────────────────────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--http", action="store_true", help="Use HTTP+SSE transport (default stdio).")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=7700)
    parser.add_argument("--db", default=os.getenv("CALENDAR_DB", "calendar.sqlite"))
    args = parser.parse_args()

    # Ensure the store uses the requested DB.
    os.environ["CALENDAR_DB"] = str(Path(args.db).expanduser().resolve())

    if args.http:
        mcp.settings.host = args.host
        mcp.settings.port = args.port
        mcp.run(transport="sse")
    else:
        mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
