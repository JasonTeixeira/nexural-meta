# Nexural Build State

> Single source of truth for "where is the build now?" Read at start of every session. Updated at end of every session. Per ADR-0008.

---

## Current state — V1.0 ✨

- **Status:** **V1.0.0 — General Availability**
- **Last tag:** `v1.0.0`
- **Soak window:** ADRs 0002–0012 locked.
- **API surface:** stable per ADR-0012 §2. Breaking changes require a major version bump.
- **Maintenance cadence:** patch (1–2 weeks) / minor (monthly) / major (no timetable) / security (≤7 days).
- **Next quarterly federation review:** 2026-08-22.

## V1.0 at a glance

```
10 packages (all 1.0.0)        7 recipes               11 warehouses
─────────────────────────      ─────────────           ──────────────
@nexural/schema                saas-multitenant-baseline  architecture
@nexural/sdk                   saas-rag-chat              auth
@nexural/mcp-base              saas-agent-platform        database
@nexural/qa-runners            saas-rag-chat-qdrant       observability
@nexural/qa-runners-federation saas-rag-chat-openai-first security
@nexural/model-router          fintech-ledger-app         dx
@nexural/factory               internal-tool-dashboard    payments
@nexural/forge-emit                                       billing
@nexural/warehouse-base                                   rag
@nexural/cli                                              prompt
                                                          safety
```

| Federation surface             | Count                                                           |
| ------------------------------ | --------------------------------------------------------------- |
| ADRs locked                    | 12                                                              |
| Federation qa-os runners       | 5                                                               |
| Git tags                       | 23                                                              |
| Tests (workspace-wide passing) | 419+                                                            |
| Constitution docs              | 6                                                               |
| Public-API contracts           | 10 (schemas, render grammar, manifests, CLI commands, lockfile) |

## What's stable (locked at V1.0)

Per ADR-0012 §2:

- `@nexural/schema` — 22 Zod schemas
- `@nexural/forge-emit` template grammar (`{{ var }}`, `{{ var | default:"x" }}`, `{{# if }}`, `{{# unless }}`)
- `@nexural/warehouse-base` composition API
- Recipe manifest format
- Warehouse manifest format
- Forge lockfile (`.nexural/forged.lock.yaml`) shape
- `nx` CLI command surface

## Recipes — slice status

Per ADR-0011, recipes earn `shipped` status only after the 6-gate slice (emit → install → build → deploy → qa-os clean → adversarial proof). Promotion is per-recipe; no federation version bump required.

| Recipe                       | Slice | Status   |
| ---------------------------- | ----- | -------- |
| `saas-multitenant-baseline`  | 5/6   | scaffold |
| `saas-rag-chat`              | 5/6   | scaffold |
| `fintech-ledger-app`         | 5/6   | scaffold |
| `internal-tool-dashboard`    | 5/6   | scaffold |
| `saas-agent-platform`        | -     | scaffold |
| `saas-rag-chat-qdrant`       | -     | scaffold |
| `saas-rag-chat-openai-first` | -     | scaffold |

The 4 recipes at 5/6 await live deploys (gate 4 + gate 5 — Sage-driven). See `evidence/gate-4/deploy-runbook.md` for the exact step-by-step.

## Outstanding (post-V1.0 Sage-driven work)

These don't block V1.0 GA — they unlock individual recipe promotions and architectural targets that ADR-0012 explicitly deferred:

1. **Phase 8 live deploy** of `saas-multitenant-baseline` → promote recipe 5/6 → 6/6 → `shipped`. See `evidence/gate-4/deploy-runbook.md`.
2. **Phase 9 dogfood deploy** of `saas-rag-chat` (suggested: RAG over Nexural's own ADRs + recipes) → promote recipe.
3. **Operational hardening** per `evidence/operational/sage-blockers.md`: npm token rotation, FileVault, `op signin`, `gh auth refresh -h github.com -s admin:ssh_signing_key`, B2 buckets, YubiKey passkey check.
4. **npm-publish for new packages** (`@nexural/forge-emit`, `@nexural/warehouse-base`) — the v0.7.0 publish reported success but the registry never received them; granular access token needs scope-create permission. Will land automatically on the next tag once the new token is in place.

## Deferred to V1.1+ (per ADR-0012 §5)

- Promoting the 11 warehouses from local folders to separate GitHub repos
- MCP fetch path in `@nexural/warehouse-base` (currently local-disk only)
- `nexural-router` consuming warehouses via MCP at synthesis time
- `nexural-lifeops` federation split (per ADR-0003)
- Remaining recipe escapes (`fintech-stripe-connect`, `fintech-paddle-alt`, `internal-tool-airtable-alt`)
- Markdown-aware chunker (currently recursive char splitter)
- Cohere rerank wiring
- Cosign signature verification on recipe tarballs
- SBOM generation at forge time

## Build history

Per-phase build deliverables (Phase 0 → Phase 9) archived to [`STATE_ARCHIVE.md`](STATE_ARCHIVE.md). 23 tags from `v0.1.0` to `v1.0.0`; each tag has a GitHub Release with notes.

## Where to start

- New here? Read [`README.md`](README.md).
- Building an app? `npm i -g @nexural/cli` then `nx forge <recipe> <slug>`. Recipes are in [`recipes/`](recipes/).
- Working on the federation itself? See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md).
- Constitution + governance: [`docs/`](docs/) — start with `ARCHITECTURE.md`, `SCHEMA_CHARTER.md`, `NAMING.md`, `VERIFICATION.md`, `SOLO_FACTORY_OPS.md`, `AI_HANDOFF.md`.
- ADRs: [`docs/adr/`](docs/adr/) — 12 total at V1.0.

---

_Sage Ideas LLC. Built solo._
