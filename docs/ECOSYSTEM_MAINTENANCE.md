# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-26T09:14:15.457Z
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
- Public proof hash: `sha256:bf1de7474d8b7a9d900c0f5c6bc307b8c380d29e01f9fac9f4f6f675562e34ff`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13705ms |
| golden_path                 | failed |   3714ms |
| golden_path_vercel          | passed |    323ms |
| recipe_catalog_post_proof   | passed |    335ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |  13261ms |
| db_proof                    | passed |    322ms |
| operator_test               | failed |    371ms |
| maturity_lift               | passed |    329ms |
| daily_operating_loop        | passed |    325ms |
| portfolio_packaging         | passed |    338ms |
| public_proof_export         | passed |    337ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:8a9d616d9af4662bbdc0596296d6d504fa4019b9643096f7d482659a2accdf10` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:fb199813dd8df3192f0fb7eb5fa7b3de73cb6cde1e6d959693f0e35eedb0f76b` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:2a07a8c5ed43d0f3fdfa9c78ab3cea116447434b3a5a65fee78cf98ad578a6cb` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:c826719fd70323635b9e73884f83e9fb2537b08f651827ea549c8dd272f773b5` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:7222a344d0fe14e868c3a261041518ea9b2c7ee08ff2635c103c7c6bf0c38b8f` |
| `data/golden-path-runs.public.json`              | stale  | 718.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:d9bab81f3a85ec6a77c613aab4e5836b56a655f4e6cba5875fa50ac058237ec3` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:ecbc0ee19d7b5b315a1d5ca95314eece22b33b2dee3224a4c53d0ff8843bd3b0` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:17d6333716e353d7357ebdf1fc02bdc41852066e4f23f367161ba2105845f241` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:35b77bfd09394a8d0bb15da67c5a49c198ef452468b23d36e78bd91f372eb741` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:4c19b03c76c771c425d7c2e82e1ce1e6d42b59ce325e0700130750e90a91eb2e` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:4cd794fbb9e4cb9562f9130c110468fe3788732edfc252103231f1f270db004f` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:bd4de9aa52a307212fe7e00b0f988e336d3195179ce393fef914ad178a7fff8d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:17d6333716e353d7357ebdf1fc02bdc41852066e4f23f367161ba2105845f241` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:c850c17a2a86dc40cb0173b788d11f0bb608acaa12f3407d32327cbe538d0a19` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 718.1h exceeds 168h.
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
