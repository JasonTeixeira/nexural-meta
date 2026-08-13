# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-13T09:24:38.241Z
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
- Public proof hash: `sha256:fb9767419fea786269628112c223c01dfa1691cf63182463c791e3f60dcd67bf`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15943ms |
| golden_path                 | failed |   3612ms |
| golden_path_vercel          | passed |    312ms |
| recipe_catalog_post_proof   | passed |    320ms |
| resource_library_post_proof | passed |    321ms |
| proof_environment           | failed |   8076ms |
| db_proof                    | passed |    307ms |
| operator_test               | failed |    334ms |
| maturity_lift               | passed |    309ms |
| daily_operating_loop        | passed |    308ms |
| portfolio_packaging         | passed |    311ms |
| public_proof_export         | passed |    313ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:19727d17fde3d579b8411a76e81f9d0de66e5fa19ccbfc668df5d3cc33ac02ff` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:030e48e0984604750e4466c6f8f6581221419bffa99016fcdd4f852837f180e5` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:659375fedbb11ca0d616a31d381f1ed9ae86e943ad95e605a0f668da68073206` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:3ba05bab83e7e2bd2bf02c280ba7147c398a56af211e2786a4fbb837c125b955` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:c7ddd4598f8b3a9140aed01aa6d2d2a11098dfa8563283d5242b0e123d654b38` |
| `data/golden-path-runs.public.json`              | stale  | 406.3h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:66d999b59720221233bdac487b4eda5c8247f572bd36dd36b331e82d8a618feb` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:947e86ee6fc26bbe314833e9ae56dde8df267b48cb3899072faf0fdef6397866` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:787908f9b3a7094ed7643d421b55aeef579f4521d910e8e7a81cd843a6e4a84e` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:46b63e1e6e3fae3025befb0ced2be4e4deadd2d85071b2fdd43ffa9ed18cbabc` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:385aa9ff8fc5e0430a4d21107e23437b85ff435784d182f02499248d215d56f2` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:4e3e215eb6b323bca73d362cb836915fb0c313a210e66817a905f721fc5c1f2e` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:7a93ccecf0d43dfc20ced67eca0941e1ba8ae07f644f820cb69e4284a206d50d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:787908f9b3a7094ed7643d421b55aeef579f4521d910e8e7a81cd843a6e4a84e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:5e8c94df6dd30695f9d6c10b8207819c129811241c529bab93a7c6366d7aee65` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 406.3h exceeds 168h.
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
