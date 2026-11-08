# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-08T09:02:14.701Z
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
- Public repositories indexed: 157
- Public assets scored: 157
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 169
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:c20119a9ea49428ee03363c4bf90f1d52b12b5d59f329ac23ca7b0cec93c333e`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15257ms |
| golden_path                 | failed |   3874ms |
| golden_path_vercel          | passed |    350ms |
| recipe_catalog_post_proof   | passed |    364ms |
| resource_library_post_proof | passed |    360ms |
| proof_environment           | failed |   8327ms |
| db_proof                    | passed |    334ms |
| operator_test               | failed |    374ms |
| maturity_lift               | passed |    340ms |
| daily_operating_loop        | passed |    335ms |
| portfolio_packaging         | passed |    346ms |
| public_proof_export         | passed |    348ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:15e28ea62b30ae84e755a62f6ebd0435f20ac4a82847dcaf33a3a131d8851df1` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:0b7e94ddffa2bf308787550d2483b64da40b8ee6e8b8f70802aa481afb7db02a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:6d96280eb61d2b1016ccc79fa1bc614e72982efb17b41373289980723265939f` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:5123e10a0858a5df9c3d48a275995788c5500158f7202497c09450f8e5d2b3f4` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:6abb335ced96d9298490af0e818c40e37a9f43d4fcacd8aa16306822ce6182e7` |
| `data/golden-path-runs.public.json`              | stale  | 2493.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:a4791f4ae1c2a8b323011b7e44a50bb5317b96abfa4e31c0a616c963fa6bcfc2` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:cb626393bf7c4befac2870b51449bfa7e2539c12037d0d1e7f6e7a928ffb58cf` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:ec05ce3ffba854c222e295bef77038bf641f2324b4907a2aed564498bb1a457e` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:ba70837cde0c0a6b785ffcbf356214b55ce2f63872a304d8204fc7fe2a7a36eb` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:952f5dd945bd92b5d0296593eb10dafdf4deddda5de29e1b8b8ed253a464193d` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:4bd901327e1915ddc9e82af558a388fce3e64c5181039d90b967d7184c7a6722` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:8b360a7c72aa1c62c6bd9f2e0235bf1e3511228d7eb1b143cadf6dadffbe9f9c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:ec05ce3ffba854c222e295bef77038bf641f2324b4907a2aed564498bb1a457e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:3c466ba51d1df73351608606f4a58b39448a2ecea6f39a33b8ab1f47a1ed6895` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2493.9h exceeds 168h.
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
