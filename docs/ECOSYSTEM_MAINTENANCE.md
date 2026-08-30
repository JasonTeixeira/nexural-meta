# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-30T09:02:30.462Z
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
- Public proof hash: `sha256:0056d95ca0aa90a107ac558dbb05a30ad0b557bd7aa64d5f7e8b9c6149321a16`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15050ms |
| golden_path                 | failed |   9070ms |
| golden_path_vercel          | passed |    223ms |
| recipe_catalog_post_proof   | passed |    221ms |
| resource_library_post_proof | passed |    344ms |
| proof_environment           | failed |   8033ms |
| db_proof                    | passed |    234ms |
| operator_test               | failed |    258ms |
| maturity_lift               | passed |    229ms |
| daily_operating_loop        | passed |    225ms |
| portfolio_packaging         | passed |    233ms |
| public_proof_export         | passed |    236ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:37becae2801521c12d59f18e15456b576f553bf60d6df7b97596f7b896842e36` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:482690b31e8e8859e08d160ce7a48b27409b90d0d5788479d805b1737317cd67` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:fe370396b682170094aa9b0894b236c4ad120f9e1b80c0877390007831ce64b4` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:97c0a377d731a382796cf63b16332421f1e9448f549467c71a5bc3c5247cc9e6` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:264691ee5f49e5b5a66224dd37425d9b50f47ee230f73a6e0a454ae72331ef0a` |
| `data/golden-path-runs.public.json`              | stale  | 813.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:d74caf6a2f3052529c79cf36bb790cc5e3a04c064d5e33d2c69b487791bb6812` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:1b7f5bfb585b3c020d1b907e87d5eaf1bc36f4e233bf7825b59813aef5e86e89` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:cee2c532bc3f02248814cb0f4cf5d240d3b9ba43426c7e8ef46783d5e51fc12c` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:8d7f55b57db7f2d6dc119c3eb7c0a5a583ec6789ce5e4bf8c70eff19674304ea` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:0d9f3d737115587d075ac64c49be493c8720b7f2efdb01bedaab156f9a1cab10` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:3152684010b1c4f562e5d0f73bd944143d3d9ad0978c285260c89963bfc3e3ea` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:803a6a924a100f6013a95b5e6117a838c92f87e48e70078bee6f9ccb46165b85` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:cee2c532bc3f02248814cb0f4cf5d240d3b9ba43426c7e8ef46783d5e51fc12c` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:1f01259fcd8b99a2977c657c8a4e3813b3bd005942004e46d81a17fe6e485c66` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 813.9h exceeds 168h.
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
