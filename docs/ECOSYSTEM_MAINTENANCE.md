# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-29T09:02:33.497Z
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
- Public proof hash: `sha256:80d7a8a7b5fc20bc7ea155844894df65004e3815fd204442f0a3d0024fab8cbb`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13849ms |
| golden_path                 | failed |   4650ms |
| golden_path_vercel          | passed |    305ms |
| recipe_catalog_post_proof   | passed |    319ms |
| resource_library_post_proof | passed |    315ms |
| proof_environment           | failed |   8076ms |
| db_proof                    | passed |    302ms |
| operator_test               | failed |    338ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    299ms |
| portfolio_packaging         | passed |    310ms |
| public_proof_export         | passed |    311ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:e64ce51b5a5bfc7debe424b52c230d6c5167e2e4e9dfc7fc7f728d5b7f62ceac` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:fd7d68e7fbc01413fa72cd284c6da089106a5f7b579a1922a6e5e84a247c55e8` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:954885fc36b63f34425383e4334437cb6d2fcd843ad8f56914a5f046ef4aa67d` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:cbfd442f40653da41e0f9a0bf1530e764dd2612a0e898124ddbc7c6156e6c10f` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:cfb047857fc83ec65e8b037c7525ce495ee90c7cd09845dec5466641c3b3c1a6` |
| `data/golden-path-runs.public.json`              | stale  | 789.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:00d1799ee80d9fdabab247d3b32532d47103a0a256208c680849c40bf435f789` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:a288b2eba3bc2c7f8eaa3fd459567000337084a75915afe9cfa9e8f82bb68692` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:d307bbe1ab751523229f2b05443e98260e20cd4acb736faa36c054b42f8c5c30` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:98497c9f93c42a359d67d0f6da488a70dafb304d583949f0cbbe9f038b84cabd` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:47e278031be454fa17472bfe2a61248b895884f7d43aa9f89fd220bea71ecae5` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:7cf4beca931e77f30812fb9a64674c1d5d9f233829f4e2d5ad0bfd45a82a1514` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:a6254c8fb4753952b2fcfbf0d38fc5cfdd48b655fa6bb58c2323169422b43953` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:d307bbe1ab751523229f2b05443e98260e20cd4acb736faa36c054b42f8c5c30` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:d979c0439ad8f35d4af6d434970d1ccf3aa2b70fb029a0641035222cb99417b1` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 789.9h exceeds 168h.
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
