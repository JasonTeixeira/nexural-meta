# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-12T09:02:24.255Z
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
- Public proof hash: `sha256:01f9d57a23caf12d67a699dda182dc5aa0edb4a7d7a247eb45f8e66e555c1730`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16005ms |
| golden_path                 | failed |   3392ms |
| golden_path_vercel          | passed |    306ms |
| recipe_catalog_post_proof   | passed |    321ms |
| resource_library_post_proof | passed |    317ms |
| proof_environment           | failed |  10964ms |
| db_proof                    | passed |    298ms |
| operator_test               | failed |    333ms |
| maturity_lift               | passed |    300ms |
| daily_operating_loop        | passed |    298ms |
| portfolio_packaging         | passed |    309ms |
| public_proof_export         | passed |    311ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:ec033c5d9d322a1f4755a62bb25df9d5663d72767669ec26f8082810d6edb336` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:ec36d09fd97580a8c8cb1c0704b8eb6bb50be2288bf177133c5bc06c7cedf343` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:ed60bbef7b57e15e768db3231bf4ba9bc98dbdade56f1fc22fd09d4054bf974e` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6e011485d1775b9998eca07d85cc2ff10a392bc707ccbf96dea44eb0b029a6a4` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:565f223a6a87f5e15635ce3cb86371ea1424abc67fffa16a0cd27085313cf8cd` |
| `data/golden-path-runs.public.json`              | stale  | 1125.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:f0dbd77af1b276169d22f5bbbe8de77d3652c7817668fb1c08ccbc563c99fe7b` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:f905c5da82b20dc856dca853012008bc5a3163d05838c88a5fa67fa7b4f46f2b` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:11bd5e8fe3e013bfc5811d512bba6e3e5a0bdaff1977f138221dafb28732e142` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:cc5e130da5c81f49b8f3269c99f737641aac34f473fa60e7c3d6ce788ff1f1c6` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:3ab8c893c30b3eb5572c542a932338d49f09aa0076f9edd643dd3603a2acbe11` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:797124882b5274090183a7123c20a8501820fa54341498d1056cc8151e939381` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:93384fa13a6d6b36b801ab0711f32ed6487e58453f0c62a4f0a0f5246c3ccabf` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:11bd5e8fe3e013bfc5811d512bba6e3e5a0bdaff1977f138221dafb28732e142` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:6e679f1d5d73682f5552e7b5dda44fbc194382508dda8e3cb47e60b19b1c779e` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1125.9h exceeds 168h.
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
