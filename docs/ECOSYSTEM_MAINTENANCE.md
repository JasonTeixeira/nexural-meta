# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-04T10:50:41.990Z
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
- Public proof hash: `sha256:dbeb7984288bce0f05066ccbe66cefb06fccd87ec87c728e4b2ecde26fa6b50c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15615ms |
| golden_path                 | failed |   3335ms |
| golden_path_vercel          | passed |    243ms |
| recipe_catalog_post_proof   | passed |    252ms |
| resource_library_post_proof | passed |    250ms |
| proof_environment           | failed |   8155ms |
| db_proof                    | passed |    240ms |
| operator_test               | failed |    263ms |
| maturity_lift               | passed |    336ms |
| daily_operating_loop        | passed |    260ms |
| portfolio_packaging         | passed |    874ms |
| public_proof_export         | passed |    247ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:97ed580d7db72cba6a645b15c94e64698edc8b882b47f34a46be26a607c2cc1b` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:750e7259af27ddd284bc223b56e53ba953a6d2cf6deb7a7140a4976fb24ec434` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:9faedb478544bbe5da804a796c0ce2c63220923d0f15a5a7c44407eedb0eb9c0` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:ca97334cb845ebc16475b42b6962833b01ebd31cf79148cd6d8cdce8e1936bc7` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:6dc4e1b0f8badb03a599a5efbcff31f11e531375741f3d7ca35012e36a4d128c` |
| `data/golden-path-runs.public.json`              | stale  | 1655.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:7515b243a0b58aef7e70e2a609e234eab771fcb60e7de20514114f58bd46e803` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:6a402b85ccd1d29609c81cc1e1db96d3dfccbe44b5c49544cadc6ea0cf3acb79` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:8ecd1eaf50b438e3ec32c616fb0f6f1ed7a60b51ff94919990358bf0237f61c3` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:8f102d2ffc22ce402e6c70b2126421e1b00fcbb71383d2b95bf9d6a7412002fb` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:72e540ed2f93051fddd83fa116cca906ad02b94ec4a04f33d42873a0a0d02c8c` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:7e5eedf28c44f46da4f371ddc76720e6825a9b3070378f08b37757a68fa6ce2c` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:03d337e1708c2e6760aa80167d84b3845d8a5b8e1a7d62a9616d6c7f9013c27d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:8ecd1eaf50b438e3ec32c616fb0f6f1ed7a60b51ff94919990358bf0237f61c3` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:889eb03fd291e592708a9f9a88c5b02c914d1f011ab796b0a8cde96bc21c70b4` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1655.7h exceeds 168h.
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
