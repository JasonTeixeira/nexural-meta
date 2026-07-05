# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-05T11:01:05.644Z
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
- Hosted golden paths: 78/124
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:54cc06d754e2d0df59777efbe9091e8b1aad7075af8865bed428d24ba29378c4`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14630ms |
| golden_path                 | passed | 180291ms |
| golden_path_vercel          | failed |  81213ms |
| recipe_catalog_post_proof   | passed |    349ms |
| resource_library_post_proof | passed |    359ms |
| proof_environment           | failed |   1823ms |
| db_proof                    | passed |    340ms |
| operator_test               | failed |    379ms |
| maturity_lift               | passed |    335ms |
| daily_operating_loop        | passed |    327ms |
| portfolio_packaging         | passed |    341ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:87415b271e1b047e62becdf6676a38e80ad536fd35382b56e66fef9cdeda4609` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:58b83f400abdcd325caf321107926601b5673c10fcc649d32df4017cb5fd939a` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:95ea19978fdaad53feda9ad07a2a4b30e329e632e7a6789d7a1121b59abcc105` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:f60b9921c4d790301dd11ed72209e3d0b32824a1824a376591418083d816b424` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:9f3cdca2a7d9ba7ab6bdc70cf9be82ac9b194153e2e238faac6f341ac9ae24a7` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:be2a8a90eb0d9f8ac808ee39d1a7ff498cbb85f529313c3e153e0c147402dae5` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:5056bf3a6f61af88d1916ccff0166008a75ed09b4adb5f85e700f5dde837570c` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:fe2821fd675319e78d052ce59603c28880744963b66006fd57c0a5a1e6e8691a` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:0317ed51e7347d39c5d6442c63725bddf3e00f519981a52a10a57b7285f22eeb` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:49b7c4810f74d6f7651a6460863d30389c3da156350c68b64caf32818c4d364e` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:7a187d4b46d9348fcc57c996656de7b8165d2b574043c62a97391b7cd7260257` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:0406b697a6d6a3503dedf8e2302eac8ba1c51351e04fa3df89fa9d1a3c58d808` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:6b74c769706a59badfaebfd1382d2e99d3e0de2cd597d6172ae9819f5f8a32de` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:0317ed51e7347d39c5d6442c63725bddf3e00f519981a52a10a57b7285f22eeb` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:cfdd4a0689104c7a2a98f681099ffd5318632d277170c9d47e7c4fbc6b945b02` |

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
