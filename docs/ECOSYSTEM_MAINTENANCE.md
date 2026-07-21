# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-21T09:52:03.706Z
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
- Fresh artifacts: 15/15
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/181
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:6e2871b33882c17c02d9f6dbe31357f95f268d7b2a7fbb7e37218494b26c9132`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16890ms |
| golden_path                 | passed | 157366ms |
| golden_path_vercel          | failed |  73882ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   1552ms |
| db_proof                    | passed |    314ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    319ms |
| daily_operating_loop        | passed |    316ms |
| portfolio_packaging         | passed |    322ms |
| public_proof_export         | passed |    330ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:ac45445e77b093015afd7bc2e7e34a7990db8886a1b52c333c84af95254694bc` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:95b211e3970de85acddc34a9e4d37d9d57fe1ec41d8b2d35d4cce5f490f9f4a9` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:be2aa7223975fe5c28fde7654f701868cd6584b3ea878e6b59bf6966946182da` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:45c2d12909915582f6d7083aa3a7d80a560ca5d91e79dd034b5208ac8dfd1d42` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:f8357616828499783fde17ea9514b09762eca0e757b5e57ec39fb16ee87b0599` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:9fa394ffaa1374abff94f8561dbf764fcc3b109ce7323304bc9c56587ec75a83` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:74280fcdd5b7e30d371133511b348acb5d8081f35bc2771d5a71687129d11678` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:d311b9fee1160ac9802472208cf2ae3714db817fa0f96e6fc21de90caf6e7c88` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:af6f2b157251a59235049af547d3cde2d8d70f617a99bf9525ac4fae6f6676d7` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:59ed157a79da41a8bda98255719071b55552e3287deb76e89536b14b5970f167` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:c2666b5cbad5f92653a032f782bc1db6bf62eb9ac3ea48f5773e582b5cc7e2ed` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:9cd91fab7ef7639ccdaacdb126c77bfa5623984bfb29bfcfa5da1415cd0b68d0` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:ba3200ff6c28a860189b25637d61c09f0ba52a45a047aa482724b1693faffe88` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:af6f2b157251a59235049af547d3cde2d8d70f617a99bf9525ac4fae6f6676d7` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:97cddddd99ee8dbfd7cf89a98c8b2119a50c534617dda75f4a544a6e6d26f12c` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
