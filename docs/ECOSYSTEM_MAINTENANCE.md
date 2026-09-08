# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-08T09:02:43.073Z
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
- Public proof hash: `sha256:45b29df75e721659f05c83782bf9577ab0cf86a326b77ae575b62323dc298b37`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14670ms |
| golden_path                 | failed |   3106ms |
| golden_path_vercel          | passed |    250ms |
| recipe_catalog_post_proof   | passed |    253ms |
| resource_library_post_proof | passed |    255ms |
| proof_environment           | failed |   8235ms |
| db_proof                    | passed |    249ms |
| operator_test               | failed |    276ms |
| maturity_lift               | passed |    246ms |
| daily_operating_loop        | passed |    238ms |
| portfolio_packaging         | passed |    245ms |
| public_proof_export         | passed |    252ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:40070f762db3aeec6ae33b7dd7f740d3a555909e9f92515af510884aac2fa7b9` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:754efa56af505f94c460a3b7913996b1a67d7ba25427811ccf02bfc0e65e16ae` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:37c9c3a0ecf91aa8e99a1e0be6ba70618e865308278c99e5fa168574abed3388` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:cd6c71180f79dc03ea5d7bc2ed98d6ab0608edc59c06284c321e42ad11711c4e` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:49735ca624483db1cdfa676ad4a122f57edda7ee2a5ecf0cc708362cbca77ce5` |
| `data/golden-path-runs.public.json`              | stale  | 1029.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:8189b9977f9392cd6ab8b742e00a100526738693e722f55fb6d8f1184a96bf3b` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:d89329fa61b890cd66cfcfba162fa7ddb4e052150af472f35e11e63eed444c1b` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:167f4821b45512aca35b3de2d3f5f3d06cbf88b41498be6b02557197b66499e9` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:72c80e5e3fe7199e74868ea101671e4f455e69bbdc617f1a1d7429ad29e57605` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:968a39f9e3de37ab0064b66cc5e0d5666ca4a3cd164f35dac339950f6649b6d1` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:64d43d12e934f256afe6887560d8ed2fa16613b61ddb34480d5005339abaf64a` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:46dcd22744120e0e8122c43cd9a93c35f1073a86e5d81683a3e49acf5d5ea019` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:167f4821b45512aca35b3de2d3f5f3d06cbf88b41498be6b02557197b66499e9` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:ee6be0cb9842dc55378ebfa67b0e05f320ef95e4eee899f84c0fd555013b803b` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1029.9h exceeds 168h.
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
