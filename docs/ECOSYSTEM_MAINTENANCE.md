# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-31T09:02:30.652Z
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
- Public proof hash: `sha256:c0657a5b267554c5097d84e267c887e27a075bd97e08760ab7d338e66a81b9be`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17407ms |
| golden_path                 | failed |   3639ms |
| golden_path_vercel          | passed |    432ms |
| recipe_catalog_post_proof   | passed |    437ms |
| resource_library_post_proof | passed |    440ms |
| proof_environment           | failed |   9275ms |
| db_proof                    | passed |    426ms |
| operator_test               | failed |    472ms |
| maturity_lift               | passed |    421ms |
| daily_operating_loop        | passed |    424ms |
| portfolio_packaging         | passed |    432ms |
| public_proof_export         | passed |    434ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:96f065ccbfe2827aa55a853890352424105efb5e2a8565eb1021f3d2f7a5718b` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:2da4ca3699dc16a8d5b1fd8afa0c8f62c13a460d5f19bdd3970bfdcfc820fb5d` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:c205928164fac34e9f211289ab020e11d6528c6f840d5261097b3e2ec2987879` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:49933f423360ff9e2815c60da78a281884b8c0952c8c0fe2e8746872488db5ff` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:0d40516c104a9fc4e9f2b1bb4564cf014ad088d1ddf0ece12dcb82f48c5c4fbc` |
| `data/golden-path-runs.public.json`              | stale  | 2301.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:269d189640bef8b1a4990b7199c53cd69d40d89318640dc6dee885f0f6dc392e` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:d8301d8664e0e61c22f19853ce1faece08491ee9d3f437c711cd45b9f7e2a039` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:e972f789dbd4c1e66494de35ea7038cb2110c75f4378fd92988f6e926915c418` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:c3999e4e304ad06d9757d3486cf6cdf6a1fbc1b15d4d961eb2dc37626119baf1` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:2bc6b7f7bf24765754c9744c92597e88a00a8db67a8103fb318eb10334f5b8ad` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:3d709dcc4f26a1c05c52604233d95d92856913275fad003794780b2557297620` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:0dffd53f9ace962c3371f1b802a0a0de133c6973beeacacae20665f2ccf9e9ae` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:e972f789dbd4c1e66494de35ea7038cb2110c75f4378fd92988f6e926915c418` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:016232306e34d0e5cf284d501163a46baa1ae540ed3a1a0fb18ac43b91896044` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2301.9h exceeds 168h.
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
