# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-14T09:36:53.170Z
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
- Public repositories indexed: 139
- Public assets scored: 139
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 151
- Golden path: 14/14 gates
- Hosted golden paths: 78/157
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:3b86e5d9f69bd3807db75f2c86a19012fb986c4a6f2adb5809a4d309fe45a7b2`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17062ms |
| golden_path                 | passed | 156967ms |
| golden_path_vercel          | failed |  85070ms |
| recipe_catalog_post_proof   | passed |    317ms |
| resource_library_post_proof | passed |    313ms |
| proof_environment           | failed |   1666ms |
| db_proof                    | passed |    295ms |
| operator_test               | failed |    322ms |
| maturity_lift               | passed |    295ms |
| daily_operating_loop        | passed |    302ms |
| portfolio_packaging         | passed |    303ms |
| public_proof_export         | passed |    306ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:e291a1357e836e9e948396283cb20e9d245e13c7e181f93f1edd60ae32cd2672` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:a92d162ca994c57f32a1ffe3a27f1811dc0ab9f17fa1ad1888dc85d650480249` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:ff899a374462236ffcfce7b459f2c4ad48a854ca5edd2e05d5eb5f125a44202b` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:bbcdcf243b7efd7c97766d7bf1dc2455914c6d3423b711f05bec0de89ae63298` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:dbd20e577bcdd8e8dbf50dd5ef411a20e6d6b80778b4245cfdc3dc83aab8e29f` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:660d09d3b7e039ba401ab7df3e5f61f12a6f64f843a60b4939e706c05a5f772a` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:2252002a8d6c993d834edf14b7d847c1fd98fc6ece65b829a05a5ea9d3fa934b` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:14d59fb6f8abdaab3f34311f216e25768be511c5269101fbd0dee649a2f718e3` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:5aebfb24eaf8a149e5a155cadc5200c554428098a129a56aa13f5174f03affbc` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:7a5f677748517e6ee3107b0291e3c2a339503bb4175836a914c71539bd965057` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:f865403caddd64af421f310e6d79d9027a22697743d0bc4138dd7a27ad0612b6` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:0745d5cc956887d0d44016324706468834f944e098fbd3b2aa1861d0f3daaeae` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:bd375c34e56307f17903c6798e3394b464f03a6ca9c90c81f0e4c433047c70cf` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:5aebfb24eaf8a149e5a155cadc5200c554428098a129a56aa13f5174f03affbc` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:7b8961d08815ec59d5bca587a417ebb4fa93d7af500a58960d48abfdb603216e` |

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
