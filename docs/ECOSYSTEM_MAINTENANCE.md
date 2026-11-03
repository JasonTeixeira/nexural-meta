# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-03T09:02:39.800Z
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
- Public repositories indexed: 143
- Public assets scored: 143
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 155
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b4136ffd577751c413d910562ab48fe4b796a1ba2e467aef647dbdde741c7a6e`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15920ms |
| golden_path                 | failed |   3698ms |
| golden_path_vercel          | passed |    435ms |
| recipe_catalog_post_proof   | passed |    450ms |
| resource_library_post_proof | passed |    448ms |
| proof_environment           | failed |   8283ms |
| db_proof                    | passed |    435ms |
| operator_test               | failed |    479ms |
| maturity_lift               | passed |    446ms |
| daily_operating_loop        | passed |    438ms |
| portfolio_packaging         | passed |    440ms |
| public_proof_export         | passed |    449ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:354a7b0ec10bdd8a3cb5c95a6cbcf0334e36fdb9e7cb3648d05737d3a905bf76` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:342d16f25fa34d69e855dfd26a24414d6c4089545c89462845bb997cef83075e` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:78b0da2196c95b26d346b8114ae72814e17b46d154601384986528e11a327415` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:ed1faeeb5487c67243a5b81d77b727c54fa6e037bcf11217802c609154774e53` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:8c4c667e95e4b8858177479eac638ec2e85cb0f070cdf3bcf10877819b7fea98` |
| `data/golden-path-runs.public.json`              | stale  | 2373.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:1fce47d750394d9da7c5275f3b549b88a9fa9df8536e1079fe050bb5c359c8a2` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:4dfb35e36ba2f64534d82995d9f5b676f950dd7a5b703995957cb2675d3ea4b0` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:214f90e75fb9378d552e67c3f3a29b5eb367928114e11d88c443c27e7e8b5f0f` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:582a889166e0d85a4377b24482fd33a5ce91f959bf211909347e041c85734c65` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:22cd81bbb4f6b13701fddd2a3a003b844b6aeb209378a779a888a32c361255a0` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:d1cf7797469929b6e60df3bb28ac8ae0e433e9065c4ee99a2827df2c3e4e25f0` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:3852f712781fcf24498ec5de6bfff6603805c7f4cb466e076895ef6e095aa8f4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:214f90e75fb9378d552e67c3f3a29b5eb367928114e11d88c443c27e7e8b5f0f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:05fcdfce51288ed3d9c06147180d20acd7b817a2381f6052f7e71d33f19d6d25` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2373.9h exceeds 168h.
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
