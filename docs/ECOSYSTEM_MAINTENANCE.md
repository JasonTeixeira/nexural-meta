# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-25T09:02:46.406Z
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
- Public proof hash: `sha256:6f1f6cae82b5faffed9c3c53191ab7a382c9dd1eb5284d1575fec48d4cddfd62`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16553ms |
| golden_path                 | failed |   3623ms |
| golden_path_vercel          | passed |    327ms |
| recipe_catalog_post_proof   | passed |    339ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   8231ms |
| db_proof                    | passed |    323ms |
| operator_test               | failed |    354ms |
| maturity_lift               | passed |    318ms |
| daily_operating_loop        | passed |    326ms |
| portfolio_packaging         | passed |    332ms |
| public_proof_export         | passed |    333ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:110878b2a0422b3e1a5911577e1b246705dfbf37718e76f472de00fd729521df` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:f053d4de0a606ff46eb9faeeaf079ace30a09013421d35c2813e092aa2c27b0f` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:253e26c43ab5e7caf750123049258522c72cfa22583eedcd522a2163c6189dfb` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:936ff37bcef7b0b1a29bb10f545006e67c1801b883e1023f665e95a49d12863d` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:73e72d162b8c848cfd28373adb91c14db12ec70bf065e1a6dccb5380882a7a5f` |
| `data/golden-path-runs.public.json`              | stale  | 1437.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:ac8908750a4aec253168a97bc17bba7e788c726e3428aea042dab362e48e3130` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:027c9c297a6c879a860028b128cc9ca705ffff4e8124bf3cdd0239e390639bd0` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:65caf8c7c7bf56fe5f7dd5d4532c60d4a41723aac6dd361e13eb319c9871d3ec` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:c56ff2637daae4e998b10e7970cd4def1344685169bb4459a1cb974fe979de05` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:8f9340a74bf8a8183c8e067521ca67ddf7424980d38038650e8bfe71433cf6db` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:10b826ae96e09b1ad60b47cf07be8b679ae4b9465465123c77135eb7eecbe5fa` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:4114ecfe944630bc055dcf6662a82237170e350203a98cc3a0c8e5050d174ab6` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:65caf8c7c7bf56fe5f7dd5d4532c60d4a41723aac6dd361e13eb319c9871d3ec` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:c346979265e25e8b9368563b088e3424c2e92908b75237729e5d3e4da6eb4027` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1437.9h exceeds 168h.
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
