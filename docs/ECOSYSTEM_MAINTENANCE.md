# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-15T09:39:47.992Z
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
- Public repositories indexed: 139
- Public assets scored: 139
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 151
- Golden path: 14/14 gates
- Hosted golden paths: 78/160
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:35281d7b9137951a9be695f388be83851dc328dccbe46f6166fa52e08046a02f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15353ms |
| golden_path                 | passed | 170537ms |
| golden_path_vercel          | failed |  79178ms |
| recipe_catalog_post_proof   | passed |    338ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   1754ms |
| db_proof                    | passed |    327ms |
| operator_test               | failed |    354ms |
| maturity_lift               | passed |    327ms |
| daily_operating_loop        | passed |    322ms |
| portfolio_packaging         | passed |    330ms |
| public_proof_export         | passed |    333ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:26b4c75920121f9aac0986cc93078f3b557175d022791c7b0ab3fced85eec8c6` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:5e0f6e838bcfc3309aa0a3d0f239066136788bd84d99ee477c2b7b4d996b6e63` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:c342ed855889ebe24f027ff16021ad8b361ef32371b09b0dd6c87ae9092efbab` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:2e027621703b35aa167eaa94824bfd9b71dd1af4da3294e7c26dcccd6652768b` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:398352a2fea314342de0d9c4892dd8757306499a9e11cc5e054f5c2302ca8978` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:bf4861e3929a8e0cb4130c0d1402eeb64f326ca55f3ec129c12d1b06cd35826e` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:0e673db7df7e12e182920009d1e7a285bccac63fe913d782b8919e76c11485d4` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:0a67cb0e8c8232524084a97189ce4426581eddc5b67d6b39de47f31c4b8514a3` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:b13b2493d8b87e42f04a93e6770e14fd24263eb295c5acef4dc44d4547db361d` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:e390defb8717cf56eacc0493292c84b293eb1c0f0a1cd46e92f54987753a7754` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:1d868bcb35d0848bcb57a4f342e1187d1507afad8d81b66e626d48287f67d95c` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:d8a3d80780a2b4007c129ad9a1b5e7fbb8f42527c73ada4fd0d3c848936e8bee` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:c78cd514f2786773abf1a1bb1996abfbb724310549a2b0d246da5d21366c7493` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:b13b2493d8b87e42f04a93e6770e14fd24263eb295c5acef4dc44d4547db361d` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:e13e3f2f1085c0f39743790c3b13ed74da1150f482f80ea7720192da0ae4c213` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
