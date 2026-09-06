# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-06T09:02:32.846Z
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
- Public proof hash: `sha256:83a09bbcd1a7f826ea5fa2b196180ead22de6283ac4aa9ab44e1905e80d1aa0d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14446ms |
| golden_path                 | failed |   6363ms |
| golden_path_vercel          | passed |    293ms |
| recipe_catalog_post_proof   | passed |    300ms |
| resource_library_post_proof | passed |    295ms |
| proof_environment           | failed |  10831ms |
| db_proof                    | passed |    285ms |
| operator_test               | failed |    312ms |
| maturity_lift               | passed |    284ms |
| daily_operating_loop        | passed |    281ms |
| portfolio_packaging         | passed |    288ms |
| public_proof_export         | passed |    291ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:33576ca78c0ff0d3dd6c7e0db16052eafb8cd416cb6b453743d55e307ca50220` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:51c0e1b5152337ff69ee227c4e7bfc92f2d256b18fde17300c933a56c71925ca` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:d65f4e49601af1d4e79143d53655ad444aa1f57a5ca36bfed76ea8babf7bf98f` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:15b5d4d028228ee8a51fc333e099ce166e7ad5c0a9d3816e40e21d6ccb1fb46b` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:3f1959c350530972d2d38ea93221dc808bdb206aa969acd6a9fd073d39290688` |
| `data/golden-path-runs.public.json`              | stale  | 981.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:1ef2a590f4d2eefcc79996579bebc2bf7ffb6ab8067bb1e683570e0ee7ff472e` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:d83d89e2db68ee029f3294b331b847a0ecc15d914f6b0170ee5bbd0badd74c30` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:5d6a8624131b8abfa31ea57c1156ce55b69e6d75b100224b4f7c554c4de7b0db` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:4ff62e11c1707b6e08fa79404abd47cb01daf9b1b0ec5cc2d01601bcf6cd15ef` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:7e36eb46d01c23d4b7d478a1204115441fcd52a94e5144851e0f18c6b320aba8` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:319c28cd284b1a9dce1bf29e43c1d426d16e266d2e3ad6e228f78598ba81dea8` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:ce2f0a2684463ea2d5a245ca9806279ad41aa8861b67e64822ff4fbab1c0d48d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:5d6a8624131b8abfa31ea57c1156ce55b69e6d75b100224b4f7c554c4de7b0db` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:7249cc59b27a54df1c98084ef1fd4a0d2966f52299680f8e7a4c967ca9445ed7` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 981.9h exceeds 168h.
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
