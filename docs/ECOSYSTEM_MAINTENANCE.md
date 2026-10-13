# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-13T09:07:46.344Z
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
- Public proof hash: `sha256:154021e15499f0ac42977a191f4b92f9c41e278a970fb37d877a048add53487c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15214ms |
| golden_path                 | failed |   3521ms |
| golden_path_vercel          | passed |    295ms |
| recipe_catalog_post_proof   | passed |    396ms |
| resource_library_post_proof | passed |    358ms |
| proof_environment           | failed |   9147ms |
| db_proof                    | passed |    297ms |
| operator_test               | failed |    323ms |
| maturity_lift               | passed |    294ms |
| daily_operating_loop        | passed |    295ms |
| portfolio_packaging         | passed |    302ms |
| public_proof_export         | passed |    300ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:73d19d9770f88627db7acfc6159108ee3e7f7be22d112aca7e62420568a8b377` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:91b60d1e0ee31412aa7dfb95a18b7c27521ae57e14e4645373c9f3b7ffaf2be1` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:17b0adc9f2f1495bbb95524c1d28a97c0919c04a95573aa454cd84f50179e8e2` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:ed5e9833d344204491dae2f4925fbd9fe40d774ebcbde8a349b7b179412cdf0b` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:9fc2037a6081ef6c8d7c5b24255064225ea868cb09b3c9552a803cf2f051d92d` |
| `data/golden-path-runs.public.json`              | stale  | 1870h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:e4bf78f023b8e0235abada68724a0c1e015ad5088bdb61c8726d1842aa9a50f9` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:86c1f4aa97e2d25f3cf55a3195848d1a32b0ec07b8ee504a4a130e2156bed73b` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:3618e037de7caff88e5fd927e86cad38a9769627a47c0a56ed1b4df6eb85766f` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:c9072e92a9c391efc83819ba09d7db73911a8292f6c9088942ffb3526ad6d74b` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:869e7be6ab9c74897725cacb95a9166ea3fa2bd878ce8a82bb0055855cb19d18` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:064c1a21978b648405f9590ac684a42cd77606ac135502fc211f43984b39351f` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:9f98b5377d99dd14a0093b7d47dd5a823b219f37e72f3c4c4c3fb132d62b1120` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:3618e037de7caff88e5fd927e86cad38a9769627a47c0a56ed1b4df6eb85766f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:3ffa29b9a7d4e5f7030447132efc73e26410ae730bc5e22b29b154851037b3cf` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1870h exceeds 168h.
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
