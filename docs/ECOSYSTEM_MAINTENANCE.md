# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-07T09:03:06.449Z
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
- Public proof hash: `sha256:ef6cfd646d299f429bc8b2d72814b67d574655aa03b5967fe7c59adb36cfe8fd`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13841ms |
| golden_path                 | failed |   3687ms |
| golden_path_vercel          | passed |    317ms |
| recipe_catalog_post_proof   | passed |    331ms |
| resource_library_post_proof | passed |    327ms |
| proof_environment           | failed |   7930ms |
| db_proof                    | passed |    312ms |
| operator_test               | failed |    340ms |
| maturity_lift               | passed |    319ms |
| daily_operating_loop        | passed |    309ms |
| portfolio_packaging         | passed |    318ms |
| public_proof_export         | passed |    324ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:f01d32e27f34252923d8d51ee994b19a3e301fd90f63a9e423d5540ce8d120da` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:42d320d4102bf11c2b67a02aff5b6948c6ceb9631a6706111860e6b40835bf63` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:687688e2da3d5d1802232326bbffb62f7acffa2ac25aeb41de91c5653cdfcd5b` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:94e0f2abaf710cb785b47ea397418211aa978d7bb8076327bbe77a14154c545f` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:32a22364c360b25b9b7e6a4fae1a43fcd966f94ec39553c07d0c76a0a6e3a89b` |
| `data/golden-path-runs.public.json`              | stale  | 1005.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:9a38607f07a9d7a17cf880425a9ed5afffa9d5a20597d5f3baa3ee6ea164ea5b` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:76cddee08574405d8fc415f267280f1665c9148cbe1d5deec4dcb66a5a2599dc` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:4304c481f2963869ed3ce50fdda8ff82e5a91457bbcebd2dc81e6caa2f8484a5` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:5b71d219fcb62115f54fdf361881fe2c678c7f5a36f7bc8db0dc5006544da6f3` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:59c1ed0e6921b46df55d752da064453935a78a3d53ea320ac307f1e0b1e32a50` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:3fdd371fefbcfd5e75ed6f47159a379579d5a7b8014e20065677be1bd52788d6` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:ebb21a8de5c8a909619615d5f853e46401575420dfc800a55bd9b5de610aa37d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:4304c481f2963869ed3ce50fdda8ff82e5a91457bbcebd2dc81e6caa2f8484a5` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:3c0a9d8ec121e1877461840a9e209307080785f6f89f27b0e495231f33903640` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1005.9h exceeds 168h.
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
