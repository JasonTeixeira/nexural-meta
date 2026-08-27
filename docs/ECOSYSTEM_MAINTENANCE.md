# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-27T12:28:58.869Z
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
- Public proof hash: `sha256:7887cd2d5afade2c256eeae659814e378eb6f2ea4ad970087069e5e110ff7db8`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13788ms |
| golden_path                 | failed |   4834ms |
| golden_path_vercel          | passed |    337ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    334ms |
| proof_environment           | failed |   7977ms |
| db_proof                    | passed |    320ms |
| operator_test               | failed |    349ms |
| maturity_lift               | passed |    329ms |
| daily_operating_loop        | passed |    320ms |
| portfolio_packaging         | passed |    325ms |
| public_proof_export         | passed |    330ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:63603ebee073a91c83bccc254e98e5eda267998b5f6f822e84f457c967e81525` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:9820924aac5e483952ba7d664755cece905bbe737740341781bd91851e496f8c` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:541d615f389ef638af5bced09603fc031a8ef54facb4f2a23779e330b4367b6b` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:7cc6ca26a52befe2122e9461b5f0e8c8ab79add4a202cad2ca0341cd237aa5de` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:4581b48a7e2a05a0c1de194933841494c1886fd3552b0e828eb5a4b1acc6641a` |
| `data/golden-path-runs.public.json`              | stale  | 745.3h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:b61fbce3610c504a767d86c5a3d9dcf4d4c52c9861f9fe56626ad8515b564bbc` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:152ecb1f6513f0e2b83061cb3fac40aae98232cd35178b893d3f7c211a611e76` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:74e97b01d1df05934789d85d6d0f5644017cbf3d641559c07c395253275abb63` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:635e160dbe24fd33b8e3e5544a72c5b2964792ca97bdc590d87097fffab65aad` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:463660aca0eb7911b190d52b014d2b950d8563374eb8be49c02d8f626e6fb508` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:d65b58c1ad73a77145512c0354c351ab57cf1d8c768516b03c5975992ba9b831` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:c476f21c4fb1ce6c2af265ff7cb23c88c0d3ed2c8397d63d2b7b7a5e3ce00ba0` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:74e97b01d1df05934789d85d6d0f5644017cbf3d641559c07c395253275abb63` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:b89979ef8f85071c159fb145a0398410cb07d5679e9f233c5491592992926f74` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 745.3h exceeds 168h.
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
