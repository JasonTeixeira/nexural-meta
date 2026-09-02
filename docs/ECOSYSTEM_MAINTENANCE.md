# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-02T09:02:49.264Z
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
- Public proof hash: `sha256:14ba34acfb0efc9b8d5f6582a3c0a135b48b46a27063e2f0b94e7115bf4ce46a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14559ms |
| golden_path                 | failed |   3530ms |
| golden_path_vercel          | passed |    315ms |
| recipe_catalog_post_proof   | passed |    323ms |
| resource_library_post_proof | passed |    322ms |
| proof_environment           | failed |   8230ms |
| db_proof                    | passed |    302ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    310ms |
| daily_operating_loop        | passed |    305ms |
| portfolio_packaging         | passed |    313ms |
| public_proof_export         | passed |    319ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:66b06b0c1e21647933bea63f36cdce34e014ffb271cc1250f2bc78224eee20bf` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:789ba24711c9a2d878b7e81f24c8d389ef175ee48ad3e4f0caf9c79549925c75` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:327b6b6aba1b95b2baec5e6a777f718d352db019a914b953a36c1b285d8e5d91` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:4c1aa8976e7b7b92f83885cf3b589d24a59a338b5dd4176c2d7b2b86c59a18a6` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:bd1384a7a5d653bc0202d0713e7bea4970f6cb30fc08cf2093daa0ed94bfdf25` |
| `data/golden-path-runs.public.json`              | stale  | 885.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:d81e8fabd2800224af372cee62405651077494cef5e98d0aa6c44dae6865aa6d` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:e37e1af906c6b015e8fb159cd246bf8461c000dca2254e76ef10c12f8fef935e` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:1f6b25a30ca1f0762c3a25c8a9a9306d16ebb216d16e4cb4f3bb6af8aa8df2b6` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:28699eb38af3da5be734a5f6a3ad6c392c4647d08cfdb21c4b9bddc507861154` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:80cbe4ed716816c13ccaa6fb363d3ac5c313e0c752b98b4cb7426e9d13bbf9ed` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:1fd790e40e681bcf9931f151dd5ac7242dcb0d7beabeba827c2fb46fe20d90bd` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:ac47526ade651eb3056abed6df79a4cc46a0abf33092ba749ba08296163fff31` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:1f6b25a30ca1f0762c3a25c8a9a9306d16ebb216d16e4cb4f3bb6af8aa8df2b6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:e373c14e3f36e19789068fb78aadbc30f64361da540e20db1f6012a170eb3ef5` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 885.9h exceeds 168h.
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
