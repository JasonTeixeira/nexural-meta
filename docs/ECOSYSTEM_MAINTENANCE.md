# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-07T10:13:41.740Z
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
- Public proof hash: `sha256:3135fa27d49fc0c1426cc3df8038592ab9216bf080377fdac65123a8d1714d8c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14179ms |
| golden_path                 | failed |   3454ms |
| golden_path_vercel          | passed |    298ms |
| recipe_catalog_post_proof   | passed |    308ms |
| resource_library_post_proof | passed |    307ms |
| proof_environment           | failed |   8293ms |
| db_proof                    | passed |    297ms |
| operator_test               | failed |    330ms |
| maturity_lift               | passed |    303ms |
| daily_operating_loop        | passed |    294ms |
| portfolio_packaging         | passed |    304ms |
| public_proof_export         | passed |    310ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:62ebc4b56b36ba9193b39e64bb406346a437d418a613aefd86ddedaec301a7e3` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:3be4b4be29b5d5849cda0b6b0d8a3393735ad6de8939de2bbe5eede3c81509dd` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:6a3812447d2138038596ed91c1e1470f361c19eca66c6cf71d8c0a765fc80933` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:d21a659e5300328200cb262f78f943e4e3b717a61a6ca0c0f905c32c15de5a56` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:aeb5c5e303bb8bc94714d24132dd7b6499ab33941fb39b9fd3637553e3e15ec2` |
| `data/golden-path-runs.public.json`              | stale  | 1007.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:c19bf29f72f143389a8a53a81f1ce9e235b269fdc128d2478560a16acdad8b00` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:9943b75d865f2cac65c564aa7e600b794dc3e96f020ec45bd939a3eea9f732ef` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:bbfc1ec525d7891335858080748d2342f9c7038e537b89e3f56f723f02740560` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:3d574aa04fbabf4765884175decd70349dd68d149e8c5d6effd484bb114088b9` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:990483b0835445aea2dbbaff86d00547ad9b66b9c8781ad6b1b2c26602717049` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:e793e8b939790d657cbcb834312928c2cf0c76cf66c9cb6fdb2cccb06237b585` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:a6beb829771c7f649d1da9ca8e0e687ca9f37782f4b35815345391871bc56dd3` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:bbfc1ec525d7891335858080748d2342f9c7038e537b89e3f56f723f02740560` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:ffcc09581745604e118336b57928d0461ff16eeb86fa886e1fde55f43701cbc4` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1007.1h exceeds 168h.
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
