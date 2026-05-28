# CLAUDE.md — voice-engine

> **Read first:** the master ecosystem map at [`nexural-meta/docs/ECOSYSTEM.md`](https://github.com/JasonTeixeira/nexural-meta/blob/main/docs/ECOSYSTEM.md). This repo is the **voice agent toolkit** — one of four repos in the Sage Ideas LLC ecosystem.

## What this repo is

The **voice agent toolkit**. Persona library, voice provider adapters (Retell, Vapi), TCPA outbound-call compliance gate, redaction pipeline, MCP server. Built for AI voice agents that need to be compliant + reliable.

## What lives here

- `personas/` — voice-agent personas (system prompts + tool sets + boundaries)
- `src/voice_engine/server.py` — MCP server
- `src/voice_engine/tools.py` — agent-callable tools (TCPA check, redaction, etc.)
- `examples/nextjs-client/` — Next.js client showing how to integrate
- `tests/` — test suite

## MCP tools you can call (current + planned)

| Tool                                | Use when                                  |
| ----------------------------------- | ----------------------------------------- |
| `voice_search(query)`               | Search personas + patterns                |
| `voice_tcpa_check(phone, timezone)` | Verify outbound-call compliance           |
| `voice_redact(transcript)`          | PII redaction before logs / model context |
| `voice_persona_get(slug)`           | Fetch a persona definition                |
| `voice_persona_list()`              | Browse available personas                 |

## Cross-repo flow

- **From `nexural-meta`:** the security warehouse vendored the TCPA gate + redaction pattern from sage-agents; this repo carries the canonical implementation forward.
- **From `ai-warehouse`:** queries here when picking voice tooling (Retell vs Vapi).
- **From `nexural-qa-os`:** scored once Phase 1 surfaces stabilize.
- **Used by:** any forged app that ships a voice agent (future `saas-voice-agent` recipe).

## Doctrines (inherited from ecosystem)

- TCPA outbound calls: 8am-9pm window + DNC check + non-expired consent (fail-closed)
- PII redaction applied to every transcript before log / model / breadcrumb
- No SMS 2FA anywhere
- All voice provider keys via `op://` references

## Active phase

In active development. Few stable surfaces. MCP server boots; tools landing. Federation references this repo via `registry-external-mcp.yaml` with `score: 0` until Phase 1 ships.

## When something breaks

| Symptom                            | Fix                                                        |
| ---------------------------------- | ---------------------------------------------------------- |
| TCPA check returns false-negatives | Check timezone string vs `Intl.DateTimeFormat` support     |
| Persona not found                  | Confirm `personas/<slug>/manifest.yaml` exists + validates |
| MCP server crashes on boot         | Check Python deps installed; `pip install -e .`            |

---

_See also:_ [`AGENTS.md`](AGENTS.md) — same content for non-Claude agents.
