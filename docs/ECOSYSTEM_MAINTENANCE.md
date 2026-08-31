# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-31T10:14:11.090Z
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
- Public proof hash: `sha256:a12fa8ff3d98b6e9f6f44477accfce5dc8ff0c9c5e2452518a67f3e9824f8ee8`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14209ms |
| golden_path                 | failed |   3610ms |
| golden_path_vercel          | passed |    324ms |
| recipe_catalog_post_proof   | passed |    334ms |
| resource_library_post_proof | passed |    332ms |
| proof_environment           | failed |   8080ms |
| db_proof                    | passed |    332ms |
| operator_test               | failed |    356ms |
| maturity_lift               | passed |    332ms |
| daily_operating_loop        | passed |    331ms |
| portfolio_packaging         | passed |    332ms |
| public_proof_export         | passed |    335ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:dba7dcc6e1e8ce54e337e34f88f4158e844cd2225ddddc5a4cc6367cfb11fe16` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:98dced1a4a9d305f197d9ade2ff883dd7460e02f07599e580d7a90b97f129155` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:d87e6c8a44f767a5c780e3dc9e4f312b332d2605a7b24d61cc59ca9e2ad28101` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:88c9c1a73cdff9df0cd576fc23eda7da08f536232323346a364fbc79e267fa9b` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:44e1f2c3b50e545857bf9566521201bf29f47d34c0a8732684fd0ca052c48197` |
| `data/golden-path-runs.public.json`              | stale  | 839.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:13e0ac22132dcee86dca3fb7ab74e4fbee6d724b0d27cca3125c8f90fc8df2c5` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:c713fb142752cd8f3f94e1383c9fc55628d4ee8d45e939c7038bf0271060b459` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:45da13a5ac1b8c8296c87d72e2c438f7ef0a91a743c2ccad1df3ac6ad52ec05e` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:a4ccada1b6d373360f30ead080e8898561692b780e195d393a55381a7f243b64` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:e1daa75b743fccd7f7ba198229169222ad1a838f724ad85472d80701ed645e7e` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:d47aab851a2d2fa738c0e551f4c7f43b4f3022f24e6d4e9d6d8f755ad4124897` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:8423f4f6d052fdad2ae7d080f088a476557bc2af65c5d7a6e5d05ed4ec05f81c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:45da13a5ac1b8c8296c87d72e2c438f7ef0a91a743c2ccad1df3ac6ad52ec05e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:6b38089194e269c26d1016e14b5d165a8dc8adf2f1e4d130fd488d443e771cd0` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 839.1h exceeds 168h.
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
