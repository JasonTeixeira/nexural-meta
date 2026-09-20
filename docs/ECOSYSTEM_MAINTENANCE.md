# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-20T09:02:23.419Z
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
- Public proof hash: `sha256:604111c1815343fc4c88ffb23dbaa4748a601f75c77f12e4fe42ef41b057fe6a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16337ms |
| golden_path                 | failed |   3684ms |
| golden_path_vercel          | passed |    246ms |
| recipe_catalog_post_proof   | passed |    253ms |
| resource_library_post_proof | passed |    248ms |
| proof_environment           | failed |   8238ms |
| db_proof                    | passed |    239ms |
| operator_test               | failed |    264ms |
| maturity_lift               | passed |    241ms |
| daily_operating_loop        | passed |    235ms |
| portfolio_packaging         | passed |    243ms |
| public_proof_export         | passed |    248ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:99ba28dad28cc755bc07502c03b6fe2cb4de68e437a9d47322b0bdacc343be73` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:76f269bce660cd1bc93a917c845c6b75f3d71cb93850e8536a23cea1374fd3a5` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:08c170b4fe399c6fd17f70d8ba08e6f77ba1aec8dc1caee165f3f910c0ef37de` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:673dde3bf6eacc3c31d8a9c69c6bd46926d1fe69c1a7f70cc47e4189fef9cd5b` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:9639615d408e091c9ee62d5c8a03dd5187862d77ab682e012e3bacba506d4b06` |
| `data/golden-path-runs.public.json`              | stale  | 1317.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:30132e69da6b95685dc87f44c88de33231563b2447f2fac46cfa1219f271da5f` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:0d4347c35875b8402ad7b92cd92f6e2716721804330320e75d5381a9b546f9c0` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:ab1b54d44487d984282df2c11910193021a805e24556a32af9131d4e006095cc` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:a7190c46dc7e1faac30afad1606c73532ec45fb93f4cdae8fec1891acfec5301` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:2db20622a0b6c5f0d173c31fd949c0d96d0c7559da607c54d0b2bc3854ce4fff` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:76ebc8cac05db71436753194030aa4d7bcab3d3e205d83651171c7c1de868932` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:23aa2b4a27c78c180aeba1538bdf615e0d6369a5a6636d6298f6191d980cb3bb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:ab1b54d44487d984282df2c11910193021a805e24556a32af9131d4e006095cc` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:54f6079e125a8a18e0431bea76b5d8a30d6602ff2ab6bf621465e21f3edc8308` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1317.9h exceeds 168h.
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
