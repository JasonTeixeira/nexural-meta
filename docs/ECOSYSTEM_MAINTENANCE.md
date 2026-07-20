# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-20T11:08:22.104Z
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
- Hosted golden paths: 78/178
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:8577496f4352f83abc91555a03aa1bae677cc817fdee1fc31242675f60475a5f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15909ms |
| golden_path                 | passed | 161109ms |
| golden_path_vercel          | failed |  89285ms |
| recipe_catalog_post_proof   | passed |    344ms |
| resource_library_post_proof | passed |    339ms |
| proof_environment           | failed |   1413ms |
| db_proof                    | passed |    331ms |
| operator_test               | failed |    365ms |
| maturity_lift               | passed |    336ms |
| daily_operating_loop        | passed |    334ms |
| portfolio_packaging         | passed |    336ms |
| public_proof_export         | passed |    351ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:1abea644e29a2af85c4838b5ed43afe17f6fb7627739d3baa8cf4462d9ff2305` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:232be6b7f876467fb9800a9be75e21d71ef112145bf7b618ce594106ade4cf71` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:72b4ed643373799679fc2a7d10f9271210e2b9fb347fe22bb224079b6f8105d1` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:f65ab85a6638e8c468b24f51a9421a21f0557bd7b34a307c7772f2a5bdfd91e7` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:2109d5b6341c20ea5bb9658ffec7fcf36c565ffaf31bc80ed38fb9aa7f50dae1` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:b64185cdafcc3dd47c496b93791ada227697b9fa8d09a1cbef4e756cd363d172` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:3a350f96c4dddea9553f2788a7bb2461b2e8e3710fff2e2cd7a4dfafc3f96905` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:c2f6e2cc5445a47bcaddb84c3db5365b1472bc249486a05fa217f6657b8c7e96` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:e4db90ff864d20762d1992bcfaa7ec169640b4859372f988a2104e24694e58bd` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:911193def621af364232baed2ffecc902dc0aeb95d3de2999027cce89c1a9f7e` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:475692dad0d7a8e703c236e8e009106efa9386b3b287ff2bcb266c90b8762fa1` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:e496a25bf7876097e6f14930939d78c18878b9b7266d68ad65de77f7f375c4bc` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:b5cd7672f97a5658c56df1e9cdcdea26cee692607c54a74eefafdd750e339fd4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:e4db90ff864d20762d1992bcfaa7ec169640b4859372f988a2104e24694e58bd` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:96e10bc0c58e90df55a11c13f49affff1c26b5922a9488667e7d30398a66c607` |

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
