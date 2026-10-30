# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-30T09:02:13.492Z
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
- Public proof hash: `sha256:ece064041523818f872055c994e6c8eb45b41eaf0b4b98978bdf7408f27839e0`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18067ms |
| golden_path                 | failed |   3438ms |
| golden_path_vercel          | passed |    340ms |
| recipe_catalog_post_proof   | passed |    347ms |
| resource_library_post_proof | passed |    345ms |
| proof_environment           | failed |   8417ms |
| db_proof                    | passed |    327ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    327ms |
| daily_operating_loop        | passed |    322ms |
| portfolio_packaging         | passed |    339ms |
| public_proof_export         | passed |    335ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:6ef993925a9525d5699032fa0d3808f42a49b327a3921f986ee5abaccd59e5e6` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:64a1b6f4ea18fe666e6413f3c35a1d715291b990958f53d12caee0880864b3f9` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:22ac31ffafcf119edde5b1da11224d0ad40f74f2c89840e16ca2791811c1b308` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:2eb917c1f32b1c40a9aeb06fdb41e4e5669b5461bd153b7a09a32c68095ad6bb` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:6bdde305a997922fa463e68c592b5e55f72e1f0431f6afbc38d14eee8197e425` |
| `data/golden-path-runs.public.json`              | stale  | 2277.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:cc81bbd33690706f04aca25b56088fe2d1851cbe6dea0a935e16262db98cc9e0` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:5ebe69000850faea42b0a9a8878a479dbcf458cb12b4b52a1e7d3553bef9f855` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:a642cf454f049d3b587a21bbb30f9467fe30a4e1e69ddcb0360de41560ec6025` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:7a4db034408fddd7c988176f361c92850f8596a1bc46e8fe406a778b74ddaeb7` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:bf44ba0aa4493db5c7cec180fe03b66690fde0b81253b2f19845f49b4b2dd40a` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:89eb465cd74a47bf83f0168ba279fd4003e173dea458ee9a903c355f5b1bfff3` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:79953b8c35706e5a9fa667e4ddaf9818c1d494f19d52a0d742878700c2eca9f4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:a642cf454f049d3b587a21bbb30f9467fe30a4e1e69ddcb0360de41560ec6025` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:97c12f50f50511913accd044b62135d325ee58c316d8d640fc59bb01eab6013c` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2277.9h exceeds 168h.
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
