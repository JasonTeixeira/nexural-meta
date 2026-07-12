# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-12T09:37:03.140Z
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
- Hosted golden paths: 78/148
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:ac7578338090e633405d8b4638f3778a90d352b4b4db1e6f919ddf99465466ba`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14810ms |
| golden_path                 | passed | 172912ms |
| golden_path_vercel          | failed |  97922ms |
| recipe_catalog_post_proof   | passed |    345ms |
| resource_library_post_proof | passed |    349ms |
| proof_environment           | failed |   1730ms |
| db_proof                    | passed |    330ms |
| operator_test               | failed |    361ms |
| maturity_lift               | passed |    332ms |
| daily_operating_loop        | passed |    326ms |
| portfolio_packaging         | passed |    339ms |
| public_proof_export         | passed |    339ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:6d85e66f52be1d0e7d18869f515b68511c6859c1bc861ba8159bab051ade07c6` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:4cfca64bc2f1798c2c8c9648c9b63d0b96015eedc9551258dcafedc24f6b04fa` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:19e656ae260b11ddbdc6c2f04a3285b44cb6c2c714b32bb2670cff88eb1df228` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:2c98e298558a268a56f7f3d2cdd2c1299e9d6d989d5edf32ef350f59bb160a9d` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:9d94bb075a57a30426aa4a28705f9a3549fce3a378bddd0bc03b81c6882311f0` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:e2c4b0220ccd836330914f028a746bbfc10b2854f3fa3a9695d1617bf8a1272c` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:885d9c280d3fb1445e70d5c1d6317c9b842ec3833187d02bd612620b5e4193a7` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:98bf0acf7b9766efd3fd1e9d114a7585920877183652b9f26e655dab4c82fefb` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:404226e9e7123aa1bcca44f6331e10b13d93a9385e0e6242876259b3b47a3635` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:88d659abcf1a24cef4b8c230423d8e473fa9dbfa370543e80882947f5125cece` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:91f2fa0564c0d1de37f16f3a11c3a4e732ff120b7e7e33b544f72d699d43aeb6` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:74bc84a8ed5f30b82ad172d061f1aa9a19deb102fe6547bc4d29ca425fef3197` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:1b1f1c653fba5ae6c22a9f854305be86ca18255e30f4f47e6236cef78ad445d3` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:404226e9e7123aa1bcca44f6331e10b13d93a9385e0e6242876259b3b47a3635` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:3ef84fece319f39340860e8e75867566612e01cd14565b828eb4621d9d63f328` |

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
