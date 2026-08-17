# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-17T09:13:28.045Z
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
- Public proof hash: `sha256:f41641d54573c81e992d5eec694b1db19b539f3139723298034f75e1726f237f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14041ms |
| golden_path                 | failed |   3452ms |
| golden_path_vercel          | passed |    318ms |
| recipe_catalog_post_proof   | passed |    328ms |
| resource_library_post_proof | passed |    351ms |
| proof_environment           | failed |   8148ms |
| db_proof                    | passed |    307ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    305ms |
| portfolio_packaging         | passed |    315ms |
| public_proof_export         | passed |    322ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:9eb2c3af261f08e84c3c1707c3548d6a4de275617b47f9181d99b008e8ad0b7f` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:cc5c019803de6df75578934da14ff5849e4eab371f54bc958495ca0e9ec18d03` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:50e1ccc3fa9525b082573c4e4c55873e2f0df9897286c2a82cd8637e618a8489` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:67df74864d1796af4641f78636e3dbfd43156a7a877680efe87a51c6736354af` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:e03ac85e9c31c629a60e3024f3f0bf13bcab510faede080409c61aee3d27730d` |
| `data/golden-path-runs.public.json`              | stale  | 502.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:1a1de9f9c605f5958233ad8c21adba6fff1ed7b0256c84c555aa07c5d955208c` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:336324c5f9f73048c22b3ddf82c4db677a4ad2ce8ba90c20cbfb6d62dc672cad` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:7ac94cbb9a1aa83caf3f4f2b08e0ccc70aa9f066a82c04e03db5ea8f2b7d6150` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:9392c3efd01267d8724f5e312092569198f15e821e056d138d5967b3368a1a18` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:d002301946a8d5334f25e764c952d52ef57509b0af3726485d5dd76f4ae0ee05` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:92976d19df2e677a8cf2ab5bcffdfa13673a88e2f9c4ab02a1e2519a8aa6e435` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:985be7935f3b2f5ba59cbbb7de757f3ce2aa1b26d140fd01561ca4e2d2652d56` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:7ac94cbb9a1aa83caf3f4f2b08e0ccc70aa9f066a82c04e03db5ea8f2b7d6150` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:eb833fc4176f9f82cdb7f997c9a0feccde8f71254b6ed4f6d810756a2896f31c` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 502.1h exceeds 168h.
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
