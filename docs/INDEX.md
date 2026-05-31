# INDEX.md

**Sage Ideas Engineering OS - Documentation Map (v1.1)**
**Status:** Canonical.
**Owner:** Sage
**Last reviewed:** 2026-05-31

---

## What this is

Single entry point to the constitution. Read this first; everything else branches from here.

If you are a future-Sage or a new AI session, start here, not in the codebase.

## Phase 0 naming authority

The current umbrella is **Sage Ideas Engineering OS**. Older `Nexural
Federation` wording is historical implementation language unless a current
canonical document explicitly keeps it. Nexural is a trading/investment product
name and legacy namespace, not the company or full ecosystem umbrella.

Read these first:

1. **`docs/SAGE_IDEAS_ENGINEERING_OS.md`** - the ecosystem purpose and layer map.
2. **`docs/BRAND_ARCHITECTURE.md`** - company, product, engine, and proof naming.
3. **`docs/ECOSYSTEM_CONSTITUTION.md`** - doctrine, asset types, maturity levels.
4. **`docs/adr/0014-sage-ideas-engineering-os-umbrella.md`** - decision record.

---

## Reading order (60–90 min total)

If you read in this order, you'll know what Nexural is, why it's built this way, and how to extend it without breaking it.

### Tier 1 — Foundation (mandatory, ~45 min)

1. **`docs/ARCHITECTURE.md`** — what the system IS. North Star, principles, topology, stack, tech choices, build phases. The single most load-bearing doc. ~30 min.
2. **`docs/INDEX.md`** — this file. ~5 min.
3. **`STATE.md`** (repo root) — where the build is RIGHT NOW. Phase, blockers, what's next. ~2 min.

### Tier 2 — Discipline (mandatory before contributing, ~45 min)

4. **`docs/THREAT_MODEL.md`** — what we protect, who we protect against, how. Security controls, key management, incident response. ~15 min.
5. **`docs/SCHEMA_CHARTER.md`** — contracts, versioning, schema discipline. ~15 min.
6. **`docs/NAMING.md`** — every name follows this. Names are forever. ~10 min.
7. **`docs/RETIREMENT.md`** — lifecycle: deprecate, merge, archive, resurrect. ~10 min.
8. **`docs/SUCCESSION.md`** — continuity, dead-man switch, what happens if Sage is incapacitated. ~10 min.

### Tier 3 — Plan (mandatory before building, ~30 min)

9. **`docs/BUILD_PLAN.md`** — ordered phases 0–8, gated, with deliverables and Sage checkpoints. ~20 min.
10. **`docs/VERIFICATION.md`** — definition-of-done per phase. The gates `BUILD_PLAN.md` references. ~15 min.
11. **`docs/PRE_FLIGHT.md`** — checklist that must be 100% green before Phase 1 begins. ~5 min.

### Tier 4 — Amendments to constitution (read sequentially)

12. **`docs/adr/0001-existing-master-branch.md`** — legacy `master` branches grandfathered (referenced in NAMING.md §3)
13. **`docs/adr/0002-factory-reorientation.md`** — four-layer model + 30-warehouse roster + 5 priority recipes (THE big one)
14. **`docs/adr/0003-federation-split.md`** — split into `nexural-factory` + `nexural-lifeops`
15. **`docs/adr/0004-polyglot-recipes.md`** — Python via Modal/Railway in emitted apps (control plane stays strict TS)
16. **`docs/adr/0005-ai-warehouse-external-mcp.md`** — `ai-warehouse` stays standalone, federated as external MCP
17. **`docs/adr/0006-recipe-lockfile-signing-licensing.md`** — lockfiles, Sigstore on recipes, 1Password secrets, SBOM license gate
18. **`docs/adr/0007-cost-guardrails-model-deprecation.md`** — cost envelopes, hard caps, model-router for family→ID resolution
19. **`docs/adr/0008-prompt-injection-conformance-state.md`** — XML wrapping at synthesis, 3 new qa-os runners, STATE.md, escape recipes, per-recipe docs

### Tier 5 — Reference (consult as needed)

- `docs/adr/NNNN-*.md` — all subsequent ADRs append here in numeric order
- `incidents/YYYY-NN-*.md` — incident log
- `drills/*.md` — drill outcomes (cold-start, succession, key rotation, etc.)
- `runbooks/*.md` — operator runbooks
- `templates/<tier>-warehouse/` — warehouse scaffolding templates
- `registry-factory.yaml` — generated; do not edit
- `registry-lifeops.yaml` — generated; do not edit
- `registry-external-mcp.yaml` — manual; lists `ai-warehouse` and any future externals
- `scorecard.json` — generated; do not edit

---

## Who touches what

| Surface                            | Who edits                                                  | Frequency                      |
| ---------------------------------- | ---------------------------------------------------------- | ------------------------------ |
| Constitution docs (Tier 1+2 above) | Sage, with ADR                                             | Quarterly review; changes rare |
| ADRs                               | Sage authors; AI assists                                   | As needed; soak required       |
| `BUILD_PLAN.md`                    | Sage, with ADR                                             | Versioned (v1 → v2 → ...)      |
| `VERIFICATION.md`                  | Sage, with ADR                                             | Per phase; rare changes        |
| `PRE_FLIGHT.md`                    | Sage                                                       | Updated on stack changes       |
| `STATE.md`                         | AI auto-update via `nx session save`; Sage manual override | Every session                  |
| Warehouse content                  | Sage authors; AI scaffolds                                 | Continuously                   |
| Recipe content                     | Sage + AI                                                  | Per recipe release             |
| `@nexural/*` package code          | AI implements; Sage reviews                                | Per phase                      |
| Templates                          | AI scaffolds; Sage refines                                 | Phase 5                        |
| Cron workflow YAMLs                | AI; Sage approves                                          | Phase 2                        |
| `registry-*.yaml`                  | NEVER hand-edited (generated)                              | Auto-generated nightly         |
| `index.json` per warehouse         | NEVER hand-edited (generated)                              | Auto-generated on push         |

---

## Glossary cheat sheet

(Full glossary in ARCHITECTURE.md §13.)

- **Warehouse** — single-domain repo following the standard shape (ARCHITECTURE §4.4).
- **Federation** — loose coupling of warehouses via schemas + registry. Two federations exist: `nexural-factory` and `nexural-lifeops`.
- **Recipe** — parameterized composition of warehouses that emits a complete app scaffold. New in ADR-0002.
- **Forge** — the act of emitting an app from a recipe via `nx forge`. New in ADR-0002.
- **Forged app** — output of a forge. Lives in its own GitHub repo. Contains `.nexural/forged.lock.yaml`.
- **External MCP** — third-party MCP server federated via router (e.g., `ai-warehouse`). Not subject to factory governance.
- **Control plane** — `nexural-meta` repo. Orchestrates everything. Stays strict TS/Node.
- **Trust tier** — public | internal | private-encrypted (THREAT_MODEL §1).
- **Decay** — staleness measured as `now - last_reviewed`. Past `decay_rate_days` triggers quarantine.
- **Scorecard** — `nexural-qa-os` 0-100 score per warehouse.
- **Lockfile** — `.nexural/forged.lock.yaml` in every emitted app. Pins recipe + warehouse SHAs (ADR-0006).
- **Cost envelope** — per-recipe declaration of expected unit economics + hard caps (ADR-0007).
- **Model family** — stable reference like `anthropic:opus` resolved to concrete model ID by `@nexural/model-router` (ADR-0007).
- **Escape recipe** — paired variant of a primary recipe using a different vendor/stack (ADR-0008). Pre-built and tested at v1.0.

---

## The four-layer mental model (post-ADR-0002)

```
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 4: Verification  →  nexural-qa-os (v1.0+)                  │
│   + federation-conformance, recipe-validity,                      │
│     prompt-injection-resilience                                   │
├──────────────────────────────────────────────────────────────────┤
│ LAYER 3: Pipeline      →  @nexural/factory + nx forge|play|upgrade│
├──────────────────────────────────────────────────────────────────┤
│ LAYER 2: Composition   →  Recipes (5 priority + escapes)          │
├──────────────────────────────────────────────────────────────────┤
│ LAYER 1: Reference     →  30 factory warehouses                   │
│                           + 14 lifeops warehouses (parallel)      │
│                           + ai-warehouse (external MCP)           │
└──────────────────────────────────────────────────────────────────┘
```

---

## How to extend the system (decision tree)

When you need to add something new:

```
Need to add:
├── A new app? → `nx forge <recipe>` — never hand-scaffold
├── A new pattern in an existing domain? → Add an entry to the relevant warehouse
├── A new domain warehouse?
│   ├── Does it fit in factory or lifeops? → Choose; add ADR if ambiguous
│   └── `nx new <name>-warehouse` from the right template
├── A new recipe? → Build in `recipes/`; sign; SBOM-gate; publish; add to registry
├── A new escape recipe? → Same as recipe; pair with a primary
├── A new qa-os runner? → Build in `nexural-qa-os/runners/`; cover by `recipe-validity`
├── A new model family/provider? → Add to `@nexural/model-router/registry.ts`
├── A breaking change to a schema? → ADR + 30-day soak (per SCHEMA_CHARTER §6)
├── A new constitution rule? → ADR + 7-day soak (or 14-day for security)
└── Anything else? → Re-read ARCHITECTURE.md §2 "Operating Principles"
```

---

## Quick links by task

| If you want to...                  | Read                                   |
| ---------------------------------- | -------------------------------------- |
| Understand what Nexural is         | ARCHITECTURE.md §1–§3                  |
| Understand why it's built this way | ARCHITECTURE.md §2 + ADR-0002          |
| Know what's safe to change         | SCHEMA_CHARTER + RETIREMENT            |
| Add a new warehouse                | NAMING.md §2.1 + templates/            |
| Add a new recipe                   | ADR-0006 + SCHEMA_CHARTER recipe shape |
| Forge an app                       | ADR-0002 + `nx forge --help`           |
| Upgrade an app                     | ADR-0006 §1 (forged.lock.yaml)         |
| Add a quality runner               | nexural-qa-os RUNNER_SDK.md            |
| Audit security                     | THREAT_MODEL.md                        |
| Recover from a lost key            | THREAT_MODEL.md §4                     |
| Plan succession                    | SUCCESSION.md                          |
| Verify a phase is done             | VERIFICATION.md                        |
| Know what to do before Phase 1     | PRE_FLIGHT.md                          |
| Know where the build is            | STATE.md                               |

---

## When in doubt

Order of defaults (from AI_HANDOFF.md):

- Boring over novel
- Local over cloud
- Generated over authored
- Schemas over flexibility
- Reversible over permanent
- Explicit over clever
- Future-Sage's clarity over present-Sage's convenience

If a decision violates more than two of these, it probably needs an ADR.

---

## Document Maintenance

- Review every 180 days
- Changes require ADR + 7-day soak (this file rarely changes — it's an index)

## CHANGELOG

- **2026-05-21** v1.0 — Initial canonical draft.
