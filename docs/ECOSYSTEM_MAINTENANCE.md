# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-24T09:15:11.737Z
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
- Public proof hash: `sha256:3a0a910e71cda35d2d1ac9725b27ae7ec1cfeb831d84c75506871d01d74ec1af`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14017ms |
| golden_path                 | failed |   3484ms |
| golden_path_vercel          | passed |    309ms |
| recipe_catalog_post_proof   | passed |    325ms |
| resource_library_post_proof | passed |    317ms |
| proof_environment           | failed |   8152ms |
| db_proof                    | passed |    310ms |
| operator_test               | failed |    335ms |
| maturity_lift               | passed |    311ms |
| daily_operating_loop        | passed |    303ms |
| portfolio_packaging         | passed |    309ms |
| public_proof_export         | passed |    317ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:bc5bbcb0f5b775e49cc3065f940a9333d91fb6261407a897c34fcec6e9937fb0` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:25eb347c806813d23d43305dcb47f0887bb0afe4e9f2d5baa93f9398aa344158` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:c8d506c024f4bc843587d1ef9d67a6af22aa35842c1a4c66b43580d2406c79a0` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:67a9312d9b10b6fbe2ce097d1b6724b109330b67fdc36c8124578a94379871c7` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:d9029a6b2fd0a750fedfc3aa9984411df449f80d0c72d32e1dc62e88dd8c2131` |
| `data/golden-path-runs.public.json`              | stale  | 670.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:0ca56e4801e3e39f6b03c75fbbe5229ea8afdde50a20a6408d8e280e95d41bf7` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:e7644be2dddd162df1a6bbfea2932912db2b34e6ad943f9418b9b105afceada4` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:6549139f1c5bf5fcc160185132e84f6c1edd7d3c7777ad9ca7603b17be7862ab` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:13b9b20596f83c423a71fb8c4a0ba884cae43c14de60483f07c0d2fa5c50640b` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:567a0aa507c4baf184aa1c33f4a15a84837527ab03565cbf6d26a01e4a75a2bd` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:2df1d815f7da6faba1e7f1d5ea2e642f92ad65e4e28488eee262d363c3c6c4f2` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:80311d37950fcf1a3dbc6848a8de112e5b547a1c7a9d42bbbe18c6895ffc392b` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:6549139f1c5bf5fcc160185132e84f6c1edd7d3c7777ad9ca7603b17be7862ab` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:9357087faffb9a46b84dd15da91f20867a929578d8400e08c961daf1c5342aa6` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 670.1h exceeds 168h.
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
