# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-15T09:02:31.473Z
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
- Public repositories indexed: 161
- Public assets scored: 161
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 173
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:37af93c595ac9e6849d2d6c05dbb49d3d2e198c991aa5211198be3c030852a0f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15904ms |
| golden_path                 | failed |   4526ms |
| golden_path_vercel          | passed |    340ms |
| recipe_catalog_post_proof   | passed |    348ms |
| resource_library_post_proof | passed |    346ms |
| proof_environment           | failed |   8142ms |
| db_proof                    | passed |    333ms |
| operator_test               | failed |    370ms |
| maturity_lift               | passed |    335ms |
| daily_operating_loop        | passed |    334ms |
| portfolio_packaging         | passed |    342ms |
| public_proof_export         | passed |    350ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:7150d99d7d596d805a26ee6a654a923c3e2dfaa4414b985880309b66dc2cd318` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:dfb07f33f7c8664221e445a1e6ddc06754c7687a2a65257f02901918e16f3d1b` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:0a81d78719fab2a82ea6b64b8e0b3cb1a116b31bcffe204aa80ed10343a6f482` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:bd2d0c42f96406d34e674ff7c267827388c430e3fb1aaf1e219d54a497f532c3` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:cd67913c0a5fb6750fe94f5e97e00ce7a59b3d92a5ea6e1eb4a4080f4623517c` |
| `data/golden-path-runs.public.json`              | stale  | 2661.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:d80f651cb2872ddfc1b2770f561b7d9d2dbcaff779b484ba83dd5a0ff476c7e2` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:adeaef20b0bd96a7b04ad97ee9124866ebcd8b60547a8437a6726ac9af779efd` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:8841a1092622ef61f2b88f66dbd701f9465b89505bf7da200d2b95dc869ebb37` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:c9b88ea9a7e36e302b089fd397c88a773ab4471aa3e67189f6d8151f6be10d88` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:03e9f2e010419878b3a85205424cfd7e84f2a1860d472b7df613b7545175e358` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:1ab7e0f35c3d00321a76ed3cfdac1825302edb7882f3ed01ba62efe01109e3e2` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:cf18bdfcb08028018434047c4e27b504a6a92de1aeae246a1320b8403ff83b60` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:8841a1092622ef61f2b88f66dbd701f9465b89505bf7da200d2b95dc869ebb37` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:0c313ffd2c390b5843a5848d7f904cb9290178b636f6b1ed7ae2379d9b29a889` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2661.9h exceeds 168h.
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
