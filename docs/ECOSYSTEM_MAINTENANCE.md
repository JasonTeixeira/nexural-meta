# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-18T09:09:03.880Z
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
- Public proof hash: `sha256:2dd2e7f311fbcac3f45dc668d8266696b6c99ae5798135f2af376e56c0174526`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13937ms |
| golden_path                 | failed |   3917ms |
| golden_path_vercel          | passed |    308ms |
| recipe_catalog_post_proof   | passed |    323ms |
| resource_library_post_proof | passed |    322ms |
| proof_environment           | failed |   8095ms |
| db_proof                    | passed |    307ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    321ms |
| daily_operating_loop        | passed |    308ms |
| portfolio_packaging         | passed |    314ms |
| public_proof_export         | passed |    316ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:4a728a8327565c8cda5aa023d4e5bdf8d879ec29fa12cb54106cd98ed357f485` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:c664d2093714b261e6800b0694884a1bf52023714d1bdda8702967749cc77c61` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:8769cb3d8932952c8c97b616c66db64f4553ada64191a0344b5c0eec8444b3f0` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:a4432e9706ff3bcd25df30f3fe4a9b7c499e0928d43fa6e271a32213dc738256` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:a35e082527bf8152fa4d0160efad93252c9a07f9310c0c2f81a9c5f38ed1f4c2` |
| `data/golden-path-runs.public.json`              | stale  | 526h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:b149ae0347f43b85c8199f3bd62c6903ceffc8ebe1d7878e6999fbd837faccd0` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:fe0a2480aaadbda96167cd1d83b02944c5b5b06f55716e5c3e44c4007841f687` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:66a1539e740eac8b0023ee7c4050f3dfe2f26c9f95d0a548c46a31444d5c92dc` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:b2088652bd81875b3064428c26eda76c884a98fce33c7ce57558ef9f1e885ff8` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:c665dd8fb5705019447fbb96b971c2ee7792a14a086f5acc42a31e6d32661999` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:a52e6a8363601b65ee0648e74ab84651a1c48f6601f3fdf283a1b05fa0a81d46` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:1eb617786ba4019e9bf26b4a92f007c9f8f88ed25e01b987ffb519cc5932f6f2` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:66a1539e740eac8b0023ee7c4050f3dfe2f26c9f95d0a548c46a31444d5c92dc` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:311992a83ae6c416b38809253051eba4e6acf9c4fdcadc4f442666b5c0667d85` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 526h exceeds 168h.
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
