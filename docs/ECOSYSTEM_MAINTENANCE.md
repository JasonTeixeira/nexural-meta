# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-14T09:22:13.602Z
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
- Fresh artifacts: 14/15
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
- Public proof hash: `sha256:3d068860d250a1f82eac8da634c8b478e40636a87323483ce79b509948c74eb9`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14460ms |
| golden_path                 | failed |   3571ms |
| golden_path_vercel          | passed |    322ms |
| recipe_catalog_post_proof   | passed |    330ms |
| resource_library_post_proof | passed |    328ms |
| proof_environment           | failed |   8091ms |
| db_proof                    | passed |    321ms |
| operator_test               | failed |    348ms |
| maturity_lift               | passed |    323ms |
| daily_operating_loop        | passed |    317ms |
| portfolio_packaging         | passed |    329ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:69ee5770a5ceac99feac01c1cd56a4edbec20c36b68c194296669e3936b37bb2` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:d86f17c4a462ace71404b6448db9edce0edce52ed94e6091512606b1691c6e30` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:edc7f6dfef70c3df5429ef332f6a89e7413218de690c02dfc2b255cc634788ca` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:402c20d5c651d2d653e102b12e7fa412055eb00438f3b4e28da0a9eaa92b5a40` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:b190bcddd02637deb3335e6d762c6903daa9d9d099589700034a097801aee825` |
| `data/golden-path-runs.public.json`              | stale  | 430.2h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:9e61db6e60fbda1e26ea46da4f745e24b60c78e33f2ad783e0f365214d9b791e` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:dabc86ed53964b604cecf2f67a2aff314d57f81b05b4d95c983298cd3a01358e` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:ebe7c634d6acefdab7815475a6805dc5b5b25f27e54ffbc957fa1549c1214fb1` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:49598b33023542bf18a0378e9b94ae5c7020acfb6546b72da0e1b850b466fd38` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:5ee4fa10f68baa1b5752997b7f4a4e05de7dd69b96f9917c288ea00443eb5233` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:2f995505d0f6ebd2cc76b2d20d6f91cd471ba7ac1374839a0ca74da5c339e2cd` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:32a2bdfaf3eb8c751acc9fc81d4a0e4691094e820d882e252c50a6e1058a4aba` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:ebe7c634d6acefdab7815475a6805dc5b5b25f27e54ffbc957fa1549c1214fb1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:47eb10cfd38a0904f3bb1375999aaf0a24503b067985d4fc4e44e1e0cbac0130` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 430.2h exceeds 168h.
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
