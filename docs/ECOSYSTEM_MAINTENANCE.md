# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-28T09:06:21.515Z
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
- Public proof hash: `sha256:465f72edf6373b753a0622ec6d07e1b4bfdfbaed54c88a08f9482d682cd0209d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17777ms |
| golden_path                 | failed |   3689ms |
| golden_path_vercel          | passed |    311ms |
| recipe_catalog_post_proof   | passed |    320ms |
| resource_library_post_proof | passed |    320ms |
| proof_environment           | failed |   8511ms |
| db_proof                    | passed |    303ms |
| operator_test               | failed |    335ms |
| maturity_lift               | passed |    302ms |
| daily_operating_loop        | passed |    301ms |
| portfolio_packaging         | passed |    308ms |
| public_proof_export         | passed |    312ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:1057427d6c001a22147eaef64989bf28e97d49cb4cf46d50521eb5e9c08c2b64` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:f195221dbde72e1f522c6ccb6fbd63d3e8e7df87b43fe6a4df66e9330e86666e` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:bb6fa38490ae3934f5bd7087d02b722e0a0467f00faa20d68516360054941087` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:db0bfc7c80ecef049f29688d2da96f289436844125ccb6f2537b4922c5a8e498` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:1de11ae8483995298373a812c8f6717d34d04e5335d13dfb4bc7e399829e3da4` |
| `data/golden-path-runs.public.json`              | stale  | 1510h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:26f97c958e1dc91b57938d573e43856d334331cacc757675015085b697ebe199` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:a07dabacd756d3aeb942601f614e4ecf81fe8c633e98a700c3f2f1259a68cf48` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:d55fd461a9e82426b43bbee6994d00ac11938be073fdfe49cb734675a7fec407` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:7e6f6781e1abb86e2f859d545fde4288b52597d1ea099fbfc11cfcca72610a4a` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:61f0680b17bcef3e065503e89ab19dd094a378516f025f49a7a1ab5e264451e2` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:a0aeaee5bddf8c6bdbb5029eafa0727c1a7588a11792635dc1f814bca902436a` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:90ecb91816127182f203fc328a4139ab798683beb4a55be3b04bb40a517047eb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:d55fd461a9e82426b43bbee6994d00ac11938be073fdfe49cb734675a7fec407` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:ec9d4d146ed54418abf3935107984e526340baff7f29521cdf2a2420c27406e6` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1510h exceeds 168h.
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
