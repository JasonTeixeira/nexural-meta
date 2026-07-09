# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-09T10:17:38.828Z
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
- Public repositories indexed: 138
- Public assets scored: 138
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 150
- Golden path: 14/14 gates
- Hosted golden paths: 78/139
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b8a8e78edf4d3766dd96a692b27d5d0fd314f0d7b0c2344131f4747dd14d0494`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15713ms |
| golden_path                 | passed | 147450ms |
| golden_path_vercel          | failed |  81185ms |
| recipe_catalog_post_proof   | passed |    299ms |
| resource_library_post_proof | passed |    299ms |
| proof_environment           | failed |   1532ms |
| db_proof                    | passed |    287ms |
| operator_test               | failed |    312ms |
| maturity_lift               | passed |    288ms |
| daily_operating_loop        | passed |    293ms |
| portfolio_packaging         | passed |    296ms |
| public_proof_export         | passed |    300ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:a7bf61f28cc433f48a3b78708544d7ccfdf9218c4f47c27b6f587e8fd7634787` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:2194da6a1bc75b043d97adb65da697e16f629d80ee635d89b522c78074cb5dad` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:6264af0994122d80ee182cfb94b15f3cf5b3902763e93335d79de3d3246478e9` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:73c0c2b0ee80235197fd8a61ffcc05eb137bdc1da586d8349e7d33b3b5901455` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:13f72a38c7ee66e1ec1b9bdfb4f89d145580aa520521e894ddb1bffe05e51cc1` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:8b4b6faa25118f73340228898181adde6056a15e506c9d0154c218562dfad90f` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:9105812cee9cafd2d40d29ce0e29bd33746d4cc1edac74e4fe0b26d55176104b` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:f74d007f79420b1e1644b6a1a5946a1cb0c8244d2047bf0c6ebd2e15c8d57259` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:d57118e441a4d736a9aa4e41410689ddaf23056ec09bdf7ca98d1f23e3bb4295` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:eaf946b9047a2817377818a89febdc163ec7332cce31d1542b318506549a9cf3` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:50974622927018079ec8a7bfc9ccebca1e0f5bf4eba63424d40a7c187c3427e6` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:f3f44a9aaf32109bfa43ad141fbb2f3d80a452d15b49dc332d528dcddabb70cb` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:ad0ee80691b1311561a9438f84550ecf8de8b454f2e388389154b37ceb5741d3` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:d57118e441a4d736a9aa4e41410689ddaf23056ec09bdf7ca98d1f23e3bb4295` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:df4ede17fff0569297e6d0c36fe1309ed8d414106f6cd29a0beabc9160c5e0f8` |

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
