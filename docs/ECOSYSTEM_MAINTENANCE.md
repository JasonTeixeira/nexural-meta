# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-09T09:14:10.903Z
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
- Public proof hash: `sha256:8c29cfe73dd67a29b97a8007b0872ba9b0cad9f11f737dd4889380b7f7318cc9`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14790ms |
| golden_path                 | failed |   3924ms |
| golden_path_vercel          | passed |    333ms |
| recipe_catalog_post_proof   | passed |    340ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |   8323ms |
| db_proof                    | passed |    321ms |
| operator_test               | failed |    355ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    316ms |
| portfolio_packaging         | passed |    326ms |
| public_proof_export         | passed |    328ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:1d188bb63e7fc38cf3951e8bed1b119a04f71b61733bf604da13ca17ac7c48b5` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:14d4a349921f01d1a854d59fadbd45f358dc60f258f16377123063fa0a6e6f68` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:940fac897733e2bf5d2dd55d3cb8a0af4e4d3b14badb09c88508cb101818f96f` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:dd5341b8c2fc77049daccdb00fb2b0444fcd0e346de072cc06e6de247cf64343` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:487d6ce2b9ef8a2cdffe7774907ad6923daee095a8e8a53448aed7e6d3eea6d9` |
| `data/golden-path-runs.public.json`              | stale  | 310.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:f457352cccc1aac16e7266ee6d58599eedac5b1e3cf1fb335a9e6df5235fbda5` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:51b0cd7f0854aad9a77a2227303bf49b9300f52b895aef5f62b150294447f387` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:0a07ddeffe774b93721fd882244323f918ce5a8bdb513bf65b3985f8b1e844a2` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:eccb538d9bdbf06ee4373bae1815e9fda964b54deef334998705c7167350fed6` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:f6f5e008c34f865d4b4c66180d46ff4972dd12be39ce12809f81d1e268ebcac3` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:d7e0fdb4ca6d503a3da77f77770be2e8adc2ee3af44011f348ca72452bef159b` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:93b7dfc03f966aca856c0505c8398944f282d9eb6a4591ab205cc3cd49b7af0f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:0a07ddeffe774b93721fd882244323f918ce5a8bdb513bf65b3985f8b1e844a2` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:cd5e7a243655426ed83b379d79160bbd95d4c52f90f9327b2ac9554f56418b86` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 310.1h exceeds 168h.
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
