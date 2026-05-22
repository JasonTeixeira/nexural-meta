# Nexural Federation v1.0

A solo-operator SaaS factory. Forge production-grade apps from signed, audited recipes — across SaaS, fintech, AI, and internal tools — without restarting from scratch every time.

## What V1.0 is

V1.0 is the foundation. The federation can:

- **Forge a working app.** `nx forge saas-multitenant-baseline my-app` produces a Next.js 15 + Supabase + Stripe + Sentry + PostHog app that builds, deploys, and runs.
- **Verify the deployed app.** `nx verify https://my-app.vercel.app` checks security headers, the health endpoint, and `x-powered-by` absence. Closes ADR-0011 gate 5.
- **Catch regressions before they ship.** 5 qa-os runners check schema conformance, recipe validity, prompt-injection resilience, golden-set drift, and forge emit-time invariants on every PR.
- **Compose recipes from warehouses.** 11 warehouses (architecture, auth, database, observability, security, dx, payments, billing, rag, prompt, safety) contribute typed templates that recipes assemble at forge time.
- **Refuse to ship secrets.** `@nexural/forge-emit` rejects any emit that would leak a `secrets.*` value into a rendered file. Adversarial proof in `evidence/adversarial/`.

## What you can build with V1.0

All 7 recipes forge + build cleanly at V1.0. Their **slice status** indicates how far each has been through the ADR-0011 6-gate ceremony (emit → install → build → deploy → qa-os clean → adversarial proof):

| Recipe                       | Slice status        | Use case                                                                                      |
| ---------------------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| `saas-multitenant-baseline`  | 5/6 — awaits deploy | Tenant SaaS with auth, payments, RLS, observability. Parent of every other SaaS recipe.       |
| `saas-rag-chat`              | 5/6 — awaits deploy | Chat over user docs. pgvector, hybrid search, citation validation, safe-link rewriting.       |
| `fintech-ledger-app`         | 5/6 — awaits deploy | Finance / ledger. Double-entry, precision-safe bigint math, 7-year retention, reconciliation. |
| `internal-tool-dashboard`    | 5/6 — awaits deploy | Admin tool. RBAC, bulk-action audit, no-index, MFA.                                           |
| `saas-agent-platform`        | scaffold            | Agent app with typed tool registry + per-session whitelist + adversarial eval suite.          |
| `saas-rag-chat-qdrant`       | scaffold            | Qdrant escape for >1M chunks.                                                                 |
| `saas-rag-chat-openai-first` | scaffold            | OpenAI-primary chain inversion.                                                               |

Recipes graduate to `shipped` one at a time as their live deploys complete (gates 4 + 5 of ADR-0011). Promotion does not require a federation version bump.

## What's locked at V1.0 (stable API)

- 22 Zod schemas in `@nexural/schema`
- `@nexural/forge-emit` template grammar
- `@nexural/warehouse-base` composition API
- Recipe + warehouse manifest formats
- `.nexural/forged.lock.yaml` shape
- `nx` CLI command surface

Breaking these requires a major version bump and an ADR.

## What's deferred to V1.1+

- Promoting the 8 warehouses from local folders to separate GitHub repos
- MCP fetch path in `@nexural/warehouse-base` (currently local-disk loader)
- `nexural-router` consuming warehouses via MCP
- `nexural-lifeops` federation split (per ADR-0003)
- Remaining recipe escapes (`fintech-stripe-connect`, `fintech-paddle-alt`, etc.)
- Markdown-aware chunker
- Cohere rerank wiring
- Cosign signature verification on recipe tarballs

None of those are V1.0-blocking. All build cleanly on the V1.0 foundation.

## Maintenance cadence

- **Patch (1.0.x):** 1–2 weeks; bug fixes, runner findings.
- **Minor (1.x.0):** monthly; new recipes, warehouses, runners, schema additions.
- **Major (2.0.0):** no timetable; only when an API surface must break.
- **Security fixes:** within 7 days of disclosure.

Quarterly federation health review per ADR-0009 §1.10. First post-V1.0 review: 2026-08-22.

## The numbers

- **10 packages** on npm, version 1.0.0
- **11 warehouses** under `warehouses/`
- **7 recipes** under `recipes/`
- **5 federation qa-os runners**
- **12 ADRs**, 6 constitution docs
- **23 git tags** from v0.1.0 to v1.0.0
- **309 schema tests, 27 federation-runner tests, 32 CLI tests, 34 forge-emit tests, 17 warehouse-base tests** — 419+ passing tests across the stack
- **9 months of build**, single operator

## How to start

```bash
# Install the CLI
npm i -g @nexural/cli

# Forge an app
nx forge saas-multitenant-baseline my-app

# Verify a deployment
nx verify https://my-app.vercel.app
```

Recipes are in [`recipes/`](recipes/). Warehouses are in [`warehouses/`](warehouses/). The build history is in [`STATE_ARCHIVE.md`](STATE_ARCHIVE.md) (organized by phase). Current state is in [`STATE.md`](STATE.md).

The vertical slice doctrine (ADR-0011) is the rule of the road: no recipe is "shipped" until it forge-and-deploys end-to-end and passes the federation runners against a live URL.

## Acknowledgments

The federation borrows pattern + code from the earlier `sage-agents` repo, particularly the TCPA outbound-call gate and the PII redaction patterns (now in `warehouses/security/`). Per ADR-0011 §6.

Built by Sage Ideas LLC.

---

**Status:** v1.0.0 — General Availability.
**Date:** 2026-05-22.
