# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-11T09:02:07.133Z
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
- Public repositories indexed: 160
- Public assets scored: 160
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 172
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:8d76133ed68ef4765d4e39d0c3f7f622d34acf980c5c999f875943821ec07582`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17387ms |
| golden_path                 | failed |   2622ms |
| golden_path_vercel          | passed |    242ms |
| recipe_catalog_post_proof   | passed |    229ms |
| resource_library_post_proof | passed |    224ms |
| proof_environment           | failed |   8264ms |
| db_proof                    | passed |    217ms |
| operator_test               | failed |    234ms |
| maturity_lift               | passed |    248ms |
| daily_operating_loop        | passed |    206ms |
| portfolio_packaging         | passed |    207ms |
| public_proof_export         | passed |    216ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:c234cf44612ce5b0e623bb8c697ccff380a55bc5cdcfd93c9dd80f22f646e548` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:0209c32f3f9d6ccad535fb0c519ed7ba237d201a458da279a1bda267257023b6` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:bc77aed283ffea46c196b4933bce487fbbd9775ed214b2d65065cadd30520200` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:b0d3c148928bc52fa9271eab3d9b157b50c02dfccc15c76b12ffc4eaa3251ed2` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:6ef8b4156d4f64a2b55767404b938c1898e57da438a328d9e1ef3cd75dc43673` |
| `data/golden-path-runs.public.json`              | stale  | 2565.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:a66dd22cf1078a3b8ff64797dab50ee0545fc2883775ac4d344d5fae3ee55dcb` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:053dca044b8716295875806bf907fde0bce66ac1a3384ac8218a78fb4204c0c2` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:c9a8f7e4066231dbfa83c94de3985ded8b902cc58cd47f206eac866da43e0925` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:5f7c418b2a8273600afa765bcfcdcb3738dafcbc097594456e7346adef22318c` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:a1077e3c7997f7bb38335ef9d461a2aa986a4648c6c7b9b8b8b559793f9a3e0b` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:63038c1307f68c26f8212c092c50d3ff9da2f03f255b9ce8230cff5408a6bbb3` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:3575a41f9c1fc3a08c44ff6da7cbdad37c6b0812d175f8e330bb7c2a2fea3309` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:c9a8f7e4066231dbfa83c94de3985ded8b902cc58cd47f206eac866da43e0925` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:8bf8d318ad243a1f0c026ad757e688e4bd34ce920c220b8768439ea3f1e95d18` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2565.9h exceeds 168h.
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
