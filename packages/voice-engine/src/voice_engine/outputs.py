"""Structured outputs — typed deliverables some personas must emit.

A persona's *value* often isn't the chat — it's the structured artifact
at the end (medical SBAR, interview debrief, qualified lead, intake
summary). Personas opt in by referencing an output schema; the engine
registers a `submit_<schema>` function tool the LLM can call to finalise
the result. The tool persists to telemetry and (optionally) hands off
to an MCP tool the app uses to action it.
"""

from __future__ import annotations

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────────────────


class SBAR(BaseModel):
    """Situation / Background / Assessment / Recommendation — clinical handoff."""

    patient_name: str
    date_of_birth: str | None = None
    situation: str = Field(..., description="Chief complaint, onset, severity 0–10")
    background: str = Field(..., description="Relevant history, current meds, allergies")
    assessment: str = Field(..., description="Patient's own theory; any vitals they shared")
    recommendation: str = Field(..., description="What they think they need")
    red_flags: list[str] = Field(default_factory=list)
    consent_to_share: bool = True


class InterviewDebrief(BaseModel):
    candidate_name: str
    role: str
    interview_type: Literal["behavioural", "system_design", "coding", "domain"]
    signal: Literal["strong_hire", "hire", "lean_hire", "no_hire", "strong_no_hire"]
    strengths: list[str]
    growth_areas: list[str]
    one_drill: str = Field(..., description="One concrete practice drill for the next week")
    notes: str = ""


class QualifiedLead(BaseModel):
    prospect_name: str
    company: str
    role: str | None = None
    pain_summary: str
    budget_signal: Literal["yes", "no", "unknown"] = "unknown"
    timeline: Literal["now", "this_quarter", "next_quarter", "later", "unknown"] = "unknown"
    next_step: Literal["demo_booked", "follow_up", "disqualified"] = "follow_up"
    meeting_iso: str | None = None
    notes: str = ""


class CallMessage(BaseModel):
    """Generic receptionist message-taker."""

    caller_name: str
    caller_phone: str
    reason: str
    urgency: Literal["low", "normal", "high", "urgent"] = "normal"
    callback_window: str | None = None
    received_at: str = Field(default_factory=lambda: date.today().isoformat())


# ─────────────────────────────────────────────────────────────────────────────
# Registry
# ─────────────────────────────────────────────────────────────────────────────

OUTPUT_SCHEMAS: dict[str, type[BaseModel]] = {
    "sbar": SBAR,
    "interview_debrief": InterviewDebrief,
    "qualified_lead": QualifiedLead,
    "call_message": CallMessage,
}


def get_schema(name: str) -> type[BaseModel]:
    if name not in OUTPUT_SCHEMAS:
        raise KeyError(
            f"unknown output schema '{name}'. Available: {list(OUTPUT_SCHEMAS)}"
        )
    return OUTPUT_SCHEMAS[name]
