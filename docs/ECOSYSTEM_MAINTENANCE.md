# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-15T09:02:19.425Z
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
- Public proof hash: `sha256:77bfb7bbebd1cc409dfd2c4d2486eabd6c47f3be3c08b3ab98b3b12f7f04cf1a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14682ms |
| golden_path                 | failed |   2669ms |
| golden_path_vercel          | passed |    206ms |
| recipe_catalog_post_proof   | passed |    206ms |
| resource_library_post_proof | passed |    213ms |
| proof_environment           | failed |   8301ms |
| db_proof                    | passed |    209ms |
| operator_test               | failed |    225ms |
| maturity_lift               | passed |    201ms |
| daily_operating_loop        | passed |    197ms |
| portfolio_packaging         | passed |    209ms |
| public_proof_export         | passed |    214ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:2dd8eb8628f8fe977a168618db963545def215eb3c09db20577ed9066ea10ebf` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:7e6392e32b7de4a94f7dde8e9738882a629dd2b8416161a699bb1a2550dcea8f` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:bfcb8156b6fc51600f980975139790aaab47727779b4da18e12c0f5bbec84795` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:1d06cff399ea410852beb2de67389551401962a88f5ab332d4159b916492722d` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:de0427461857ce52eb82cad6177aa93c4cab9e27a4e61767e3f224bc45a440ff` |
| `data/golden-path-runs.public.json`              | stale  | 1917.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:b9e590c046230104a9eaaaec08c1aa21060f896fb11686e44fde8209d6c9604f` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:54456036d9ebb7f9cb94bb6e59c6867725661671ef08a61d53de51c05095f0d3` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:ee445a60a3b6e6b26c928439a3af1b2f1ed0ce859404cb0cd6fe92302b07fb2f` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:2cc8242a08582a0534740819cf1eaba3570bfd9177d516407c36661e8f63b305` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:9a012941271a6292981dbec42b9c802c862e81291df94490940b3a1e6b2615b8` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:81fa8e01efa2a4a753938c8c593f3ffddee0205fbf321e1090ee9ec670efa04a` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:395350e6e1479a47a34af21fa88831f87ed613314ba98a02440e92cad1150ac9` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:ee445a60a3b6e6b26c928439a3af1b2f1ed0ce859404cb0cd6fe92302b07fb2f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:3512cb9b625c4b24d9fec407f370f22283ab67abc4bfe0fc94a9b7de5828fa36` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1917.9h exceeds 168h.
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
