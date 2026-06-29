# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-29T10:36:00.383Z
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
- Hosted golden paths: 78/103
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:7503a8fb0fb234cb48848ef044a80113a64e274a3e46577596bfee88bb7a8d77`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16564ms |
| golden_path                 | passed | 150448ms |
| golden_path_vercel          | failed |  82544ms |
| recipe_catalog_post_proof   | passed |    299ms |
| resource_library_post_proof | passed |    298ms |
| proof_environment           | failed |   1664ms |
| db_proof                    | passed |    291ms |
| operator_test               | failed |    320ms |
| maturity_lift               | passed |    289ms |
| daily_operating_loop        | passed |    287ms |
| portfolio_packaging         | passed |    289ms |
| public_proof_export         | passed |    294ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:f9285630703740fdaa6c000b4d4c9fffdd333492eb6e369fb820080704c4390c` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:ad180de3c95c76c103847653762a7f0d76464d4af6ecdef5632ccccc07e1037d` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:c3b3cba0e6b84a75c3fff6d032aad0c39bad8a1460f424bb83b760757469fd17` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:cb40d8170fd0d055e1cce213f76092ee2f616d4db32eba7bc34f8d37a4ad352d` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:3f2107fdd1ae101db659953e965fe04a87ea524cc00c7e684851461856776790` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:fedf899b285c2b8ed9f229ff2a350531c834907c59ea829ea912e3d9e03571a8` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:1cfb74250a928a42277aa96ef4fddb8d75883ac65ecb1e88862adb79e52e7bf7` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:44b4cb19567092dd2b8adcc344142f69851175f8158e3f0a0b68668c380fd67f` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:e5b1bab10a15133092b44c63ff1399a69ad8807191da855fcab97c8c21c0f79a` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:fa48e1c82ffb7a590c93ed7ea9ad5048b3b568736fef0ca6a4360a54a98b0a39` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:4e3577f60fd47f918761478d2bfcb652c7391a2824429da9cded8e0222f991e0` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:5ddb45a2064e9e48f855052615850b52a0c733bc3fdfc4f7093af02a4befedbc` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:a5367b08fb3829cc8dc4b512ccdb237723a86011b20e0d11c0983b88df7831b9` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:e5b1bab10a15133092b44c63ff1399a69ad8807191da855fcab97c8c21c0f79a` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:790cb308bd83297ebff35e3d6a83775b3788da69280b8c715012e26b3eeb30c7` |

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
