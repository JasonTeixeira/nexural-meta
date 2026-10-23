# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-23T09:02:50.336Z
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
- Public proof hash: `sha256:2f02e1eabf24172ce4ec2635b14bfcc9e5d66fb3057bd060e95a723371708a1a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  22486ms |
| golden_path                 | failed |   4033ms |
| golden_path_vercel          | passed |    343ms |
| recipe_catalog_post_proof   | passed |    354ms |
| resource_library_post_proof | passed |    350ms |
| proof_environment           | failed |   8419ms |
| db_proof                    | passed |    339ms |
| operator_test               | failed |    366ms |
| maturity_lift               | passed |    340ms |
| daily_operating_loop        | passed |    332ms |
| portfolio_packaging         | passed |    344ms |
| public_proof_export         | passed |    349ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:86d4113bfc2f0188f82f0d67198102d315eee169a8b1dc4f90443e0b83561ae7` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:3058d3ae734cd3c89d2c3df2ff78f413af84040474f03e0365c922a629c1b2c8` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:4edeef3bbf075f6203d3f5dceb19cd903bb182b6e76be534deb028e03a412d26` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:b06cea9265a4fba4a36148ff4064e929d5020521c2c239d963bb49410c853f80` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:999dd002ed211af6b293ab5bbb28d4df9396807ae9d9240488b2fe5164328b8b` |
| `data/golden-path-runs.public.json`              | stale  | 2109.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:39260783a468167f930f85109dcb0bf2db4640a3f94f6602b92de5970a27858a` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:ae232cd61e7aafe2493601d3e3027450e6614a95ab9723cea8cae3693aa4806d` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:d028058f851b6e6f57fb29467ee1b50812b39ecc51769cd054bcd1fde2335eca` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:4f87288c6274996d4ef9c04a6b8d83af6bb82211b3842ed5232fe89ed888d8e2` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:7fe8f7df27796abe967647a78944d9d88b5770ca181d0d26731d0a7a983202a2` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:3a288a8034058f3b7e3cd7bcb688160f309d0b23ae17ca46a53a28aa58671907` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:d4af21ee6a77260148d13eb632508908f3c23653fadc27d60dc4178fbaba2c9e` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:d028058f851b6e6f57fb29467ee1b50812b39ecc51769cd054bcd1fde2335eca` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:6a79c4002ef74f0c0ec37f6da881960bab93ac940d0fe3b3732d8056105af25c` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2109.9h exceeds 168h.
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
