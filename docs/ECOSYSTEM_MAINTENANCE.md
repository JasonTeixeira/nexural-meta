# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-17T09:02:21.650Z
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
- Public proof hash: `sha256:f0a016700a513b92a2e183e944f6ed10c037fbec672ebfb081acaae5289eeab2`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16879ms |
| golden_path                 | failed |   2962ms |
| golden_path_vercel          | passed |    241ms |
| recipe_catalog_post_proof   | passed |    253ms |
| resource_library_post_proof | passed |    250ms |
| proof_environment           | failed |   8253ms |
| db_proof                    | passed |    237ms |
| operator_test               | failed |    265ms |
| maturity_lift               | passed |    237ms |
| daily_operating_loop        | passed |    235ms |
| portfolio_packaging         | passed |    246ms |
| public_proof_export         | passed |    246ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:413afc15977d41d4a29b25679802a2023ab109c5d2a622321666ec773526312e` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:3ac98de8b167b061bfedf5a6fa16bb73b0b8b425ff59f80fd43ea705564c7a48` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:88b8fed90c9efb7105fe3ba0955764b5bfd73dd99355aab1dc817919d4b76566` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:7a90b81340346283dcab87d76dc5f63359f3f303f307c128228e1d73b3f3ee35` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:1890edcfe9c9525f64a9d117fce8f69219c914f15e2d30fee072911f05e76664` |
| `data/golden-path-runs.public.json`              | stale  | 1965.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:9482b4ee2c457d5225d8128969c25d77c79b636548539f10622e079900ff5e38` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:f22e187103bf7ed481362f09787e351a1cd5fddbbee9a8bd976890a3b591ab2a` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:6fcfca0073a059b2a35c9b0fcc14a2b104ad12e7ffcf350960cead347be2d064` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:db38e726a87403f9b9dc359d18624a6ce593ad7f902bfc3c6b3f7b3c35c75926` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:745d3cf46b4c5d443a387880cb1eccb89b3b06244bade0c9612fc7b3a9d36f57` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:8c03a034d3c74388332552a83a8285f561298d880ec858b21bd3e34a93a25737` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:4a69e34a856310cdc767bfaca374173055a96437db17b067716dab14f2c088d0` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:6fcfca0073a059b2a35c9b0fcc14a2b104ad12e7ffcf350960cead347be2d064` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:3bbbb71f368e2aaa08f1aaab80a9ce2e59d3e9367f0746a7dc12172bb42e75d8` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1965.9h exceeds 168h.
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
