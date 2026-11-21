# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-21T09:02:24.795Z
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
- Public proof hash: `sha256:e39f2fa3d7a0e69311995e21af3b3fa29f02b32d9c49417da5d1593916942e87`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14660ms |
| golden_path                 | failed |   3764ms |
| golden_path_vercel          | passed |    337ms |
| recipe_catalog_post_proof   | passed |    354ms |
| resource_library_post_proof | passed |    346ms |
| proof_environment           | failed |   8185ms |
| db_proof                    | passed |    337ms |
| operator_test               | failed |    367ms |
| maturity_lift               | passed |    334ms |
| daily_operating_loop        | passed |    335ms |
| portfolio_packaging         | passed |    341ms |
| public_proof_export         | passed |    346ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:dc12a97cd2ddbd5236b29f92b0fa9a08716d64539f6554f9f3613168607fba82` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:297f6ebf9d8cb0dacd25a83d158a919a3cb32b0f0001139e78029bbec8cfab08` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:48a4e420823e468c3506e349d0fa7b12642054000c42de20d07a7bb6f600b9e4` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:2f8293ccf06d6e14467082f1f4ac25e4069b700f054a636fb30a1b41b9c61ecd` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:c584a20e786a2148b6bfed746670b8ed48cbf3fe1fb97d183053c4ba83594fc6` |
| `data/golden-path-runs.public.json`              | stale  | 2805.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:623bd68102294d6a77c09e380bcc95faeb4c464e9d33f9cd8b99e3414617d835` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:30ea45c533e977efc707c9abcc768c2900428830cf78ad0c471b2e0d66c74042` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:321046d4853a828e0ec8f482af43de184b1a7993b838269d7802f3c272c5acdd` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:a130eaffdee24519783d48af8d4d26d9df5d490276322e398dfbeb60f97c1948` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:0b50a94c0fb53ddc1f694a93bb975589931536e6149590c4330c6da55a79e85c` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:ba3adfad3d8d9555639da9413361d0f5904cb46ec67300899dd089a1cf4e37ea` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:73813832c7b5650e448f2220bcf3216f1526d514c2ad37328e3169d935ba25be` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:321046d4853a828e0ec8f482af43de184b1a7993b838269d7802f3c272c5acdd` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:3b700f029990b66d3dbe763688472e319e8dfae73cbde479ced0c00242829968` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2805.9h exceeds 168h.
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
