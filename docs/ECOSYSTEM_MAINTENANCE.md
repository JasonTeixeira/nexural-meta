# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-10T09:29:40.694Z
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
- Public proof hash: `sha256:4059ad82cd015ca813c1ef6597c3c8508ac02f14288723105a19507f618c7564`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14512ms |
| golden_path                 | failed |   4145ms |
| golden_path_vercel          | passed |    323ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    326ms |
| proof_environment           | failed |   7847ms |
| db_proof                    | passed |    314ms |
| operator_test               | failed |    347ms |
| maturity_lift               | passed |    310ms |
| daily_operating_loop        | passed |    312ms |
| portfolio_packaging         | passed |    319ms |
| public_proof_export         | passed |    322ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:ea00c8017c0db9d4e08030b16371b6c40fa4733bea03cd333099136f8efb321a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:cd837772e82d095887b165ffad2a642b0acc0e762d2c68f54a5781c170139657` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:78deadb96dff909c50e63c83c6bd176c65dab6a873f605ff1ef717d340b2bd8f` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:57f4c35725152e6081e54c5a470601c8b60f24a2e687a8be696e61aec4e66acc` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:be1abe7bdcc57400fb50340cefadad6e00aef4a38c9311bbabb509500296280a` |
| `data/golden-path-runs.public.json`              | stale  | 334.3h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:5d0cdcc40a36c9904d9267744401f3f61d07eea0f0e4a336f09445f23e98b06e` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:f07fbf783fd38ccf144be15dc5838400e7f2dac1724e6ca02ff062b7f0413553` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:ac14d468246d6e14a753c83aa93759204dc7593e2069f890cab178f8b619c428` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:50ab775bb6b74533c6f5df770e0f64cb360f30f03e69fee5833ca63e73e13c54` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:d2b00e05e1f80e912b0a35206ba090f8030750361c6db9f16118270c57742ec9` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:0a1d2efe7d4134b545fd132b1042aadd00e2672e9a9fb46b3464845f51d4a3e1` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:5e34782e47d045c822bbb3a9f22be8e610e68061afe97839e74878ecd2ad2d54` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:ac14d468246d6e14a753c83aa93759204dc7593e2069f890cab178f8b619c428` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:c02c7400604a3d197e69f96a3d42071fad604f01846b4e169ad49a030a241000` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 334.3h exceeds 168h.
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
