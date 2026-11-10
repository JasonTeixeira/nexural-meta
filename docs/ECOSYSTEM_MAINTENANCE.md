# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-10T09:02:37.912Z
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
- Public repositories indexed: 157
- Public assets scored: 157
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 169
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:a4fe9b1851ba8786d7bd0d6c2a4682b21212cd5fef90f689b9b9eb2430cf2a03`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16003ms |
| golden_path                 | failed |   3339ms |
| golden_path_vercel          | passed |    300ms |
| recipe_catalog_post_proof   | passed |    314ms |
| resource_library_post_proof | passed |    305ms |
| proof_environment           | failed |   8096ms |
| db_proof                    | passed |    299ms |
| operator_test               | failed |    327ms |
| maturity_lift               | passed |    300ms |
| daily_operating_loop        | passed |    294ms |
| portfolio_packaging         | passed |    299ms |
| public_proof_export         | passed |    301ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:f4cb3cb71d1dfd3afd0627238c2daad7e8ff685a10276cfb2505622218289cfd` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:9aa9c37f48048075eb864cdc3028342bac282c5448970fcc76b5fba996511cf1` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:c8a840f4416a2203f4ea529118fd85ab23833f108f59edd5cf4da9ab8fe87e01` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:128a4e04d82984fbe228f11fe6eedb2377b32dd6adb4b1da664fd4bf514c44c1` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:3c1244c9b9136681ae2a82f1b0578ae4368640a07bfc5b34f240459d484ece3c` |
| `data/golden-path-runs.public.json`              | stale  | 2541.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:d7f695c6bf99193885de57039077ae401260d5758eb525b147e1b8d6d1a93140` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:3ebf99a565a58a6fa4fa085a452a3f062b79e3205def7cb4a5c7f02e7fe93235` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:d13b9310f073b446cdffffa6c3d1c3a200289c6a4e2334626b224e9711ac804a` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:cd3436a0ce0cbc74cf2694e2293b768910bc611ebaec38d4367a3ff13936c50d` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:bcbef0aadcafb3b546d717bc1f1e72820362f5a2e3ab690759d67396209f1d7f` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:24345fbf770522bae0b48988b474dfe473cb078411bffac1dfe27a4182bd9b97` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:bf97b7a3cfe033d1912bf1463276e92509c5f7a68f11745aa88494eaa176a372` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:d13b9310f073b446cdffffa6c3d1c3a200289c6a4e2334626b224e9711ac804a` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:346cdba901d21ea005e364f7a11839935fa064b3cc5bce64efa73352652b218b` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2541.9h exceeds 168h.
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
