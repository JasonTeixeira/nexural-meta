# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-28T09:02:47.903Z
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
- Public proof hash: `sha256:5d2057b22acfb1d30302004461299258e192afcce0cfdf49e7056170c74e59ca`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17654ms |
| golden_path                 | failed |   3751ms |
| golden_path_vercel          | passed |    329ms |
| recipe_catalog_post_proof   | passed |    341ms |
| resource_library_post_proof | passed |    339ms |
| proof_environment           | failed |   9398ms |
| db_proof                    | passed |    323ms |
| operator_test               | failed |    358ms |
| maturity_lift               | passed |    322ms |
| daily_operating_loop        | passed |    319ms |
| portfolio_packaging         | passed |    331ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:9f419c046423e90ae3b4d3f05ddbcead3d7b76214dae47d3b2eb04d209acaa1c` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:cb1970a6f3ea12cb8b0caba607742002887905ab06e60c6ba69c00869d9a5571` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:dd1bea6d7299893b63d4ffd121ebce1491fa2fc648698b48952daa94e1d087d0` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:dee8201d69ff3de2d86405a3cdac2ee77e6721ae8f5434c9a3efd7bf9e599004` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:08ca780225ed9a4f16cb2b8960eaacc8ae2b1b23c5104cf7d00af9f7e204376d` |
| `data/golden-path-runs.public.json`              | stale  | 2229.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:fa1e1514ead2a0e0ffe434282a05da88f20b109eec2c5ce0d6968ea56ff3857f` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:a72802f1ac234a6cda370bb8f8009c6b6c141e5d969d6b03855e46b9be51f66a` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:168ca3b4109bb1ba5e69239ba5f182dd63f04239c62a8d61bf4cb91c416b2cbd` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:b131260e2270041b808addcffea690e6f57faa3b04cf87c084734514c46cd9ae` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:f26e3d8558cbc5361e47ce90d9d61ecd77b9611e5d9520a40f138f7fa9b15305` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:e92c1202720b5f397ac225a495e2f3d08e525b5b0eb320c1462a5d4f2fea443b` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:b4739e70a4c4342cbbed47a325f8ca0228ace2d5441bb9c2e90d4765c1bb0a30` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:168ca3b4109bb1ba5e69239ba5f182dd63f04239c62a8d61bf4cb91c416b2cbd` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:2ed0e2bfcd186983378587b18381b67f2dc070c54448fadce43e7e99a2a998c9` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2229.9h exceeds 168h.
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
