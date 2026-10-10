# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-10T14:52:36.678Z
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
- Public proof hash: `sha256:ef1da8129f0febed06aa89fcee2ee58e976e95fd3e32c3abea15df40829aa25d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16102ms |
| golden_path                 | failed |   3747ms |
| golden_path_vercel          | passed |    346ms |
| recipe_catalog_post_proof   | passed |    340ms |
| resource_library_post_proof | passed |    330ms |
| proof_environment           | failed |   8166ms |
| db_proof                    | passed |    318ms |
| operator_test               | failed |    349ms |
| maturity_lift               | passed |    318ms |
| daily_operating_loop        | passed |    319ms |
| portfolio_packaging         | passed |    321ms |
| public_proof_export         | passed |    327ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:b2954a31fa3f28f03b1687ca8cf801223573adcaeb33ecedf85f648dd09f3ac7` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:500bf1a9300245ae0ef113720b873d73e2929ed5b88cd8804c6aaa606d53691f` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:bac040cba7d137806bc88c6adca348d1d8b7c89a2d8c1ba525e4ed1dc35e70e2` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:8543ce55059224558d9c7ff7abd3079cd2a202abdc8a14d65eab96648c45e706` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:1d7504219d35dfe830a722eca1d1082f9685028771148c1595dfd708390afb72` |
| `data/golden-path-runs.public.json`              | stale  | 1803.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:c13aa5f73d9cd7b8a1460b40e0b15914271eb940af32efc7f8ce5e7f70814cf2` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:f6be60970990f86df84d819d45a160decbaa8326e83ac6f39009f9889b80570b` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:c4bda3355c3a8e3834643451d4a1b32046852cfdc5f556c1b45efc9d5bef48ed` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:552e1761b25decaf05b9fe46a2fbc6009d57a4a332e0c960843908d30ef29377` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:243ea5e08c02ada8d0998bc7379b99cc0b3970a76067fe3cdb484894c4bb1d39` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:a7d953a4174d7287dba4c5629a9036d9423a9c710a406deee055722cc4ceb92c` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:d111cf85a5aea2ad60c2f68b31d7f84759a508a1b5105eaccb3823df97ccbf39` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:c4bda3355c3a8e3834643451d4a1b32046852cfdc5f556c1b45efc9d5bef48ed` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:e71adf155aeec049db4b9dc77fa56763c90f0c8f183f123fad83f9730ea604ce` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1803.7h exceeds 168h.
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
