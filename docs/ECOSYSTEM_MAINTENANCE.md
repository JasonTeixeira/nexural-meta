# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-12T18:18:24.512Z
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
- Public proof hash: `sha256:21a4a04d6106a17bd0a96f95adbdde0d8110e6c1cdc5ed9452be7e41ffa5607c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14344ms |
| golden_path                 | failed |   3789ms |
| golden_path_vercel          | passed |    327ms |
| recipe_catalog_post_proof   | passed |    339ms |
| resource_library_post_proof | passed |    332ms |
| proof_environment           | failed |   8480ms |
| db_proof                    | passed |    355ms |
| operator_test               | failed |    352ms |
| maturity_lift               | passed |    318ms |
| daily_operating_loop        | passed |    322ms |
| portfolio_packaging         | passed |    327ms |
| public_proof_export         | passed |    327ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:3469da1be023e5fbd2c7038d26910005941544ab32985ee367cef9f23cefacb9` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:86f048a603975746635521791c3a2f58ae16f51275bff90d27e1de796d5ac9f9` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:869c5fbac92bcb24b316de1871e9508c9ffeaafb413df4fc177454fd407e2d01` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:af66c2f0b844b0b8c4ac516c919ea8662f2cee94ac489fec6ea8328d5f2f6d5b` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:e477f6d890d5fef4e108590a5db96b8c2b21798870d16fbe427e37a6904bc420` |
| `data/golden-path-runs.public.json`              | stale  | 1855.2h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:ba4763f07a735d1275984d64752f0efc8d91ac61f45144c7e20ef00df4795c91` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:3bbccc682eef909a0e0a3cae10a679eff9f5f86a1a9396b431640095d18cfe0e` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:84f14854941ce6f820bc2e5263d3e8e8f8bfd9269ab2154de89b321555c77275` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:b9d815060e0aec624e2b4ab3504af3eedb1256c9c9d1730e5e8e01aac3423c4f` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:69274d6297002809d70302f944454801fe21f022b4f2e51e62922b19c74d87c8` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:272b7886c3f97296ff7c92db348c0ee51d1443661657b30bb0d0ac4b35768a55` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:28132c556b1679dc8f9e4571a8eeeeb0565cc5a5ad19d894a6aa89acac6c9b85` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:84f14854941ce6f820bc2e5263d3e8e8f8bfd9269ab2154de89b321555c77275` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:33b06b8e0a4fb41da3c38c4c7fc18870925a7a1629aed10efacd928e6d943746` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1855.2h exceeds 168h.
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
