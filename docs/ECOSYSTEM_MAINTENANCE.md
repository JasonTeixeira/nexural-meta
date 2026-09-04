# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-04T09:04:35.097Z
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
- Public proof hash: `sha256:441c861b24892c788e581054c8ce9afb8eafc9afdf862c9a4545b884da058a3c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14011ms |
| golden_path                 | failed | 120442ms |
| golden_path_vercel          | passed |    256ms |
| recipe_catalog_post_proof   | passed |    279ms |
| resource_library_post_proof | passed |    263ms |
| proof_environment           | failed |   9393ms |
| db_proof                    | passed |    253ms |
| operator_test               | failed |    278ms |
| maturity_lift               | passed |    259ms |
| daily_operating_loop        | passed |    250ms |
| portfolio_packaging         | passed |    253ms |
| public_proof_export         | passed |    254ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:09cfe856c3694f01a75027f7443c818cdffe52812887dbca8724c82287297486` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:f0772bfe60f905a56dc1a82338323f33401b2d65af3b36a33218732d8f7b05be` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:0449d45ed07c1057b4a1dd3b7146ce29e2eca0dec59d01cac064ed76c23c56ed` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:2b203b8fc776d9e2912005ddd3e1ff69de7af472a7db83a9c15f45b7e4dea26b` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:15d237c3d678b14b693f97c695c00c3548eda7f80951bfe3cdabbbdf780b05ad` |
| `data/golden-path-runs.public.json`              | stale  | 933.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:2f429a64eec0d373a123224c266fd8fbc534a1f18398510b3eb1914ed2edcbee` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:b880b5c820d17d5022eb88653687c2e23bb7e6ae5f2f84b90bb9d3298bced9c1` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:248f443cad6e277a81fae931175bc033cb5684c632a6261ba82583bd998ec020` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:fac5378dce49a0ac0c2587641d218c09c537d8fc59ab63e746197218d29eb228` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:9385d5505358ab905cebb9f290e23f9aebe4d6722b1c2f68d1a3334c0694a42a` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:a04b496e5dc341b223dab6c27e0dca5eba51f7aca052c9ab481c06d1cb923e51` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:bf77b3b014cf6e5130ea366f2e12eb27c7746c004c12f9cec79449279f2e0160` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:248f443cad6e277a81fae931175bc033cb5684c632a6261ba82583bd998ec020` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:7eca6af60e1bc17fcdfec633620f4ad6f7f4ba352575bae76113091a7d9f835f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 933.9h exceeds 168h.
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
