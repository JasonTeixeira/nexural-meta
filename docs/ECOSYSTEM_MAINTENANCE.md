# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-28T09:51:26.079Z
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
- Fresh artifacts: 15/15
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b0869f2705e0de30bccd9fb1742d50127cd7e55346bad6eca66d3222fceb4555`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18306ms |
| golden_path                 | failed |   3614ms |
| golden_path_vercel          | passed |    334ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    325ms |
| proof_environment           | failed |   7986ms |
| db_proof                    | passed |    322ms |
| operator_test               | failed |    345ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    323ms |
| portfolio_packaging         | passed |    334ms |
| public_proof_export         | passed |    326ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:4fd37c6fe2b269122d206c144aeae62fb4e67ada2eec115e2071aff2e10891e1` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:58f435a23432f158a602edc0268bd68db6670cf0f22d752d7e849b35d763700a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:8cb62a738dd9e1c34ec89d456794a67a4911d2b22411d265a47dbba9b1412fd0` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:7ca86d5918f422ec0ca124ce69b32f7a1fe9cbf882bb407a7c9fac9d10a67eb6` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:f3f89f478805f55713d8c9f75deea2944a86e33523208b9e3de65fd476b36e8a` |
| `data/golden-path-runs.public.json`              | fresh  | 22.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:70bd0ca53b49592d5cc01dc1ee284ed76fb7082a2e039731181f5cb50c124b9e` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:c1976edfc2e1533cab4473a8bfd42efec38b353545a645ab02433f38b6ead9dd` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:587b1bbb8c81cf0868e28f807f80d205a3349c030e39c391dfd9e095cb5466c6` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:069cc76c5db158b0de418b7aa9ab493b71d1330a892dc86f9efc617c35673f5c` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:5172df59e35ce41671348b545148476c1a4b7d7d3f44f221cac0937dda5bc294` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:af4178f197678edf926f5c167ce2b3c5a45aa3c282933da962afbd40394406b8` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:25f040fafa3bf81e60cc6e294176a20c930ace5f80f828916c036d8f9779e2e5` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:587b1bbb8c81cf0868e28f807f80d205a3349c030e39c391dfd9e095cb5466c6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:dd4d372d79e385345fda5175e5a4f02947ec12f0adfd680bf31838c89951b5d9` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
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
