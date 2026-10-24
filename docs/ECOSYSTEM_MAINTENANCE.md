# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-24T09:02:29.923Z
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
- Public proof hash: `sha256:37014a0a9abf2addbf81ebb087ee4bfe2d7536662bcc265ed50549f9138111b7`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16110ms |
| golden_path                 | failed |   3047ms |
| golden_path_vercel          | passed |    256ms |
| recipe_catalog_post_proof   | passed |    269ms |
| resource_library_post_proof | passed |    263ms |
| proof_environment           | failed |   8181ms |
| db_proof                    | passed |    256ms |
| operator_test               | failed |    289ms |
| maturity_lift               | passed |    262ms |
| daily_operating_loop        | passed |    256ms |
| portfolio_packaging         | passed |    257ms |
| public_proof_export         | passed |    265ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:e346088dc4b1213808cc8af55fe6391798ba9502fecfbbd5bec5f38e755762ef` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:cf3d3bd720df345103bf2e49fd7ae28b7f0ace9d86c9a55da08300e8662619ce` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:900c0d101cd8688131e75fc10193be460496a54b3ee2a211a472763a1a84f399` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:399e12465f8e68d1e4821b166bee54bf48d54a5e4b29b494ad21ff1aba40d8a0` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:54c2fc20d4d6c95ff592586e212aee1b9a28a606ab9ec361d820c1b44cdd1c68` |
| `data/golden-path-runs.public.json`              | stale  | 2133.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:8320ff3eddc7a708c8e8c1e989b1769b153986390286a22d781629d9f38fd500` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:409772b5c649656fe5c790d7e74bee7c7982371d2b1166526b6aff3b07f71f3a` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:f9c5803c255b64b242253e62384d65966caedca4c35cfbf1b309ad251695af3e` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:7434ef4af38b37aa5291936d48c97fcea8a45b548cb4fad0f1b42e692bd0edba` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:dace92a198809af682242fb1243d7adc7ecf563f2d649be1d527f53e9a92fa5e` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:452676c134c39cd4c0c4e7892dbff7235ef1468807133befacde5ea414e82e5d` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:a1c83e41243fe78dfc9d29d0266df62b3da5989536fa058e20fca349e4d13532` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:f9c5803c255b64b242253e62384d65966caedca4c35cfbf1b309ad251695af3e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:62fe2ab38e125028153ae6d67c34287825fd6c8fe992c690ec0d62187410f40f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2133.9h exceeds 168h.
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
