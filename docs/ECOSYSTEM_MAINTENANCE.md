# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-31T09:53:17.491Z
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
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:22221015cddca7009ec737dc38bf5e7a3113ebe5f8711043357b58d06c93a44c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15513ms |
| golden_path                 | failed |   3722ms |
| golden_path_vercel          | passed |    328ms |
| recipe_catalog_post_proof   | passed |    334ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |   8234ms |
| db_proof                    | passed |    315ms |
| operator_test               | failed |    355ms |
| maturity_lift               | passed |    318ms |
| daily_operating_loop        | passed |    315ms |
| portfolio_packaging         | passed |    323ms |
| public_proof_export         | passed |    330ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:fcf7697c1068a5ad3a05acca76b640260f00abb63d46b40b155bc94793750ad9` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:d36807b1f856dca720e495b544db218a13918bd55852f82111e91038ac1771a1` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:aba9b4ec0ab5e72620f0cbbb954cd20c0c3769d2e76bb5c717ba02085fb32ce8` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:f261491faee8ecc221e0d514d776c708b2f566b483e42a6966fc0e0ab2d7a138` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:27ce2e2c106a6cf23f784b288e70c1f48ca238c97b6863464ff43381ab88a32e` |
| `data/golden-path-runs.public.json`              | fresh  | 94.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:ca87c76d4f3528a9a8da819d1c43e4a51c84972783e67e5081c5982eb9d070df` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:182a55dce60f9bebe0f77ed626f70ec47e7d4c786d4ac71241cfc51230ec1c82` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:b55021f3276fbb679c796a9d1a255942ba0270a3f3e13f266068aa169afb8d1d` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:0f0662ced6bea6d99400bc83c5ecb1ebca28e128c7fbbc87995f02d5409e490a` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:a4b7839dccc949b398f20ca7c66541681a3c9499884ec3da48cefd9ca2cb654d` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:c0cfcb5629478614e64921b18aeb389f270328a8bcec9e1a46f074485170658f` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:6487a25b6b111c8ac2765cb7db0f0ab74216e2e0f67424f74edaa74f8569bb97` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:b55021f3276fbb679c796a9d1a255942ba0270a3f3e13f266068aa169afb8d1d` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:e4504dfa67075830d7bffea7d226ac1c72ba0c528bc82a41e971bf2b4523e02d` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
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
