# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-30T10:15:59.968Z
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
- Public repositories indexed: 137
- Public assets scored: 137
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 149
- Golden path: 14/14 gates
- Hosted golden paths: 78/109
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:115c5cb16dbb690e3bfdde28b34661b8f41fd1bd31be094c16ed2c495b4792f4`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14415ms |
| golden_path                 | passed | 152212ms |
| golden_path_vercel          | failed |  78435ms |
| recipe_catalog_post_proof   | passed |    296ms |
| resource_library_post_proof | passed |    299ms |
| proof_environment           | failed |   1579ms |
| db_proof                    | passed |    289ms |
| operator_test               | failed |    308ms |
| maturity_lift               | passed |    284ms |
| daily_operating_loop        | passed |    285ms |
| portfolio_packaging         | passed |    291ms |
| public_proof_export         | passed |    291ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:d21ee210da25bee928e05de881e05c83a2f927fa61738b4775dc4e2b22a66ae8` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:77a49785eb93bc335eeb1ce4a987476ecf7b86a1d07e346abaccbedc48bc5b54` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:c999b936c2b6d81c79347f66e961acef9908882b8f9da041bdd2db3594b5372f` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:09a4580cbf0cb6fd0ab3df379775de0476b93b423927b283d9145ec8e791a15e` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:145015c8662377a90995615c179d802057120eed7ef6101134a48f5d3be5675e` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:898908a8b7dc308eb24c987b3c7901f7078928a943db4044775470b34cde02e8` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:20bcf13ec9e135c6aaaf8817a43e58ea4758e3479fd9f41bd2992a056caac2ee` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:8f55954f0c2aff029924153ebf049e576fc983afd9250a116803b8b70dd20f61` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:8c7e647c814fda7d1ee7f59ff75a5f84e75f56084d356e4ab5dc80451bf505e5` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:2a79c6c12599dc415b3399e0f5fda34f6614e22b0921e5a3e447e74d37bcd64d` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:3f8c35e2db59c8bdd486f49d4cdba55ce033bbbe202ceb91a835e975967694ff` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:ffc9c0034748d24c976e442d84ee77b8c6000b57ee35bbe4e242bac5e2cdb86b` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:c8197759cdb8dd41cfbe45153f384e55cd8d6cd2b1afe29dddf2783b2295a091` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:8c7e647c814fda7d1ee7f59ff75a5f84e75f56084d356e4ab5dc80451bf505e5` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:8e9336f5aff68d03aab6422a5541e0bda54aac3cb9b25feb3f37cf4c5c51850b` |

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
