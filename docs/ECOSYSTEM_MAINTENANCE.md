# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-06T09:02:26.187Z
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
- Public repositories indexed: 157
- Public assets scored: 157
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 169
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:fd239a27dcf2eec82b50b2cf62897b022a1a3f4009e501af05d701ea98d930cd`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18636ms |
| golden_path                 | failed |   2657ms |
| golden_path_vercel          | passed |    209ms |
| recipe_catalog_post_proof   | passed |    210ms |
| resource_library_post_proof | passed |    209ms |
| proof_environment           | failed |   8885ms |
| db_proof                    | passed |    210ms |
| operator_test               | failed |    232ms |
| maturity_lift               | passed |    208ms |
| daily_operating_loop        | passed |    204ms |
| portfolio_packaging         | passed |    212ms |
| public_proof_export         | passed |    215ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:bf730184b2e738bb95c6ada0b3657e90187f26bbc0473a7337e1ef886746902a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:8c8c4506f11441d0440a97d867f7a26c5efd64b497820377a561c63e1eae9ce5` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:0e24a594f7fcf4bdd0a565359384e8ce6d73e721d6789fe88aa6b8f2f7179955` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:94a8302ace1d4ca29dc35974b3725159a1409041d1038a371126dc78910fd600` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:6832020de5959881d6a6a8359e11ec32fd9abfd3383db8c7f6e777fb84c6a887` |
| `data/golden-path-runs.public.json`              | stale  | 2445.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:82070bc48f06fa9c738d21a34c8ba5b851d08e5e654b640b102d59e88314afd0` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:a73d012e09fde06812b078b4d818e2068221fe976af708fa8bc0e292fdb6559d` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:4671812d5901a209d8da8ad3ebf449e3ab35f6b020afb39818d11e7f46e2e861` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:b05a1902b6bf77ec6d32a2ae046d45d5a1666668faf9626d09e2610e3c2c660a` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:047c6c14f57262ba7e95c7b7d493ddcf4ce18bb633df7bacac14db733da85050` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:6c37eb206a42e2735e829b7dbe900d416f7e8bf910635332a2655be29fb4dc73` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:b0da56dd0134ac6fce6231297856bd3417905c929b854d53cbde52d6b45ecd18` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:4671812d5901a209d8da8ad3ebf449e3ab35f6b020afb39818d11e7f46e2e861` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:f2a8fee5b02f30e3a23020777867e6be3864ab57081ec42c116112220ce57f2d` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2445.9h exceeds 168h.
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
