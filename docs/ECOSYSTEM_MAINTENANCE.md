# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-09T09:02:52.288Z
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
- Public proof hash: `sha256:583db0ebe15b7658b417dbaec4c32bcc79849047d62287678a147c82b6e0e57a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  19717ms |
| golden_path                 | failed |   4036ms |
| golden_path_vercel          | passed |    310ms |
| recipe_catalog_post_proof   | passed |    327ms |
| resource_library_post_proof | passed |    319ms |
| proof_environment           | failed |   8161ms |
| db_proof                    | passed |    305ms |
| operator_test               | failed |    343ms |
| maturity_lift               | passed |    314ms |
| daily_operating_loop        | passed |    305ms |
| portfolio_packaging         | passed |    312ms |
| public_proof_export         | passed |    313ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:f582b3e0cfe3a250fee39761ccf37ebe8a6d64ab699710afac2eeb25c0f50592` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:49b2b86d390c688aa9af9ac11d81ed0789026d836d0c1f0dd502d783b8099fd1` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:5b86b48a45d3acd222542fc8597e8a3c23f4f7e10a551a35f36bc78b7f90a390` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:12c0a849c42b44af3e0689bebe6614a07bc9e2de06aa55f0e8491affc8d90404` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:97f2c526015157885d0731977222a6d92db4ca9f91462cccc01ca9b7823e07df` |
| `data/golden-path-runs.public.json`              | stale  | 1053.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:59015e96c3ff10aa3eebd17ac9718b8306451e6e699b4c50fc6e76c7794d5063` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:4d0319b55d6d09c0da5bf1d54b094c37b3854f4920ec4d2c84ba8bba1c258472` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:19d2def9801c4b8608505c2d0e05424cbb66271357a978502bb6c507fccb69b8` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:7aefbe1a84b41852b07039ff802ad2b963fda2a7b05805b47cc7076b0fd99f46` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:b868a0a706ad7b62c4d3fc57aa8c9ffc0fedf2237fefd8428e8fc88094127465` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:4e3abfba273ff9cbbaaa79c8bf5fa46e23519af226592785f3c70df96d296bcf` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:597d0842635158d1fcc5eb8301baf4757f0ba733e16c8285278bf61066246f5b` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:19d2def9801c4b8608505c2d0e05424cbb66271357a978502bb6c507fccb69b8` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:599ecd37236dda03de268e5d39ad3d4ce9455ac66f0ff490b36dc7f13db63f91` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1053.9h exceeds 168h.
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
