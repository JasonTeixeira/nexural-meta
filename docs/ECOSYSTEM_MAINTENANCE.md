# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-02T09:02:51.208Z
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
- Public proof hash: `sha256:eb54f6717d1ed9021eed50f69c42d6343ab05244385f5c58eeb6f2599d337be0`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15803ms |
| golden_path                 | failed |   3856ms |
| golden_path_vercel          | passed |    448ms |
| recipe_catalog_post_proof   | passed |    461ms |
| resource_library_post_proof | passed |    451ms |
| proof_environment           | failed |   8193ms |
| db_proof                    | passed |    440ms |
| operator_test               | failed |    471ms |
| maturity_lift               | passed |    442ms |
| daily_operating_loop        | passed |    437ms |
| portfolio_packaging         | passed |    445ms |
| public_proof_export         | passed |    443ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:65cd63b5c3b6fa2153d613235c0a84a774930c98641443764b22d6eeedefbf4c` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:337c8e5349aeefe3084198a355920c8d34170efa5ecdf717eafe419008ee2d08` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:ffc1debe94fdd2595fca85ebf3f6e5a6b9907fbfd7e033055e813c80affeb203` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:4aa33a537405872f8c9b209a85b7e84ccb4ff769eba6be286ac0209a1c08a1eb` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:545c49ac08034c057e223ac9113395881da2ec9449be1b025b7cc67baf212232` |
| `data/golden-path-runs.public.json`              | stale  | 2349.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:871cfd3034b424dd4e68bcf07233256dfecc849d6285005552c3a9199e098c53` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:0d1638b9179e97cf12668e1814cdecf1129d27788a03a76230ea9b20b550f703` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:afe037c1a1632586cb7b9eebd57c4c1760a9382bf9d4aeafa8bc11be11d589e2` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:7e4ad3db06c5742c70477b6db10dfb1d48fa70d14d23300f4b6277982ea92d6f` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:f50cbf3b88d7f6aac87d07df17029db2da1458635095be31d54094914450d6d9` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:a1b1980ab04287ea1b0e9b3efc34cf493c636de3b36d8db3219fc06b45b1a457` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:d5e2bbd26a09c229166a1f8595cc95af0fdba7e4baf36c5613b9b2f0c3c61703` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:afe037c1a1632586cb7b9eebd57c4c1760a9382bf9d4aeafa8bc11be11d589e2` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:5290bfee1c31a9ef8946ddcd98e07319400c37ed19e51d942556972baab59e1c` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2349.9h exceeds 168h.
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
