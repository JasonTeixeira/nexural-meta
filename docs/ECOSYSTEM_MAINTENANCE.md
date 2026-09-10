# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-10T09:02:42.670Z
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
- Public proof hash: `sha256:4c728407e96da39154eafb9bad9d6181a7ca306c5e18a4c3b906819deb7d946b`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17707ms |
| golden_path                 | failed |   3981ms |
| golden_path_vercel          | passed |    324ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    330ms |
| proof_environment           | failed |   8405ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    348ms |
| maturity_lift               | passed |    321ms |
| daily_operating_loop        | passed |    314ms |
| portfolio_packaging         | passed |    320ms |
| public_proof_export         | passed |    330ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:897e64fcce68b10f61894ead4581f288087a8fbaef1cc0e1e715d627d34cd04b` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:25b19d645c0a7a6f34feb27caa09b03721ee5e45ca659187255ba9199a68312a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:865c6253600323e48be611d5efc0bc41fa0b418168af673570fc586a01b00d4b` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6247796a1b4a26d54d16c1d71b374c6b0d67295b4a87c56c4bfa9a1b3c03f5c0` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:e58d1e9859d9d1b31a7ff286bed277ff0991a5ca9c8d5c1911a1c9eb82b2b0c3` |
| `data/golden-path-runs.public.json`              | stale  | 1077.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:66e94bcbea24185c9bee3d691e665eb3227ae119c18b42266b3b5ef16b4c6985` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:c1a39ac6fc4e17e625a037f6bf3185a07430e1ce2bb46cbb7e392efe014d22a3` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:b2cbbd87833810aff094a3e3dedfc70f663986cbb99daa72290bb02f1f1ad058` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:974fcfa609d471cfc4ca9a6edef1d4f85e9b3fbdc455f7abbae0028e9bb0fd52` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:f2d5b138f15f4195b89189bc3d3896358156a6cc05c68ab933fec33ac226397b` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:f840a445cdf898a491660152559cd7a87284d19c6423e2c4ebb658ea41c8f799` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:f6c873a1b69f44c33b8cb00dc0d9e70af9fb6084dce4c041fd4c0b76211fad70` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:b2cbbd87833810aff094a3e3dedfc70f663986cbb99daa72290bb02f1f1ad058` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:ee7aa89ee560c752fd80e24d677e18b37311a84cbc05eadcf40dfe99337eb112` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1077.9h exceeds 168h.
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
