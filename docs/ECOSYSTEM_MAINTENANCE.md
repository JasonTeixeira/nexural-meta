# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-21T10:20:04.726Z
**Overall:** passed

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

- Commands passed: 12/12
- Fresh artifacts: 15/15
- Public repositories indexed: 137
- Public assets scored: 137
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 149
- Golden path: 16/16 gates
- Hosted golden paths: 69/76
- Proof-backed recipes: 3
- Proof environment: passed
- DB proof: passed
- Public proof hash: `sha256:eca4333a9f39d0c8eb7dd7cb1fc51cb485a87f04ff1310d55bbc50923ef33414`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17500ms |
| golden_path                 | passed | 171989ms |
| golden_path_vercel          | passed | 219788ms |
| recipe_catalog_post_proof   | passed |    384ms |
| resource_library_post_proof | passed |    341ms |
| proof_environment           | passed |   3169ms |
| db_proof                    | passed |   2870ms |
| operator_test               | passed |    385ms |
| maturity_lift               | passed |    360ms |
| daily_operating_loop        | passed |    328ms |
| portfolio_packaging         | passed |    330ms |
| public_proof_export         | passed |    331ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:1c188a3b805dcd8f5e8e9b6b2814f216fb498e5663327699c20160c257e5d13c` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:3b1a19756060cf0bd102a0964cbf48c8cdd66e2bc5bb578bb276d5b1fc4c85e1` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:25be924bf4b4000871acc9a97d6f736615c527f1e977df5388c930ea734ca12a` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:9a9c5708fdb170cd70562ded66f80b0e45c588641ec4411552823fee04a89bd2` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:08fceec0302bcd9ad9f9baa591c5de874d0f3414e35258975f2ec0513af8403d` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:2b3d16562f5edeeb4ace07c8c74029866f9f35c61c01f56925df4d5c5a124ce6` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:29b7a4e943f66866c755fecae2aba09d95b6d50ea31478cbb2ecc81f14ec209b` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:67b88cdc49eee614f2facd77a5bbd651bf0abf4ec3f4156dc6aee914bf4687d9` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:e65a8fc55435c3544891a8fc67b4837d18b3ed983804b8a27e83eaa7aafde2bf` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:8178d8ddc39cbeec2c4b0dff89e4e1df7ccf7de4111b4a85cbffc64099988b52` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:59857a51aba5a845ac34d661a55a40a47cf20aacd3f0b5738581cc82b37d85fd` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:4b673c88d89dce9fe54f4df57f4d676f15e701a1e95b1cf7e582f045faa3308b` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:1d6c214ab4604ce99c647b3bb9d227097d57f98ecaf2f7fe2a8a4b5fec6c09f1` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:e65a8fc55435c3544891a8fc67b4837d18b3ed983804b8a27e83eaa7aafde2bf` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:a24c60d75c8c0496dfaee17be755b13a5783c6241c9c2068fa16f29fa93d623d` |

## Next Actions

- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 46 changed path(s) after maintenance run.

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
