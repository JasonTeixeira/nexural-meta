# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-16T10:10:40.308Z
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
- Public repositories indexed: 161
- Public assets scored: 161
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 173
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:5837aeebcd78c9f82a45c94d270e3e06c6f71c567f5b8c79649a0920869c4618`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  22831ms |
| golden_path                 | failed |   3305ms |
| golden_path_vercel          | passed |    274ms |
| recipe_catalog_post_proof   | passed |    288ms |
| resource_library_post_proof | passed |    280ms |
| proof_environment           | failed |   8261ms |
| db_proof                    | passed |    317ms |
| operator_test               | failed |    303ms |
| maturity_lift               | passed |    273ms |
| daily_operating_loop        | passed |    265ms |
| portfolio_packaging         | passed |    278ms |
| public_proof_export         | passed |    277ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |    0h | `sha256:33521e606df9a7435245da2eb8a67fef7ed8c27dd307e272909239d59d85a7a0` |
| `data/ecosystem-scorecard.public.json`           | fresh  |    0h | `sha256:6c7197c846eeadf06ade4a75d2f3f6ac3836e6d352a9ffef34f0ac92dd7dbfb1` |
| `data/ecosystem-resource-map.public.json`        | fresh  |    0h | `sha256:6393296bf2893646137593e60501bae6a09e20701ea7d142bf015a7775795d45` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:5f6bfad8dc41966c97e666516c34da0c073cf5e7d9e8b344a97b11b2d048fcb3` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:96f08b065510a46ac493741c6e7842c579a53e1d36e1bd03a51a44e6b5b91388` |
| `data/golden-path-runs.public.json`              | stale  | 2687h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:6bc3e98666c590724c44cf10b78804d68581b27ccf48990b7f932099e780507a` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:4a3da4310fddbd08854bd8ece1096dedafaf077c4e2fc46ccae3d365ee9a643f` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:06d0d90b2b113161b17d770d55b286fbb210569f135ae828cd4627a786e6aadc` |
| `data/operator-test.public.json`                 | fresh  |    0h | `sha256:1274136db3781a1b7190cbfdecb78fc1f901a12ad8d634b9efb8f8afbeee7cdb` |
| `data/maturity-lift.public.json`                 | fresh  |    0h | `sha256:19ba8ad3ec8f881da8f5b7f8f49edfa6dfab13e43237a851c02f621c22ed352d` |
| `data/daily-operating-loop.public.json`          | fresh  |    0h | `sha256:3673e205401cf3abb49664f110c48d7b04b46124f1a3d7f2e2f92422cd080e55` |
| `data/portfolio-packaging.public.json`           | fresh  |    0h | `sha256:6ad003d5283b161871644f026b72f9a77915cfc33be25690c93251aff863da2d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:06d0d90b2b113161b17d770d55b286fbb210569f135ae828cd4627a786e6aadc` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:6305983bba4a90c6dc192d3c3f7ce6e74b832d8a2a83a15356bc8b40029c976d` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2687h exceeds 168h.
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
