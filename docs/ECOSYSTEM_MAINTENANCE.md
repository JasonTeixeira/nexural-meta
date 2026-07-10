# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-10T10:10:46.529Z
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
- Public repositories indexed: 138
- Public assets scored: 138
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 150
- Golden path: 14/14 gates
- Hosted golden paths: 78/142
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:13013dc348c429285c70026ee2974974356a035d7019863d38fc57088eed72c6`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15335ms |
| golden_path                 | passed | 170569ms |
| golden_path_vercel          | failed |  80677ms |
| recipe_catalog_post_proof   | passed |    362ms |
| resource_library_post_proof | passed |    336ms |
| proof_environment           | failed |   1944ms |
| db_proof                    | passed |    320ms |
| operator_test               | failed |    364ms |
| maturity_lift               | passed |    334ms |
| daily_operating_loop        | passed |    331ms |
| portfolio_packaging         | passed |    336ms |
| public_proof_export         | passed |    341ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:03aab879aa90d9a40e3cedadf5e8bac7914716bbb36b22e9cb8c425638c42012` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:7802409d0d4f2046b5e7fae3612b52f3ca3efbe854083505b2598cf5e4d6571a` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:ab42f1d97b6c90414c04c7c7c763efe8d93a70db83ee58d621fc89ae540f9874` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:8898b77a68bfe0d9cb78480e60d8c0df8b39200c88e9ca37a1bc9deb6e60fbf6` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:edced1c659b96b0d2235b218fef5a9f6bcd92f7497f119593f1a4307eec70fb8` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:0cb5a70ef0efc2ebfd0250f178ead3f8ff67398bf244bb4d441212426ebd22c4` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:f1952d69dda54794c779ea88d04ff97ec8ef8126ca30d14a9bd9a249fd9ba338` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:f7da195b3f1164dd0cf22e192c1b867413d4dd23028b9cecfbd60c114a816cbe` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:244e5551c3038ba929e84e998e268694b12bf3fdfd0c40e291445d145b1c82fa` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:a19b1907d8a2e795e101b729b36bbf41fc1733d4c88ba52bc79045b163ffba6f` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:be4bb9f8a0d5e1c81ed365977d00c6c645b50f578b848df41af3527a8482be77` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:8d7198fc71b70f3e3d8915cf824614ad60b430cf43fff80be0f50a60a6ceccdc` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:1aaa6041420f95ca986d1915eb6c3a9f1efff510c52f52abc625e9d2cfc7ef58` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:244e5551c3038ba929e84e998e268694b12bf3fdfd0c40e291445d145b1c82fa` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:2264f5426430129f485eb1cf7aa058213cafb61a8e87a30ee895a3ec7925a367` |

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
