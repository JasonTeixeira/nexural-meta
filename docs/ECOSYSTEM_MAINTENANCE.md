# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-27T10:20:28.147Z
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
- Hosted golden paths: 78/199
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:920db4e986fcde950029a9a7b700448d23b6dc48baa0705f7ab09bb6037b5949`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15703ms |
| golden_path                 | passed | 172222ms |
| golden_path_vercel          | failed |  86246ms |
| recipe_catalog_post_proof   | passed |    343ms |
| resource_library_post_proof | passed |    338ms |
| proof_environment           | failed |   1894ms |
| db_proof                    | passed |    325ms |
| operator_test               | failed |    349ms |
| maturity_lift               | passed |    321ms |
| daily_operating_loop        | passed |    319ms |
| portfolio_packaging         | passed |    328ms |
| public_proof_export         | passed |    333ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:92b294c97fd85e3435272cb09e4aa452eaacf054169265a7986b11329932c0f9` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:daa51268f979f083c6138e48cf93facd241de3002559669133ad12bd32dcdebc` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:826eb58f74bfb63510472c5a2a516303718bd3257f4ead8cef9ec375414da8f8` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:3cb2c19b58bd94a5a398a2caaf064fe6bf9daf3d7062829cf108d5f901f46a2f` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:36b792fbefa13a0a3afd46324bde73f37bcb1fe88397812bf7e3a9d7ec44b469` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:66f8e97b68155d7d4476272708ae850afe999732595e705731f9797d95b1bf00` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:f1ae6895e3735a5c25ce6909a2aee0e2100f2e0de35e534a7deefd171cb1d5ee` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:6e7ec5d8cde4141439538e568d11ec715c8c63911622fac2206f007e24e5b9a5` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:2fdccb55810e4b421f9c2e9f14d5761ed71c472ac21c454c0e247cf9d4bed388` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:5c1fadc19121e7d5cd186b89e8acbfb11c84c77d8970b1fda653b95ea8b51df2` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:af3f269cbb957f18c3744510951c3f603f8424c8e0c3e2b7f72331a824f210b5` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:7b5c8d39821c0a5521b119f6359ff126f8da9bbe1495bb6bb24f9fbb85f64761` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:9cf31879c9ac281e0c920fee9923686016830f2dfb49b717ef3b7cd31ab4f259` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:2fdccb55810e4b421f9c2e9f14d5761ed71c472ac21c454c0e247cf9d4bed388` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:4bc873f19f9a6a15531e342595776f80d64e70e21365eea8bfa925443e0a7d73` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
