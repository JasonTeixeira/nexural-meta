# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-13T09:02:20.104Z
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
- Public repositories indexed: 160
- Public assets scored: 160
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 172
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b587916bbd932e3cc966bf3556e86c4959d2340b890bf0633ac831fac2a702f5`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15748ms |
| golden_path                 | failed |   3165ms |
| golden_path_vercel          | passed |    259ms |
| recipe_catalog_post_proof   | passed |    272ms |
| resource_library_post_proof | passed |    267ms |
| proof_environment           | failed |   7994ms |
| db_proof                    | passed |    255ms |
| operator_test               | failed |    284ms |
| maturity_lift               | passed |    257ms |
| daily_operating_loop        | passed |    258ms |
| portfolio_packaging         | passed |    261ms |
| public_proof_export         | passed |    264ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:1ee5a52431a4acdf3609009caea3d0419bdee04a2acd2f0450d3580e3bf67398` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:c8193ce22f86cf5ad617ef04190757a3664de637fa6bbf1f43138a7a0fe1e0e6` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:ffa88c4f7bc6c0dd00abb14b8d5dfb447f7a5b84ac3dc3ea874d57b59d11d6a2` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6d64a2a2ec18636d4b122e85d8cb1865b727ea0f2b45405cec5deef6d88ce871` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:c0b17b7a865e6aa5c4f01c58e7da0312992cc0f95bf756b5378c9166e4eba256` |
| `data/golden-path-runs.public.json`              | stale  | 2613.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:6b43adf1c1f8ea902e7e8d9eae7c7c8fb75d1c9692fccfec90dd5433c9bc8d33` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:47661273854b94edceecbcf8f06f330661f7c500d333a76cfb5b5342eddf458d` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:363f0836070c0c7a0742c8caadfa9955669fb0eb1771275c6408d9d138528aa1` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:e6153ea7dba48126bf8cbd9e4114e5440b5b4182b2aa56934a81caa5b842db8b` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:1c709e1e19b0b719b50cc1dd9043475318e6af75a47fbb1e15b4c297d490c1b3` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:0fa44d6df1b4b7ce25a7547336ed37940b6153ba30f76b88090674f09b5d1aab` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:e08c71944f75c981951309903a007295aca96feb022a89f66c5369c8c0887e4d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:363f0836070c0c7a0742c8caadfa9955669fb0eb1771275c6408d9d138528aa1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:a4711ea48fb29466b5db666df60d1d331efaee5dd2f918d3e1653308a018553d` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2613.9h exceeds 168h.
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
