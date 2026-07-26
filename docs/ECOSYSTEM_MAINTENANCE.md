# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-26T09:43:27.113Z
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
- Hosted golden paths: 78/196
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:922154951963fb4d62ec51c07d8fc30555648e63ddf65a84501ef29b5af3f787`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14077ms |
| golden_path                 | passed | 162576ms |
| golden_path_vercel          | failed |  81454ms |
| recipe_catalog_post_proof   | passed |    337ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   1534ms |
| db_proof                    | passed |    322ms |
| operator_test               | failed |    352ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    320ms |
| portfolio_packaging         | passed |    332ms |
| public_proof_export         | passed |    333ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:78649554f73a0bd8a4174562a1c4ae389d1dfff796d0f11e17f9dd06a54a7c38` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:7f3116c5654d9f22bad3fbc50ff476bff81143692d231b6062d3d75890f023da` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:60b8fa070af75a167f236765b584974cd3b1177453b5122e67a56e672ace95ba` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:8153b946ca5c2d7ce1f2b80e6464af9179976333120407e0fb88cfdb6c895061` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:3880acf03e737bfa77b36a2a4a3c525f65a5a166180e2153c7d0fffd7475ebd3` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:82d376a5446fd3faea095f9b8b8dae3e3367a82bea4c7a9abc3102fed7354ead` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:a85ed510d29f28904b35755fb18cdd542c43d149d060c1dc8e308a655b2b2a30` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:f8ed72236e8718d7d2199cb3740d71b74d8ab3e2d5fa08d8e4d7db0a29f92a45` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:4a7b3bc537e96629c7c934882fde6c978aea40ecb562be095e6fa940531c52e6` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:5a86edad1fa0cc0e686d065c2f45a189b538392539c52857529926d0d3ebe494` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:6ee456c1ffdc163260acc9228e089f2a0c5e31eb8080862ba14cfc1bd8098e4a` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:c806c3c6187d0ebc90a394934434fddd35dda2f5cb3af827b39cb1115e36f49b` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:a7cf09607e552308f998895e4c1aa6aafd44ecf84dbe3e5090dd44b78ea87c27` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:4a7b3bc537e96629c7c934882fde6c978aea40ecb562be095e6fa940531c52e6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:e5e519e5e92620348ff6b792c7f7c11032c95545f59cc6bb1987e22c7fb5d5eb` |

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
