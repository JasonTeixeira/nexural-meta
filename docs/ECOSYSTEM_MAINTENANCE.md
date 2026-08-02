# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-02T09:38:17.459Z
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
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:56b0ad4974c30416f5e3157e2415f19774bf044c05d01f96ede05f60e7854a56`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13880ms |
| golden_path                 | failed |   3452ms |
| golden_path_vercel          | passed |    308ms |
| recipe_catalog_post_proof   | passed |    316ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   7877ms |
| db_proof                    | passed |    301ms |
| operator_test               | failed |    336ms |
| maturity_lift               | passed |    301ms |
| daily_operating_loop        | passed |    300ms |
| portfolio_packaging         | passed |    310ms |
| public_proof_export         | passed |    312ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:e66cc800155c52073c2c3c81d37fa50e0f3d5a593a0dd21f958915109024964f` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:8892915cc3f1babd23869969b30ab1e54c4ff73d25eb4268add23803629df08a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:5d79a2d013617d0327e66a7792e56c6cae59db3d39a6b82abb9d233cf43a3421` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:4f2e86962bfe46472345ca6a4ddb80cdd8bf9765c86d9496bf3524529e3372c0` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:235ae2dc09b9f0cf467f23e1e961be8a27137510879b8f13a339f593dc27a2c2` |
| `data/golden-path-runs.public.json`              | fresh  | 142.5h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:e668d4d8a02c23a396e953a707ec96c573fa54e3ea29518db29abdd385e4bf0f` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:ca9c232fa49ddf61f4de386af1e53c482b7853b9365d85f6e86d603135ea1262` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:0808326d3dabf6220b30dbd62be5fbe9529191ee25f13d0067bd86e9e21c8e88` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:46007fcb808a25bf3344ba5ef1611d37433c042809cf361ec61d14721b80c203` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:e25f05679952ebb9d1c9aaf7cf4147af04b8172de4ee02a96dce3d61d0203dd3` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:72e79e831d82d56d920d372d2a5628e4d92ea28a89abe093c1110e3338f02075` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:c398b1a776be9a3aa081102aa00a8c1812b30bd9c11d7a5e456181bdffaa191f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:0808326d3dabf6220b30dbd62be5fbe9529191ee25f13d0067bd86e9e21c8e88` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:278c6d6671928df355b9ef675e8201e958687b2d17d162fdc66bdd0e7b5ebb17` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
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
