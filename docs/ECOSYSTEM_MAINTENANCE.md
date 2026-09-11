# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-11T09:02:49.531Z
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
- Public proof hash: `sha256:ea4af80151a29b754ebfbee3746f7194e3d6fd0e76b774907e96499c5ea42ad9`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17281ms |
| golden_path                 | failed |   3492ms |
| golden_path_vercel          | passed |    313ms |
| recipe_catalog_post_proof   | passed |    327ms |
| resource_library_post_proof | passed |    327ms |
| proof_environment           | failed |   8071ms |
| db_proof                    | passed |    311ms |
| operator_test               | failed |    349ms |
| maturity_lift               | passed |    319ms |
| daily_operating_loop        | passed |    306ms |
| portfolio_packaging         | passed |    320ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:636f1725577f509c2376341772eeaa334bc7f0884d98f051cb397622629dcc52` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:6d59726959ba771e9245e5c7cc510da44c36df30fbde9d5736cbce880effd34b` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:65bf9cbb585ad473467839c8b6cf567ef8109f0e0ba190899ec30dc24e554cb7` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:0fa680ee245b78727027e970d5e68c4d55a367f2f5c8f685007de8c6be92d61a` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:fff30d6297bb6f4626e7baf108e2f00a64d2bd840de05d4b80af946f118b5ca4` |
| `data/golden-path-runs.public.json`              | stale  | 1101.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:2e80c0c215dcc3dae964f2a8128a1986f4f382c7ecec5028cc75bb31141a8961` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:a93f87c744bae905b23246c9c330ede1e9c50dfd37f468143eeca3781531fdac` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:e46bd57e523ef994b0c5f2f751d28086ef90327a990457f6d4e433e24f5024c3` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:94e823b0e79f33dd86c217e246ee2778366f83151a17cc4981eb3f6bd50ec432` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:de73faf05656425bfcec16bb94efa7d080fd00af7a6eae67f80c78c44b60089e` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:03bd84d172ba2336c3539070527b49e16a4eecbdf942f68eee96e58e8a59f264` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:c49189f59125a39b523fd99f4764d6c1ab55dff8e69520ccb14cb89bd820f71c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:e46bd57e523ef994b0c5f2f751d28086ef90327a990457f6d4e433e24f5024c3` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:2be7eaaddd0a6bc09c76ca1368c55d9ec83fa6aa1f2c05ecf96999e0e566208d` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1101.9h exceeds 168h.
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
