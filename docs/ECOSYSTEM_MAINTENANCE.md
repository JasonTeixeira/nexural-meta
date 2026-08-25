# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-25T09:11:51.766Z
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
- Public proof hash: `sha256:05c30ec87eeda16606b9f268240b660569e305ad99dec09410cc8f4a06b8438a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13157ms |
| golden_path                 | failed |   2707ms |
| golden_path_vercel          | passed |    244ms |
| recipe_catalog_post_proof   | passed |    251ms |
| resource_library_post_proof | passed |    246ms |
| proof_environment           | failed |   8601ms |
| db_proof                    | passed |    235ms |
| operator_test               | failed |    263ms |
| maturity_lift               | passed |    240ms |
| daily_operating_loop        | passed |    235ms |
| portfolio_packaging         | passed |    244ms |
| public_proof_export         | passed |    244ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:493069c2ef824d2b0622d396dbbffb822641fae51b63bd019e72fc2df0a9b7f9` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:4bb706fcc9b8ab8caa743003dc49be75579e9c511a473ed7ad4702051d1e489d` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:8830c38044098c85c56c617c1ce50749578380d75e5a0c06198f521543346e7e` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:041fa11c29777db62a1a57b030fe6032e44345da53065ca9288f3de1ed32c631` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:a5ed2588e057d9ec2f5a83a9ec0b10292f0e6019eccaf3fa116bb68084f4ab68` |
| `data/golden-path-runs.public.json`              | stale  | 694h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:66bb63e09e9d7444549b80ab3a3e59a405307a01ac05fd77d0164360d9894111` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:85b726f50b79a7e8e31206f6d32891f5fd42b8bb93b1bde1d1154e05811a8cf6` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:a194823b4801130d088c6c4459d5d498315171e9b1f9152bae482341a67cb7c2` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:c9fbf5c5f06e1bb7165a775ffa030ba82e87ce479dfc2b419da3a01157b88200` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:a1c133f2144391a18891f85dbc3db55ee1a1f94a8fe59cf6fe5fed0044362106` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:3a03cd8d44f03dd0b759220dc4bf7d630c465a7c0a79a04ff72393a88742b731` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:6c1107d0619998f27615a6d69a08fc2506174e65f9020e31cf4cccffb846eb95` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:a194823b4801130d088c6c4459d5d498315171e9b1f9152bae482341a67cb7c2` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:59fbdb2e03facbbba12640644e06e97508b6873a9fc41478a57628e0f98ca438` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 694h exceeds 168h.
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
