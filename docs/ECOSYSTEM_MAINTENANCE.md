# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-17T09:02:34.778Z
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
- Public repositories indexed: 161
- Public assets scored: 161
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 173
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:3592e474e006b5568c77812483b3abb699d54c4526644fe2bdbf98c54fc3741d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  19199ms |
| golden_path                 | failed |   3648ms |
| golden_path_vercel          | passed |    301ms |
| recipe_catalog_post_proof   | passed |    307ms |
| resource_library_post_proof | passed |    308ms |
| proof_environment           | failed |   8218ms |
| db_proof                    | passed |    295ms |
| operator_test               | failed |    321ms |
| maturity_lift               | passed |    291ms |
| daily_operating_loop        | passed |    298ms |
| portfolio_packaging         | passed |    299ms |
| public_proof_export         | passed |    299ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:4775cae66ada766284bc592fff535aa6e323fa8026ec1646537af5debbaf9dca` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:d51593ce696ba23381e4437960db132cc78bdfa8406a1b7680e3aecd09c627c5` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:9adf7f452e79df3c06b8a3b650525cdb543ec0d0783a4585152d73edd6667558` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:5b1baa226f2d07faf65898c773141cdf3957da9b46cd8dec568866b9c0010573` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:4a6d6723d2e2946481010a14f15f4f1bb75d1e5f94861e4120422887e85b660c` |
| `data/golden-path-runs.public.json`              | stale  | 2709.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:86c90753fca547cd6619274684fdeebcd9f8d2be7d54441db5c5d96f4a6e23c7` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:a34f2e5658f2bfb36b475d8c4d140199195ddded331dec30aed276734e1edf92` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:a5c629983310c53f9d3f8b746ac4d0c86d87f9a07f2aeda6e4ec813473f730bb` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:ef46d1dd34348fe7d5813d69fc48deace4efe7777a10c9cb094594bc2b6df517` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:ab2f2700ecacbf24064793f7f8f9c363e2ab60b78757074a57c1e8321a5d0042` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:b0aa5ea3b55bf953ce234b97cfcda312930460cff52ba1a60bfc6fceba03771a` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:dea4b49e0fe7f2bd516038770fcf1d5263df1f93eeaa1e22e415b7df29d8d0ea` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:a5c629983310c53f9d3f8b746ac4d0c86d87f9a07f2aeda6e4ec813473f730bb` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:370e1674b9eae8c13ac43ea815efeb7c3c092a664d6c40226f35e0d64cdc3477` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2709.9h exceeds 168h.
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
