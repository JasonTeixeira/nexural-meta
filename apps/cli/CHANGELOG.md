# @nexural/cli

## 1.5.0

Tier-2 daily-ops payoff per ADR-0013.

### New commands

- `nx status` — one-screen dashboard: federation audit/health score, tracked projects flagged at risk, ecosystem digest summary, ADR/warehouse/recipe counts, operational blockers. `--json` for machine output.
- `nx project add <slug> --recipe <name> [--url <url>]` — track a forged project in `projects.yaml`.
- `nx project list` — list tracked projects with last verify score + timestamp.
- `nx project check [<slug>]` — re-run `nx verify` against tracked deploy URLs; persists `last_verify` + `last_verify_score`.

### Infrastructure

- `projects.yaml` (schema_version 1) is now the canonical project ledger.

## 0.1.0

Initial release. Per ARCHITECTURE §4.1 + ADR-0009 §1.5.

### Commands

- `nx ask "<query>"` — federation synthesis with citations (stub; router lands Phase 4)
- `nx sync [--factory|--lifeops]` — pulls all federation warehouses with auto-stash (ADR-0010 §2.3)
- `nx health` — Ink dashboard: federations, scorecard, decay, external MCPs
- `nx open <warehouse>` — cd + $EDITOR
- `nx forge <recipe> <name>` — emit a new app from a signed recipe (real impl Phase 5)
- `nx play <playbook>` — execute a playbook with confirmations (preview-only at v0.1.0)
- `nx new <name>` — scaffold a warehouse (per ADR-0009 §1.5; full templates Phase 5)
- `nx session save --note "..."` — STATE.md continuity per ADR-0008

### Infrastructure

- `~/.nexural/config.toml` loader with Zod validation; NEXURAL\_\* env vars override
- `~/.nexural/telemetry.db` SQLite with `nx_command` events; args sha256-hashed (SCHEMA_CHARTER §4.5 privacy rule)
- `NEXURAL_NO_TELEMETRY=1` disables logging entirely
