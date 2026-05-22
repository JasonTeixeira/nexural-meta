# ADR-0011: Vertical Slice Doctrine — Every Recipe Forges or It Did Not Ship

**Status:** Proposed
**Date:** 2026-05-22
**Deciders:** Sage
**Soak:** WAIVED (Sage, 2026-05-22). Treat as locked at merge.
**Depends on:** ADR-0002 (factory reorientation), ADR-0006 (recipe lockfile + signing), ADR-0008 (federation conformance)

## Context

At the end of Phase 6 the federation reached a state that, audited honestly, looks like this:

- 8 packages published on npm, all green
- 4 recipes scaffolded (`saas-multitenant-baseline`, `saas-rag-chat`, `saas-agent-platform`, 2 escapes)
- 4 federation qa-os runners passing
- 18+ warehouses **referenced** by recipes; **zero exist as MCP servers**
- `nx forge` CLI command is a stub that prints a 10-step plan and exits
- `@nexural/factory` validates lockfile shape, license composition, typosquats — does **not** emit code
- **No app has ever been emitted by the pipeline.** No app has been deployed. No qa-os runner has ever caught a real regression in a real app.

The constitution and architecture are good. The packages are well-built. But the federation has never touched production reality. Continuing to add Phase 7 / Phase 8 / Phase 9 scaffolds before validating the pipeline compounds integration risk exponentially.

Building 21 warehouses + 5 more recipes on top of an unproven emit pipeline is the highest-leverage mistake available to a solo operator.

This ADR locks the doctrine that prevents it.

## Decision

### 1. The vertical slice rule

**No recipe is "shipped" until it has forge-and-deployed end-to-end at least once.**

"Shipped" means: tagged, published, advertised as ready for use. Recipes can be _scaffolded_, _drafted_, or _in development_ without satisfying the slice — those states are explicitly distinct.

The slice consists of six gates (all required, in order):

1. **Emit:** `nx forge <recipe> <slug>` writes a complete filesystem tree to disk with zero manual edits required to install dependencies.
2. **Install:** `pnpm install` in the emitted tree completes without errors.
3. **Build:** `pnpm build` produces a deployable artifact.
4. **Deploy:** the artifact runs on its target infrastructure (Vercel + Supabase + Stripe test mode is the canonical first target). A user can reach a live URL and complete the recipe's primary user flow (e.g., signup → checkout → email confirmation).
5. **qa-os clean:** all federation runners pass against both the recipe definition and the emitted app. Score ≥ 80.
6. **Adversarial proof:** the recipe owner deliberately introduces at least one regression class (RLS-drop, hardcoded secret, unsigned recipe, etc.) and confirms a runner flags it. Recorded in `evidence/adversarial/<recipe>/` with the break + the catch.

A recipe that passes all six gates earns the `shipped` status in `registry-recipes.yaml`. A recipe that has not is marked `scaffold` and is not advertised externally.

### 2. Minimum viable warehouses

A recipe SHOULD NOT depend on more warehouses than are required to satisfy its slice. Speculative warehouse dependencies bloat the federation and prevent the slice from being achievable.

For `saas-multitenant-baseline` the minimum is six: `architecture`, `auth`, `database`, `observability`, `security`, `dx`. Other warehouses (`billing`, `email`, `multi-tenancy`, `onboarding`, `admin`, `analytics`, `accessibility`, `performance`, `design`, `runbook`, `storage`) join the recipe at later versions when their slice is demonstrated.

The federation builds warehouses **just-in-time** for the recipes that need them. The 21-warehouse target in ARCHITECTURE.md remains the long-term shape, not a Phase-6.5 requirement.

### 3. The `forge-emit-conformance` runner (5th federation runner)

`@nexural/qa-runners-federation@0.3.0` adds a fifth runner:

- For each `recipes/<name>/recipe.yaml`, run `nx forge <name> <test-slug> --dry-run --fixture=test/fixtures/<name>.inputs.json`.
- Assert the emit succeeds.
- Assert the emitted tree contains the required files for the recipe's declared `services[]` (a Next.js service requires `package.json`, `next.config.*`, `app/layout.*`, `.env.example`).
- Assert no template variables remain unresolved (`{{ }}` patterns in any emitted file = fail).
- Assert no secret values leaked into emitted files (any string matching the secret-shaped patterns in `security/secret-patterns.yaml` = fail).

This runner is **mandatory** for any recipe claiming the `shipped` status. Recipes marked `scaffold` may skip it.

### 4. The doctrine is institutionalized, not aspirational

The slice is the federation's "definition of done" for recipes. To prevent doctrine drift:

- `STATE.md` always lists which recipes have passed the slice and which haven't.
- The next federation runner audit MUST verify no `shipped` recipe lacks an `evidence/slice/<recipe>/` directory with deploy URL, qa-os score artifact, and adversarial-proof log.
- Bypassing the slice (declaring a recipe shipped without it) requires a soak waiver per ADR-0009 §1.10 — counts against the ≤2/quarter cap.

### 5. Phase 6.5 carves out the doctrine's first execution

A new phase — **6.5 Vertical Slice** — is inserted between Phase 6 (AI recipes, shipped) and Phase 7 (fintech + internal-tool recipes). Scope:

1. Real `nx forge` emit pipeline (new package: `@nexural/forge-emit`).
2. Six MVP warehouses for `saas-multitenant-baseline`, each as an MCP server backed by a shared `@nexural/warehouse-base` kit.
3. Deploy `nexural-slice-test` to Vercel + Supabase + Stripe test mode.
4. `forge-emit-conformance` runner.
5. Adversarial proof.
6. Patch every constitution / ADR / template gap the slice surfaces.

Phase 7 begins only after Phase 6.5 closes. Phase 7 recipes inherit a proven pipeline.

### 6. Sage-agents extraction is folded into Phase 6.5

The TCPA gate (`packages/voice/src/tcpa.ts`) and PII redaction patterns (`packages/voice/src/redaction.ts`) from `sage-agents` land in the `security` warehouse as compliance materials. No separate phase. The remaining 4 sage-agents recipes are not adopted (see prior assessment).

## Rejected alternatives

- **Continue to Phase 7 as planned.** Defers integration risk until Phase 9; cost of late discovery is exponential.
- **Build all 21 warehouses before forging.** Months of scaffolding without proof. Same paper-without-reality failure mode at larger scale.
- **Run qa-os against the existing scaffolds only.** Runners that scan only scaffolds prove nothing about runtime risk. Adversarial proof against a real deployed app is the load-bearing experiment.
- **Skip the deploy gate; assert "build passes" is enough.** Build-passes-but-doesn't-deploy is precisely the failure mode the slice is designed to surface.

## Consequences

**Positive:**

- The federation gains a hard floor of proven reality before any further breadth is added.
- Every future recipe inherits a proven pipeline + the slice ritual.
- qa-os runners get adversarial validation, transforming them from green-CI theatre to actual gates.
- Cost of discovery curves down: gaps surface now (cheap), not at launch (expensive).

**Negative:**

- ~5-7 sessions of focused work on infrastructure rather than visible recipe count.
- Cash cost: a Vercel project, a Supabase project, a Stripe test-mode account (essentially free).
- Existing 4 recipes are downgraded from "shipped" to "scaffold" until each runs the slice. Optics-only; nothing on npm changes.

## Acceptance

This ADR is accepted when:

- `STATE.md` reflects Phase 6.5 as the active phase.
- The four existing Phase 5 + Phase 6 recipes have their `registry-recipes.yaml` status downgraded from `shipped` to `scaffold` (excepting `saas-multitenant-baseline`, which earns `shipped` upon completion of the slice).
- `BUILD_PLAN.md` is updated with Phase 6.5.

## CHANGELOG

- **2026-05-22** v1 — Proposed and waived in same session per Sage.
