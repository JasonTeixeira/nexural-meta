# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-12T10:19:12.235Z
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
- Public proof hash: `sha256:54637655ffbc6c8887a6653dc1641e24e70e9585b6c23e1e04fd805a0aa97cd6`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16397ms |
| golden_path                 | failed |   4019ms |
| golden_path_vercel          | passed |    358ms |
| recipe_catalog_post_proof   | passed |    371ms |
| resource_library_post_proof | passed |    377ms |
| proof_environment           | failed |   8425ms |
| db_proof                    | passed |    365ms |
| operator_test               | failed |    407ms |
| maturity_lift               | passed |    372ms |
| daily_operating_loop        | passed |    365ms |
| portfolio_packaging         | passed |    381ms |
| public_proof_export         | passed |    378ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:090bc714ab4bea112ddbc0176da139f7ad5c856bb0ed0a2e2a30692e1ca312d0` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:e31478d0437560ea6a10d9cca3b26110a3daf3789da83a685a660061e77a51ac` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:3786a979cfe55803b9dfd251c8f07bcb7694e6c4853d7e3a61a489440597a08c` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:4a7044fe731623cb6ce82b8a30ab0b0b120b474a0bb81bc00ef4468fb3ac0163` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:ab43e8a553d2492d39d501c7424c58e1c159ae02156d187307165a50a1b75ba8` |
| `data/golden-path-runs.public.json`              | stale  | 1847.2h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:d3e04981327ffa1b9d4f793792d2124789e1de71a4802c9768cc11d64d0549d7` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:4a7450d0c4bc6dfd4dd833a03d67252f27012c26647a4159cc71c6c6009163fb` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:980d6d4e0d31b6d86d06e842a06400d7b58d0b0d55497624d08b0e1ab2a35241` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:d864cc899d017e708ae52675ac49db294369e20951c829789aacb877b1b5a0ee` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:7835f0cb579471c3898bd8a06cd5eae2d796fe7566b30e52fe6cbe169a11a329` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:5faaa74a287c24906fff52211f8869b599346c921ebd6c8a94c51db0e6b91a41` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:7fed7e6ac4d891a88fb57f717a4f76240d3b0bc328796ea6e06a5ce5a0cb1329` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:980d6d4e0d31b6d86d06e842a06400d7b58d0b0d55497624d08b0e1ab2a35241` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:911d59e81efe43abe796834f4581d613bff17ca262aa8e68d13e4665be35a5f9` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1847.2h exceeds 168h.
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
