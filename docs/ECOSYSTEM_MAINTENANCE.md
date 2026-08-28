# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-28T12:50:16.093Z
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
- Public proof hash: `sha256:c38e07bf2187ca682be54c7dd75a8a6ad0979ee0804a6bb682d3e793c1c3a15b`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13876ms |
| golden_path                 | failed |   3654ms |
| golden_path_vercel          | passed |    343ms |
| recipe_catalog_post_proof   | passed |    338ms |
| resource_library_post_proof | passed |    330ms |
| proof_environment           | failed |  13545ms |
| db_proof                    | passed |    313ms |
| operator_test               | failed |    349ms |
| maturity_lift               | passed |    327ms |
| daily_operating_loop        | passed |    316ms |
| portfolio_packaging         | passed |    314ms |
| public_proof_export         | passed |    320ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:0f649a726dfafbbc4f2f1c8aec1e31ebe510fbf8e738b20f6c4f4d0dc459a53a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:096c176d1524f94df660f87fc0271aaf175a03aee07aee03a750274d2ae3dfcb` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:3368a56800697c20be007c90cbe3679408c9f07aece58435cffc48005a24566b` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:ca1619178b3c3acabbc0fe33d25b8734adb749f2a3be361b6f7c4a9243452f2c` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:3e67490a387b893968ba8ccdfa038f379033897c2fd6c6b1e98b4f93af340d17` |
| `data/golden-path-runs.public.json`              | stale  | 769.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:47abb4d3df41dac09b455fb0f29ad9853df4b39f09a73dd57d803c6a4c0b5def` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:074d995ca90c717a090c5154f03c2ad40f6d0042cb3f434159a6a5dc51f9569e` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:bcb652939c9f56902850f95faa3cb74c556003b8db06c7ddb909c6958bd681b7` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:9ed69cbd967a925aef60b1dba39a196ade410d25e1eb44d20d79201438583c1a` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:d24bde28f6c755d71eb8982a046596ddef8680c7415876ee7cd2cc3ae8370fe0` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:f189580b38287b0bab3e33fbaf0e35a338ac76a95b513190ee874da9b42e914f` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:23b347f996b3e70d5f6f2984c25ca9ccd117e32b3830999cc142b28f28c395ec` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:bcb652939c9f56902850f95faa3cb74c556003b8db06c7ddb909c6958bd681b7` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:8fb8a833135440c49acbfde13cb37ee0c1fb794dbe69ab9084ddcdfb2a19f0e7` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 769.7h exceeds 168h.
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
