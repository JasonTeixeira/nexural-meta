# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-09T10:08:47.600Z
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
- Public repositories indexed: 157
- Public assets scored: 157
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 169
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:3abd69507ccefd2d0fbca4ceb48eb953d17a5a5820f682ef8bc4a9abcaf768c6`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17680ms |
| golden_path                 | failed |   2864ms |
| golden_path_vercel          | passed |    265ms |
| recipe_catalog_post_proof   | passed |    289ms |
| resource_library_post_proof | passed |    290ms |
| proof_environment           | failed |   7907ms |
| db_proof                    | passed |    276ms |
| operator_test               | failed |    304ms |
| maturity_lift               | passed |    267ms |
| daily_operating_loop        | passed |    255ms |
| portfolio_packaging         | passed |    270ms |
| public_proof_export         | passed |    285ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:18a00194dcf762e75cbb53d69f8ae5a6136e19c329b84d882701f61cf1a3706f` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:bbc473009ceb4e497d5da9402c3a2d88eaa6a43a67920402212ca47e629711be` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:1d164c52051310fae264392e0418ea49a326c560f010edb1baa05754f19c730a` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:73a85623979faab195c11a46df24bc922cbd918479e10fee78dbae745629a356` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:1c7fa198285e2b8d3c6d5183ce08ae3aac15b1b8d9336b77b78ff1808d5d1178` |
| `data/golden-path-runs.public.json`              | stale  | 2519h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:742516a6fcb6c639ea9fdac6950b5833b70f63bb906b229c163f27ee2218155f` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:2e6c3a6aaf71d2eed6f0106a45d89a87b0a2bc2c4c5212e4e668901939a7ecd7` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:96d5650abbdbe977fe6524829b0eb7b83814b51e2df1c90ca3a4dbb79ee349d1` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:bf531ec8cda56e841384faa1b56c150a6e1705c03049dcf346da82cb0b03a5ed` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:f9d5ef2e8ff7a3954403dd54f7046d88a5d3b3dede1a5c6f600b46a273ae9420` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:8ee7736080e24620735f9b542c5f09c4fc864542793c7d6876db2b7efeb04a8c` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:85598d5c9d0d82d85385b4f6edc098c8e5fe6427c6f0297ea1f670839b632011` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:96d5650abbdbe977fe6524829b0eb7b83814b51e2df1c90ca3a4dbb79ee349d1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:ae1a32a9cff25b2603b2fdcdb052d2538ddc4190f8ea03a8501da3f59855ef5a` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2519h exceeds 168h.
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
