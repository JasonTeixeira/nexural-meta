# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-13T10:08:14.869Z
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
- Public repositories indexed: 139
- Public assets scored: 139
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 151
- Golden path: 14/14 gates
- Hosted golden paths: 78/151
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b060b52e17f18d25c858b85f1411a3a90002740bfbd01ca83dbdb2f8cd7c79f5`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16401ms |
| golden_path                 | passed | 168025ms |
| golden_path_vercel          | failed |  97292ms |
| recipe_catalog_post_proof   | passed |    358ms |
| resource_library_post_proof | passed |    350ms |
| proof_environment           | failed |   1561ms |
| db_proof                    | passed |    330ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    346ms |
| daily_operating_loop        | passed |    333ms |
| portfolio_packaging         | passed |    335ms |
| public_proof_export         | passed |    345ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:70432742f2140e42af9bf946709766363548c53a459dac641b2d35467a25c8e5` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:0432cd843198dc767c74553156fe63bcd9b2c6d07940b1c7f0c7a21242f4e3b7` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:a40c089daabdba48132cbd8b857581245fabb1ebed1095c62498425f98dcf939` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:3458d3089d77351afda0ae17f27c17301e200fae4c50b67f22ef23b5588fa0ea` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:6879878be8331e8f8163541de92eb6b3df41577dfcd1eff6573381cc0d2f6855` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:ae9e63433c5278787ceb8c9226809e21fd6723535db884af8d9c03a7f40432d2` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:902e3b03fe8c8943f138ea0083922c32da345540e1f5012700525d001baeeb82` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:d70e58607a6b6e28a45d72018a5351f2975d5885323ae25969738803375cc565` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:63561126b20d40c765b268ed35764ed87ca5a514fe68c5f8f3119be1370fe401` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:a30052630eba763bbdeaff10bebaa74a8c9a68d74beb358a85ee3acf23adf914` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:46ee39244fba52ab01f57944f49bcec905f2b703aa57dd60fe9a5e786771b426` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:4bd07b451da5fd93ca7cabce0b946cb01019c107319249617137484db5f948c2` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:466704df27314591ca639b4eb046e41674bb335bf48dd51f10d72bfaa1d9025a` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:63561126b20d40c765b268ed35764ed87ca5a514fe68c5f8f3119be1370fe401` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:348aea28e8694e4bb9b12720f29a2fe9f54caf82a2ad6fa88cae62c917521def` |

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
