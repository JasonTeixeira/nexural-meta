# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-14T10:13:17.543Z
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
- Public proof hash: `sha256:9d2a16ecc480377e04a74daf41ca878f56b81499285b99c991cb58164c50da8f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18804ms |
| golden_path                 | failed |   7189ms |
| golden_path_vercel          | passed |    329ms |
| recipe_catalog_post_proof   | passed |    345ms |
| resource_library_post_proof | passed |    345ms |
| proof_environment           | failed |   8197ms |
| db_proof                    | passed |    327ms |
| operator_test               | failed |    359ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    329ms |
| portfolio_packaging         | passed |    334ms |
| public_proof_export         | passed |    337ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:1e952ebfa09c6817522d0740017387e76817dee8de8584b03f7d1a7bdbf6a0ba` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:03d19fcbb8c3afc9bf91742666c3fbfa3f2522746df7f3b452061d4cd6f77c29` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:f123def57020f68a3f7d4eb23a1f6f963e03369838f4fdeb907e5806391393b8` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:1299cc7354f737a2f251ee28b5111bbf778b28e73e8367ec7fe0915bf45dc715` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:a233c204ef5bbebe4f0e90c79033e91f95b6fe4fb35693492aa427a04ded2c16` |
| `data/golden-path-runs.public.json`              | stale  | 1175.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:dc114b2b9bfa5db5c0ba69fd977d5bf50107eb1c1b6ec0ccee4a524f261d552e` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:d36037013beec366c8a7bf87f97372a6a0b1562d329065b6f3ce1e591bbdfaa5` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:388e5e5546b76a4c1f9cbc8f19ecbdbbc02f6162e5307db67a6fc4b56c414eaf` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:b307c910824baf87535dee6414f4fb9b2ae6332668c33211cc8d683fcc5ff177` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:db3765fa2344fcf9f7f6d1e5c7cdc412668cbe0253510f4bda6dd4c0b9d7839c` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:ea4f58481c7ce5b4b4f189e520305b7ec819f5db95b3606d17230b82c27eea0a` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:2f849737c82f095c35d69c04f61081eb45a613a3e484a13968d8d439d36fa204` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:388e5e5546b76a4c1f9cbc8f19ecbdbbc02f6162e5307db67a6fc4b56c414eaf` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:7602564d31c21ea84108db22b6cac58eef12c967735736c3c215b6fd8f245d55` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1175.1h exceeds 168h.
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
