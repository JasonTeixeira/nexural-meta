# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-22T09:03:19.140Z
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
- Public proof hash: `sha256:4c8e834fe02a0f1866ead81c35b3528d2d8f2d67984a1a6adf8c75522544149b`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18571ms |
| golden_path                 | failed |   4699ms |
| golden_path_vercel          | passed |    293ms |
| recipe_catalog_post_proof   | passed |    304ms |
| resource_library_post_proof | passed |    302ms |
| proof_environment           | failed |   8285ms |
| db_proof                    | passed |    289ms |
| operator_test               | failed |    318ms |
| maturity_lift               | passed |    283ms |
| daily_operating_loop        | passed |    283ms |
| portfolio_packaging         | passed |    293ms |
| public_proof_export         | passed |    294ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:7314f4f3e63d73fd0d25c260a9f56fa59a043f64682873fa4069177ae5265ac1` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:c84afd4719446f09b652bae499156e07442cb3267514a002887ff41d2bb24391` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:4261d3b5fb00b697fa310080e8234a82ebafb3fa3c56c393d3e998193690d937` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:fab6af631103ecc73f2e94e63fa41fa78f781f15c8b82f05ac21c29350ef9417` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:8f755f3c3ca43ad674885222d5d8381af0f17dce869085e30117497cbd09e61f` |
| `data/golden-path-runs.public.json`              | stale  | 2085.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:10dbe2945aaf0c2ce0c5dc59d0d5100d45303eb292357b372785ae2a78424770` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:19dc4c4b4161b8e65ca3543576bd8becdc79ba289d960445467703dd08da47ca` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:65bfd4c0d5e3659005bc05cb97bcd2c7249f0b106fca32e923b710c637506eb6` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:b5d9ebf493db61425134c7fabfef3696200ccc269414e984ddfa13185b6251f1` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:af9bfb65447bd44777619984b983137d1db1cf695811fdda36f15368bbbd66c7` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:7599377c5f5e4e9a935b4df828d6b3f66387a366426390dfe7bd9581e1d84a62` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:6d0d6fef4af2bfab9674bb033855a8de4880c6ebc8ba7894c9c80a98860bc434` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:65bfd4c0d5e3659005bc05cb97bcd2c7249f0b106fca32e923b710c637506eb6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:726d7148ac83ec796f1fc89416f6ebb13673a34d35635473a1cf4380151eaf7f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2085.9h exceeds 168h.
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
