# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-18T09:02:15.146Z
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
- Public proof hash: `sha256:0836ef92086c5c13f4683695bb95fd9c17a1150ab29c5e6c18d38f66fb86563e`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14369ms |
| golden_path                 | failed |   3529ms |
| golden_path_vercel          | passed |    247ms |
| recipe_catalog_post_proof   | passed |    253ms |
| resource_library_post_proof | passed |    248ms |
| proof_environment           | failed |   7979ms |
| db_proof                    | passed |    240ms |
| operator_test               | failed |    269ms |
| maturity_lift               | passed |    242ms |
| daily_operating_loop        | passed |    241ms |
| portfolio_packaging         | passed |    246ms |
| public_proof_export         | passed |    250ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:81b0899c388f29f6e251a9509533735a022b4c41fbbdc4fdec1d9a3c024d7851` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:0f200d43198676887a1a8592cfa058cae933448c229348204811d9576cccd48e` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:fd433da89de019be2edb90a04542a76d9b4357925af3564ceaa913d8755b6528` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:eb27acb0b50b9d436ba7ed8304398455f8966b2e2411848053cff9acaf6ecc65` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:eed32ded2ed3ebff95bab10a406bcebdef6ce1ebe5b849b0d30d9ea07f51aa62` |
| `data/golden-path-runs.public.json`              | stale  | 1989.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:21cb9a15345d7567009012169061a66c6938cbab2c76ea1a9eb56101210f0f10` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:4505576385fb60bd1624343fd0e70c78e979970a0f14154df53041c277a21a99` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:613fe3bb948282e548d5368e398e4f61358489578cd7d657a10737159a3971fb` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:35a617cbd5d4e0036cb5dce3e759528e8994ad04522712c0342c7348652cc748` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:fad3bb1ace61e27926c3139e12a8be928f35c049bde65fbf0a7a0450d2aafec6` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:c3565125e75b1c567a21eb6caa3e90d70c762a09fd1f6de808066cb96bee8f4b` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:3c8b6a843f9b6092b31efc7a3bda8a85c48c15ac8f731d6a94632ca5c802f014` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:613fe3bb948282e548d5368e398e4f61358489578cd7d657a10737159a3971fb` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:913ff6e0cd14b172121173ce5d22f2540015505f1f0477f0952ecbfe33207b31` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1989.9h exceeds 168h.
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
