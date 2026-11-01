# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-01T09:02:21.945Z
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
- Public proof hash: `sha256:7f919762415c84d5373e1a18c7850e1388595aabf584da521e76e222cf1a6e26`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18138ms |
| golden_path                 | failed |   3783ms |
| golden_path_vercel          | passed |    420ms |
| recipe_catalog_post_proof   | passed |    427ms |
| resource_library_post_proof | passed |    419ms |
| proof_environment           | failed |   8455ms |
| db_proof                    | passed |    411ms |
| operator_test               | failed |    441ms |
| maturity_lift               | passed |    407ms |
| daily_operating_loop        | passed |    414ms |
| portfolio_packaging         | passed |    414ms |
| public_proof_export         | passed |    416ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:5b3aa08c53de95c60481ccdb2aaf4d19a1110240c7e7804c77dc8e39cf48814d` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:4d6a7d27f2186cb509478808d057641a2ccb0922ccfa61b7917ef390f2478008` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:22782f177f3e63a1fd6efe496dce81f45d2f5911b5d79b0d80e2c0c1cf32e6b9` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:c5a4c16aea433bf0b9035d01a2538803ff9253386186fa2cc1426f964d7d348e` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:8156399826caa4be6b83f1d868769e832f8f50e6689ae147aeb0dabeff5a5058` |
| `data/golden-path-runs.public.json`              | stale  | 2325.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:f29ac7ef3c3036fe23c5edeada3921ddbd89ce0ae0733e179b2c2ed456b59bc7` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:4c836cfe9dd5331681387ab7d9d66bf43e082eb15cceb6d731781495dad90521` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:59fda0a3de71f0ded2189474d49462620c6cae4f34b90836958809765712e654` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:6a15f7409252687044935d9efe7744da2cbbf67f1e5baf0997e813cc6704ae57` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:e4353aed594271657e7b1d0644c3eb5e0e5535912eaaf8388512142cf57ac9d6` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:600e1dbadc72d7a8d2c8d6ea24025b810480fd22d6f733ccaa9dbef43db6b0b8` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:13a77d46bcb32f6244c7c8f92c1c966ceca774f14f3c278f0944ced2d601031c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:59fda0a3de71f0ded2189474d49462620c6cae4f34b90836958809765712e654` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:7f5d950dc43094f29ddae10b8cc71bb28400f00de67b635e14fc17bec73fae6e` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2325.9h exceeds 168h.
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
