# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-26T10:15:36.238Z
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
- Public proof hash: `sha256:ffcdbc976fb5a6757a36c28a09bcfb8d4c14c93e26d562563d4f485fe5b6ef6a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16872ms |
| golden_path                 | failed |   4597ms |
| golden_path_vercel          | passed |    307ms |
| recipe_catalog_post_proof   | passed |    310ms |
| resource_library_post_proof | passed |    316ms |
| proof_environment           | failed |   8148ms |
| db_proof                    | passed |    305ms |
| operator_test               | failed |    329ms |
| maturity_lift               | passed |    306ms |
| daily_operating_loop        | passed |    302ms |
| portfolio_packaging         | passed |    307ms |
| public_proof_export         | passed |    312ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:7b738b79b76408a3476dfaef9cb227a952343c765a914efc0d3074ba50954e5d` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:66fb7133d6fd027742531d5e3040485838a929bf68003a552c62f389fc4b4210` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:449a5f60dd237a722adfd60e0b0da7f83d99dc1a792e879ada60537dc74f76b2` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:0dc380757668ff9a16d9b8a53b462e63d11d0cb3e32d8ccfe988164bef878a7a` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:274b9a58ae831c4a78bfdea01db46f1470a77c45806049824eb29e94b12132c7` |
| `data/golden-path-runs.public.json`              | stale  | 2183.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:c227d088352277b3600f804d4095b3073daa914e611012e83edf4045554aa80a` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:b07d348f4a04cad29bc3b08698284d8b44945a5088eceba8300071c152fd3548` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:cd9adb3ac1ab61188f987e2c671930050d805743831e2db00cc1f99f379c602e` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:9e58338144a70f66c38a8eccb36c1f93dd4629fc62a348178a47c64e2728933d` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:72406e4df2d223f009431719c271d134f4610bd2e3ccadb5f1fab26b5412e731` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:fa6d3acfe1b2910cf0349aa90650c6d0d5a33eaabf2cfe9ee740609c288aaf9e` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:1f0059fd66e96c060736760f4ce749465ebb1e125777efe6989328576a597ff8` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:cd9adb3ac1ab61188f987e2c671930050d805743831e2db00cc1f99f379c602e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:d1e638af6acff317b3ed7dcc3826c3ce406458c2ed48d2683692ff319c5e0188` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2183.1h exceeds 168h.
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
