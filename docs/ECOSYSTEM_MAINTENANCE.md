# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-09T15:38:22.927Z
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
- Public proof hash: `sha256:7dfd9931750545642310d295a625cd2dd1294950010cc6188a86d47f5d5cbfc5`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16783ms |
| golden_path                 | failed |   3864ms |
| golden_path_vercel          | passed |    337ms |
| recipe_catalog_post_proof   | passed |    355ms |
| resource_library_post_proof | passed |    354ms |
| proof_environment           | failed |   8097ms |
| db_proof                    | passed |    340ms |
| operator_test               | failed |    370ms |
| maturity_lift               | passed |    338ms |
| daily_operating_loop        | passed |    337ms |
| portfolio_packaging         | passed |    351ms |
| public_proof_export         | passed |    357ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:981b0e4e4618014e23e5def6fe32c848b2028852b64d0b645e67e5c26224f1f0` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:3fa29a575d0d53f9de89c881c1e5fe48cf9f14265666e95ce07225f32e42e509` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:4f80b21577ef7e585a90fb9003173f8362e75595f904b76edd0f72a80a6ae277` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6240e95e701a50fee3fe29fea9af3afd20f0f840bc6e2a1842fd8e226a8775d4` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:eff903b185f769ae3e49b94cb4b0ca99460bf903830a9561b3289fec8f8e89f9` |
| `data/golden-path-runs.public.json`              | stale  | 1780.5h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:a00f4a62e9d2330202d70068697c25418830101462515d2ae79c2652c031df7e` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:18ab3595d1aeca63320102bde5fc7a6b3b1e895ddc505b993c61ba6c30375a7e` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:f816f8f4b18a7e9549724c9a64f7299786285e52e57480b35415d30a42c093b8` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:605600370d22021b84337063d34254311f5a51a485132f39599f656d8203968a` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:e9d6f432088a475544fa11cbb17077a9ffde6e590674c61549d0abc4e00e5869` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:8715cf92bc396de1f2d597e732c92af3a088e8f7635a3ec8da9eb5225e127e13` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:374d6692ec6fc0599b2141da1d4b7593e41a393a87ec07a415974894130330c1` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:f816f8f4b18a7e9549724c9a64f7299786285e52e57480b35415d30a42c093b8` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:332444070d68818d716964512ab703613823a9eadb748eecdd2804aeabd45466` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1780.5h exceeds 168h.
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
