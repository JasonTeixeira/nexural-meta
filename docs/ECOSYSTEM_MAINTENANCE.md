# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-06T11:39:31.999Z
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
- Hosted golden paths: 78/127
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:ab286bc32252f43fd79a01fe78d9ebad23c3ad42e46fb1039fa6ddd9c37b8784`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17440ms |
| golden_path                 | passed | 178553ms |
| golden_path_vercel          | failed |  76829ms |
| recipe_catalog_post_proof   | passed |    351ms |
| resource_library_post_proof | passed |    355ms |
| proof_environment           | failed |   1704ms |
| db_proof                    | passed |    354ms |
| operator_test               | failed |    381ms |
| maturity_lift               | passed |    353ms |
| daily_operating_loop        | passed |    350ms |
| portfolio_packaging         | passed |    348ms |
| public_proof_export         | passed |    356ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:be052517e3c2ee572ab4583143a1d6265fc60c3c6f5d85dcd1558216ca15123a` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:f701b7b6b5c689183aedcf2ce9972399c42df0dd569902e71ad573624e549838` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:f9cac5dc0a2d1e257fd83b34d7e0009d26d6332227940d60e4a331d165e55371` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:2abd248730e1d40441f201f49af791184f45674ffdc5035d7dd48357c8ebfab5` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:10c7e9ea9121cd3b0fba9296c36c0583168b23b9c38703b2b2070464babb9848` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:c5a1944154f15e2d56a5c128434522d83caaf50dc1f20faf91d588dbc9629f71` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:28b2fef8512a4190bccfa46174e73dd060717cc341025e73fbd0861298e0fbc2` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:60e707effcb697c4558d33e38571dd13cf87efab6c498efd9e97212b05d0da25` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:e75dc367d9802a697f69ded4228425bc0d6e30e37eb8830e4df8f656097beb31` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:2c9268bf09b8acc5c034242bb46853a89b95f6c18a0ec9df187f835bd4a222dc` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:30a434617dbcc19fed94c7e4a8697e724a405ca811b775234fe97bddaf2d73fb` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:9dc2ac9ca148c7be34284dc180926d97c4cc895b1caf3c49e601060728936ea3` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:54e10366847b71255699fe2597c795330d192fdb759acf62ff1a6aeb06502922` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:e75dc367d9802a697f69ded4228425bc0d6e30e37eb8830e4df8f656097beb31` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:dfbcdfcb6549d92c330990386d3dd88db57be5272a7e9f36ad5cbb4f2935f43d` |

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
