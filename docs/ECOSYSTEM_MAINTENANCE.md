# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-03T11:28:14.689Z
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
- Public repositories indexed: 138
- Public assets scored: 138
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 150
- Golden path: 14/14 gates
- Hosted golden paths: 78/118
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b920113c701a9c0acfe7aa8f033149166e45c44562e8e71332bab8740e64f562`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14102ms |
| golden_path                 | passed | 161352ms |
| golden_path_vercel          | failed | 100329ms |
| recipe_catalog_post_proof   | passed |    324ms |
| resource_library_post_proof | passed |    326ms |
| proof_environment           | failed |   1432ms |
| db_proof                    | passed |    317ms |
| operator_test               | failed |    347ms |
| maturity_lift               | passed |    311ms |
| daily_operating_loop        | passed |    312ms |
| portfolio_packaging         | passed |    311ms |
| public_proof_export         | passed |    318ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:bb2fe35654c6be0454be76db525cc75e3dfb260cdb3fb3828773061d0c697586` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:4155aaf7fe7e30b15c498a768432eabe6f87af16e9ecebd73d94e143f3a6e909` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:aeddd1a32ef9ef931024ffeed713443bb2470e779d9b59a9606cd752c8870ff0` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:b9a6ea518a56f181bea69d3bf5ce5259fe9eb42ac4bf6eed977943cc68b8d2f5` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:49b0cde96220cefc10ffc8254bafecfdde1a96f57562d7e8a5639444997b99ef` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:555536c8e499ec0fc5ad3ded0340f3e3710da36d72b82dcb5421d87e4d084272` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:93db22f350e1db9f6c5c764ec993e0b2fabce69a7c1897109e5ee65cdefe4069` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:791511e3e82b26bb2cb5539945121969ec9d298831b57016c26b65fa6e62fef1` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:f14f91a8c9133e40c46491e7674bfde18ae79b4c8e69102f8a310d98ee3394b2` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:43a6d8cda480a7973d637d4afa2afdd89508ba4fd8884eab5132ef0ab6a46ffc` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:8c61ef4477b8d3fa43071db50d1e3a965c6bf50a30824219469ad540a5ac8344` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:d43c17b63b273213e6305db065eb56d172941dff0cc635661d92c681e7dfc598` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:0b26990519344bec2cf83737370589077fb3e33b417199fe31b133372bbf8d96` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:f14f91a8c9133e40c46491e7674bfde18ae79b4c8e69102f8a310d98ee3394b2` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:d448fa6c57a5afff18ec37b78f12c41bd315c90adb6778fd3952b9d07472ac8a` |

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
