# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-01T09:37:16.640Z
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
- Public proof hash: `sha256:f21db1e0671bc9905f67ce7632ec1c90bdcb699cdb189e2abc738444e21c4c23`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15090ms |
| golden_path                 | failed |   4237ms |
| golden_path_vercel          | passed |    325ms |
| recipe_catalog_post_proof   | passed |    337ms |
| resource_library_post_proof | passed |    333ms |
| proof_environment           | failed |   8015ms |
| db_proof                    | passed |    317ms |
| operator_test               | failed |    356ms |
| maturity_lift               | passed |    319ms |
| daily_operating_loop        | passed |    316ms |
| portfolio_packaging         | passed |    325ms |
| public_proof_export         | passed |    326ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:4ac7717eee78e669e097d157344c468d348583f52a1e5223be8197c0f57345eb` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:e0d975a5e4c862dcbbaa1db0a5ac960e879c733c95cb8989a2753c1d7af10306` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:d3cc270e6c3bd032992da3fedfa9a61ea481b459976c346aa5ce8dbdf5402aca` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:b45df8510694fbabf47a26959736ff1a3c891a8ef65c2817ba173f0494517da7` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:b7c523e028ddb299ee5468bc03290a0279cf18300f9898a159ce4d5bf1c0064e` |
| `data/golden-path-runs.public.json`              | fresh  | 118.5h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:f41ec9d6931d1ecac5e82cd859262a2219ac46d3d59d04af3202658795131da0` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:cef3b4797c76063dd893991db3f41cb808d0013da35c1b845d1d6bf2fb03a05a` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:1a144cbf7d6e51fe868a9e3e22fa467aab57edd2b7ac85750bf97c33a89aca7d` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:661a26c252fe6bbef826c40e64b915e531028834b1a4097d14314203bd53312d` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:155b15ef2a24c70cf5fb56fdf07f0ee6b4edb48928a5eccb5dfba78ed09d4296` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:8d79fa7f1aa38555983d8a1bd27eb0fb142b8f24b4a8c134c32748bb4bdac057` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:473adad7a4441a1324abc7978ac57104ac4ef786dfaf1c55613431d55fb714d9` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:1a144cbf7d6e51fe868a9e3e22fa467aab57edd2b7ac85750bf97c33a89aca7d` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:edd0648fa227ea881f78c927adcda2216faea8998f5c5ceee968c080170e8105` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
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
