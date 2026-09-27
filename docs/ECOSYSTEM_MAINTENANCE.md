# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-27T09:02:29.057Z
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
- Public proof hash: `sha256:f180a246140b7f0f7a142f2d4c124704484835a79e637c5c89db618519e28d4e`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16089ms |
| golden_path                 | failed |   3703ms |
| golden_path_vercel          | passed |    339ms |
| recipe_catalog_post_proof   | passed |    348ms |
| resource_library_post_proof | passed |    341ms |
| proof_environment           | failed |   8151ms |
| db_proof                    | passed |    326ms |
| operator_test               | failed |    354ms |
| maturity_lift               | passed |    331ms |
| daily_operating_loop        | passed |    330ms |
| portfolio_packaging         | passed |    336ms |
| public_proof_export         | passed |    332ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:a1eeb69859ecea06c8ce8b82203112ccfae7d75a39246f2693f1aaee2c1ef43c` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:050291434cb0322a10004dddd75174378580454232ecf0e23756e7049c89c939` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:85ac1890f41b9ce807330d6390fc5edcddfd34230fa62f6ae0dc4d4d3a146edc` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:026aa15e31d7c21ad09b43ad6377e963423cd46138ea8a08b4d2b0e7308935b3` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:da6c90849da5ad7987aed6a5e4f0a82d16e5e785a8fe59ef7acdd37ac95db569` |
| `data/golden-path-runs.public.json`              | stale  | 1485.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:5482bd208cf30d0cecd5b210c21f2118af4da3a63618e783c0031b665bba12f3` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:518e446e7e09c4ad672158d04e8e9d40b7b24cb03488908dda967775e0a20f5b` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:f0c3fe5779f4990022c67816acf1332752316a6652060c1a84e04b7434f4c3a6` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:10c5f6907d106d6ec5ad592cba78e44e3987d1e4ef07b5fad9d4ebea5a3215a9` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:9f448643246d7b7ebacce7784d45dbeeb801dc4584858443ff36814475e747d2` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:38ca851457c22b4fd60b174448aa17cef376757b571bfc9b2f2298f987f53e6e` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:08dffa2577c66eeb1fb7bcf14e49f00544bfa74abfc41a2deb20eb21367ff4a0` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:f0c3fe5779f4990022c67816acf1332752316a6652060c1a84e04b7434f4c3a6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:bfad7241941bb3f41e474bc56bade827a0cf2d55cfbb5519b218c0acd8939606` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1485.9h exceeds 168h.
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
