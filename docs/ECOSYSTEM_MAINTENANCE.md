# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-15T09:03:03.992Z
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
- Public proof hash: `sha256:65e10d02173438f6208e31cf19516962c04bdf63dba8c501c65fb190702d7f19`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17014ms |
| golden_path                 | failed |   3623ms |
| golden_path_vercel          | passed |    321ms |
| recipe_catalog_post_proof   | passed |    341ms |
| resource_library_post_proof | passed |    332ms |
| proof_environment           | failed |   8134ms |
| db_proof                    | passed |    311ms |
| operator_test               | failed |    345ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    322ms |
| public_proof_export         | passed |    326ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:d66f05f809af03682e6980946499c9956b69cda9b9ad2ce6e51f375673072067` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:e64c8ae66a873b5deab83e375a1cdd8251926d8b4b591854b2d165d48e8103a3` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:7d0f7bd3c541a2a91558686475b9e98f2b6b4f3813363b43e64c70f70de0d319` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:c2a6a277b06c75c63433d4ea89650af0fdcbbdc9d7d27e7d30fcd64b0490be5d` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:f08c7e33e8287534589d9909297114fd7a6c220c00dfb4c993bf67ce843a82b4` |
| `data/golden-path-runs.public.json`              | stale  | 1197.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:d3bb719edb07f3910e6e3d1402aa5f14285df29c23faeeca7a071c2759897303` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:508ec07f21ac440897341051685111e433fae329fdcdb04e74c14d6923402cc4` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:04de8bd1463198fc81a627bb9360abd4c188f0bfdeb716d456ccca1b0a741f0f` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:fed4e831148c652e22794d7c15d94bf303286f9663941ad5135409263a619193` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:a7cd3f04a261f333d0276255ddc528191c04a69da3a16b5eb552e9f21816f4ac` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:b4a4fc53809d1520200cb9113cb8b048debe844cd0bddd69d49106932294677f` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:44cc4427fb1f97bad0eba5c8d1cdc2eb73ff3f6e70a6d5b3d6466b48f4cfe3ca` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:04de8bd1463198fc81a627bb9360abd4c188f0bfdeb716d456ccca1b0a741f0f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:3e5d25520bfdf38f07d599eb5837e236fa5106ba887150510b666667d31d1137` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1197.9h exceeds 168h.
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
