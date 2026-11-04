# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-04T09:02:34.061Z
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
- Public repositories indexed: 153
- Public assets scored: 153
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 165
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:f40401a279463df972b0a218f4e788e0b3ce4bf56697c01709c833ed87176042`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  19005ms |
| golden_path                 | failed |   4684ms |
| golden_path_vercel          | passed |    438ms |
| recipe_catalog_post_proof   | passed |    460ms |
| resource_library_post_proof | passed |    446ms |
| proof_environment           | failed |   8475ms |
| db_proof                    | passed |    429ms |
| operator_test               | failed |    462ms |
| maturity_lift               | passed |    427ms |
| daily_operating_loop        | passed |    431ms |
| portfolio_packaging         | passed |    433ms |
| public_proof_export         | passed |    439ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:0ab0bfdb60540cff4c09d92b6b71d06f9a1c13fd1ab4f7720b87b637ef501133` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:8662126b47b343ddd85278b7bc75a79a4e40791cde92a6d0e10b0d2ae8ead925` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:915a6efe2459fbc4b07ef8baa9e69659c42d9ca4a125aa929eaa330e3839b5fc` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:29324c4978abe023c28d7c7e2e95b9b609867d83e93fa1b3a52ba0b0fbd16b80` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:81f33088c5bb50fdf2483768a6a1f3377020a0e06554d4eece49df3f59f4b6a2` |
| `data/golden-path-runs.public.json`              | stale  | 2397.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:8ab1ef00b65ee2fde3104dee6922e22ff6563558b95b73eb44760a105b95cd34` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:ce9cabfac2a20ea97ae6c1e185bf571b1b754968357e3512f976c9746943918a` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:e0a1af345f9131fe575725440c316bdf5f37136eae8861a14290271eed86b3bc` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:d8bd6edd0baba9612f742bdd379f4ef34449d0eddf08910b4b27955ce8036799` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:f50af5560c5b3a8ec122dd2b92e60a8dcc2af3e6da73eaaa464dabc8826335f7` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:8d6042352f241a1da1761de8b8a73dfa10dcbc96baf1a8d0f9fce5194740d487` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:8be11421970e20f64c6a93411760a892ac9af350de4a0cb42344aecb755ea4cf` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:e0a1af345f9131fe575725440c316bdf5f37136eae8861a14290271eed86b3bc` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:9a9239492226b38c92e112983507d351932d439356d52c5dd027cc22aa00b9ef` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2397.9h exceeds 168h.
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
