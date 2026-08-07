# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-07T09:48:06.693Z
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
- Public proof hash: `sha256:482f5eb2ca519578aac1eacfd5059cc7ae098bda090ca4d4208ead8fb6f170ad`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14522ms |
| golden_path                 | failed |   4515ms |
| golden_path_vercel          | passed |    322ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    328ms |
| proof_environment           | failed |   7922ms |
| db_proof                    | passed |    339ms |
| operator_test               | failed |    350ms |
| maturity_lift               | passed |    314ms |
| daily_operating_loop        | passed |    318ms |
| portfolio_packaging         | passed |    319ms |
| public_proof_export         | passed |    324ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:3f1da8fe0392454361085d9b39faa66e92e27a6b4fda5ce21d3aa6ed81bb726e` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:b026e2043b7bd9352f43b8b3da4a2c5254a8bcc7e929d2c78d978c9eebcaf885` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:21fa1dcab981a8693465f0d5f530236eee4430a804ed14ec703fa681ca13e79a` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:cf64242074cd81fb218dcbbf6d92d3338038ddf3977ac3ad569a6eb2a6b0751e` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:3b6af50a043822cba10db48add78771366f9e236adfbf4628abc512d28eac8f1` |
| `data/golden-path-runs.public.json`              | stale  | 262.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:e4706f3e967daa0472d4ee23c3dc6719475fc3c570249cc01c39bfc81125d066` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:6501d6b8906906a1b4ac44133d3f3d0add40b7184bf7d11b0e24be2566339b20` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:8bb1f8d0105131a8c49a4d783565816c763c6e222ac1693f7761b7f5a0f2db09` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:5a31a7c390856a2aa70de14f23846808dfbd8db93bbbf81fc27d503133d81859` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:32b54ca7799e488926c4e60a184fd2d53901263f87216da480576f31f4c5a8f4` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:acbf16bf840db229f86991cefc05fcd7334ae6735d673bb40703e236cc99ffe5` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:63b9b0cfe03192532155ebba498414d5fc72e3715dbbfcc5fb64e55db188c13f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:8bb1f8d0105131a8c49a4d783565816c763c6e222ac1693f7761b7f5a0f2db09` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:b03c9b38c33866462ecc88998d46c41cae3d2cd334bad2b4ea79c7e512f5212a` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 262.7h exceeds 168h.
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
