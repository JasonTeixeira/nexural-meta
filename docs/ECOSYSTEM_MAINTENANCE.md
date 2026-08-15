# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-15T09:06:17.919Z
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
- Public proof hash: `sha256:c8a273d24c67f966c853c6eb1e07c393a98b25cd4dbbe3ccf5ba7084fc641993`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16239ms |
| golden_path                 | failed |   5032ms |
| golden_path_vercel          | passed |    335ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |  13335ms |
| db_proof                    | passed |    315ms |
| operator_test               | failed |    346ms |
| maturity_lift               | passed |    326ms |
| daily_operating_loop        | passed |    323ms |
| portfolio_packaging         | passed |    323ms |
| public_proof_export         | passed |    322ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:a467404b43d1fb683d88c10129d960c3f09bdf51433004a1f6631c663bb6c9b6` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:75d767cbb45ae6bd0b3f4e8c8ee6f6e93f559087b60bbf0c4a52b05cb12943f0` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:f71bc2e89c32e5e584a5afe0db0c746ceb4d7e1f5856e3c11ae0260539b15ec9` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:6dea10e2d611687e26355cbbbbb7cfbf3dd8ccc81885f875643fe61da82a66c0` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:08562e361cb2bb41b7e1ff95bee68330f98d295d156dee5743a23e8826db5640` |
| `data/golden-path-runs.public.json`              | stale  | 454h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:23c0889f94303f0467b228d7cdc724307bbe3f649e645613d7a8b986efdd106c` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:c2c9ee77ff414ccb507bcbb30d19501fc724ccb6e17c3b1e766925135016a5bd` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:7215156413c8779fdf9e52ac93b8137f544df560cd9c654118ea66bb72a2763d` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:3241659846dcb33d929fd374278d95197757e805f0af0c93a5a0ba72c64e07b4` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:d6c8606a75a958ed1446a78526d269b6105ec37e4102198f76513a0462d12d87` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:2b62111d17116fe26d9291ca0d98ee5becdbe55c1fb75f28b5db710eaa8682da` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:5e83b764645dd8edc0846eb5cba868869b61d8b5e7efd58bf43abf2b94092fbb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:7215156413c8779fdf9e52ac93b8137f544df560cd9c654118ea66bb72a2763d` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:cffeed77aa155caffac10ac7bffad2b8c9567aa203f84e7b3eca5cc63ca198d7` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 454h exceeds 168h.
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
