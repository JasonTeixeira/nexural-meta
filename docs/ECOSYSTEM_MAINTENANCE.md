# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-26T09:07:46.189Z
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
- Public proof hash: `sha256:bd4c6857185ab9e624d80650aee60afcf81d49c6f8a298b459e4b803264a3e52`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16871ms |
| golden_path                 | failed |   2709ms |
| golden_path_vercel          | passed |    230ms |
| recipe_catalog_post_proof   | passed |    233ms |
| resource_library_post_proof | passed |    233ms |
| proof_environment           | failed |   8248ms |
| db_proof                    | passed |    224ms |
| operator_test               | failed |    259ms |
| maturity_lift               | passed |    237ms |
| daily_operating_loop        | passed |    226ms |
| portfolio_packaging         | passed |    229ms |
| public_proof_export         | passed |    234ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:1c8429e315f0488d5888147bd34fea6bb3d32eea6c54de797361f8bb31c9d52a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:21bfb77cb98a871fef6aaed6896e81e6260998e7d25d90845c75487f74faf92a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:a038a96acc43c824bea225f12cfaa4cc7f516e278eb7ba54fc9cdc88d91485a2` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:3626c488b9e1a16680a2a6c65a50659eb94520c689a8131a7d91cc155ffab7f9` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:06e30620c78604675a5205a31ad8a772ce7c98adbb4f6b4325fec100c1081d75` |
| `data/golden-path-runs.public.json`              | stale  | 2182h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:58924980bc26dd228dc48d0f694d9df8405b080cca63b8e8e11fa55d16287394` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:dc8a05488efc0466124dfd293f58af590111cf3b5dd7d389908532ee67875fc2` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:adaea8204800ecc6ef5c9351d5082d049160b4b0bfac2767691b726a234a178b` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:769c57b04e4d30195c472060325d6788c0079ddc77dff10f76383409a9ab9773` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:95baadafa64e2c0e7b984c700ad3286d1596142218a9aa3d51a2c9c018ce7475` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:2440c8253079d54c4e58aac6ff965ca942641a71bf962eb9f08f0bf9f7472493` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:7be052d0ba644f9e96952f257c34f151c60825ba106bd2e90a3a3edf03503e1d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:adaea8204800ecc6ef5c9351d5082d049160b4b0bfac2767691b726a234a178b` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:243b8b545e5c70aea0135a794e2e6a683d872fb5c69c5170f9272832fc297e07` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2182h exceeds 168h.
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
