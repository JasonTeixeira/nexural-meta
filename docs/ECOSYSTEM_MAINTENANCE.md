# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-01T10:24:04.474Z
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
- Public repositories indexed: 137
- Public assets scored: 137
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 149
- Golden path: 14/14 gates
- Hosted golden paths: 78/112
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:52da0844febc2fe11dc5261ccd522eb45ddf3d2b54ef208d47a21d98c3148ba8`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14493ms |
| golden_path                 | passed | 165856ms |
| golden_path_vercel          | failed |  84634ms |
| recipe_catalog_post_proof   | passed |    344ms |
| resource_library_post_proof | passed |    350ms |
| proof_environment           | failed |   1591ms |
| db_proof                    | passed |    329ms |
| operator_test               | failed |    355ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    322ms |
| portfolio_packaging         | passed |    329ms |
| public_proof_export         | passed |    335ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:9243f3e86e0ef6342a7ed12ea39603eea3383e60ddad1bfd32df0b87d6de28cf` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:16d6f7b9eb30c300fd0520865bc94930a163e055f46d7d61374e7c11e5de71b0` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:47341f7c88a1e62800744da0182ea9ec97f79f7b673fe4fae165e5a61e821c47` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:7e5734519d3b8ac3073ea663fc503439e436bf70f8469dc7e2539c57f226bdcb` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:37c64664c934212de72e1bea72c7e24c596627394a0e6fcad29a9f5740d10a71` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:1c1333fafb3f9f702c4d56bc66a6b54ceef25101c168754abade411365836508` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:31787c71a77e4269368c91db6f02cad6a22919806cd132cc0b863fecc92e10d3` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:5af2a1f90802891623960af57f65a692ed9d8ef1f8be0344d6f73e8d8e443bc6` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:c34a4b939dfff56b8ba1ee1f88874b78f26626e6ce5c85e537b24727c50f9fb2` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:6a018518e1fe0e1856549ff02b914f264ea91baedc669f0da747e94be2bd8f1b` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:83dac49f32c5900d68b0908ef231b6f39976b5a992640dad4967803256bf097a` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:df855c9b44844fae754c14d674d977c2295c28ed48711a4715fcc2711a249d61` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:5d32439f889d7a1faa216902869adec67e99aec7b79c14bba42a41c3e4b01760` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:c34a4b939dfff56b8ba1ee1f88874b78f26626e6ce5c85e537b24727c50f9fb2` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:c99167d7ea598085b96ac7df7512300430d1435d548096613a83eabb7b9a2123` |

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
