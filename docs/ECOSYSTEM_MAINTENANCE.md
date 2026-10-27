# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-27T09:04:11.159Z
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
- Public proof hash: `sha256:f0526d803540e86ad76d2014bfc19d1273e0d017239b3297ad85ec8697de9fd3`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  20861ms |
| golden_path                 | failed |   4568ms |
| golden_path_vercel          | passed |    338ms |
| recipe_catalog_post_proof   | passed |    357ms |
| resource_library_post_proof | passed |    350ms |
| proof_environment           | failed |   8495ms |
| db_proof                    | passed |    334ms |
| operator_test               | failed |    369ms |
| maturity_lift               | passed |    338ms |
| daily_operating_loop        | passed |    332ms |
| portfolio_packaging         | passed |    340ms |
| public_proof_export         | passed |    344ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:976969321b6fc9be4b9f0b7340a6effd145b17d320fef50b25bda543ee8da913` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:c35e3b61b1160614938e710203c5bc82030781dab1dd06fcf193b1a262dd80cc` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:d3d3098caa70e5e26332d965aa1bac2ca9a85bd3225de675c5dfb5c329fe34e8` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:4b664b35dd23e510d82f62590b371c5ae510446025a56caccf64633623bf4ead` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:72e37b50469c8c0fc8eca632b0a1a2f5f378c725d23590bc953c66b3006606d8` |
| `data/golden-path-runs.public.json`              | stale  | 2205.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:6b601e0276449bda592cb5f6f5736ee5962e1a9af22f04bdeebefba9569be485` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:f903825a153cad882b5cad4e92161cc20691e0d3b66786c8c8aa77d8d2641f34` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:90bc640a61435546f5f2415c5e355661e1d547f0fbe75609403231a197f6e13c` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:dcc9b1db2cfc57d87dd8f5a158678af3b948b7143bf6638f2798ef07d4daeab6` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:6118ec6b4b6cf6a80b6d5aff2aeb065e3bdabf4e738081cf6e1d2401855821e5` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:2efcb35c429a790b66908cc13acefed942303656b0ac489d779fddc09bb65186` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:cdaf6f231ddc49531aefac486bd46dfc8c2e08986b346c10a806b154d19c4bfb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:90bc640a61435546f5f2415c5e355661e1d547f0fbe75609403231a197f6e13c` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:503a1a81bd649aa19b9c680c7577441cb711a3e77c6d671ad89df4c1725e5c98` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2205.9h exceeds 168h.
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
