# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-28T10:14:27.881Z
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
- Public proof hash: `sha256:1c0d4304e579dc682d7bff4c9fbf2338abe1445dd4d8fb178446b43ee110f658`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15586ms |
| golden_path                 | failed |   3994ms |
| golden_path_vercel          | passed |    319ms |
| recipe_catalog_post_proof   | passed |    333ms |
| resource_library_post_proof | passed |    327ms |
| proof_environment           | failed |   8402ms |
| db_proof                    | passed |    309ms |
| operator_test               | failed |    342ms |
| maturity_lift               | passed |    309ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    321ms |
| public_proof_export         | passed |    322ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:b4d549011ed65574fdc45a0d1a783051ec151d4fefdfa9926429a7e6c43c5dee` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:c21eb38bc501b50cb15b5e79ba3f6f435c77c0d09f36ae25aac165bbd189131d` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:fdcd8b138e971729dd30927b5b76618017a227477cb0e11ef415057b6bfec171` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:ea522720d91ca8a5057b2608790fecbdec3fa78e20bad46867432cb76bff544a` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:86348c8a86f642a1fb97d36bb96b84a6e8386e15caa71a26bc1e0a6152fecaac` |
| `data/golden-path-runs.public.json`              | stale  | 1511.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:8c0c897fe36a6d081780fca22ccfcf59a86be260f46dd940a3369a60d23528b5` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:e6fe4814b1375f6a75d27f338122b97b228b9bd2afd74f03781b7afb9ab38cba` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:dee105ead2529d00cc094945b08f40b56029725eb1a4e9bbb81fe12457f84b5b` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:642cd8623427f6518b8a39769ca375561c4093b8c75e7bf60f52800524c07437` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:1fae01ef21b9073aadbdf5ff4874f6488936ffcdeacfd5350eb63af6dc6a85f2` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:1f1abe7ada5cb63388672528e799a9c965dd5c4336fed91047e8c02f0fc5f2fa` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:dc07c188c9bfe3a0432fffd43d83d8947bd77c0705d5ae81f76c7b1499f781b9` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:dee105ead2529d00cc094945b08f40b56029725eb1a4e9bbb81fe12457f84b5b` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:f4ddb58999faaccc615b0b843486bac9df577f7f7abf3e59d698ed8a822fa20f` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1511.1h exceeds 168h.
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
