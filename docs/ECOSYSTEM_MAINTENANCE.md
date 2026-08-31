# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-31T09:03:15.847Z
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
- Public proof hash: `sha256:24069d27aea88b9e80bab0c84501d785f0e7109ea226486c9e7d309b1b418f7d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13777ms |
| golden_path                 | failed |   3633ms |
| golden_path_vercel          | passed |    319ms |
| recipe_catalog_post_proof   | passed |    337ms |
| resource_library_post_proof | passed |    327ms |
| proof_environment           | failed |   7992ms |
| db_proof                    | passed |    319ms |
| operator_test               | failed |    346ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    315ms |
| portfolio_packaging         | passed |    322ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:14bd62679c4e2a6c803af330b81bde03fb1dc391d03db1d6aaad9722ba87e6e6` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:8fa58939fddb96e6ff6475f78b900c3d504097f7afdf60281412e6245715a5ad` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:6b652600640e0da7eeb0ae5429e19b835339d164e22ae89e30363f45784ed41f` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:b3157e954f8dce93768d857b7a9c0b02968400a43fdb3a8db559ffc552634ed6` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:142cbc36ea2501d1f973c4992237ba0b173db066ab843edc8a0631a9703023a0` |
| `data/golden-path-runs.public.json`              | stale  | 837.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:acb28991fbfe3e3061f80d1a95767b494a181b6e4a4db1dcc1d503c6ace645e0` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:7d38150cfb7f5a85a13c46835f65ab3c5237b1d8f3d2159f86a2171cf73b3bd0` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:b1ea629ad2d874272172ce20dbb2c0560e0f8539f88ff61f52874b5a55b77568` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:560b6e758abc7bad2fa85084f03c57514e4c3c58c5d31471e25a3a52f81c8d99` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:e533a162c13c6df6eb21cd138db6cfbcc27d5c0317de64364bd2020ce41d280d` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:2fb570b9bc3b48ab54ef1a6cde137508f920152203384cdf394f7281da060251` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:47685dd62913e5551bbc711b92a164d0e9f31d2bc9f86bf6d8d91541b5159574` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:b1ea629ad2d874272172ce20dbb2c0560e0f8539f88ff61f52874b5a55b77568` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:bacddba0e3452fb9ab342d2ee97f5bd7b63b47e51768df9a330715bdc6b23461` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 837.9h exceeds 168h.
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
