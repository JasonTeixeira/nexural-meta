# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-02T10:05:38.707Z
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
- Hosted golden paths: 78/115
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b20ef39478259896ec06e2bff16f88ce47f1aef0be7981cfe379e00b5531047d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16981ms |
| golden_path                 | passed | 171252ms |
| golden_path_vercel          | failed |  96837ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   1851ms |
| db_proof                    | passed |    326ms |
| operator_test               | failed |    350ms |
| maturity_lift               | passed |    321ms |
| daily_operating_loop        | passed |    319ms |
| portfolio_packaging         | passed |    324ms |
| public_proof_export         | passed |    328ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:636283a818b8b814a717f5f0e30f5b76c876e0c23fb2ee670ae355e6a041615c` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:3356d319587d5e35e3b32a199544f4f0b12e5cb2130e840b5a460e10f50b1982` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:74c2a68b0eeab2b71b0b1f5d445b8b3c7f510baab87cfe0b663a1dc37ace10d2` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:6881de81adb6cb64d0ff3090a8e9db1efe0fb00ef4bff88b5e01e6419e1f4c05` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:8ca99192f07b4c4f1dad5b029a8929653cde1e062df8604c890fbf0d025e75ec` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:22ca606185abeabd3aa62bbe99e5ecfd03db69518798d3eb649e4faa2d2d4c1a` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:1a45bac0e72e26d4502a3cfe9046049bb036b53807ff69690e08f3141a17adb0` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:f510fcf1f88a1ebc94d1e24b4bd1894977fd4c579b3ab933578006b6e45ea4a2` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:1e381f4fbeee0edd3eb93bf90b6ab7ad6fb194577b9d74b67907027bb095d34c` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:44db1df0f57d4e762c3ecc3c3e32afadffe6c5781a54fb630e387326ea48a981` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:8694f2114ef91c872244e58cfcad00aac703551b77119474fa3fb35ec548d1fb` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:3b65aedf2920811a5ce803c26bb5e471a742f21417667ee195f8e87628e91d21` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:64a6f426203df62b89b732d9df9bfe004570fc53cc0dcc8f9a8e8dd7de6718f7` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:1e381f4fbeee0edd3eb93bf90b6ab7ad6fb194577b9d74b67907027bb095d34c` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:a0b4aee8967c997dac262d629bd2a7e73d058768f63850b23b5ede4ed161d2c2` |

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
