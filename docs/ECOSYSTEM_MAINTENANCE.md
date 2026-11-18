# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-18T09:02:06.620Z
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
- Public proof hash: `sha256:dbfed459e4b8d2c5c0348df8b98b4b2982fa72bcf65932ea2dc38c2a1d8a081c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  19055ms |
| golden_path                 | failed |   3178ms |
| golden_path_vercel          | passed |    217ms |
| recipe_catalog_post_proof   | passed |    226ms |
| resource_library_post_proof | passed |    229ms |
| proof_environment           | failed |   8183ms |
| db_proof                    | passed |    219ms |
| operator_test               | failed |    233ms |
| maturity_lift               | passed |    208ms |
| daily_operating_loop        | passed |    209ms |
| portfolio_packaging         | passed |    220ms |
| public_proof_export         | passed |    217ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:47447f3b152f2342f5e5d7f6a777cf8cf439e75c13661e6367a0d3f0f295fe63` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:fd37039882ab849a2097c13be208eafdcf2e1dd0cb9ba37149d6a78345b5ce24` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:648cd2015856b7ef14b0a40808f0fae49785cc9bafae9a5b642361b264e51689` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:20e3069f1f051bd035766bc46cc00dcb88d49914c70961449c4e888a37a37fcb` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:29813cdc435264dfaf3edc6e3238ad1991c0bd183d765f615950dfd3287f8235` |
| `data/golden-path-runs.public.json`              | stale  | 2733.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:ec5adb5bd191b5514f936f59cb03979d6168571ca1580efacaa64cd95d913f8e` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:36722d61065819f44ec8d33e83e9150a1f252a3e3e6b08cd22a6794504a980d9` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:3672f93cbf1adc41153a1cca56805a40702f97afa208a4bcae7affffe0b1106f` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:0aa8ec0e15b073218c9a213b63f90ebed7e9c2b44dd03ca94aab53067bb7e5dd` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:ff65eae13a32460c77d883fc4178dfd8de379a4115c5b8ccd4ff59caf7456cca` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:31e20b5a2d7fa30a254f6d8c682901f81e21ec3188a303ed0c7a0593908e7e4c` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:232dfe8806d76c71da5060d6776309516f349c778975b1bcdae8103f091acc7d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:3672f93cbf1adc41153a1cca56805a40702f97afa208a4bcae7affffe0b1106f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:5551007b5aa85f3baf329c1e0f3133b916c05bb3f5dd8a364b775e5677657102` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2733.9h exceeds 168h.
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
