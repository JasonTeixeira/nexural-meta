# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-24T10:17:08.391Z
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
- Public proof hash: `sha256:dabd011127bb0e8656d47f183b7d58667f5acaf290f4f2b8813dc4a5aca354d7`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13703ms |
| golden_path                 | failed |   3374ms |
| golden_path_vercel          | passed |    311ms |
| recipe_catalog_post_proof   | passed |    325ms |
| resource_library_post_proof | passed |    323ms |
| proof_environment           | failed |   8029ms |
| db_proof                    | passed |    300ms |
| operator_test               | failed |    334ms |
| maturity_lift               | passed |    313ms |
| daily_operating_loop        | passed |    303ms |
| portfolio_packaging         | passed |    312ms |
| public_proof_export         | passed |    313ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:a629fbe4942ec3de936c116f55d3bb3bbd357d84534aa35195bbdd62c5bead44` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:6a95a6475d8b4542b612e3159fc9f91e9f4f29f79f3c77062493351dd47c1f9a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:0ce514866245dca5443d5455533722f466c1b0cf03cd947d015a9c460f325125` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:06e21d87ef25e3490cd42341f19bb1a3cbdb28f235ea072c593caefc0d4fd734` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:c4a974952b30c26979ef8deaf58d66f60d5f94172fdb9fbee7f8cbfc3bec1e1f` |
| `data/golden-path-runs.public.json`              | stale  | 671.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:62dd0c2f7668c68f39675e70146f3f7bcdd47e245460c7edf083053569261f8c` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:eb04dc74a0919161c9e49eef8240ba88fe4c2e4dc2793ae30181d6e0c3f2407d` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:4d217307eb8dd999d629b4b7c9feedc824fd11fa47d5a31a7ae5795b65bcaf90` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:07e7b41d60cfcd01c4237fb3202ea1e64412f39c30921543c4717b83c979b216` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:9609574c7f19e4ce6beb95e122cc1d49779865171bf7f3e59cedde3f0e9ee674` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:f51dea8aeb361da1c2ffaafc28b6dee0cf0cf052a4150ef6a81038f2ad69bbcb` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:cc3bd0df024e95700faa199853e37e239bc6abc4e46c230321012451785ea25c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:4d217307eb8dd999d629b4b7c9feedc824fd11fa47d5a31a7ae5795b65bcaf90` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:95499f7ab6839b6c83c58fd3bf2c91419860cd9eeb0d4edf639ce9f212f24f02` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 671.1h exceeds 168h.
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
