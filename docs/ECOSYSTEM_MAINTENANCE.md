# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-16T09:42:51.161Z
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
- Hosted golden paths: 78/163
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:e269fceb5f876d847cedf0402bf56f78d7980b89b9694c2f32823a112e9a6070`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14080ms |
| golden_path                 | passed | 152797ms |
| golden_path_vercel          | failed |  84478ms |
| recipe_catalog_post_proof   | passed |    319ms |
| resource_library_post_proof | passed |    317ms |
| proof_environment           | failed |   1481ms |
| db_proof                    | passed |    303ms |
| operator_test               | failed |    339ms |
| maturity_lift               | passed |    304ms |
| daily_operating_loop        | passed |    307ms |
| portfolio_packaging         | passed |    310ms |
| public_proof_export         | passed |    317ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:fa4d203aa025aae9c2b56deae50b83df782cbf4d0d1d95360af1aeaa75dbadc7` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:7569a4f099dbcc66138cc3139677d9059488a844ea9e88876772fb535cb99c9d` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:a656d113d572ec7b682e5ca38d82994db5c149f12bd4383203f52786bad4b1dc` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:3f1483f9cb570685624fb2e779a3eca30b4ff0caf7b79a080c9a73e5f0abd83a` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:c142d8e906eacc2ac858a0161fa8c915c4e80b54ccb26a2c3774cce49977e613` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:5257273b144f2bbef8292f681b4363d62e9387f8edf7cf9ca11af25d3ac62ae9` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:0fe0c3a405d3fddace5e8261900adcc9ee53631bba43ea22c7685b082531b077` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:a75e48b0238ca8a32e822e6a280474ce25f08c6941529bc60c432bba4a7e9524` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:db6ec601bb31d70978200346611e502179cf618526d861fed24880b69b5adf94` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:5836d86870dea3f173b6a2287adb11e9a6902436992ea9718f665aedf5470693` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:869f0f69bc7038617ff8a426c96d75384ab58ff00ca57afe1456b850573c2e52` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:95afb9ef6ce6d70836f4e62c7a149c10dde3827207c910788ea4c6bed3493991` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:6a7db195712861a5e12f8d5826b210e149e9a0049d9450eebacd2f27aa2edcfc` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:db6ec601bb31d70978200346611e502179cf618526d861fed24880b69b5adf94` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:030e43ed66383816e7fa52d203b6b06ed31c6c537677686c51d745bacd8f6f7d` |

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
