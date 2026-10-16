# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-16T09:02:32.242Z
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
- Public repositories indexed: 142
- Public assets scored: 142
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 154
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:3bfffe5f5298ac80198d6c67026efc0cd01039bbc79e3038e007427ba82fb2a6`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16470ms |
| golden_path                 | failed |   3747ms |
| golden_path_vercel          | passed |    299ms |
| recipe_catalog_post_proof   | passed |    307ms |
| resource_library_post_proof | passed |    307ms |
| proof_environment           | failed |   8332ms |
| db_proof                    | passed |    292ms |
| operator_test               | failed |    324ms |
| maturity_lift               | passed |    298ms |
| daily_operating_loop        | passed |    286ms |
| portfolio_packaging         | passed |    292ms |
| public_proof_export         | passed |    296ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:356f4df605ce2452ff7c0f01d47faa1317df165174d8095315ec0cc7eb184ab2` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:9ee5e21ed4889c57cb30a5acf00882f768e2d681308361e738b777daf8b20bb9` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:2de524ca98d6aa0e25635688d086f386755e1b1e3cd24f235775e28c9fac50c4` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:1c9b29ee7cb104522c4684e850a9abd51c604dec33da971ffda47d0d2d9d576e` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:374c423b4c148142a5cadc2c73e7024bfc7ace71c2fc4d72b110b4e82b07d0a8` |
| `data/golden-path-runs.public.json`              | stale  | 1941.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:9edfa15d7873c054e6544339f57ea799585090ec2d4e259bb5c02b8470afb24b` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:c45cd8b98319a7de5dbaf0e01628617304795476e7608ddc2cddfecc759bc2b6` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:c7a717b5867fba2082b71c3e07c34355e68db9e0d0420082960a3e1452fe12d7` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:6faee32a8a218dd91a400fba1e6d827b94b51e540e97805b7f32b5356ea375ee` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:814f573f97b3af96c9f8bba30314249634e308075fce960c1aca387f54a3fa42` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:905e5e991b0401b636f8c0b6d6f882d5c6bf6922341ef18e5c8c879cadda915d` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:7ccdff283bdd612c0d39074faf5da7c3d7e0b3517965ad932f4c2aa370a1018d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:c7a717b5867fba2082b71c3e07c34355e68db9e0d0420082960a3e1452fe12d7` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:2094fd69e8f5aef69f95d495ba7339e14da6a3499a0cce430a59826799e06c90` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1941.9h exceeds 168h.
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
