# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-12T09:02:32.294Z
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
- Public repositories indexed: 160
- Public assets scored: 160
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 172
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:df6a4bb16d117ff044cf9ff30938e2d013bd63c77a7e7bd8fd331d33452a478f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  19187ms |
| golden_path                 | failed |   4527ms |
| golden_path_vercel          | passed |    350ms |
| recipe_catalog_post_proof   | passed |    361ms |
| resource_library_post_proof | passed |    355ms |
| proof_environment           | failed |   8259ms |
| db_proof                    | passed |    337ms |
| operator_test               | failed |    371ms |
| maturity_lift               | passed |    339ms |
| daily_operating_loop        | passed |    341ms |
| portfolio_packaging         | passed |    349ms |
| public_proof_export         | passed |    350ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:b83f2d72203765061712f07ff7ee8f3f474577d6ec71de77683a8e51bda21abc` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:44a43ec9a2691f071b577b5aaa8e658cd3c928f13680b6a4a9b5e57c7fd100d9` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:58d3983fabec2c479fce04a11268cbb91d17c0b4bee37105729ce8f2416388d4` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:eac2a4eaca33ccf8894f7d3319a950b561a3d57159c04decd76e2727ed4d58d6` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:9fc0a81cadbb29402ee5961ce9f5b59141fb5a9168a24ef8f9f4ad3677175771` |
| `data/golden-path-runs.public.json`              | stale  | 2589.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:5663950332313e475070ffcb3b878a6a2b7a29b326ff60cdd206616af2a0ea2e` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:2a9caa9147095f431bf915a45c287d550a1106c27128650ac76cf843e034a846` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:3033f0e3f903832048ba8ed2fa6298996fe8ff9533da1bc272a6cce14bdd1a0a` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:493245971f2038956bf21cfc4bef624ed184d31af12a7c5856d9bfd2f64f32bb` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:8d2513605233665bd65410936d666947309e38e4e5e5590c3bab2d0970f102be` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:bfa15c876fe2f0728547543832d9c1b88c4c0f561f4a7a53391d58ecb97a5f63` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:3b6f907ee851ad29d71a93a0c3dba556671519bc089246735255e3b72d9166b1` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:3033f0e3f903832048ba8ed2fa6298996fe8ff9533da1bc272a6cce14bdd1a0a` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:9b26fb70868ea8465310d2e8fbe6a7cad3142c6ed479b25a85220bb0a74c8187` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2589.9h exceeds 168h.
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
