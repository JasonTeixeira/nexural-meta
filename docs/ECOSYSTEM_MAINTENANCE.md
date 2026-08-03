# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-03T11:07:28.235Z
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
- Public proof hash: `sha256:c114b8321154f274fae6268f61bf10a1f5d013411200478dad6db2768b6ccbb0`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15098ms |
| golden_path                 | failed |   3555ms |
| golden_path_vercel          | passed |    320ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    336ms |
| proof_environment           | failed |   8139ms |
| db_proof                    | passed |    319ms |
| operator_test               | failed |    351ms |
| maturity_lift               | passed |    314ms |
| daily_operating_loop        | passed |    317ms |
| portfolio_packaging         | passed |    322ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:3d468e32144c161ff090534568685566cae615858f4e86d96e8256c3f55ca340` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:17236465a8b97ee78b951cf7ceb791b0bf0eac8ab38e67427b263ae370626b85` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:ecc27de38b2ded185a5dda2932bf874f1c47c0251dafd65c898fdf9c796a7e03` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:49eebab16943682f9dba2b483a93627102cc344a34fca481f6417e15a3ad2027` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:42172f6ce4f437b38a53bc114f2b80e1d51fca77536cdfefbd82c3e8a29b542b` |
| `data/golden-path-runs.public.json`              | fresh  | 168h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:01c1d9c633c52aa351af6ddf9943af43faf8be1ff3d77166c0fcbec2a0c93e27` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:08200bb95ba0723aa8cfb4b40313318229985d1197ebe6781771611a3c72e34a` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:d0463f97508a955cc6a31fd45ec77117a58e4d8eecd73b78665aaac170f55a42` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:7781dbc02c4bd8319cfc7404efdbabb59c32083bc68c37bf3b9530a930c5112a` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:70527b3c66ef05f0412de093b36960ee401ace6e0497d7bf0c7e31a0b4fe7725` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:0b3d155e414485af8baeb24652cd01d3b35287b1ec067c8a4f35d9bc758e3bd6` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:681f3fbfc09dcf413d68fecce45db1ded266f966cb77f7a7a26a2c2c82781724` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:d0463f97508a955cc6a31fd45ec77117a58e4d8eecd73b78665aaac170f55a42` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:900ee04cc8965a8aceaf86766a6ef037806d2d4356ca38aa4e0ce174023c2e09` |

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
