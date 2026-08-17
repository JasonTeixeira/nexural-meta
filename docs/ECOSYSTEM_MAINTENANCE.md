# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-17T10:12:50.676Z
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
- Public proof hash: `sha256:53a7642d67eb92b293eeb1ff1396610602eb59bbb5763621a0167ee4dedcfcae`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13805ms |
| golden_path                 | failed |   4367ms |
| golden_path_vercel          | passed |    313ms |
| recipe_catalog_post_proof   | passed |    329ms |
| resource_library_post_proof | passed |    319ms |
| proof_environment           | failed |   8136ms |
| db_proof                    | passed |    307ms |
| operator_test               | failed |    341ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    311ms |
| portfolio_packaging         | passed |    313ms |
| public_proof_export         | passed |    320ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:b1fb01403785ef5fe4d399a2e6bcf2e822c2b607f6c8b6b2690611856dcd9168` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:786b05cd38e8252d575238167ead6eb424c85646239103b15c05e835fc51431e` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:7d5e4c485ef6f18811dc0a504730eddec473896c6947014308e44e5357eec7f1` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:6d919cddc3e304171e79544343a7d03585bdd640aae601b8d62c183cd133a027` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:08b2cb20f941bab4c6582aa7de99cd4da62faa73dd62ca02bc9e02dd95fd3ed7` |
| `data/golden-path-runs.public.json`              | stale  | 503.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:1fbb7b32ab5ef78b94c9b932d9ec7d5d299534c50f33bc8335b1f8e80b989f58` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:e35a89c0c0f169472fd7a46096607d8246d440551ab990e4c919b2e268bcb554` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:e2dc5bc03a1ec42455b739457570f3bc677c6214b4f6f591b3cbfdbb32b11a23` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:e59dee4b14672631c3b68a0226a57f5c273705c9f8f498827482d09d5b898f83` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:fe46d50db5eabbef9b38632f91cde46a7d02e0deecd66fd921f8df335f5f9786` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:1367089bdd5efd055b6796dce080e94a74f9ca1525bbbd840992dcb28965bc7f` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:827657c837b2a6009fa950a0f35bfe6b9005f1e48e1638533d3e28d04b7ab72c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:e2dc5bc03a1ec42455b739457570f3bc677c6214b4f6f591b3cbfdbb32b11a23` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:fd49208dfc66611eae591569e21142d91cbdfbb7b36df6ab5266bb9eefee28ee` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 503.1h exceeds 168h.
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
