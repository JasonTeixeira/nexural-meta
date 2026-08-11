# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-11T09:19:22.443Z
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
- Public proof hash: `sha256:bdee53b110cf8c9112a4a683603d400b2aca8b1933da9854af0393cdb9a168d6`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15031ms |
| golden_path                 | failed |   3850ms |
| golden_path_vercel          | passed |    343ms |
| recipe_catalog_post_proof   | passed |    357ms |
| resource_library_post_proof | passed |    351ms |
| proof_environment           | failed |  11737ms |
| db_proof                    | passed |    338ms |
| operator_test               | failed |    367ms |
| maturity_lift               | passed |    337ms |
| daily_operating_loop        | passed |    328ms |
| portfolio_packaging         | passed |    341ms |
| public_proof_export         | passed |    347ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:5095f02baa1a463f2182195adf890dbccb0b940c7da77a078f6d524ed4bb7fae` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:1033f7752547a3a3cf2028758e3726ab244dbe76218c3d8f7c9d47f97bf4a19c` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:ca955d7025e0c3daa81b4aa90931d2aa9e1692d32fa376ac6f0b892e10d8fc10` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:ef7f8812800695982813141b0e95d844d59b2ae03bb7c69958d84a801b6cdbf5` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:00ca064ca1251d7d2211afaa3119a0dd073f44edf7213f7b763801f76d8f7cdc` |
| `data/golden-path-runs.public.json`              | stale  | 358.2h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:8b6342669f2d490f2ec9f31c881dfebdefea6fb5ec3c8a71172e1a57f819b450` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:70fc7efb34e6b29cf357c83ac842838c57ab602c24cee1b4f221402ccdb02163` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:546f2db31f66ad6f85d02d75c4f875656fd670e590fddf37d0da5e543ea8d8f8` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:9a2d23dc86ad3e2e4f9229e9198cbdd11e4dbb0591be9462a381e015b061b871` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:2d5f95ee0dd1693c7f667ff198ca24997008949e4c2181a48e44bfc843431eb0` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:e3548352fe563b7ffd5a44b86cfeb469c847abacde1417d597cff8b8cb380ca7` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:733ebe039a4866dc10787181fb6b16de8fa5955f4ba1e3721635d89a4e11ab87` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:546f2db31f66ad6f85d02d75c4f875656fd670e590fddf37d0da5e543ea8d8f8` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:a3b7914c7edf4d085c6873b35179a431048053a3aeab4818922a3ec553cee20c` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 358.2h exceeds 168h.
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
