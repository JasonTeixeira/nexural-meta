# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-30T09:03:01.620Z
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
- Public proof hash: `sha256:0fc27849f75113b9a8f266f9ca0b23c7d5eecb481ce59c04942d738da0442c86`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16552ms |
| golden_path                 | failed |   4199ms |
| golden_path_vercel          | passed |    323ms |
| recipe_catalog_post_proof   | passed |    340ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |  14974ms |
| db_proof                    | passed |    314ms |
| operator_test               | failed |    351ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    322ms |
| portfolio_packaging         | passed |    319ms |
| public_proof_export         | passed |    329ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:2e8378794b9f8f54bc1dd56b94cafdc5075e9af8c22dd66312a323367689df68` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:826152a9af0955bd43d13af155bd1ca2f1cea8c6fe46234948904aeea8e0ced7` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:55117017ef3beb7e3f57f2002346e54ab7c62ab9ae8bb6e75ee636aeb51c3cd2` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6f1881f5f06ad714789e8c22e2a92501af7b1a024ad5d3bb93f2564887075019` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:bf8e826b5a69adf1a72c5a0e5aa75d2b95574e2b814962cc96903502bbd0eaed` |
| `data/golden-path-runs.public.json`              | stale  | 1557.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:9a542a8f3f3cb0d67360742172523099e48ccf6a76c8c0aba98f973a58f76dae` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:f697a9da9361a1836ad8c73d733193ad96e1c05eaa1fe8bd2bc282e63f5a4ba0` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:37c49fc4dc8390bc70ed2e0d36182cb0ade3510486371730a6d9a8c6d182896e` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:3d3e177f4cc9c29c9f70fc40ba3376c41223cb1ab9a2f2e62390c08a919be05e` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:db6e0e6004fb4d93985e9257a50ab8dd857bab792860f138908911408b8a9936` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:162a23591aa363e072ba3bdd5f5e77717835abae9fc6b57a826ecfab55b2e1a9` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:b89cacde4e2a36c0b3f2bb33be26e953de9975ca280ac14c744b1baac9e9c2d2` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:37c49fc4dc8390bc70ed2e0d36182cb0ade3510486371730a6d9a8c6d182896e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:0d86e9242fdee944f34eb3d0d97c5ba0ccbe92a7abbf18e77850dd5acfbb8972` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1557.9h exceeds 168h.
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
