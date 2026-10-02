# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-02T09:02:54.872Z
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
- Public proof hash: `sha256:582617571d18b77ddf7fad92d7850ce71d28f4796c3b1b315e8e0b560bf02213`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17639ms |
| golden_path                 | failed |   4921ms |
| golden_path_vercel          | passed |    330ms |
| recipe_catalog_post_proof   | passed |    343ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   8518ms |
| db_proof                    | passed |    325ms |
| operator_test               | failed |    364ms |
| maturity_lift               | passed |    333ms |
| daily_operating_loop        | passed |    329ms |
| portfolio_packaging         | passed |    332ms |
| public_proof_export         | passed |    338ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:8a074e0657c8517d4a0d069f221ef6aef85d244c1847bdbe21f6e5aeacbe253f` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:e8a02aa301619510adc724c3940164084701eee727260e5070a479a0488e71be` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:7eb3a797a75e8ae07cad7c5fec24c198de6ce3f9f8b5e1b43b7a52fbea83c2a0` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:59b8d5711950271050050f2ba903cef52cf2a6412c454ffee0d439c57d330138` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:71cf0d60f1dce255fdf118d2c99c566b652f6f9cbe939721516a351ce77cf3c2` |
| `data/golden-path-runs.public.json`              | stale  | 1605.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:ec00abd580eb3c99751a6f975f717f7dc3b02f95977fa01360f90a680f70edcd` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:7d78cb3a05ae81991be45e83cc1892169d796a1ef01922fdbb38f5fd72839752` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:b037eef81ff491372b64660051891cc0f510ea490b444113d566ee30e82ed848` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:109e686634cd87594346bfc510451489df702634e1e9b78b6ff4ea4ab25c115e` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:174feed70bfcd6ec1f171dbd71a85735c14502ae80f4f26bb4e6499e5b0e3083` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:1d9f72e2dc240d6e11d9f57a2352b346e523c0cff34fe690930768e588f9f3dd` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:660f28ee29cc1af53082a45e7029a40550d54a5d69161ce25cf7a8722a7e0496` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:b037eef81ff491372b64660051891cc0f510ea490b444113d566ee30e82ed848` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:ae409d2cf5ea8202672935b6224e75ac46c6cffa7c379aac5cde1f26b03b22e9` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1605.9h exceeds 168h.
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
