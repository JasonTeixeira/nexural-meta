# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-30T09:48:34.974Z
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
- Public proof hash: `sha256:67e91faa4a356a240adbc10b352380ee28291ee5ff6f96c140473ae3fe1333af`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16735ms |
| golden_path                 | failed |   3755ms |
| golden_path_vercel          | passed |    194ms |
| recipe_catalog_post_proof   | passed |    202ms |
| resource_library_post_proof | passed |    188ms |
| proof_environment           | failed |   8315ms |
| db_proof                    | passed |    192ms |
| operator_test               | failed |    212ms |
| maturity_lift               | passed |    181ms |
| daily_operating_loop        | passed |    182ms |
| portfolio_packaging         | passed |    183ms |
| public_proof_export         | passed |    184ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:b4f593ce6d85c322fbb7eea5c95c032b6b7ed59992e1f1ddfea157387e8fbb24` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:fee59f0eb55ab88f84c1e9d4af79ce14c334b4f92819f6271dd0e5626a9f856d` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:36c10e7977cd6bc7f03056459e1dbdb5dd71b8af96b245dcf7dc93ac0182046e` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:c2461b1059b7cd51dc1600c2454805f27ca2c9f0d5b36986fe4a455a4ab09174` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:428928cf0e1d0ce50fdb1689f4e41e19609a4073e88b11029a77375d38d1bba5` |
| `data/golden-path-runs.public.json`              | fresh  | 70.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:e6c4778a926262199d9014fbf3d2e5a9f7baca69716e9287a2960c3c932eeaa6` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:3f61d6994971f6e316b43d123941c10b1565e5323e79fd5890e08f56d174c01e` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:631745e8f0a81c3dec58f716f11067c8807a4e9b7c6e3c535928c40a2ffcd1a1` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:2f0d6890092a89e6ff446cdfac59b85bcfce84700bbb0116e6092ca280cc4116` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:9f8c77bf3fd5193634d4d43a7e3ae3f77ebc71e2b799d4a249e9781e8ea52680` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:4e0c6ca5e8d8c865286471b29b20d9e4eb176af92c99b1e98d485405c9ebe00e` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:e40263932cfa76cdcaf5f1f0b714f387c36082aba8e316e450022cfae63d31ad` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:631745e8f0a81c3dec58f716f11067c8807a4e9b7c6e3c535928c40a2ffcd1a1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:3fe3a02efdf19a0140a8a775f2c391b24969edd10f02f1d1e0382af6d91c123f` |

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
