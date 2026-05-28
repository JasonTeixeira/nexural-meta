# CLAUDE.md — nexural-qa-os

> **Read first:** the master ecosystem map at [`nexural-meta/docs/ECOSYSTEM.md`](https://github.com/JasonTeixeira/nexural-meta/blob/main/docs/ECOSYSTEM.md). This repo is the **QA verification layer** — one of four repos in the Sage Ideas LLC ecosystem.

## What this repo is

The **Quality Assurance Operating System**. Runs scorecard checks across the federation + forged apps. Detects drift, surfaces findings, gates ships.

## What lives here

- `runners/` — registry of QA checks (lint shape, schema conformance, threat-model presence, etc.)
- `scorecards/` — generated scorecard JSON per warehouse / per recipe / per deployed app
- `playbooks/` — hardening playbooks (phases A through J, target 95+)
- `mcp-server/` — MCP stdio server (exposes `qa_os_check`, `qa_os_scorecard`, `qa_os_list_runners`)
- `phases/` — per-phase hardening criteria + acceptance gates

## MCP tools you can call

| Tool                                    | Use when                                              |
| --------------------------------------- | ----------------------------------------------------- |
| `qa_os_check(target_path)`              | Run the full runner set against a path                |
| `qa_os_scorecard(name)`                 | Fetch latest scorecard for a warehouse / recipe / app |
| `qa_os_list_runners()`                  | Browse available runners                              |
| `qa_os_run_runner(runner_name, target)` | Run one specific runner                               |

## Cross-repo flow

- **From `nexural-meta`:** runs as the 5-runner federation conformance suite via `@nexural/qa-runners-federation`.
- **From `ai-warehouse`:** scored by `qa_os_scorecard` for catalog completeness.
- **From `voice-engine`:** scored once it reaches stable surfaces (Phase 1+).
- **Used by:** every forged app's `pnpm verify-all` command (federation's recipes wire it in).

## Doctrines (inherited from ecosystem)

- Scorecard format is API-stable; runners can be added but not silently removed
- Drift threshold: 5% behavior change between scorecards opens a PR
- Target score: 95+ for any warehouse claiming `shipped` status
- Per-phase acceptance gates locked in `phases/`

## Active phase

Per memory: Phase A done (truth-hygiene); Phase C next (Option 2). 72→95+ trajectory.

## When something breaks

| Symptom                                 | Fix                                                          |
| --------------------------------------- | ------------------------------------------------------------ |
| Scorecard generation fails for a target | Check `runners/` for the failing runner; add missing fixture |
| New runner not picked up                | Register in `runners/registry.yaml`                          |
| Drift PR storms                         | Tighten `drift_threshold_pct` in scorecard config            |

---

_See also:_ [`AGENTS.md`](AGENTS.md) — same content for non-Claude agents.
