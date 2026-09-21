# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-21T09:02:58.323Z
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
- Public proof hash: `sha256:29d31fccd09630af785abdbb59aed6d695935e498b440070ab9f8f110f6dd4b2`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17571ms |
| golden_path                 | failed |   3833ms |
| golden_path_vercel          | passed |    315ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    338ms |
| proof_environment           | failed |   8238ms |
| db_proof                    | passed |    321ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    313ms |
| portfolio_packaging         | passed |    329ms |
| public_proof_export         | passed |    330ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:3760b766a468f998bd46aec2c737834e1b7b9a2038f6f687d019e16809a0b85a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:5be5fbd340c4682d2d5cfd8f3887ddf67b6c2d55d92b332043ad896591757924` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:e3e2be88df1413719db4aa6f2d38ffd10c6cb05598e75775cf16b7f27db64976` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:4ddcae344004bc155ffbd7cd909b04ea10d8c224c7ef1f094859c5c97fdd9e9d` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:d55d83d7f24f090cc852ba58c0e60b0b8bdd7d4e3af57af232cdcbf2c162daa3` |
| `data/golden-path-runs.public.json`              | stale  | 1341.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:32268e346af43de87edaeb413cfddb072579928367b99fcaf949212a5d96b0d8` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:ebaeaa409c4df1db20c2392f55759d9ab8f9d4a8691ecfafb6ba8cc3fee31016` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:836e35e235a677b0ab5674fb51046408207aff050ce58df7c486fc1b0a6df6c5` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:9d1b36729861b643144a72c754cfb8f5673b6d647e94187c568359c4d04b7049` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:9b627079c74eb14a195140ce5815a89213cb4e24f876a8331681550c6f9fcab7` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:8525fe0fd467f8623b71922edfe969bb45e137898f8653f9af6377b9c7a49594` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:62fd8f1a8c13c3adea82c3505da7cd7ab8dba773e21e891ea29b720b98dd853f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:836e35e235a677b0ab5674fb51046408207aff050ce58df7c486fc1b0a6df6c5` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:6d5a9dcb7af543771e6bd979fd706de2e6612d07c78d0c5a37408933fdd990d6` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1341.9h exceeds 168h.
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
