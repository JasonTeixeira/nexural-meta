# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-07T11:40:35.513Z
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
- Public repositories indexed: 138
- Public assets scored: 138
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 150
- Golden path: 14/14 gates
- Hosted golden paths: 78/133
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:d8a1d15a61a39e0df426b0d1cae0a9ce3c1ef1a3d86031ddd801ccde56e48685`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14175ms |
| golden_path                 | passed | 160479ms |
| golden_path_vercel          | failed |  79646ms |
| recipe_catalog_post_proof   | passed |    339ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   1595ms |
| db_proof                    | passed |    324ms |
| operator_test               | failed |    362ms |
| maturity_lift               | passed |    326ms |
| daily_operating_loop        | passed |    325ms |
| portfolio_packaging         | passed |    323ms |
| public_proof_export         | passed |    320ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:c2c665bf507b90d8680c762ec8b6a51103924a6674b37d890bc5b63355bdcc40` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:7554020de73e339858fff038262dcb3196eb7e6bda4f90995fcbae48c70b7c1a` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:927d7ee4678adac3a61d5252751f8172693215310a02098cb3eefe14cd4de90d` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:afbe63af9c59b6dc1414dfe434b40c7fc6bf6533642f228209027b9e7c3a4b66` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:c3f8e0f59c80bb66b30b161b4a3ca49be4dbec24278745dd6a49cecd24d989ed` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:62c39914016ae2e2090ef53d69481855c9f18aeff9607d9cc78067816a30b29d` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:7d5c527c8ff1b6d8faba381d93b14feffb1fc084aca470b9850c9c8dfb5d1dd8` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:80451941cc89e37a16f53b74f15d6c3a167ac3cf1da360f24dc1ebd4441f05f7` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:ca4ec2f142d8180a657fa67653fd982c6c7fa3f3cfa9fc0f10fe86b8a734c441` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:8879e4979b2eae9312f5cd44d394bda952d3bf2508d4797f5d328d0dc6a7f79e` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:31a49e945d0148d09cefcc742a1f270fbfa18769d0062fddb22dac9197c0f992` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:ada4f2f8ec1115d0efa34353d42c6c288d64f2b1f4b2a8af0b6c6f3e96a84c5e` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:30a48d786144ff41d41058e78b51f352b2f475342f8dad19b1bbe2d908135afb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:ca4ec2f142d8180a657fa67653fd982c6c7fa3f3cfa9fc0f10fe86b8a734c441` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:583572b6a31696031fc8f09fc36079de83585de5e9cc264d46a5192ebbd80ad4` |

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
