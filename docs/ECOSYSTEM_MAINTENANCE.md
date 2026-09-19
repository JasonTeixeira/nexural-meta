# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-19T09:02:38.880Z
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
- Public proof hash: `sha256:b12cd4e1e87d245696011cecf644f97d3ebd7bcf8ac003e07d9cc671ed63bf37`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  19186ms |
| golden_path                 | failed |   4507ms |
| golden_path_vercel          | passed |    324ms |
| recipe_catalog_post_proof   | passed |    348ms |
| resource_library_post_proof | passed |    328ms |
| proof_environment           | failed |   7961ms |
| db_proof                    | passed |    312ms |
| operator_test               | failed |    344ms |
| maturity_lift               | passed |    317ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    318ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:5c8db371745729188b521b116f6f40d41f1f00eecd1ce5636d157b00d06435f1` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:443b54ccc5748b30e1324072446909a08d70f3cfa6e9b40e832c494337b937da` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:6bdf2a1cb7535c867ccbb8408a819112d22f794e0e9340dc1bfd8b467488e30c` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:648894fd8bfc6a4e2eb84c4ae8d8244150ff2fe431fe3a27f1d59b77a9925c08` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:feb026ef9a4b0434eacf9c9419110b6a45a1d1296c78f6251e73eb704fe598a2` |
| `data/golden-path-runs.public.json`              | stale  | 1293.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:0084e08eb96f817b019354ab9eab6bde2c1c403216d7eaef6ee04ca894d25cb4` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:3f4762fb577255a5c52659757bfcacb36104ce76b2fb6466e3a1e22c587fd912` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:53492825edcd7605f99406880b0aa69651e5b07505523d621cfb5fca051ae1cf` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:c74a6710496f39d781d2e20971cb256ed2c4a13ee3696f0b098d53dfb4161f13` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:5d8c09b87e8885086e9d857791efbe03f9866bd14e6feb13963a0ed79440aad3` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:6e4721766e16d641c1a482dbad289691013c1830a3437d1817fa267437ce4715` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:4026641eb08bbeda9626eb23439b2632db7f1f4572e32bcc5f58aa9112f65508` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:53492825edcd7605f99406880b0aa69651e5b07505523d621cfb5fca051ae1cf` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:2af50d2820e4f1f4f5fe7b9eb6611cdcfb4d91b6b6e15bec7cbd4d1320e70d48` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1293.9h exceeds 168h.
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
