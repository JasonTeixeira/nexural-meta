# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-19T09:02:06.422Z
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
- Public repositories indexed: 163
- Public assets scored: 163
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 175
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:a4c4791a4fb0818699341098160c6ce127772a0ef0810f5a18b211f5460166bd`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18250ms |
| golden_path                 | failed |   3254ms |
| golden_path_vercel          | passed |    270ms |
| recipe_catalog_post_proof   | passed |    278ms |
| resource_library_post_proof | passed |    276ms |
| proof_environment           | failed |   8342ms |
| db_proof                    | passed |    263ms |
| operator_test               | failed |    291ms |
| maturity_lift               | passed |    263ms |
| daily_operating_loop        | passed |    260ms |
| portfolio_packaging         | passed |    268ms |
| public_proof_export         | passed |    272ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:0fa9cb0438bcddf7d0669aa5bb4b5c09e9dcca784096a7e93d531992f81ed071` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:eacc79c21bbec3dccf2219431c1a326c411efa2ba1067ce86f2c92d61b93d9f7` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:e8f8ac68664f18b339a51695cb6a07d6876ed063c49b1f3421a7afdff059e392` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:1e81f5af996bc76ca02fd4090e9bcd66626263fc6f28ee544419f65af3fc307c` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:d4664c0fe79c778860a6659db9d45ad69fdd34002365ef65ae523453b72fa78e` |
| `data/golden-path-runs.public.json`              | stale  | 2757.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:d07690381df8499fb766880edd99da6b0c189aad1f96a611d7b94020ff703133` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:f2ed2ea9c2ba1522d3652320a16f42134527bc7293790cccdaaeed2100458de5` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:18178c1ad54db2fbf679aac46387535b97b09caf4131951d8bfae659154ead9c` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:3c6c8adb26efd11d913598b8d245d401799bce790372b33a1ba3c04bc8df38f9` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:1b8af529e05451338fa03cf4ecfe75a92f0dac131bb75a2047f04fbfc02ccc6f` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:841d0991ebdb3322370e3ed3f8c2ab0bba3dde57bf0e0b9d76233429f3cdf0cb` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:ec168ddd3c01e1d96feb94e049d072320d22245d2c2d4c91b3e6b44ae91bc2b5` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:18178c1ad54db2fbf679aac46387535b97b09caf4131951d8bfae659154ead9c` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:b672503d5e873dfc8cde4e0ad276cc2a2269ede28f4a3aa9b6a2ddf601521e28` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2757.9h exceeds 168h.
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
