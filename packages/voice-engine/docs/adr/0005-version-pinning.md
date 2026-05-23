# ADR-0005: Pin LiveKit plugin versions exactly

**Status:** Accepted (2026-05-22)
**Owner:** Sage

## Context

LiveKit Agents shipped breaking minor changes between 1.4 and 1.5 in
the metric event names, the `AgentSession` constructor, and the
function-tool decorator. Other voice plugin authors (Deepgram, Cartesia,
OpenAI realtime) also push API tweaks frequently.

Our smoke-test passes at install time don't catch these — only a real
audio session does.

## Decision

Pin every LiveKit-related dependency in `pyproject.toml` to an exact
version (`==1.5.12`). Other deps use compatible-release ranges
(`>=2.13,<3.0`).

Bumping versions is a deliberate act: edit the pin, run the live test
(RUNBOOK.md), update if metric event names changed.

## Rationale

- A persona that worked yesterday must work today, unchanged.
- We don't have an automated way to test against a real LiveKit room
  yet — manual gate is the safest.
- This is internal-use software; we control upgrade timing.

## Trade-offs accepted

- We miss free bug fixes from patch releases until we explicitly bump.
- Mitigation: monthly pin-bump as a calendar event.

## Consequences

- Any dependency bump is its own PR with a live-test note in the
  commit message.
- `nx-voice doctor` reports the installed version of every plugin (TODO
  — not yet wired).
