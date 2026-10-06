# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-06T09:03:02.788Z
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
- Public proof hash: `sha256:901244032aa2c05c834bebc1b5b42f948a66b70719dd151ba809fd6e35a9a7ac`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16685ms |
| golden_path                 | failed |   2579ms |
| golden_path_vercel          | passed |    196ms |
| recipe_catalog_post_proof   | passed |    198ms |
| resource_library_post_proof | passed |    199ms |
| proof_environment           | failed |   8270ms |
| db_proof                    | passed |    190ms |
| operator_test               | failed |    218ms |
| maturity_lift               | passed |    194ms |
| daily_operating_loop        | passed |    192ms |
| portfolio_packaging         | passed |    201ms |
| public_proof_export         | passed |    200ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:37eb6b330f3297799b0539687e3035e858c460ca89d97d90e88796f8077fb794` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:fa118f7f3843472147afe239295a0390656a0253054bc737bde317b0218a95f3` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:700d22cbf868bae7c483c3fa9338e0a0114a424ec0e2766137b04decc7a980e1` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:f835aef736975cb689521ca6884f38e2c4daee552cebe6c143cf2f44d3942ae7` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:7143b15091dad5226448710ae796c27fbb0fa4d0241cf0802b6679eb85085371` |
| `data/golden-path-runs.public.json`              | stale  | 1701.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:6b34d8ade3485034aa7e09c237cdb1e2b3b1324d82cecbda7bd759256b9dee31` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:dcb7bcd8b13554d3aacff7339d441d5b9662eab28fa4fdfc4e27cab31c78cdf5` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:eba7246e4c3c9f9f6a6b106ac3498302003d47301a26fffc89ead64d02adda11` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:984318db84671f988cb5261d2b279c0c842b6e07e29b3edec79d4b804c771708` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:a25b4a2f0b8305e9de56d5827796c0bf73b611f15c68b0996ee506dfe0fb3266` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:0c76f14fe12f01b53cf7b1e2348a773cfd40239673a1ac102fffbfa046c5c7ed` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:61fb6d7d33792930e26bdc58387e0ae0f1749e7e59d68662947a6dc5c12bb855` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:eba7246e4c3c9f9f6a6b106ac3498302003d47301a26fffc89ead64d02adda11` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:9807d2f8e2ec520aad2d8f19aa35ee438f299cff9c507710cc6ff26b9daffd15` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1701.9h exceeds 168h.
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
