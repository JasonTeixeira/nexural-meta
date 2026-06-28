# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-28T10:03:51.033Z
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
- Fresh artifacts: 15/15
- Public repositories indexed: 137
- Public assets scored: 137
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 149
- Golden path: 14/14 gates
- Hosted golden paths: 78/100
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:463b7a28458370836912d6b9049057d0a8c622397d2ae8a485c67687169ae1da`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15828ms |
| golden_path                 | passed | 173347ms |
| golden_path_vercel          | failed |  77195ms |
| recipe_catalog_post_proof   | passed |    343ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   1771ms |
| db_proof                    | passed |    325ms |
| operator_test               | failed |    355ms |
| maturity_lift               | passed |    331ms |
| daily_operating_loop        | passed |    320ms |
| portfolio_packaging         | passed |    332ms |
| public_proof_export         | passed |    330ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:b67d0d86ed193e989680f0a28baf649a3ad8e398fa96be998a51f32543af7463` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:3c4c3de76675926316507e332087182a77b8bf72300543a3826e84dc28a6d088` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:81640b4d5a0edf09329fe4f88232a5082f5576318ae1f2b97b79a06e336a86d8` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:0e70138b5ba5dbf9d25378cc81ba66c75843305e35237f655a511d155af089c2` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:50715ead26efd72761b120298f17436d4e3a7bc038abb9c141d6b683a4660536` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:cb7eb2065aa6a049ded619ad07f502a1c9ca5b6a0597d379fb477b49fdc28b11` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:f922bfe28a1fc9eb2df03784059925bf69b225c0a93752798a8ea3e262616ce4` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:e91165506e60bdf8c492d6c5559bf182af67f32b8ed38e450070ef168effde52` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:2feaac0bfa9c5b17b148f2db0550a84126940633ac6f3d126762eb0bcb9a6c66` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:823d974ff1c6132a90ca1f6bd832c8343be7fe2d391c446833e198e0297f7ce9` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:7145e3c720621e11c8ca403ebfb528fa38531e35a958e7737ea521701676eaca` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:90a0af7a0cb2c83ac6aff7a985815f88caf2d091dd58b2c2ac7b134b4457a479` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:365092289b7dc6a805f85f53721e67e332158617bf5a98c9c0e5a504dc6e7b3f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:2feaac0bfa9c5b17b148f2db0550a84126940633ac6f3d126762eb0bcb9a6c66` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:97b2ef274178d09354105942c68187a33ad973cfbabd31b16feed758d3b7bff7` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
