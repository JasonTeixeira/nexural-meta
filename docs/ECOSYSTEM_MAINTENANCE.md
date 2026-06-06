# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-06T09:44:27.561Z
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

- Commands passed: 11/12
- Fresh artifacts: 15/15
- Public repositories indexed: 136
- Public assets scored: 136
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 148
- Golden path: 16/16 gates
- Hosted golden paths: 18/25
- Proof-backed recipes: 3
- Proof environment: passed
- DB proof: passed
- Public proof hash: `sha256:d5fcab04da48aa086ed91000fb88ac8f2f6b2cca256222542cf06c882af1c5e4`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13984ms |
| golden_path                 | passed | 159704ms |
| golden_path_vercel          | failed | 157121ms |
| recipe_catalog_post_proof   | passed |    372ms |
| resource_library_post_proof | passed |    361ms |
| proof_environment           | passed |   3421ms |
| db_proof                    | passed |   3097ms |
| operator_test               | passed |    366ms |
| maturity_lift               | passed |    334ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    312ms |
| public_proof_export         | passed |    310ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:e39c414144a8936a9031fecc1384d373b6821faa8b750070d7ed47dc90e9b836` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:7c27c7105cdfc2910fe9f2a80f01a3e6cc7881b0c3397ee91c4b8dffab1d97ec` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:ae6e6be7585bc584d8be3c1ee84f345c84d25c60c34357ed6849dc0db9a7240d` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:4fa505ef35ba3b26da62a4126ad7b7fb013ef957cfbf7bdc4b730e97f8e34609` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:76214ce1dc9b7292313592fc9f95aa8f81bce4740c64ee34e136679ef8d37876` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:2882ede61ced60a1c82a5a3c68632b780a6c927d3b38cb624f3d584e14619524` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:eca3c362b0febbd56d4195ff5ddd2f407c0e809edda8c332f177a938489d983b` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:5b86c7cff3e43d656cd6cd338269a86e500aed24900fc5461a3d95e6010a2925` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:6cdd73fbe4a83e3d59a2cd41780cecfda3714af0929a4d9bf4df7bf522661eae` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:23d400eea281ce9ac48b39a2290aeb28280fb1f11e15113bc74755945c1db26a` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:2a0d5560349b0011d665785bc5476b2469222f8d463516356ec24c26c2bc642b` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:fa8a41c4f7b7dac8c4f9a35a68ffd1ecc24fd6971a12b139fcf635e63577ace9` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:87bd37d25e97b3ddb07e541694f270ec9d125904e85d3085f103d30145bd4c97` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:6cdd73fbe4a83e3d59a2cd41780cecfda3714af0929a4d9bf4df7bf522661eae` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:570bdc83689764e9254484ee529335396accbfad9d6c206d1b214e0e3b8f001f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 45 changed path(s) after maintenance run.

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
