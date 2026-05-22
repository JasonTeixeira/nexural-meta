# ADR-0009: Tier 1 Gap Closures from Comprehensive Audit

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak:** Sage waived; treat as locked at merge
**Depends on:** ADRs 0002–0008

## Context

A comprehensive audit (recorded in this session's conversation log) identified 10 Tier 1 gaps that would degrade the federation's institutional posture below 95/100. Each must be closed before Phase 1 begins.

This ADR codifies the closures as constitutional amendments.

## Decision

### 1.1 Canonical constitution docs in draft directory

The five canonical constitution docs (ARCHITECTURE.md, THREAT_MODEL.md, SCHEMA_CHARTER.md, NAMING.md, RETIREMENT.md) plus SUCCESSION.md MUST exist as files in `/Users/Sage/code/nexural/nexural-meta/docs/` before Phase 1 begins. ADR amendments are merged inline.

**Status:** Closed by writing canonical copies in this session.

### 1.2 Recipe schema consolidation

Recipe-family schemas (`RecipeManifest`, `ForgedLockfile`, `CostEnvelope`, `ServiceDeclaration`, `ExternalMcpEndpoint`, `ModelFamilyResolution`, `CostEvent`, `RevokedRecipesList`) MUST live in one canonical reference: `docs/SCHEMA_AMENDMENTS.md`. When ADRs and this file disagree, this file wins.

**Status:** Closed by writing SCHEMA_AMENDMENTS.md.

### 1.3 Content authoring time budget — entry minimums reduced

BUILD_PLAN.md v2.0 required ≥5 entries per platform warehouse and ≥10 per AI/Finance/SaaS warehouse. **Revised to ≥3 entries per warehouse for v1.0**, with the additional bar: each entry must score ≥85 on scorecard. Quality over quantity.

Calendar revised from 17 weekends to **19–22 weekends realistic** in BUILD_PLAN.md v2.1.

**Status:** Closed by BUILD_PLAN.md v2.1 (this session).

### 1.4 Pre-flight checklist amendments

PRE_FLIGHT.md §3 amended to add:

- Vercel account (Pro tier ready)
- Supabase account
- Stripe account (test mode acceptable initially)
- Sentry account (free tier)
- PostHog account (free tier)

PRE_FLIGHT.md §2 amended to add:

- Spare laptop OR VM for cold-start drills (Phase 2 + Phase 8 requirement)

**Status:** Closed by amending PRE_FLIGHT.md (this session).

### 1.5 `nx new` moved from v1.1 → Phase 5

`nx new` (warehouse scaffolder) moved from deferred-to-v1.1 list into Phase 5 deliverables. Verification metric "Time-to-scaffold a new warehouse via `nx new` ≤ 10 min" now achievable at v1.0.

**Status:** Closed by BUILD_PLAN.md v2.1.

### 1.6 Recipe revocation mechanism

`nexural-meta/security/revoked-recipes.yaml` is the canonical revocation list (schema in SCHEMA_AMENDMENTS.md §10).

Properties:

- **Append-only** — entries are added, never removed. Git protects history.
- **Signed entries** — each entry's `signature` field is a cosign signature of the entry contents.
- **Consulted by `nx forge`** — forge fails immediately if requested recipe@version is in this list.
- **Mirrored to dashboard** — `/security/revocations` page shows current list.
- **Revocations are PRs**, never direct commits. PRs require security review (when contributors exist) or solo-merge with documented reason.

### 1.7 Forge build environment hardening

`@nexural/factory` enforces:

- Default: `pnpm install --ignore-scripts` on first install after forge.
- Recipes ship `.npmrc` with `enable-pre-post-scripts=false` by default.
- Recipes that need legitimate postinstall scripts opt-in via explicit `forge_sandbox.allowed_postinstalls: ["package-name"]` (per SCHEMA_AMENDMENTS.md §5).
- Typosquat detection: post-install lockfile is scanned for packages whose names are <2 Levenshtein edits from common high-priority packages (lodash, react, next, etc.). Suspicious matches fail forge.
- License gate (already in ADR-0006) fails on AGPL/GPL/BUSL unless explicit opt-in.

### 1.8 Cost model split

ARCHITECTURE.md §8 amended to separate three cost layers:

| Layer                         | Target                                 |
| ----------------------------- | -------------------------------------- |
| Federation COGS               | ≤ $200/month                           |
| Per-forged-app COGS           | ≤ $150/month per app at steady state   |
| Per-recipe LLM unit economics | enforced by `cost_envelope` (ADR-0007) |

Total system at 5 shipped apps: ≤ $950/month. Crossing triggers cost review.

### 1.9 Cross-federation tier confinement

Router enforces hard tier boundary:

- `nx ask --factory` and factory-scoped MCP queries NEVER receive lifeops content.
- `nx ask --lifeops` and lifeops-scoped MCP queries NEVER receive factory content.
- Default `nx ask` (both federations) returns results clearly tagged by federation; synthesis prompt segregates them.
- Cross-federation request → hard reject with `tier_confinement_violation` warning logged.

This is implemented in `apps/router` as middleware between fan-out and response aggregation.

THREAT_MODEL.md amended (§12) to capture tier confinement as an explicit control.

### 1.10 Discipline scorecard

New `nexural-qa-os` runner: `discipline-scorecard`. Runs nightly via verify-all. Metrics tracked:

| Metric                                                  | Target                        |
| ------------------------------------------------------- | ----------------------------- |
| % merges to `main` with all CI checks green             | 100%                          |
| % releases (packages + recipes) with Sigstore signature | 100% post-Phase 8             |
| % LLM calls via `@nexural/sdk.llmClient()` wrapper      | ≥99% (sampled via grep + AST) |
| % warehouses past 1× decay                              | 0%                            |
| % recipes failing recipe-validity (last 7 days)         | 0%                            |
| # force-pushes to `main` (last 30 days)                 | 0                             |
| # `--no-verify` commits (last 30 days)                  | 0                             |
| # soak-window waivers (last 90 days)                    | ≤ 2                           |

Drift > 14 days on any metric → automatic incident.

Aspirational ARCHITECTURE §1 metric "≤ 2 hours/week maintenance" revised to **"≤ 3 hours/week"** to match realistic OPS_CALENDAR §7 calculation.

## Consequences

**Positive:**

- Federation jumps from ~96/100 (pre-closure) to ~98/100.
- All "you'll regret it" issues from the comprehensive audit are addressed.
- Ground truth for schemas + ops + pre-flight lives in one place each.

**Negative:**

- BUILD_PLAN extends 2–5 weekends.
- Soak waiver sets a precedent (item 1.10 caps further waivers at 2/quarter).

**Neutral:**

- Most closures are documentation amendments, not code changes.
- ADR-0010 follows with Tier 2 implementation mandates.

## Alternatives Considered

1. **Defer to Phase 1 in-flight fixes.** Rejected — these are constitutional in nature; fixing mid-build means amending the constitution while building against it.
2. **Skip the realistic calendar update.** Rejected — silent over-commitment is dishonest with future-Sage.
3. **Skip discipline scorecard.** Rejected — solo operators drift silently. Mechanical check or rot.

## Soak

Sage waived. Documented in STATE.md.
