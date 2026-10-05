# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-05T10:17:04.737Z
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
- Public proof hash: `sha256:92b1bbb514e2a04c3145975b863ddcadfdf41bd3a4d094ff9e2618b7e273b124`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14368ms |
| golden_path                 | failed |   3915ms |
| golden_path_vercel          | passed |    321ms |
| recipe_catalog_post_proof   | passed |    337ms |
| resource_library_post_proof | passed |    337ms |
| proof_environment           | failed |   8244ms |
| db_proof                    | passed |    325ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    322ms |
| daily_operating_loop        | passed |    318ms |
| portfolio_packaging         | passed |    331ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:0f605caa1a2c9e8d8ba138359f93b7c38c95675d1fd3677442da70cb70f693d6` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:d34c4c68b87290c94eee84555638ee7550916a70f8a840d678c36a851fe98c43` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:5f14d9a9c74a409a12fa54f3d5f1fdac3cd907c1ab4c7d1b7177a468f1e4622f` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:2df78288acff78c253cfa122db4080cac2493b8d68baa2e06f8795b89958f920` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:33f40b4fb99c8dbd2912fe10eba7a6a67e77d87e3cb2c379ec2032ad6ef427b1` |
| `data/golden-path-runs.public.json`              | stale  | 1679.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:209f2f5c1727ee7d76e1452bfca5e22a526c07c3b5dfe98088e8674a1cabffbe` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:efb9a7d0057cac4a5990bb6aba9aac0c0171c50e5e94f5852f91d251d249d345` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:7531d38b8217032b1e739293250303c9efe3207aa7db53da6aa672ff8bc1235a` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:fda38ae7bb39afb5876eba6bfd8a83d6bec3a65f8a34b13e2651473aa8d5e272` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:6389595d1e228de865f6b250f58c9510f9018d097d5b4edcb70a8608893c44e2` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:5f53c7acd77956d4851148101db4ca27e195c491e690326fdfab4e5c83f83ec9` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:8a66addccb5e5c14c7f3754747dec5f748e588d7ec016e7a1e66f8afd9954ebf` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:7531d38b8217032b1e739293250303c9efe3207aa7db53da6aa672ff8bc1235a` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:99aa02cfff9102b8e22422f4efa172d2f11d41af8a16afc6a8272bdfee899e62` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1679.1h exceeds 168h.
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
