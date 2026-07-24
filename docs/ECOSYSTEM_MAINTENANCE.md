# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-24T09:49:30.090Z
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
- Hosted golden paths: 78/190
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:ec797703020a9677f96f7e283665ee3861db336868a1c4dd47e44aa3e3140870`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14353ms |
| golden_path                 | passed | 152941ms |
| golden_path_vercel          | failed |  82691ms |
| recipe_catalog_post_proof   | passed |    321ms |
| resource_library_post_proof | passed |    317ms |
| proof_environment           | failed |   1444ms |
| db_proof                    | passed |    299ms |
| operator_test               | failed |    331ms |
| maturity_lift               | passed |    303ms |
| daily_operating_loop        | passed |    302ms |
| portfolio_packaging         | passed |    307ms |
| public_proof_export         | passed |    311ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:cde805bfbd42add3e98def3ce19b587a80a1ddc574041539ead623e82cbaf7af` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:092fd24af55ddc7f076ebd7dcdfaef31d218102f2335ec5ab3382309b539a5fc` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:2d68fd17ed301b27005143088a9dbc4419203d52d3a3b5f14a30e4d31f6c886e` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:139fa842fa585d57b74ba5ebd266eacc3f594ebec4cf2892ad567887fc84ec31` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:74799ccf420b85da979a62d057d90b619b4c7ff37e1dfde210e1a77f70c00f8f` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:61bd60e6e1ef9851e4b06e9167a66f9323ed32cabf54a2a2229837c1c98e863c` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:cf9082d6485d20b6e05f6b137f7bbe8c175ead87c98ab4d79345849f96987c6b` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:f5643925974a8c0f74a6d0459e4b1dcf9f4100136255e87fddf9a9b61dc543b6` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:640a9620126e81f494164e931d7c645991bd3bb6a5bc6bec6c1dcaa3a0912d11` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:6b69cad891a951b223632bf57881365b902e1755856f28e1ca19e09aafc97d8e` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:c0184621d72369b7b5c3d43c4eaff51bd298d8ea3d6aa0e23ad009cba7ca5e0a` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:786ada96a31bbafd6c56fe66d8811d26dbe566450289c3c6ce776ca49161cd95` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:97a3ce73518f664a223cf7eba9f6e52a6a6cf5ed6f1c17ebe1125d73a0294a1d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:640a9620126e81f494164e931d7c645991bd3bb6a5bc6bec6c1dcaa3a0912d11` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:0f7e4dc43c537a24f24977789b97f5a6aae6b045381108ac20e75700c3fad6f8` |

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
