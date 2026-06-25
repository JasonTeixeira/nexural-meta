# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-25T10:06:46.809Z
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
- Hosted golden paths: 78/91
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:94eaaee687cf74cbc85cc0f16c1a50463f454355947f8c5890ea03c43b47c854`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14731ms |
| golden_path                 | passed | 166252ms |
| golden_path_vercel          | failed |  76571ms |
| recipe_catalog_post_proof   | passed |    331ms |
| resource_library_post_proof | passed |    325ms |
| proof_environment           | failed |   1825ms |
| db_proof                    | passed |    312ms |
| operator_test               | failed |    338ms |
| maturity_lift               | passed |    312ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    312ms |
| public_proof_export         | passed |    317ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:ad7dca664edb1296ec1fa642af045e1565fa2140b4836df641ddb63b7eef4639` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:d9e6b7ddf86bb391041b87cc51371bd84c9ec08b1f8e951b274005a9d9084465` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:1a23de85257dfd27dd05ee95ac77340327956b5edae52a49f8b0b810fcc66e41` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:29178c6604be5c9fa230e9e5e37eb5cb79b0a155638eafaf9ab5f7111d2f8f61` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:eeeec8f85cbd58feaece7ca06b29e57348fb5eb0c36853c73f31c15b7a277b82` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:411c3aa1c5c6c0c7ca06f46790045136b996a1a644c489eb7bd1daaeed1b0d2a` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:17be5aa4d3c4e0ef1a1fafd07d73858c1d7f3e4519ee375dcc3a7a1b3bbb0af4` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:4492abc6a3d0f7e122075a37e137db7b6caa4df64c8859808bc97591aed0c864` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:e77831c5c3427684932716e9c3881b8d08a27cba036e9e0a8e61571c540ba68f` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:92265ec8cb7f2d82b2f6f7cfb6805808e8a405273e68fa8e0fc609a741408137` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:7e7e4aa189129caf91d088b999c33720eb29b47dac7740b19cec9c5a6f88bf17` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:790e627326067f04dedd0601c4deabaa23aecfdf182acbca906d698f4a9de4ee` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:21b66e12b5469b5ba119216ead19af780382fe0c8dfe317d4850a5c358c5bec7` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:e77831c5c3427684932716e9c3881b8d08a27cba036e9e0a8e61571c540ba68f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:c5a065f46fecfdddb78f28e699d994f1a41e24a2861c423a8c33506a32facfe5` |

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
