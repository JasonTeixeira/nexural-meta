# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-07T09:02:16.307Z
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
- Public repositories indexed: 157
- Public assets scored: 157
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 169
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:2c599b341add2d0ac46dc9031d86f5651e304144ddbc312084ef9912450555b0`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17315ms |
| golden_path                 | failed |   3033ms |
| golden_path_vercel          | passed |    264ms |
| recipe_catalog_post_proof   | passed |    271ms |
| resource_library_post_proof | passed |    269ms |
| proof_environment           | failed |   8301ms |
| db_proof                    | passed |    263ms |
| operator_test               | failed |    287ms |
| maturity_lift               | passed |    268ms |
| daily_operating_loop        | passed |    264ms |
| portfolio_packaging         | passed |    269ms |
| public_proof_export         | passed |    269ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:1227437e1b7263eca5981d2838d8e57046049e9f69b3239cefc267aad4d28635` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:54ed7f26114d34be2bd38985f7c0718e23b2ac3b3d6d4a221c63a02480f0af67` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:ddb9fcedc4feca9ae231a5df67473c88b2512704366142886b3d3ffe39a93567` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:46db1a9b869a9d64893c71a910e2a2d5a796704f2b0ef768308e97ebfd0a09cd` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:d4ac72e538129df8603bd41c9c88c72dd483b97f226f766676fd71747bf336b9` |
| `data/golden-path-runs.public.json`              | stale  | 2469.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:a7c553472b5e5666344d2b4e573176169b50182098fc0d85a4e18a555f397995` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:81b8a9dc1592ce3b235cd98d31933262230efae1f2ce7ae7e11f4bd7d7bf20d9` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:70892877c24950062e63f729ea5e5b9a8d756cb0f3f5f6289b4635095d225bd3` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:80d7edb4b24ba0d4eac80c1801dfe41595572a3a3676802d6c4d7348d0c4b2ff` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:6615159b0bcca7e8ea4778531b0e580ad68f74ecfc1c83cf8537b076b84ce76c` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:72c07c59ec1382d070aadedaa40eecf4164a74a2a83333b7256e56bd57c114e0` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:24ae76903e03966b38fca0801b6b138f241b391da1402545c8743876dd94e73d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:70892877c24950062e63f729ea5e5b9a8d756cb0f3f5f6289b4635095d225bd3` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:a6a0dee7eca00be76fb11a73dcd3b817bdc761bff562272c9bf9ff2043445e15` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2469.9h exceeds 168h.
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
