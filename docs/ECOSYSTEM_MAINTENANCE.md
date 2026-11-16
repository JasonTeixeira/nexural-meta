# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-16T09:02:13.694Z
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
- Public repositories indexed: 161
- Public assets scored: 161
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 173
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:0e1d5d75a73a677ea65af21591d938739b8d4f587989b78f16d02661623fa5dc`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17809ms |
| golden_path                 | failed |   3104ms |
| golden_path_vercel          | passed |    265ms |
| recipe_catalog_post_proof   | passed |    353ms |
| resource_library_post_proof | passed |    268ms |
| proof_environment           | failed |   8038ms |
| db_proof                    | passed |    259ms |
| operator_test               | failed |    283ms |
| maturity_lift               | passed |    254ms |
| daily_operating_loop        | passed |    260ms |
| portfolio_packaging         | passed |    267ms |
| public_proof_export         | passed |    271ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:d8d6872259477e49f02b2cdc76c41c8fd0cb2bd8daf7e8a555b1fd3e66b2f011` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:d6467f797810e8b9112816035986d5d5e45bd8aa86c5226dd91ca41388174cbb` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:d0f3f9e8f2e6a6a3b8d210ff81a3d3fbbf2c98aa2eb462c3bca5f1deadd1f5eb` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:9bf1518351cd3de8dd96045071945462f37b7cde774444f2a6608f0ba0413e73` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:71840285284d83484bc79bef381a79f139d3ac040c99bafe94178d0670e81916` |
| `data/golden-path-runs.public.json`              | stale  | 2685.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:34b59bdd62f3aa5501a5d9b667cfae534fdf681e9bf54f17035734519e6ab508` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:6a19c30629cc150c98e4a0c98eed64589dc46d65e9f01c002b260f3f67a4588f` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:d892ed23675ee610a89f716afc520d874d87d27df233b61f70f16faf2f6fc4eb` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:129612a5923c8d427669e581aab6979f3cf282f529286ef469f3caa2fc9c5473` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:82c4d0d70c685e3c1c6b6303da5f3f2cb1b7b3000bae3a3beae0f4a031018b6b` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:a7639b4cbd0991d1838fda65541387c7fcdb993053079bf4d2e6c373a0b210ed` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:6e7c98b02a8b4a4de557df5e6f8c371e7cec9ce5bb9e86661e5417b7c8ad4a9b` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:d892ed23675ee610a89f716afc520d874d87d27df233b61f70f16faf2f6fc4eb` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:61c0792509dfafe238d6eb743696a075a124998dddcb69c845e520ff4d87b88e` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2685.9h exceeds 168h.
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
