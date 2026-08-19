# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-19T09:09:50.496Z
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
- Public proof hash: `sha256:5b389ae7e6400c0cdf6ecf329c501241604bfc3a1fa07663f979698a957c9d08`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14081ms |
| golden_path                 | failed |   3896ms |
| golden_path_vercel          | passed |    314ms |
| recipe_catalog_post_proof   | passed |    328ms |
| resource_library_post_proof | passed |    320ms |
| proof_environment           | failed |   8050ms |
| db_proof                    | passed |    306ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    321ms |
| daily_operating_loop        | passed |    310ms |
| portfolio_packaging         | passed |    324ms |
| public_proof_export         | passed |    321ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:4ceab3a4b6e7e7e095a0875a68873b43c46d192152febf95a6f5589186fa973d` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:4730deec6a6fdbbdebcebd68a24b24b6afe19c6ab3f80d6d054e777d6abded85` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:bdb4da35498c3767ee7a4dd7ce83b0f54eeb1c5f59203ead11c3d344cb46c9f3` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:5235aa68625d182ede5d4bed694573ebc366cdbbe0e92e16d0976a805bf227fd` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:89f8fcbea0bef42c37f32902cd4664a0361ba121abc71bb90eef8aa38fba2b37` |
| `data/golden-path-runs.public.json`              | stale  | 550h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:dd038cdf7bff76941de93cef0c49cfded999abfc7a9b237527c41567edab22b2` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:07abf2fe35935c2654871fc5e4dcffd0385ba9ee74ef7ea01a2ed5aabd908bfd` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:411eab60adc55e98ed8c4b7f514aced15ddd143c37504e1d25b131c9affb78a0` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:b6e7c85da1e5ba656790230d61ea919ebbf03eb430e6e9ad3db98ed161ac873b` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:6d67831164620ed25a001d6094c5acc590b5263ed843132a2e995febfbbf4f02` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:a3e134e6e110b7df520ddff69d7ecf555cfd435f3bd1c1d4f1105a30ae73b666` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:9909098391c22d4fb06b736025f21d35ce4f3e67da5e056aa7ab39b62976d93f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:411eab60adc55e98ed8c4b7f514aced15ddd143c37504e1d25b131c9affb78a0` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:a8818f0446b4f521d85bd7902fc6049a423213171b0b0a63999b7b0873b75cd3` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 550h exceeds 168h.
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
