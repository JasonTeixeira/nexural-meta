# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-14T09:02:36.948Z
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
- Public proof hash: `sha256:1dd66872ec9d54d440ab33b145d0fcc3e493deab532072865a5068c0b76e6724`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15931ms |
| golden_path                 | failed |   3362ms |
| golden_path_vercel          | passed |    247ms |
| recipe_catalog_post_proof   | passed |    258ms |
| resource_library_post_proof | passed |    253ms |
| proof_environment           | failed |   8234ms |
| db_proof                    | passed |    242ms |
| operator_test               | failed |    272ms |
| maturity_lift               | passed |    245ms |
| daily_operating_loop        | passed |    237ms |
| portfolio_packaging         | passed |    246ms |
| public_proof_export         | passed |    246ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:7d17fb2c0a3f4e2f73011f21f2ee5531cb07b2860bcc3c26dedd9bda8d495763` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:233de6ce5dda884f2e67ba62a32de3b3d30c03bcf5c886203c2c98bb51f9ffb3` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:54b57e9bafdf3e5f8e0b767db018505c45d74000a13a23b44eb61252e60e4fd6` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:9a3bbc62e6106a5815874106fb3c44bc0b3a9ceb7278b03561efc526c38e7ca1` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:32549986d820d34a72130dc2643a71185fb11df5e73097f901a0b615700a350b` |
| `data/golden-path-runs.public.json`              | stale  | 1893.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:6390e8fd7e57a99e4709ba418babe1d1ff1d18b07c4ea83dd402e123c2698537` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:73b32dcb65bd23076f7b2049aceb5dc0ca4a1865e86088f392a524c48b28ee09` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:57c4ccd46aaae77ec463a6a1204272da08e3c2ab204bbbfd88a32d1302531410` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:962968a097e99a84d825f8951d401810c1b50c243741b6435ea7d677b84f7bef` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:c1ff460416e7dca51dc4fb03dacceab3278f19974c3254732ab3e5255bf5536d` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:9c0b1f728cb47b8256c62fe8936fc256b9afd61d590fbd076a92b25ce2fa15c6` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:64a9c8f9407b8cf7b5d6f95bca2ba53432bd07be80d3b25d8a3666c3d9139fc4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:57c4ccd46aaae77ec463a6a1204272da08e3c2ab204bbbfd88a32d1302531410` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:9b114ffced195b7c99a55ce6c9f2dfb5aec74cc1aa0a92dd071d498e85386cfc` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1893.9h exceeds 168h.
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
