# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-02T10:09:00.701Z
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
- Public proof hash: `sha256:560dcbd183e5b56a535ba121555ad52a1a75e6797c22403a783d34805d19a561`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14197ms |
| golden_path                 | failed |   2702ms |
| golden_path_vercel          | passed |    279ms |
| recipe_catalog_post_proof   | passed |    280ms |
| resource_library_post_proof | passed |    281ms |
| proof_environment           | failed |   8474ms |
| db_proof                    | passed |    276ms |
| operator_test               | failed |    300ms |
| maturity_lift               | passed |    277ms |
| daily_operating_loop        | passed |    285ms |
| portfolio_packaging         | passed |    280ms |
| public_proof_export         | passed |    299ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:1a5e7f8bb4c997db95d2a2eaf14cea7a3a90fa2ee960a41dea069637944ef650` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:d1023dc4899afc4a04bc4f1e749a6771c951013e9b37f14deb4df8cac9139c45` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:76bb84bb689c40b2343920d3fefd651a0d05db5bedc35b7ee2206dbdbd5babf4` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:43d32d6c817a87ce9012b047533151cbf62a23833a030a540717c793131239a4` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:6f1efa3c7932d7b196844a4a8dedb0634f68156fa1f1005e865b6abf9e213c10` |
| `data/golden-path-runs.public.json`              | stale  | 2351h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:e38a05b383e8ab29a477c6f5bd811f1f2324553475232dbaffccd020d4f8204b` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:c44f87747654b1944db81552dc6e456afb8efdd7ba23ecf8f77c42d0fb07c42e` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:5eec92e364f87d2c66b78321cccecfa9ba321cc4ddbd77ea46a1224d368cf779` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:1f2cf3e72f0f11a23e70c62457a925930689893f2f9180749fd25530918b9205` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:43ee4db617a0aabe9bf14fb45dddf41a03b989ebf01be39fe90574b4a7f360e3` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:cf60785aebe44522ee44b58550912c3672c01b5dd9d35ca4a0049213f20aff9f` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:4421891968f132960f2e3f62b29f882a569169ad5cdcdfe3599ebcc1f6759718` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:5eec92e364f87d2c66b78321cccecfa9ba321cc4ddbd77ea46a1224d368cf779` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:d1758bf2835a1d30b9122ac8c47905798035bd516ed7db6e4f23a9f421ef5565` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2351h exceeds 168h.
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
