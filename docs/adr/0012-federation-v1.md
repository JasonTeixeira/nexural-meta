# ADR-0012: Federation is V1.0

**Status:** Proposed
**Date:** 2026-05-22
**Deciders:** Sage
**Soak:** Sage waives; treat as locked at v1.0.0 tag.
**Depends on:** ADRs 0001–0011

## Context

The Nexural Federation began Phase 0 with a 6-doc constitution + 10 ADRs locked. Eight phases of build have followed:

- Phase 0–2: Constitution + scaffolding + `nexural-meta` automation
- Phase 3–4: `nx` CLI + MCP router + dashboard
- Phase 5: `saas-multitenant-baseline` recipe + first 3 federation runners
- Phase 6: AI recipes (saas-rag-chat, saas-agent-platform) + golden-set-drift runner
- Phase 6.5: ADR-0011 vertical slice doctrine + `@nexural/forge-emit` + `@nexural/warehouse-base` + 6 MVP warehouses + adversarial proof
- Phase 7: fintech-ledger-app + internal-tool-dashboard + 2 new warehouses
- Phase 7.5: `nx verify` runner + operational hardening
- Phase 8: First live deploy of `saas-multitenant-baseline` — gate 4 cleared
- Phase 9: AI warehouses (rag, prompt, safety) + saas-rag-chat slice + dogfood deploy

The federation has now been **used in anger** — at least one app has been forged + deployed + verified against a live URL. The qa-os gates have caught real regressions (the slice surfaced 5+ real bugs that were patched back into warehouses). The 5 federation runners have stable interfaces. The CLI surface (`nx forge`, `nx verify`, `nx ask`, `nx sync`, `nx health`, `nx new`, `nx play`, `nx open`, `nx session save`) is settled.

This ADR locks the federation at V1.0.

## Decision

### 1. V1.0 is what currently exists on `main` at tag `v1.0.0`

No new architectural commitments are declared. V1.0 is the federation as built across Phases 0–9, with operational reality (a live deployed app at a real URL).

### 2. Public API surface is now stable

The following are locked at V1.0 and require an ADR + major version bump to break:

- **Schemas** (`@nexural/schema`) — every exported Zod schema's shape is API. Adding fields = minor; removing/renaming = major.
- **`@nexural/forge-emit` template grammar** — `{{ var }}`, `{{ var | default:"x" }}`, `{{# if expr }}…{{/if}}`, `{{# unless expr }}…{{/unless}}`. New syntax requires deprecation cycle.
- **`@nexural/warehouse-base.composeForRecipe()` shape** — request/response types are API.
- **Recipe manifest format** — fields in `recipe.yaml` are API.
- **Warehouse manifest format** — fields in `manifest.yaml` are API.
- **Forge lockfile shape** — `.nexural/forged.lock.yaml` is API for downstream consumers.
- **`nx` CLI command surface** — adding commands is fine; renaming/removing requires a major.

### 3. The 5 federation runners are the baseline qa-os contract

Every recipe at v1.0+ MUST pass all 5 runners (`federation-conformance`, `recipe-validity`, `prompt-injection-resilience`, `golden-set-drift`, `forge-emit-conformance`) before being declared `shipped`. The runners themselves can evolve (new findings, tighter thresholds) under minor version bumps.

### 4. ADR-0011 vertical slice doctrine remains in force

A recipe earns `shipped` status only after passing all 6 gates (emit → install → build → deploy → qa-os clean → adversarial proof). Recipes that have not are `scaffold`. At v1.0.0:

| Recipe                       | Status      | Slice evidence                                  |
| ---------------------------- | ----------- | ----------------------------------------------- |
| `saas-multitenant-baseline`  | **shipped** | Phase 8 live deploy + `nx verify` ✓             |
| `saas-rag-chat`              | **shipped** | Phase 9 dogfood + adversarial eval ✓            |
| `fintech-ledger-app`         | scaffold    | Slice cleared 5 of 6 gates (no live deploy yet) |
| `internal-tool-dashboard`    | scaffold    | Slice cleared 5 of 6 gates (no live deploy yet) |
| `saas-agent-platform`        | scaffold    | Recipe valid; no slice yet                      |
| `saas-rag-chat-qdrant`       | scaffold    | Escape recipe; depends on Qdrant infra          |
| `saas-rag-chat-openai-first` | scaffold    | Escape recipe; chain inversion only             |

Promoting a `scaffold` recipe to `shipped` requires its own slice run + evidence in `evidence/gate-*/`. No version bump needed for a single-recipe promotion.

### 5. What's explicitly deferred to V1.1+

The following are good ideas, but not V1.0 blockers:

- Promote 8 warehouses to separate GitHub repos
- MCP fetch path in `@nexural/warehouse-base` (currently local-disk only)
- `nexural-router` consuming warehouses via MCP at synthesis time
- `nexural-lifeops` federation split per ADR-0003
- Remaining recipe escapes (`fintech-stripe-connect`, `fintech-paddle-alt`, `internal-tool-airtable-alt`)
- Markdown-aware chunker (currently recursive char splitter)
- Cohere rerank wiring (interface exists; client wiring deferred)
- Cosign signature verification on recipe tarballs
- SBOM generation at forge time

### 6. Maintenance mode commitments

Post-V1.0:

- **Patch releases** (1.0.x) every 1–2 weeks if needed, for any of the 5 runner findings that surface real issues.
- **Minor releases** (1.x.0) monthly cadence for new recipes, new warehouses, new runners, schema field additions.
- **Major release** (2.0.0) only when the federation needs to break an API surface. No timetable.
- **Security fixes** ship as patch releases within 7 days of disclosure.

### 7. Quarterly review cycle

Per ADR-0009 §1.10, federation health is reviewed quarterly. The review covers:

- Active recipe roster + which need promotion / deprecation
- Federation runner scorecards (which findings are noise; which are signal)
- ADR drift (decisions that have been violated in practice = candidates for revision)
- Soak waiver count (cap ≤ 2/quarter)

First post-V1.0 review: 2026-08-22.

## Consequences

**Positive:**

- The federation has a stable foundation that downstream consumers can build on without fearing API churn.
- The maintenance cadence is predictable.
- The vertical slice doctrine remains the truth function for "is this recipe real."

**Negative:**

- Breaking changes to the locked API surface now require a major version. Some debts (forge-emit grammar gaps, recipe yaml awkwardness) are now harder to repay.
- Documentation burden increases: every release must announce changes against the locked surface.

## Acceptance

This ADR is accepted when:

- `v1.0.0` is tagged on `main`
- All packages in `packages/` and `apps/` have `version: 1.0.0`
- `STATE.md` reflects V1.0 status
- `docs/V1_ANNOUNCEMENT.md` exists + is published in the GitHub Release notes
- `README.md` has been rewritten to describe V1.0 (not a build-in-progress)

## CHANGELOG

- **2026-05-22** v1 — Proposed at the close of Phase 9 dogfood. To be accepted at v1.0.0 tag.
