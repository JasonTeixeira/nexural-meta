# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-29T09:52:07.729Z
**Overall:** failed

## Purpose

Phase 7 turns the Sage Ideas Engineering OS from static proof artifacts into a repeatable maintenance loop. The loop regenerates the registry, maturity scorecard, resource map, golden-path proof, proof environment lock, public-safe packet, and this machine-readable maintenance report.

## Run It

```bash
pnpm ecosystem:maintain
# fast check only:
pnpm ecosystem:maintain -- --check
# skip the expensive local app proof:
pnpm ecosystem:maintain -- --skip-golden
```

## Summary

- Commands passed: 9/12
- Fresh artifacts: 15/15
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:f8aafac07faf66bee4c311f27a7435e751574ee648647c7adae5e5c8cfa1bb02`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13622ms |
| golden_path                 | failed |   3611ms |
| golden_path_vercel          | passed |    295ms |
| recipe_catalog_post_proof   | passed |    304ms |
| resource_library_post_proof | passed |    297ms |
| proof_environment           | failed |   8080ms |
| db_proof                    | passed |    290ms |
| operator_test               | failed |    319ms |
| maturity_lift               | passed |    287ms |
| daily_operating_loop        | passed |    288ms |
| portfolio_packaging         | passed |    295ms |
| public_proof_export         | passed |    297ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:2a424ebb8fc49f2867ee17659ac28753e18a93edda4c6bea583537c658689d41` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:40afa274fa13d004a37bbd08679738af3f606c196e7c1a60e3c1d734aec57e80` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:3cb56ea2ad65563bf4a3b31af769aa1542acc8fa4d7c9d79f02c9de84369ec46` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:c7b908a45237b3ff408c9b72d3d728d52d4af1b6e310a4f344554e5cfbb5f5e5` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:867f86a2eca630022447aded6c6fea5c56f7dc4d03893431097417f46b51a262` |
| `data/golden-path-runs.public.json`              | fresh  | 46.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:023204549df4b5d03ff5847029f49ee6898eae117447453cd5631ceb57d36352` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:09337fc88909feb28ad552878b313063cf258f6fc5f7db2bad4061d71ce975bf` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:ad1d5a54b4b30748b1db43bafd2a9128b25db4936974aa615a2df695a7cc9bc6` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:bdffc2b5f2f8a7f1fdc36c2ae33a3eb828a19466b9a8dc415ec24184345817c4` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:0b2dcd3b44904e0275d2f27da49b5ad305a0c58ec09e464a4303524396a7fefc` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:fc0fc9c862193f4f3c4a7c92bbe832765197431bc0fd9d2bd8967183af32d7a5` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:e86a3906dd65d682e9a266524925868c1a6c306679d2cbbeb3a67726b49cac5a` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:ad1d5a54b4b30748b1db43bafd2a9128b25db4936974aa615a2df695a7cc9bc6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:84b8f4b22599699039c3d10952275a5f76dd5ebb28f00c03ced1013f9adffb1b` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 34 changed path(s) after maintenance run.

## Generated Artifacts

- `data/ecosystem-maintenance.public.json`
- `data/recipe-catalog.public.json`
- `data/resource-library.public.json`
- `data/proof-environment.public.json`
- `data/db-proof.public.json`
- `evidence/maintenance/latest.json`
- `evidence/proof-environment/latest.json`
- `evidence/db-proof/latest.json`
- `docs/ECOSYSTEM_MAINTENANCE.md`
- `docs/RECIPE_CATALOG.md`
- `docs/RESOURCE_LIBRARY.md`
- `docs/PROOF_ENVIRONMENT.md`
- `docs/DB_PROOF.md`
- `docs/OPERATOR_TEST.md`
- `docs/MATURITY_LIFT.md`
- `docs/DAILY_OPERATING_LOOP.md`
- `docs/PUBLIC_PORTFOLIO_PACKAGING.md`
