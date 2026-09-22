# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-22T09:02:52.300Z
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
- Public proof hash: `sha256:ea237d1ddbc2fe1998738d095961ffee92aa1ead16af4d8c2ec06ed2a849fec4`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17052ms |
| golden_path                 | failed |   3661ms |
| golden_path_vercel          | passed |    323ms |
| recipe_catalog_post_proof   | passed |    351ms |
| resource_library_post_proof | passed |    332ms |
| proof_environment           | failed |   8057ms |
| db_proof                    | passed |    314ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    314ms |
| daily_operating_loop        | passed |    313ms |
| portfolio_packaging         | passed |    319ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:414ce4683b15e27e4befe032fa2e07ceabdf1dff939fcd71b909a3238d7e7c8d` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:eb7d0afbeb1e5964f9a01ad092722c138ad78bca371629e91addbaf6997255c9` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:f1e1027826a6d0c365a857bec117c2a196a22f75976828831dad420fc684521d` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:050e3573dc26c88416b9229ee3eb0fa82d03f097558db225ca760c7839fa8473` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:c6dfb1ea0cc4691d067a86c956f22ef20e8f337d8a40882a8ea0de2781fa515e` |
| `data/golden-path-runs.public.json`              | stale  | 1365.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:e807a5e6d78dea73b8d0165a5724dc25b0e9beb2ea803868afdf4a70cb90f999` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:210c1c8b8851b73e13ced61be3cf794664a56e1931bd4a84ead8b482be597382` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:31cf588e484f24e1e8bd1c8eb7289af6407c29a3809a8914a28c00e44ff58f11` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:ed60311250d86333640e1d792b381829aac6aa17937d561e43e172473deeb86c` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:6e9ba858671cef0673b7fd500c637a230d22cee45e94531216ed494610cbea97` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:09467f77861cfa9c90ac3f25379dd021e8b9ed5c62eca995163c76e83ed606d5` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:a9d8d23b38bafda1bf7d94cec12dee7f28c1ce36c3c3ceb2bb6485897aa4bf0e` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:31cf588e484f24e1e8bd1c8eb7289af6407c29a3809a8914a28c00e44ff58f11` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:37ca2e8a986b2c40a6ed8f671e3b62e408cd62cc791b1f8544d0fec28333dbaf` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1365.9h exceeds 168h.
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
