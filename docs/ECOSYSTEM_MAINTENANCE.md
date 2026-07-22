# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-22T09:51:05.561Z
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
- Hosted golden paths: 78/184
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:e38b431cf0a886df78ebe581c16f5e8185b4bdaddb3f6b8eff015ad3df42afe3`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14357ms |
| golden_path                 | passed | 154038ms |
| golden_path_vercel          | failed |  94213ms |
| recipe_catalog_post_proof   | passed |    333ms |
| resource_library_post_proof | passed |    318ms |
| proof_environment           | failed |   1325ms |
| db_proof                    | passed |    304ms |
| operator_test               | failed |    341ms |
| maturity_lift               | passed |    302ms |
| daily_operating_loop        | passed |    308ms |
| portfolio_packaging         | passed |    319ms |
| public_proof_export         | passed |    316ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:4879e66aaba15cf65a87e5237cefc937658faf8d0d8069be967bede0749f3ebf` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:c910b9e8db3cea6b5a56815e546b3b924b7b5c08c7584af72397a440fc3067b9` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:629bcad22063a3754cae3d43d6954833e69ee1c89ddd888d963fd25acb4df41c` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:3b5ba2d2e6da241b595072883d360122891477303b3551a6e37f799201a58321` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:e950fa071c3867d4d4db131f0fbb882e63c502e5883499457b1e024b3836f272` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:da8d5a017bc241d91fa67cad96f0a48d0cd287c39566ccec36a5bbaa7bb9a6aa` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:224d99ec2a5b5f0991ec1ca08bdd9dce7dee86bf0c81b79e24bebb2d40175d5a` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:3db7d131e05e48145b39d6951f0e369bc3146942add7bacb38f33432fe917203` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:d5dfaba5f193de02f3c6b181f53648e68aa464aa8882cfecf32e24b423d9af88` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:aea6dc89df43efa273298b3e73b2c7590cfcfe6c0a4c9cc11c58fcad807a1dd0` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:cb4442dabd228b46d53b2942253059530a0c88e889db4981843bcecdf6790083` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:0ababba8b26dac70cf3a9a66cd9bb74c8e712378869235a985f1fe90fb898e42` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:b3bbf7c35076d20969ed97df16208a15b3d8878a34d410489d0a07232e2ed575` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:d5dfaba5f193de02f3c6b181f53648e68aa464aa8882cfecf32e24b423d9af88` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:3fcd23078b99aae6ebcb13562fddb359b78a4324094a071077404a40a9116f30` |

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
