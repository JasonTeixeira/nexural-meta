# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-14T09:01:51.903Z
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
- Public repositories indexed: 161
- Public assets scored: 161
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 173
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:bfec17bdf5453d8259e7b3c3768f51122b9c31ea93334ff3af2024802deec487`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15136ms |
| golden_path                 | failed |   2403ms |
| golden_path_vercel          | passed |    240ms |
| recipe_catalog_post_proof   | passed |    201ms |
| resource_library_post_proof | passed |    202ms |
| proof_environment           | failed |   8277ms |
| db_proof                    | passed |    197ms |
| operator_test               | failed |    219ms |
| maturity_lift               | passed |    196ms |
| daily_operating_loop        | passed |    202ms |
| portfolio_packaging         | passed |    201ms |
| public_proof_export         | passed |    203ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:acabff69b3a909df2fb0f009a6453ccf63dd2cf72f7ae8e8b89b44190d906dae` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:b4c3c62fc16a7ef39d1ae433153e07d1500b59c1f6f83f71c056724ec059b471` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:970a89a58f833e6c3778d9cac70552397b35ffae26e81cabf2452cbec1804b57` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:d2258ca64af84f04775675845358a9918705857e36e9fa5eba312ed4a0bdb313` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:2effcd4231dcf061dbdca1967d18c28e85a34a4c5ec67b8d61ff714d25722d23` |
| `data/golden-path-runs.public.json`              | stale  | 2637.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:56578df11d86f175e7c9d621617a756ca235a660eecea58d6f4bf51af90a0b61` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:68642f94e1eca159daccaba311f99ae139aadc5dfa6978ce146330ccded31243` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:90b6c41046031a61aafd77bfad83af2d4204d2523c8e4f200e91b5a4f56c61a3` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:a6581f8f1536d077769caf57e2835c176a603b446e326c69042cbc49697c36c5` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:83425f3e0c1f08570319c48860068c0094f1a7654607fe731bb34a048e7e716c` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:fed1cdd41503d6445c62f1699f0e9b41fa10b3380fbf1caf965ac1991deb84fe` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:7e0fcea098040e6f37ac10365dc7e9c9fa6983beb42a1b37ec76710b34d50052` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:90b6c41046031a61aafd77bfad83af2d4204d2523c8e4f200e91b5a4f56c61a3` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:7b38a5bae654332a5f9b4f58b7359e651309f373790202779d4e251560a29694` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2637.9h exceeds 168h.
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
