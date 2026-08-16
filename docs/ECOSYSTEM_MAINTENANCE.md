# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-16T09:06:15.539Z
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
- Public proof hash: `sha256:9e32ef34f61bc220b440e4ab76c4e054487b52b911996bd50e16946044a6945f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13649ms |
| golden_path                 | failed |   4327ms |
| golden_path_vercel          | passed |    214ms |
| recipe_catalog_post_proof   | passed |    214ms |
| resource_library_post_proof | passed |    214ms |
| proof_environment           | failed |   7957ms |
| db_proof                    | passed |    213ms |
| operator_test               | failed |    230ms |
| maturity_lift               | passed |    209ms |
| daily_operating_loop        | passed |    203ms |
| portfolio_packaging         | passed |    206ms |
| public_proof_export         | passed |    205ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:7ef23163d4a1db9def45c512c83cdf206b6ced35de3f3c4dbf548283e0230a46` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:8e3f32780199135b065f82ba934554dec22083f18a53060e1afa98540e7dc2d5` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:0d8528282ac6631d5e1f4ac419275e8f6a9393e20b593ab2c1ec265c444542b0` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:bfd366a2040223546bcdf866dece2f53c4cc448792e7e478d86fad61bcac9883` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:997e8a846623f16f9ddc79b51b4a1b2c5d6aba79773069cf86289ade2f835459` |
| `data/golden-path-runs.public.json`              | stale  | 478h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:0d104f04069db9bda573555b705d1b8588e7d6099bd298bb2d81c50cab7f45e1` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:e85fdb05bc1523b1b218bc0ce98d0b0b962b4ce510b147b590bcc5293e48c200` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:628f6384eee4a9069af4260459e7ec0d90c91557878922fcbe67814d716711b5` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:9550d1c31d7419c3f46bafbb90e085d8d393769725d16632cf3ab979f4f374bc` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:5b90c085c960f7a678192a183bf76bfd4340fe7c7baca142e08a22ba5abbeebb` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:5f14e99401143ae833b1ef9a6daf279f9b1894e7d9592f6cf2abb73f5b69b6e0` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:316d3e62e3bdac9cb0ac03749d7b3524cab61ecf746190cfbf1e2c8c81893ad0` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:628f6384eee4a9069af4260459e7ec0d90c91557878922fcbe67814d716711b5` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:eef856b371e307bd775ca17eb7d46f91b76222781d3bcc2529b6fa0a7b077f9b` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 478h exceeds 168h.
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
