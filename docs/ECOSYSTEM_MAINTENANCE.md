# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-12T09:24:23.605Z
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
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:7068d7cb084f62997c7aa1fd373a7fec1282f7176645c4ead9e035aa05db51a4`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15330ms |
| golden_path                 | failed |   3619ms |
| golden_path_vercel          | passed |    321ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   8330ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    348ms |
| maturity_lift               | passed |    320ms |
| daily_operating_loop        | passed |    315ms |
| portfolio_packaging         | passed |    322ms |
| public_proof_export         | passed |    326ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:be4a08ca9db7342a466562bc5ffa180e3fa51f150e4192dc96bd5e58d1e37ee4` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:b7445e37d6c230123b3668a185b092bc626a084bebcb757da0cce66c910906b0` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:0868ec17668e50ed1a0d416ae58d71ec57e9623cbceae181a3d91596bb5f799f` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:b2c0113ff8be90cdb600a64a80cc9179c563b319da398a04dae74f8dfed9d04e` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:6f105a3997c3f02f50e4361e363ab600be4ea17bcfecb0074bbbb7a0c2dcb21d` |
| `data/golden-path-runs.public.json`              | stale  | 382.3h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:2a27499a99a16738575c09b0c368e6038d129c27365bf03d7843b27ba9b58d41` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:857e6fdb72ce1d17d8d7e8de4170bea8ab66ef1539bde4ebd723711a1b3d149b` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:d64524ccda5280410e358ffd5d29e15f08749c07d028a20c1988d89ee9110500` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:6da5570c165036efff4aa27d7329951d6b8f5716ab162098d9f328a35cbda4c2` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:01526957b1d52b5d868ccfbd6647a9b62e23de4b70249f8347f4ffacdae056fe` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:4c149588c7a8e9eda81c1c37ae09730e0931b32054335cff2f07558e9fbe7f07` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:70933a71664b99db8f5edecb559e3ef63d047570fb5f36dbb7f52631f1ebaf62` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:d64524ccda5280410e358ffd5d29e15f08749c07d028a20c1988d89ee9110500` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:5e0b9258718042c7b7783f01839d1a5e2cfa5b4824f99f3ef774fecea38d4f9f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 382.3h exceeds 168h.
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
