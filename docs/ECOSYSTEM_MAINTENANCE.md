# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-01T09:02:50.875Z
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
- Public proof hash: `sha256:3db96f8f3a65fa26cad765dbc5bcb4284d8235179068216714fde7e02a328481`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13781ms |
| golden_path                 | failed |   3608ms |
| golden_path_vercel          | passed |    317ms |
| recipe_catalog_post_proof   | passed |    328ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |   8117ms |
| db_proof                    | passed |    322ms |
| operator_test               | failed |    346ms |
| maturity_lift               | passed |    323ms |
| daily_operating_loop        | passed |    317ms |
| portfolio_packaging         | passed |    323ms |
| public_proof_export         | passed |    338ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:6405de02c8aba3e712204136930e455a171593badf9cabd4f7ee0de8060bb571` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:35a9a9619d30ac952b41fd11963ecc67d79674b7e2d03d15360c5dd96b94d634` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:849c2650bc7b4403dbe65bd4990c01df15cba1a7cebd9657b68481779091e4f0` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:e3355719c4c968698721a4870b657c19f3ba5174bced8decd17eb21d18d38b23` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:a4787cd670c4925c207bcedea932ce3a3f40f6ed28a55b57fd51b7151e4b7057` |
| `data/golden-path-runs.public.json`              | stale  | 861.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:c149a290d634062a72254ab608987d139fc1a969e12b97c5d9746f2ac19c115f` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:b9b1f4975dec01e38ea70ac360d7e1348690d28cfba4a286d5be17cf392189f8` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:668190bd868d04fa2250824ac8795f8b5767094e84ca9e2a54cad0b667f272dd` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:68791826e209313b71e311066d44952ab576ebbbd174402a6d047303f2bac1a3` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:43f4a5c7eb341866c5ea87ccd042cd8cebfaf95940c47732628f06ba1f48143d` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:bd52093bd537282fc879bb159f74127dd6b59d1bdd373ad05ef6e26013a2dd23` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:4bd78212c6f468631bd035431d2abe8a067cff9cd2a5752dff64fc8141e83532` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:668190bd868d04fa2250824ac8795f8b5767094e84ca9e2a54cad0b667f272dd` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:a42afac0a4075c784e96a13508ad7584d507057ff0c762e1eab366986dfe6fb5` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 861.9h exceeds 168h.
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
