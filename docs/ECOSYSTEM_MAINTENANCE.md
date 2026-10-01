# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-01T09:03:50.093Z
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
- Public proof hash: `sha256:f9babb80e94a30dbcb66e6295ace1ff3e4cbafb707f0481be7392478ddb4c76a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17534ms |
| golden_path                 | failed |   3835ms |
| golden_path_vercel          | passed |    329ms |
| recipe_catalog_post_proof   | passed |    348ms |
| resource_library_post_proof | passed |    336ms |
| proof_environment           | failed |   8235ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    353ms |
| maturity_lift               | passed |    330ms |
| daily_operating_loop        | passed |    325ms |
| portfolio_packaging         | passed |    335ms |
| public_proof_export         | passed |    335ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:b0981a617bbd8f4ad0e94039c783b2161c95b05abb13d056ef7c1b525b62ccf4` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:4ac1ab676edb67a2d9eae2f17c927ee1791a9c2f4502e0753e156ff312be3dde` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:1097442febf63070a6ad89c7f69043733d7c1e42e5952e0294bfdcc2b46a6e2d` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6ddec12765a95065fd00ff042a2d7272d3e7f1ae279fc1dcc099832b35930b35` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:3d4f69e649a936ea10cee50aaa16c653452ff7a8fb65240e10b7ebaeead49f06` |
| `data/golden-path-runs.public.json`              | stale  | 1581.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:4f1ffe85d01cb240da8896d90b78f3ea2b1643e81d8bc2a8b18626efd3c111b4` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:fb0e70bf06bc9751c37b73873e60d6a621aef46fa0edef2f1424a9f09d38867c` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:ca73784d7f8fd12378046f78ec5a6c6983c1cba510ef40a555527cd47e563dd1` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:1399f5f38e0c2b48f6e551298b9272c384225172caf134db253a7eb3739748eb` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:ea66718bc2ed622894b36900b2a22d190fb069f32369b20d3b9a5da5f4003874` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:4a3be111b9d3f4b039ef3d5fd8e993f25039e90eadb03fa4fd1338cc1d945c73` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:d6fc51c4925fa6147c786e17993843076643bc4c67667fef57bd96788e1c8cc0` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:ca73784d7f8fd12378046f78ec5a6c6983c1cba510ef40a555527cd47e563dd1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:e6c42a21bedb038f6b68d1bc738dc308b0b9401647a0c2db80224f907235f8d5` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1581.9h exceeds 168h.
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
