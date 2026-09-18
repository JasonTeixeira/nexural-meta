# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-18T09:02:43.675Z
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
- Public proof hash: `sha256:6b387a5b68d7805d4cc0c1a92c76ffa9c5090e6bb1c8f6ac789fb1f32539b785`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16863ms |
| golden_path                 | failed |   3566ms |
| golden_path_vercel          | passed |    318ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |   8150ms |
| db_proof                    | passed |    314ms |
| operator_test               | failed |    346ms |
| maturity_lift               | passed |    318ms |
| daily_operating_loop        | passed |    321ms |
| portfolio_packaging         | passed |    327ms |
| public_proof_export         | passed |    328ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:e0701b560f3026e6a592a480ec31dc8c2c511675090e851af5fd7e72863622ed` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:3f68a7065287ed1a641fa9e2ca7a39ebc0a21de5ccd28099af8a248517a570c7` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:ef0425d98224664a096a3dd7914813943ba6164582dc3b96fad32014928f314e` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:de77c0cfcdf10e7c5f3f11525a472271e44054492dceff02c7e8f9548ac5f90c` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:85c421b060323da3d58a60f81fb6ffdbd47169126e8b886a6f0fad0f9689af06` |
| `data/golden-path-runs.public.json`              | stale  | 1269.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:4c48153c94477da7e7cecd0a9b82afbdeec651916193b27d30d0ab6aa6982937` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:6037c560722f49eb524a9c384c5122ff401ec7456ca2a0d5d2d469039c9d8ac3` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:f9d81a9a7a53f53534bce10a1903e289358bcb627c8960f17d80ca77eda92de4` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:384a1c6509d2d07906355c1b79ed10f560d49bf4eb7a014190f6728f69c721de` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:2a0e8c915100725cf4cb2069bb87f2c7fdc25be0ec5d99e099c5291b33f2286f` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:70cb2e6659b6b6adc5da8327f4ec2b703f15c1b59107096a09d7b0b2dc774406` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:1c956a537604922a7a8ef45fd821d0ceded7e82d8d246b82306620b355082f8e` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:f9d81a9a7a53f53534bce10a1903e289358bcb627c8960f17d80ca77eda92de4` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:8a10ff7f289e468a0f668ac68ec4b8e412bff008cb28b871469ff505418caeda` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1269.9h exceeds 168h.
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
