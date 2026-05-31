# Sage Ideas Engineering OS

**A solo-operator SaaS factory.** Forge production-grade apps from signed, audited recipes — across SaaS, fintech, AI, and internal tools — without restarting from scratch every time.

**Status: V1.0.0 — General Availability.** See [`docs/V1_ANNOUNCEMENT.md`](docs/V1_ANNOUNCEMENT.md).

---

## Phase 0 naming clarification

Sage Ideas is the company and ecosystem umbrella. Sage Ideas Engineering OS is
the internal resource factory. Nexural is a trading/investment product name and
legacy implementation namespace, not the umbrella for the company or the whole
engineering ecosystem.

Start here:

- [`docs/SAGE_IDEAS_ENGINEERING_OS.md`](docs/SAGE_IDEAS_ENGINEERING_OS.md)
- [`docs/BRAND_ARCHITECTURE.md`](docs/BRAND_ARCHITECTURE.md)
- [`docs/ECOSYSTEM_CONSTITUTION.md`](docs/ECOSYSTEM_CONSTITUTION.md)
- [`docs/adr/0014-sage-ideas-engineering-os-umbrella.md`](docs/adr/0014-sage-ideas-engineering-os-umbrella.md)

---

## What this is

A composable system for building deployable apps end-to-end:

1. **Warehouses** ship typed, reusable templates (auth scaffolds, RLS schemas, observability wiring, etc.) and authored documents.
2. **Recipes** compose warehouses + add app-specific templates + lock decisions in `THREAT_MODEL.md` / `DECISIONS.md`.
3. **`nx forge`** validates inputs, resolves secrets via `op://`, composes templates from warehouses + recipe, emits to disk, `git init`s, writes a lockfile.
4. **5 qa-os runners** verify everything before and after emit: schema conformance, recipe validity, prompt-injection resilience, golden-set drift, forge emit-time invariants.
5. **`nx verify <url>`** smoke-checks deployed apps against the ADR-0011 vertical-slice doctrine.

Built solo by [Sage Ideas LLC](https://sageideas.org).

---

## Quick start

```bash
# Install
npm i -g @nexural/cli

# Forge an app
nx forge saas-multitenant-baseline my-app \
  --inputs config/inputs.json

# Verify a deployment
nx verify https://my-app.vercel.app \
  --evidence-slug my-app-prod
```

---

## What you can build

| Recipe                       | Slice status        | Use case                                                                                      |
| ---------------------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| `saas-multitenant-baseline`  | 5/6 — awaits deploy | Tenant SaaS with auth, payments, RLS, observability. Parent of every other SaaS recipe.       |
| `saas-rag-chat`              | 5/6 — awaits deploy | Chat over user docs. pgvector, hybrid search, citation validation, safe-link rewriting.       |
| `fintech-ledger-app`         | 5/6 — awaits deploy | Finance / ledger. Double-entry, precision-safe bigint math, 7-year retention, reconciliation. |
| `internal-tool-dashboard`    | 5/6 — awaits deploy | Admin tool. RBAC, bulk-action audit, no-index, MFA.                                           |
| `saas-agent-platform`        | scaffold            | Agent app with typed tool registry + per-session whitelist + adversarial eval suite.          |
| `saas-rag-chat-qdrant`       | scaffold            | Qdrant escape for >1M chunks.                                                                 |
| `saas-rag-chat-openai-first` | scaffold            | OpenAI-primary chain inversion.                                                               |

Per ADR-0011, recipes graduate to `shipped` after their 6-gate slice. Promotion is per-recipe; no federation version bump.

---

## Warehouse roster (11)

```
architecture   — Next.js + TypeScript baselines (tsconfig, next.config, .gitignore, vercel.json)
auth           — Supabase SSR client/server + middleware + magic-link login + callback route
database       — Postgres + RLS multi-tenant schema + supabase config
observability  — Sentry client/server/edge + PostHog provider + instrumentation
security       — .env discipline + PII redaction + TCPA gate (vendored from sage-agents)
dx             — ESLint + Prettier + .editorconfig + README + /api/health route
payments       — Stripe client + webhook signature + checkout session
billing        — stripe_events idempotency + 5-state subscription state machine
rag            — pgvector schema + chunker + embedder + hybrid retrieve (BM25 + dense via RRF)
prompt         — synthesis prompt + envelope wrapping + citation validator
safety         — safe-link URL rewriter + adversarial eval golden set scaffold
```

---

## Workspace layout

```
nexural-meta/
├── docs/                     # constitution + 12 ADRs + V1 announcement
│   ├── adr/                  # 0001 … 0012
│   ├── ARCHITECTURE.md       # the shape of the federation
│   ├── BUILD_PLAN.md         # phase history (0 → 9 done)
│   ├── SCHEMA_CHARTER.md
│   ├── NAMING.md
│   ├── VERIFICATION.md
│   ├── SOLO_FACTORY_OPS.md
│   ├── AI_HANDOFF.md
│   └── V1_ANNOUNCEMENT.md
├── packages/                 # @nexural/* npm packages (all 1.0.0)
│   ├── schema/
│   ├── sdk/
│   ├── mcp-base/
│   ├── qa-runners/
│   ├── qa-runners-federation/
│   ├── model-router/
│   ├── factory/
│   ├── forge-emit/
│   └── warehouse-base/
├── apps/
│   ├── cli/                  # the `nx` command
│   ├── router/               # MCP synthesis router
│   └── dashboard/            # Next.js cockpit
├── recipes/                  # 7 recipes (parents + AI + fintech + internal tool + escapes)
├── warehouses/               # 11 local warehouse directories
├── evidence/                 # gate-4 deploy runbook, gate-5 verify reports, adversarial proofs
├── test/fixtures/            # inputs.json per recipe for forge-emit-conformance
├── security/
│   └── revoked-recipes.yaml  # append-only revocation list (ADR-0009 §1.6)
├── registry-external-mcp.yaml
├── STATE.md                  # current state
└── STATE_ARCHIVE.md          # phase history (0 → 9)
```

---

## Governance

- **Constitution** (6 docs in `docs/`) + **12 ADRs** are load-bearing. Deviating from any locked decision requires an ADR, not improvisation.
- **Vertical slice doctrine** (ADR-0011): every recipe must forge-and-deploy end-to-end before earning `shipped` status.
- **API surface frozen at V1.0** (ADR-0012 §2). Breaking changes require a major version bump.
- **Quarterly federation health review** per ADR-0009 §1.10. First post-V1.0 review: 2026-08-22.

---

## Maintenance cadence

- **Patch (1.0.x):** 1–2 weeks; bug fixes, runner findings.
- **Minor (1.x.0):** monthly; new recipes, warehouses, runners, schema additions.
- **Major (2.0.0):** no timetable; only when an API surface must break.
- **Security fixes:** within 7 days of disclosure.

---

## Provenance

All published packages ship with [SLSA Build L3 provenance](https://slsa.dev/spec/v1.0/levels#build-l3) via GitHub Actions OIDC. Every recipe carries a lockfile recording the warehouse SHAs it consumed at emit time.

---

## License

MIT — including the recipes themselves. Apps you forge inherit whichever license you pick at `recipe.output_license`.

---

_Built solo by Sage Ideas LLC. **Forged, not assembled.**_
