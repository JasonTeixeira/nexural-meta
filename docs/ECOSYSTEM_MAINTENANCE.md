# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-05T09:02:32.218Z
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
- Public proof hash: `sha256:2cff5daa52fc5dbd153b58d08e7fbb1716397ea963231f5309706e2688fc3a23`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13558ms |
| golden_path                 | failed |   3422ms |
| golden_path_vercel          | passed |    309ms |
| recipe_catalog_post_proof   | passed |    322ms |
| resource_library_post_proof | passed |    321ms |
| proof_environment           | failed |   8726ms |
| db_proof                    | passed |    305ms |
| operator_test               | failed |    339ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    302ms |
| portfolio_packaging         | passed |    311ms |
| public_proof_export         | passed |    315ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:2fd62258c707776b353f4f1033e9e2974f4e1b9e39f00a1ed43ce45cfa52005f` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:45f9c8e88db9795113c87df42e12f47fda520c81121877901424bfb0abbfb387` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:455012555b72c39b89f01e76a1fbcd1cdb0c4ea568842360ca281ba083792b16` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:b7cf9e2801ebe49939ec2875493f29736343afd0b675502aa7f647bf82f024ee` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:a1cec1670ca0b9081016b372c93d2d703103918f7e704ef72e3342743f3af650` |
| `data/golden-path-runs.public.json`              | stale  | 957.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:2f7f5524726acf28694ae3fc727b9e1a2adcbc74c5f26eda8c6f15a7feafce8a` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:210ed29035dccaef1bc69610f55a0231440b2f2789766a2a745d825e3d076bcc` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:bb9b332d182082964647711f22fe59363fbc027b7b78be286720f1f9f3d91fa0` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:168e7014fe2ff9024584660177affc02555106d5ee5a95ed39336dfa35cd8ef9` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:0815b1d2f70ca0732304c30c84b302148c2fb2e06a23efc518fb60659699bd16` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:ba4ce832172c79fd97c58c7bfd76dbe0abd8db6999a43bd8849f84ca62f1b7be` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:543bfcaa7c6b7706f40285c4d1bb1ec32019085c0d8d3cd67d12e73b7be120d6` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:bb9b332d182082964647711f22fe59363fbc027b7b78be286720f1f9f3d91fa0` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:5fecb7c2f2e64d0043e135a956c8cfa1ccea5cba014b788da88b4ce879031759` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 957.9h exceeds 168h.
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
