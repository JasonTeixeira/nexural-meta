# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-19T09:05:41.284Z
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
- Public proof hash: `sha256:563b142e4d8038f41338f75a89bfc7118ca2c21c82bbcc66c6f332d112854fae`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17244ms |
| golden_path                 | failed |   3976ms |
| golden_path_vercel          | passed |    329ms |
| recipe_catalog_post_proof   | passed |    345ms |
| resource_library_post_proof | passed |    340ms |
| proof_environment           | failed |   8220ms |
| db_proof                    | passed |    327ms |
| operator_test               | failed |    361ms |
| maturity_lift               | passed |    328ms |
| daily_operating_loop        | passed |    327ms |
| portfolio_packaging         | passed |    343ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:6d9faa841d4790c869a96c748b14902013e73ac13ba3f6476d11dd1ecf07d33f` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:c8072868957e640e48e0c40231d90c48e81caf0097431e5dcb36354a4a680e15` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:26aaff613879a4537ca7d813baf59b1eda7ed296fff5eb6f85d651ac4a495de4` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:20a5a759a11d34f74c5feedebe059c72d9edff33e744233e38b9f655c820c347` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:9a474f12b8e9fa8da240462d518de5165e0bced5264f3e658ddaa0b9e658345b` |
| `data/golden-path-runs.public.json`              | stale  | 2013.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:8ba23f5c30be4b141f91a85072bdc425161ab11857ae1f3bc4195b3125f71fd5` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:09853405d7929318d7bc31e4075b9cc8b216f40d514635d3f880eb1136403cc2` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:9d29661ab7576ed462df54f1240f24d2e47f3bc7ca1b614964714f27af502dfe` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:4a09d8ee4d0ad10426355369c9627983b982cc6f289f9c386861634a3baea7f0` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:e7262e0d0b028115765f686a2d908026ed6c8335f584bba32ccc5dceeab53749` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:d0c7c050bd5526ecb163c8e0ac76bc4faf498db6722a1ab1c62862ffcef5fb4e` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:05ead82733ead8bb97fb859f8833d26fa93ab42138fb92c0b915060811e415a2` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:9d29661ab7576ed462df54f1240f24d2e47f3bc7ca1b614964714f27af502dfe` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:e172da83aedacd660baafd779f8943077d170d3643d3862d6fe638fa0d3c9de2` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2013.9h exceeds 168h.
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
