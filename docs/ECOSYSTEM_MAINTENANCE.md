# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-16T09:03:23.906Z
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
- Public proof hash: `sha256:0124ccee70a4bd02d92e1519df1d308582c6e9171707f8b46fd99ceedbf94d1e`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16926ms |
| golden_path                 | failed |   4575ms |
| golden_path_vercel          | passed |    319ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    322ms |
| proof_environment           | failed |   7982ms |
| db_proof                    | passed |    310ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    310ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    314ms |
| public_proof_export         | passed |    318ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:5789d42d7d33c6d38ba33d21d2e60f1a1ddb0087f2cf17fc8cdf3b3c26d6c92a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:0b93dbe93553ed3cb69de491bfdbe720c783f195ca441c7a7909e5b8cbf7909e` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:df51ce3481af97043d054af47d85e9e41871051a4d05d85f9302a66716cd6d2c` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:f873a25939c1380d805fb21598aa4610d1b4a1e44d236848b696b6dbc21e21eb` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:99b19ca2615446cd9ed2acc0bc912a781d01cf4999a46d31dc102223ed8ad18d` |
| `data/golden-path-runs.public.json`              | stale  | 1221.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:6b774a985d76e66327ed8e250fc22ad33742ab08d9bcb7768cd989a01151ec0a` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:81f1a08100506201a4bd7b423f63ecc4eb1fb18a4eba32039177dfee0f29e294` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:b68567633972afbc08a4c955d612bf3dc0b840334bc04bf5931b447ce28cc006` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:eae538c53b49e0bf6546735ad391872b5b05872df5ada79f281e90fc623aff4e` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:d65085bd0f8379b1c228feb61839095604abe1a030c5dad8fb8db03840e8b7da` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:acc18b4af03c4c832de91db6807d1d0216840bc7e8a63d3d976a8a46e4653d73` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:b3cf66b6f963115aed78c5f9de91c8104d3f2e2c4f844fe57bb4f8144881f482` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:b68567633972afbc08a4c955d612bf3dc0b840334bc04bf5931b447ce28cc006` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:c29240360b3c657613c51c53e587a500292d1ea5c40669122b9e377f0475534f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1221.9h exceeds 168h.
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
