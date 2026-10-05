# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-05T09:08:22.417Z
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
- Public proof hash: `sha256:255d90559bc60a54ccdc0e90d2018903cb322ce55b490c8d59711fa169a38c5f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16640ms |
| golden_path                 | failed |   3865ms |
| golden_path_vercel          | passed |    347ms |
| recipe_catalog_post_proof   | passed |    349ms |
| resource_library_post_proof | passed |    354ms |
| proof_environment           | failed |   8166ms |
| db_proof                    | passed |    331ms |
| operator_test               | failed |    358ms |
| maturity_lift               | passed |    329ms |
| daily_operating_loop        | passed |    338ms |
| portfolio_packaging         | passed |    345ms |
| public_proof_export         | passed |    382ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:264d2070f455037d9da5cfa3a7e198917bbf5e47abe6ea7b7a23ae83a6165594` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:f23e2a97f67bde099886c45b97780cef3f5304c34a3eac7b911944ab6a200de0` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:38e1bccd783501e569bcb52027ab8962cf18eaca24cb5bdea3893e86f2e1ecfd` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:3767d014cf3467418ad5cd88434e1e57e42cb63530526b5a674c8e0391b05762` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:b77be65ce034cd858bed231a64fce151bf4087a00142f3c6d2a610daa5fa186b` |
| `data/golden-path-runs.public.json`              | stale  | 1678h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:844ee2ab39182cba50d1679a1f7860e9386eb97c0c56e87e956d4d3e7dd6bbc9` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:3f7e83b1dfc075cdbe85dd88636b8fcd54e63ed273069e1e914b84f88bfe4ad9` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:546ae2ae95632c65451903f12d8e4ac2f9f94423a2b49a916cb38fb3a8c8991f` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:14895d976258a8a984ef6a3290c136e6a93c9a18fb8014f7d591fa450702fbc2` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:a7972c14dd13179216e5e786efa08d3e65b882d37c9c6e4bed4335a5d43e162b` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:862bf375326475a394e8a45ebab8fefd72bc9afeaefb2c024b7b0561e7e6c457` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:f542806e2c575bf063b703bb2c7ae5c656232ed2e1181bb3b26b2fa3467207cb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:546ae2ae95632c65451903f12d8e4ac2f9f94423a2b49a916cb38fb3a8c8991f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:07afb10c985687c28dea94b46107650f525df8a71eb0b2a368e63b8857186022` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1678h exceeds 168h.
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
