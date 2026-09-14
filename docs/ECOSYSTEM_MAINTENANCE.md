# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-14T09:03:10.709Z
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
- Public proof hash: `sha256:3b03368bc51d8898fefc9ccacb909aaa0bd5c8b7b2b9f9ca8aa65886b397d180`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16697ms |
| golden_path                 | failed |   3756ms |
| golden_path_vercel          | passed |    323ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   8003ms |
| db_proof                    | passed |    324ms |
| operator_test               | failed |    362ms |
| maturity_lift               | passed |    321ms |
| daily_operating_loop        | passed |    320ms |
| portfolio_packaging         | passed |    327ms |
| public_proof_export         | passed |    340ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:d67670d208c3dc50f1cfb2036e177a69c00fa5e82010cea78173ed47d7f608c1` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:2891ffedb36eb1867e25bca2621773758f25912d1eeeff97a898e6c2841c3b22` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:e0c0c7443ff1612faf332a1fa7ddecdaef7c60d565faa2ca5f9d8a0bb125f749` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:929026455c97fd558b09bf0769b170c2881c7456725597abc7da10856801030e` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:41cfa002f33b5996f0df6a9618cf6b051f069699c3aa70a726955bf531ce01bc` |
| `data/golden-path-runs.public.json`              | stale  | 1173.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:a18f1a3bc4299c5675504f34c273107ebe2ef90d9a2ed32083cff649d26f08e9` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:8b2464f74ff5588fc467882f8e1a4af0a479759452b15a30dbb69f6a2ebaf5ee` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:3d003e6b450a61d3b0d5b1db663f3c8cf48dc944b14f71224e264ef54be6e8bf` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:4772f7de804aa9011f24c489536f441f9a70e711aee15edc852f40f0a315f6a4` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:5aa232a91ba9269c1da81fa10f01575660bbc96e15e185d669dfcc743a354a0f` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:2e66dcf7f6221da0bb7f5bc38926791f6618b51a353443ad48e35fb9dc0e806f` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:c8ec381bd134179a729bf26c51735c8a1da3ccb192f326961f6d54b59ea0c515` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:3d003e6b450a61d3b0d5b1db663f3c8cf48dc944b14f71224e264ef54be6e8bf` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:97d75d0a0101540ced91759fe5f1343a8af6ef1d0176d2041604916dac5a28aa` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1173.9h exceeds 168h.
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
