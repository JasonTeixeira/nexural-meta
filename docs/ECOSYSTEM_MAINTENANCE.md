# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-03T09:03:15.949Z
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
- Public proof hash: `sha256:37150e81a1ba7371df074b9ef3d8fc54914b113c53e29a3f71c8b488e62b921a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15997ms |
| golden_path                 | failed |   2824ms |
| golden_path_vercel          | passed |    247ms |
| recipe_catalog_post_proof   | passed |    256ms |
| resource_library_post_proof | passed |    260ms |
| proof_environment           | failed |   7963ms |
| db_proof                    | passed |    240ms |
| operator_test               | failed |    265ms |
| maturity_lift               | passed |    241ms |
| daily_operating_loop        | passed |    237ms |
| portfolio_packaging         | passed |    244ms |
| public_proof_export         | passed |    246ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:1539018e47528e82bd85274c60c2d41c7f56038e50473a2730ce5f52263320bf` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:dd84f9e3937314e390b74e33217f2ffabdc348d0fc8cd48ffd3297bb5503f31b` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:6b8fd127e9a3ddcf49bd615141dc79f3bb7d878857e3feb2f15b3d73f01a51e2` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:60ac6066b0fcd5d8a16b5948778e86b6d7957e7195eb339b998c41f9d724f1c5` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:d4ddd6b3b4413588494131ae7cdc03c1ff9bdc7e41026eb4021b7720303f8fa0` |
| `data/golden-path-runs.public.json`              | stale  | 1629.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:f005669f490d8aaa74caa91176cda0ece4c5c896d89fac12f4e8b46ee92cdd2e` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:62e42487d5f662ffa5bf8c418eacbb4f489939dbd53b4af5c8578ee901140e47` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:c97f7553cd852264fc164a87d63d1ee7387492642a8d98859005e2c64477d434` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:ef9bfad391525a1e7d9ef4667db34cb8e4ddd3f0f28d1bd966f0f8b9afdb5cae` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:525eb508c8a7d26b58875c4625a34a87bc149b2e3c93dc456b6ef02aa3c46730` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:f0b89eec6c1ab99372f09fd39accf4d874ca164680f5e90bfb2692d928cd7e19` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:25aba9856168b1e5a5808a0fd8834c0e67b1004c9aa089a8d3a04d29c8068bba` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:c97f7553cd852264fc164a87d63d1ee7387492642a8d98859005e2c64477d434` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:e91749a66b538045b21b079bda7a377258c97443cccba038fc08c51489f47dd1` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1629.9h exceeds 168h.
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
