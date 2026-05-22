# ADR-0002: Factory Reorientation

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak ends:** 2026-05-28 (7 days)

## Context

The original constitution (ARCHITECTURE.md v1.0, BUILD*PLAN.md v1.0) frames the federation as a 32-warehouse knowledge management system. After review against the actual stated goal — *"produce production-grade applications across finance, AI, and multi-sector SaaS without restarting from scratch each time"\_ — three load-bearing gaps surfaced:

1. The federation defines reference shelves (Layer 1) and verification (Layer 4) but skips composition (Layer 2) and pipeline (Layer 3). Apps cannot be forged from the federation as written.
2. The 32-warehouse roster is heavy on knowledge-management warehouses (decision, network, mentoring, etc.) and light on the production primitives apps actually need (auth, payments, email, storage, realtime).
3. The build sequence ships 32 warehouses authored on faith before any forged app exists to prove they're useful.

This ADR reorients the federation around the actual goal: **a factory pipeline that emits production-grade apps in finance, AI, and SaaS.**

## Decision

### Four-layer model

The federation is explicitly four layers:

| Layer                | Component                                                             | Status                                                 |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| **4 — Verification** | `nexural-qa-os`                                                       | exists, v1.0.0 (extended with new runners in ADR-0008) |
| **3 — Pipeline**     | `@nexural/factory` package + `nx forge / play / upgrade` CLI commands | NEW                                                    |
| **2 — Composition**  | Recipes (parameterized compositions of warehouses)                    | NEW                                                    |
| **1 — Reference**    | Warehouses (per ARCHITECTURE.md §4.4)                                 | NEW roster (below)                                     |

### Re-rostered warehouses — 30 total, focused on factory output

**Platform (15):** architecture, auth, payments, database, storage, email, realtime, deployment, observability, security, dx, design, accessibility, performance, runbook

**AI (6):** agent, rag, eval, prompt, model-routing, safety

**Finance (4):** ledger, compliance, market-data, accounting

**SaaS (5):** billing, multi-tenancy, onboarding, admin, analytics

Personal/strategic warehouses (decision, network, career, health, mentoring, interview, learning, failure, comms, vendor, finance-personal, legal-personal, principles, system-prompts) move to a separate parallel federation per ADR-0003.

### Five priority recipes (build order matters)

1. **`saas-multitenant-baseline`** — parent recipe. Auth + multi-tenancy (Supabase RLS) + Stripe + observability + security + accessibility + CI/CD + qa.manifest pre-wired. Every other recipe extends this.
2. **`saas-rag-chat`** — extends baseline + RAG (pgvector) + chat UI + eval harness + safety runners.
3. **`saas-agent-platform`** — extends baseline + agent orchestration + tool-use + multi-step eval.
4. **`fintech-ledger-app`** — extends baseline + double-entry ledger + reconciliation + audit trail.
5. **`internal-tool-dashboard`** — sub-recipe of baseline + admin patterns (impersonation, audit views, ops dashboards).

### Default stack — locked, immovable without ADR

| Layer                    | Pick                                                  | Escape recipe                               |
| ------------------------ | ----------------------------------------------------- | ------------------------------------------- |
| Framework                | Next.js 15 App Router                                 | —                                           |
| UI                       | shadcn/ui + Tailwind v4                               | —                                           |
| Data platform            | Supabase (Postgres + RLS + Auth + Storage + Realtime) | AWS RDS recipe (enterprise)                 |
| Payments                 | Stripe                                                | Lemon Squeezy recipe (EU VAT)               |
| Email                    | Resend                                                | —                                           |
| Hosting                  | Vercel + Cloudflare DNS/edge                          | Cloudflare Pages + Workers + D1 recipe      |
| Errors                   | Sentry                                                | —                                           |
| Product analytics        | PostHog                                               | —                                           |
| Tracing                  | OpenTelemetry                                         | —                                           |
| AI primary               | Anthropic                                             | OpenAI-first variant; Bedrock-first variant |
| AI fallback              | OpenAI                                                | —                                           |
| AI emergency             | Ollama                                                | —                                           |
| Vector                   | pgvector (default; <1M chunks)                        | Qdrant recipe (serious RAG)                 |
| Voice / Mobile / Trading | DEFER — empty warehouse stubs only                    | —                                           |

### Build-time target

**"Idea → deployed-to-staging in 4 hours."** `nx forge` does ~80% scaffold (code, tests, CI, MCP configs, qa.manifest, observability wired). Operator does ~20% (API keys via 1Password, domain, business logic, branding tokens).

## Consequences

**Positive:**

- Federation has a clear purpose: produce apps in three target sectors.
- Every warehouse can be justified against a recipe that consumes it. No "build on faith."
- ai-warehouse remains separate (ADR-0005) — no migration overhead, instant federation.
- Sets up the rest of the ADR-0003 through ADR-0008 changes that close institutional gaps.

**Negative:**

- Build calendar extends from ~14 → ~17 weekends (revised BUILD_PLAN.md v2).
- Locked stack means harder to deviate per-app. Mitigated by escape recipes shipped at v1.0.
- Personal warehouses split off — light overhead managing two federations (per ADR-0003).

**Neutral:**

- Constitution docs (ARCHITECTURE.md, etc.) get amendments via subsequent ADRs rather than wholesale rewrites.

## Alternatives Considered

1. **Keep original 32-warehouse plan unchanged.** Rejected — ships infrastructure for 14 weekends before any forged app exists. High risk of authoring on faith; validation deferred.
2. **Build only 5 warehouses for v1.0; defer the rest entirely.** Rejected — loses the federation's compounding value. The 30 chosen here all justify themselves against at least one of the 5 recipes.
3. **Build factory + lifeops as one mixed federation.** Rejected — dilutes both. Personal/strategic warehouses confuse the factory's identity for human readers and routing agents.

## Soak Period

7 days. ADR-0002 through ADR-0008 are a single coordinated change — all soak together. Merge en bloc on **2026-05-28** if no objection raised.
