# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-17T09:37:18.910Z
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
- Fresh artifacts: 15/15
- Public repositories indexed: 139
- Public assets scored: 139
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 151
- Golden path: 14/14 gates
- Hosted golden paths: 78/166
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:c03c8052de8706c4d76f9360a5284d4194cbc3ccf8357ca0cebaf23467059fe2`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15387ms |
| golden_path                 | passed | 172637ms |
| golden_path_vercel          | failed |  84040ms |
| recipe_catalog_post_proof   | passed |    350ms |
| resource_library_post_proof | passed |    347ms |
| proof_environment           | failed |   1726ms |
| db_proof                    | passed |    330ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    328ms |
| daily_operating_loop        | passed |    343ms |
| portfolio_packaging         | passed |    338ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:cfe22bc5c88a141e4847a36ccfe91bb8e06d5fc00ff35491a7f6d958c5920711` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:14ea58fd162498035f0d0ba658e240d61b7eb05ab1117757ce396404a26aaf06` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:303c6b2790e5f983cf617c7451cbbb294ebcba1c9637cca0b30b560c9e93a9a8` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:277000e48d4ae41846608f20ac1f9ef99c1ea6ef7bbe4d64a64fb0d24eed1a79` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:ebe915aa3ea75852d6e272291fddbb861e0df7c586d8f75d82eea3263722da1a` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:de772dd65f49a5c8437bfa432b51b0cad61b8b2e1e564f187c477161dae6d937` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:7c134d6771b8fe31c741a2d51cea6a4793f9f08aacb7a3af7f11f4c10209ba91` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:694b4341ff7ffd6903f947c537879cc33c222c0ff0a76fe31368c283185f20e1` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:79ffff032b75b64f18b04d04bba9b6dfa5dd211f0adbba91ef6b264153f5b3e9` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:f8c44a79d9abddd97e9d0287d9dcf8dc18a0fc461c11c4f12ef09aaef62594bc` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:d3c51c9e7c7922c207a0fa12b8bbcbe6a130f7e679b5763be6eef532ef6a6c24` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:39917359ec468d609c8effa0cde01645d53d3413bd4242395d3dfeef95aba2b1` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:c87307e2869579d5a19c7eba25c18888b9f5c921213af0291990afd51173ae14` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:79ffff032b75b64f18b04d04bba9b6dfa5dd211f0adbba91ef6b264153f5b3e9` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:9376869639df1d140cd4e80355e921c67a86a84987bb477c2d9d13b8de0d4aa0` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
