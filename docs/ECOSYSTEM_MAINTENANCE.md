# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-04T09:52:36.132Z
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
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:6d2c146332e657eee3a992de16851266079567d0561a90c00536e3c290c58256`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16634ms |
| golden_path                 | failed |   4344ms |
| golden_path_vercel          | passed |    312ms |
| recipe_catalog_post_proof   | passed |    323ms |
| resource_library_post_proof | passed |    320ms |
| proof_environment           | failed |   7978ms |
| db_proof                    | passed |    310ms |
| operator_test               | failed |    340ms |
| maturity_lift               | passed |    306ms |
| daily_operating_loop        | passed |    305ms |
| portfolio_packaging         | passed |    310ms |
| public_proof_export         | passed |    318ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:ffb30fc3aa0b0f7abc52217390c455334e24a30ad34f97f6a96d73be98ab4739` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:bd67b05ce6739fe3db1c8ba03445e47f67c8fe5d1776217b87f9da211a988aff` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:11f1c0ae3eaf99d7b8ce4c96a5ebca7b83403dc4437b2ee29102c23821481bf4` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:5795a0711e5257c2c0211af8040b383b186270b8af470dac6779aebf9d62a6ea` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:b08dfbc0e6f91551ad7d9449bdea9152386ef7de758ee67487f347c5887c3955` |
| `data/golden-path-runs.public.json`              | stale  | 190.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:cb55b477c9b4bea71747b40e4b33f054553c9cfb34afa2bb7abf4a27ff56a848` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:f286b9686692741a0d5a50d893a98feffdcf5b0b6a9f6def23474c4b08e790b5` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:e2d09a72d4d9417a590139006ecc61368f6f03ad67a2c67c9469cc3faf3f27e1` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:9646f24a7f6d7985ad759efd953e621518799280d82f94ed998043c1376b4097` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:de4ed5a42ecffe815a4c7b7c8092443fc3230bad6370313ca566d54bcf2b529d` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:8d2af00524179f588ac4dabf2f81dd3535cd66dcd5cee85097d92d642dc6c852` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:4db17968bd6d069ec19073944d2dadc7216222000e00955eb6ab5d01372bc260` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:e2d09a72d4d9417a590139006ecc61368f6f03ad67a2c67c9469cc3faf3f27e1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:4fece140d5381ee6c2b6417f09049ad8eb4832d5316743c136c6872af290bb70` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 190.7h exceeds 168h.
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
