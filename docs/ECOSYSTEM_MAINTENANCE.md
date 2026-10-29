# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-29T09:02:19.435Z
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
- Public proof hash: `sha256:3dc9939136c2ca8e80126aa0b99380060024e74d66f54a6a4fa2c4461a3df641`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17740ms |
| golden_path                 | failed |   4100ms |
| golden_path_vercel          | passed |    327ms |
| recipe_catalog_post_proof   | passed |    333ms |
| resource_library_post_proof | passed |    326ms |
| proof_environment           | failed |   8289ms |
| db_proof                    | passed |    321ms |
| operator_test               | failed |    352ms |
| maturity_lift               | passed |    327ms |
| daily_operating_loop        | passed |    322ms |
| portfolio_packaging         | passed |    328ms |
| public_proof_export         | passed |    335ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:cf23be669703fed9e3e4fd3e4eb55a48f9c4114ba909b45e91d047e0d5a5adf0` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:555e476199629a8ba3c15d48e43afacb30cbd4a2124e0e1fb87b547ae574d2ab` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:109283334cd45d5d9ee506ce01d6349f3dd311ec07dedf927b62f8d62200b954` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:eb76b36ecc0bb4e1a090369796435a8344f2afc05e5e3a4e8ad75adccffca819` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:b5dafc32b38db78a0026eecc8d5305fd3e23d9280c24a31411f47ea7c0ffb478` |
| `data/golden-path-runs.public.json`              | stale  | 2253.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:16453489ce23159eb0c122410dc439ddb47c9c5b473abd82cb41541467b03302` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:c260f7db883e480845180f1d5d27f9e9f34985627175cd84426c96fdeec0e9d9` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:e49ce70e573f0b60ede94562b3408f874dee20a1a18400311caeaf26400cc72e` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:803a78e8aac19e40a10026640add7d5adabf6af07e14675fa3732df930bde192` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:73a07dae1bb7123df24e98c1ea4749deb6d708bb3c0bebcaa01629f854d4c749` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:06e196be1be0d661a62d59df181ce20b67cfa34b7c40e2866ec506e1702a4d99` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:88f0a4cf2f84e010cf89aaa14e91632235a36657f0b4c9f30de7451a33fbda8e` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:e49ce70e573f0b60ede94562b3408f874dee20a1a18400311caeaf26400cc72e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:ecf11431580eba8780ac795ca1bb1031ef3244f98f1e2c5af5a93b7fd9ed82b0` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2253.9h exceeds 168h.
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
