# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-05T09:51:57.148Z
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
- Public proof hash: `sha256:267e8e50a44739c01e64eaf62f52bfcd3ce12a416cfb1bb4949b34cbee780ba8`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16854ms |
| golden_path                 | failed |   3552ms |
| golden_path_vercel          | passed |    321ms |
| recipe_catalog_post_proof   | passed |    358ms |
| resource_library_post_proof | passed |    341ms |
| proof_environment           | failed |   7912ms |
| db_proof                    | passed |    324ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    323ms |
| daily_operating_loop        | passed |    325ms |
| portfolio_packaging         | passed |    334ms |
| public_proof_export         | passed |    337ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:72316ab8ac113935385dfd23398a91e72628f2aeedf069d83fb4865d01204bec` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:9c22a440d86f32305d87401c73d6bd04e9881412261ab71df2bdbaeab3e4c536` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:c3ee7a1551f9a166167e993373d579ae73976ef8004376249e7efddecc02207d` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:3688440beb69d1089075c0daf59268c92e3f39a613d11e49a552bc7d576c5e09` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:e284f740ab8ad4b06e5d67e25e243883caf080d4f58afa2f9433e6d5367aaadb` |
| `data/golden-path-runs.public.json`              | stale  | 214.7h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:0327ce4eb7aee6ec1e8cc6957227062b49867807206ca5c2170e5f0ad63d3e9c` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:73322a9088c28250908c93d0a97ff5b69727c6c52796c498d7a0dd8a2d04853d` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:c407111f69d5d74e12586c38f159eef7928b9b3efaa01cde90aad37957d464b0` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:c48a1b5128e1c98f2a51d053cace37aa220a40c15c7e7cc4ad1616bf57ddabc5` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:d1b50ae072a1f833521db3c9670b0d9937dd4c551570c01269b7248a99e76cf7` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:75a2ef03a89af6fa882de5dec21b7889f8c210f872925eabba74d675ba12b006` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:104ce057095d4fc7681c69bb48c3518b91ddd927f8cc399d29eeb450bb815222` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:c407111f69d5d74e12586c38f159eef7928b9b3efaa01cde90aad37957d464b0` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:399696852e5cd3a0e86258f65c517c736b2fbf2a888435c34475c95d7eaeb7e1` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 214.7h exceeds 168h.
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
