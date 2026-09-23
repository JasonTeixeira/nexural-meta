# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-23T09:02:49.995Z
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
- Public proof hash: `sha256:6036542bd5b919c14aac8b6c8b65d4b8791865610a744cd8fd23dce6c85c622b`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14927ms |
| golden_path                 | failed |   4346ms |
| golden_path_vercel          | passed |    329ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   8828ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    348ms |
| maturity_lift               | passed |    318ms |
| daily_operating_loop        | passed |    316ms |
| portfolio_packaging         | passed |    325ms |
| public_proof_export         | passed |    329ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:f9c08f805e0e38849eb2a65bb863099cf5d81ac33f3e50b9c8b40b542ba09a97` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:af2f936de2d7e7db2153a348d895d5156c4587dca57f4da6ec7206744cd40915` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:152c66040bba20134fbd84561ba8cf8a73b092982d982b54c374e1f06e82687b` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:ea344ccb17568bf318f5d7c3fcf1937fb41369fe2d2708f4905ffe833bc888b6` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:cfee39ad17c75b077ba1dd66fcfc0458ff6e4dc63540c07a4f8dba1d807eaffc` |
| `data/golden-path-runs.public.json`              | stale  | 1389.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:76b904c49950db26841c6c0dd251049f96dd4f2205ea4dde6a72cc6b662a15c6` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:219ff306c8df567ec2b08d9360ff5ae24a0e958a88103d20e44ba7563a84650c` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:86ba2df7308e0dfcd90e4de31bde3f5465c9cae27e22007d22bc6be402de8a27` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:c42276d4717d9500f896a4afea0d62f5e0cf95f40c76809ec64b2d84cd7b2af8` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:160987e0c6b68bce7de20bf95a0077f807fa1ad68276b6bd8744b359cd55a060` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:e5d76cf7286982f4df28d323987ae89b751b18fe84e4ef114b3e00760e59ad4a` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:98d63ec78500fa57bbfc631e203e2480575953e36ae5454b95ec19880f86d142` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:86ba2df7308e0dfcd90e4de31bde3f5465c9cae27e22007d22bc6be402de8a27` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:10b9859afbb23315ff2897962fddb9ff2bddadce2d23cdec57683da87b0b3b71` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1389.9h exceeds 168h.
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
