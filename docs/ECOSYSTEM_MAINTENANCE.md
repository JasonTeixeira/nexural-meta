# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-06T11:11:40.914Z
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
- Public proof hash: `sha256:e30b0d1183f1f09375ca457cdecf474f47546ca67276df466d9276409aa68c71`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16025ms |
| golden_path                 | failed |   3602ms |
| golden_path_vercel          | passed |    325ms |
| recipe_catalog_post_proof   | passed |    330ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   8020ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    347ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    318ms |
| portfolio_packaging         | passed |    323ms |
| public_proof_export         | passed |    327ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:438eaded1bb40da060843bc1d7d215d82f96675fb19a6d6f8b81074458b39eb0` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:d4c99da780dc9335c5da52cc4a9d947c95c12cf29499a6f170bcce85999a9217` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:cd9dc337d436cc7a19989b8e1bca51173f5a63be2b8c4afc5c259771f15dde7d` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:2382ee2352b12441c5797f0a55b7629ac0fe2ef2dfe8a709cad56d243aa361b0` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:e2976f37da016fcacf72f2610e60a3a91499e60e0518c51bee239789260d622f` |
| `data/golden-path-runs.public.json`              | stale  | 240h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:11b24298c90b12eaed58d50ddc5fd34faadb6487979c17cb8f9b0baeb409ea25` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:d4db0b98a1e4ed21a75873573d14eb298dd7fd37e1c91876d6cffd4b0fbda286` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:6537ac589f5b2d61e1f702137ea4a69ea06f019da1317c668b6dfe815c2de7c7` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:8f47738a15396bdee93bfa38630b4419e1d11583e121c1ec1177b40c8c0a5583` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:8df581551f9b5719df4e67a7519ab87c12d1472cab85d45188bd14abb7adbe05` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:76a46e19a38ce9782d306044b44ed208291ef1f7abcb51aad0ad3ba8133218b9` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:4c5636b272b6157fc9ac18e02541375f3d1fbddedd386818acdce83414be284d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:6537ac589f5b2d61e1f702137ea4a69ea06f019da1317c668b6dfe815c2de7c7` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:83c00a541dbc130847ae0fc9434e6b7b852caddf4c057e48689712a7636519e5` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 240h exceeds 168h.
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
