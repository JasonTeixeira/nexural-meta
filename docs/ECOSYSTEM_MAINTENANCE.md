# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-07T09:04:20.135Z
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
- Public proof hash: `sha256:40fd0e61c28cdddd49f69c46e86fe15090c35b040b969687683acf27bc462b0c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17290ms |
| golden_path                 | failed |   4127ms |
| golden_path_vercel          | passed |    347ms |
| recipe_catalog_post_proof   | passed |    359ms |
| resource_library_post_proof | passed |    359ms |
| proof_environment           | failed |   8499ms |
| db_proof                    | passed |    342ms |
| operator_test               | failed |    373ms |
| maturity_lift               | passed |    337ms |
| daily_operating_loop        | passed |    333ms |
| portfolio_packaging         | passed |    349ms |
| public_proof_export         | passed |    351ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:49eca28e13413e4662766ada68804b11c949b6c45451fb7aeb7c4e741f4711bb` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:ad4ea296a966b729e7a311f650c067117d3e2dd2371ceec3acde3ca28dcdb6d3` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:1f47b852a37be8f1cbe02fcac74b7f7971e62aae608e03e4ba47ed96efe421cc` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:5562cd50a9b2d8141d6a51fa7b7606246d823d296cc49bc15ddc14262893d8d2` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:ad5ada23714060631ff85fb27ff62034de5864a38fc0d4d6b65f61a8bb966267` |
| `data/golden-path-runs.public.json`              | stale  | 1725.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:881cb978f1aecb5b77d0b1164b0388e49e51bd92e7323f3411300091b4c6fed0` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:83856fe57d9de69243f5ae23fc18ff33a91200237ef8c65359b56b995cf8b93a` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:613716a4bdc98f50e8b1f9d6ea672b9498a705642f301b2dca011bef2d84d5a1` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:326582887ba12e99722ed76716a24bd1c306ffda9fd41149ec0ee8f4137bbd85` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:9055f106fd2fd56074cb84e632b56be124723a2be8d5f1da230aba23080bfa4e` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:06e0a15289491fbabb8f21d90270bfb7069299c99b6b16c9f5c9446bbff27bb2` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:ef3fe44f441b0673faecffb7941d34de922d7633e8d872d87735cf3bf1bee8a6` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:613716a4bdc98f50e8b1f9d6ea672b9498a705642f301b2dca011bef2d84d5a1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:908c49b8ae69bc6a1162382ab23cfba2d92a2b7e1dfdbf3a2433b5ad6d76de23` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1725.9h exceeds 168h.
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
