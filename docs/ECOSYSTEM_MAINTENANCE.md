# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-03T09:02:42.520Z
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
- Public proof hash: `sha256:c816785a2b570580a08dc2fd0c88a080275a3170aef2185b637cba755369db58`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14338ms |
| golden_path                 | failed |   3567ms |
| golden_path_vercel          | passed |    296ms |
| recipe_catalog_post_proof   | passed |    317ms |
| resource_library_post_proof | passed |    302ms |
| proof_environment           | failed |   9122ms |
| db_proof                    | passed |    294ms |
| operator_test               | failed |    322ms |
| maturity_lift               | passed |    292ms |
| daily_operating_loop        | passed |    288ms |
| portfolio_packaging         | passed |    296ms |
| public_proof_export         | passed |    297ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:112c3383aec4b625f78ce127ceb026c64178ab2521e3107df1096d3c013de438` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:3ead1ee02ca4841cf1c479932251cf88277b70f63af20c3be65d249995c66232` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:e479c59478b4361d78846c2b1f29c73b157f68ab8e1a0663315b2266165a7fca` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:849cfbd4df4c0256b2451335e8b61f5c003a51f590658e85e8149c6fa215eff5` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:90638ce6c4bd64d5b01cb36275d8f590f962d7d244373ae7beef9d785466860d` |
| `data/golden-path-runs.public.json`              | stale  | 909.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:1a2068dc263353fb87b790983a4b4841e0a75c0d83df8e8917a139aa60756ab7` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:485524feb6c4febda0b4905747be580c185db33504ea006b5f76f1dbc7c2d60d` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:91a3da3c2d2fbca2f0d2f58c2347a106e9a7bafd8bcb377fd24d6abfea3b2cb9` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:5091348c46406a85193ec7adc6366c275bbeabeb90ed1f95b0f190c79ca3ffb8` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:1b475b2a8c61bba3a3b50c920dbbb5c2e6139dab4835c7bd904a50d6a2154432` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:e98c7459a0644304ef709c6c76a7128adf1b1ec4e8121eb294e1a463b700c58d` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:54dd758f95a0108ffd1af3e41bfeb81cb0eedf1d52ef262dbf4510ff4888523d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:91a3da3c2d2fbca2f0d2f58c2347a106e9a7bafd8bcb377fd24d6abfea3b2cb9` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:c24bfda321d8583294aa70d1b531ecb11bbf9b549d82d5771d745b9df8e21c0d` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 909.9h exceeds 168h.
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
