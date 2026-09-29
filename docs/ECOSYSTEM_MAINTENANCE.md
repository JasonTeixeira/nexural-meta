# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-29T09:03:15.785Z
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
- Public proof hash: `sha256:aab84feb7217a70e7cd2b54e3ad2a071176323591f08ba93236237778cc747ba`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17084ms |
| golden_path                 | failed |   4454ms |
| golden_path_vercel          | passed |    285ms |
| recipe_catalog_post_proof   | passed |    299ms |
| resource_library_post_proof | passed |    291ms |
| proof_environment           | failed |   8374ms |
| db_proof                    | passed |    283ms |
| operator_test               | failed |    313ms |
| maturity_lift               | passed |    275ms |
| daily_operating_loop        | passed |    280ms |
| portfolio_packaging         | passed |    283ms |
| public_proof_export         | passed |    284ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:6ad222ebee3731ad920d9555f0f518863f22524dbe4c05ce7be20842becdfad6` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:2af10e1235ce94db1b9d750b70da6f1e2568f0efed367c607bea0815ec451008` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:eb6bd66e0adb7a0e96ebef314ef8a8daba89a116ab465e8102a27935fe48b1c3` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:c7fc79796614e81be534e64785ac75aac9eddb1664785922cc2d52dfeed3dca1` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:b8cd579185802db9a5a1ddc6c1217eea5618a221188966863fe2a3c5edc3c91a` |
| `data/golden-path-runs.public.json`              | stale  | 1533.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:e0dc84b87c7619b592fa82d677205d24b5ffd1b57c6ddf6d29027cd8188e56bc` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:818cc08220c823a72a1391606dbe2c562a1a994ec8e8e39b77998aeb2ce4bcb5` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:1c6dbd2c50d7e8d504e3cba74e3ca047b8d3d25a389eb0a3d126e3aada684e09` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:a40badffd41e01825e121effb4c65d3c1d34190e59ba26b068e840e4e9265e98` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:4f0e9dfc4454b86ce3e624cfef224698eb049a3d3cca539a6bf6e90e0016f965` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:ec36f4433cbd05c84432a1de2a7fbba019f7dd7ef34577a82e92a63c44e0e2b1` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:fdc60eaac32719c1d0a218ae463e5eae13ba5143c8b5748f8ddf12ab2f7d5e39` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:1c6dbd2c50d7e8d504e3cba74e3ca047b8d3d25a389eb0a3d126e3aada684e09` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:359de8a16dc9539099e8fe9779871478474bbc67419775cb74266cd6f7607042` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1533.9h exceeds 168h.
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
