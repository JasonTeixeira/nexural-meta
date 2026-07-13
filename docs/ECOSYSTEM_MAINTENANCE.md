# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-13T12:36:47.270Z
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
- Hosted golden paths: 78/154
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:e6aa6260ee44ac3219cc2bc7fd9bad0fe8d648145024ad4fb8c22505b3b59531`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14064ms |
| golden_path                 | passed | 174746ms |
| golden_path_vercel          | failed |  97226ms |
| recipe_catalog_post_proof   | passed |    357ms |
| resource_library_post_proof | passed |    349ms |
| proof_environment           | failed |   1689ms |
| db_proof                    | passed |    332ms |
| operator_test               | failed |    373ms |
| maturity_lift               | passed |    339ms |
| daily_operating_loop        | passed |    330ms |
| portfolio_packaging         | passed |    345ms |
| public_proof_export         | passed |    354ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:1f3edd019faa8af7f3cf2b19e0f1afebaaf15facafda54e7845e35e7c64c3de2` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:3b1a71477942440693aaf8b9104b89f2711a22c15b1552511e7f23e7dbfee27a` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:5e3715aa3c532e03e119db0bf3c51d4dfa980c70276d8b4edb0f8b9ca133fc52` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:810b09ae348710e7b0b359a4371b821f0e33b0ac663f4e148569182382e540c1` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:c0686d9f7ea993f7197d55124be73e8ec6b818409fc5252b5aa7a6fe45b06464` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:cd240a63c8ebc37939714c918f2ee3da1638cf06d7867e78ae1501cf96482a98` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:2dd2e44d2544cbdb868fd3e713caf868eb3e836bf9cfce9236ad7f0a2f559c12` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:54a39b9307ee535c5e27efaf9ab69d199e98ebee7e4d52b8960a8f353336d143` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:3e9ef18d810d3ff6e8b28798a860d6b1fbc979207a50d819c3815eea778bf206` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:3123e345e8277d1140a217ba98934053b96e8ac4f5f3d96bb7455fa5f216ed8c` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:5178e3d0e787ea0b6773e6c6c74fa1b6a63e6d4547087833f5ea27aeb573aff4` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:ee1738b574d1604c3526422cddfdb968f0c1326951518a79fa56da5e09ca5df9` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:3922b63af0cf5924b1ab1a359663777f950d63fc005d8c4922b376824e7253ba` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:3e9ef18d810d3ff6e8b28798a860d6b1fbc979207a50d819c3815eea778bf206` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:0595f30fc92c7757a6d0a38c678c9cdfd82ec9ec9ef1b480a73a686f8eef1370` |

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
