# nexural-meta

**Nexural Federation — control plane.**

Single-operator SaaS factory. Federated knowledge + MCP routing + codegen pipeline for shipping production-grade finance, AI, and multi-sector SaaS apps without restarting from scratch.

Per `docs/ARCHITECTURE.md` v1.1. Read order: `docs/INDEX.md` → `STATE.md` → constitution.

---

## Quick start

```bash
# Tools required: Node 22+, pnpm 10+, gh, age, sops, rclone, cosign, op, terraform.
# See docs/PRE_FLIGHT.md.

pnpm install
pnpm typecheck
pnpm test
pnpm build
```

---

## Workspace layout

```
nexural-meta/
├── docs/                ← constitution + ADRs + operational docs (see INDEX.md)
├── packages/
│   ├── schema/          ← @nexural/schema       — canonical Zod schemas
│   ├── sdk/             ← @nexural/sdk          — incl. cost-wrapped llmClient
│   ├── mcp-base/        ← @nexural/mcp-base     — warehouse MCP base + prompt-injection envelope
│   ├── qa-runners/      ← @nexural/qa-runners   — typed runner registry
│   ├── factory/         ← @nexural/factory      — recipe loader + license gate + lockfile + typosquat
│   └── model-router/    ← @nexural/model-router — family→ID resolver
├── apps/                ← (Phase 3+) cli, router, dashboard
├── recipes/             ← (Phase 5+) signed recipes
├── infra/               ← Terraform repo-config + B2 backup
├── scripts/             ← discovery, verify-all, cross-refs, bootstrap
├── security/            ← revoked-recipes.yaml (per ADR-0009)
└── STATE.md             ← current build state — read first
```

---

## Documentation

- `docs/INDEX.md` — reading order + glossary + decision tree
- `docs/ARCHITECTURE.md` — system design, four-layer model
- `docs/THREAT_MODEL.md` — security posture, key management
- `docs/SCHEMA_CHARTER.md` + `docs/SCHEMA_AMENDMENTS.md` — contracts
- `docs/NAMING.md` — naming conventions
- `docs/RETIREMENT.md` — lifecycle protocols
- `docs/SUCCESSION.md` — continuity / dead-man
- `docs/BUILD_PLAN.md` — phased build sequence
- `docs/VERIFICATION.md` — per-phase gates
- `docs/PRE_FLIGHT.md` — pre-Phase-1 checklist
- `docs/OPS_CALENDAR.md` — recurring tasks
- `docs/POST_V1_BACKLOG.md` — v1.1+ items
- `docs/adr/0001-0010-*.md` — architecture decision records

---

## Phase status

See `STATE.md`. Currently: Phase 1 — Shared Foundations (in progress).

---

## License

UNLICENSED — proprietary. Internal use only. Per-package licenses (under `packages/*/package.json`) are MIT (where published).
