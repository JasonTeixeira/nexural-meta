# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-05T09:02:06.616Z
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
- Public repositories indexed: 155
- Public assets scored: 155
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 167
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:c3625022f1f81f84c5745564e3628c4087d2a656a714f0e34eaec984d535427c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15459ms |
| golden_path                 | failed |   2789ms |
| golden_path_vercel          | passed |    226ms |
| recipe_catalog_post_proof   | passed |    231ms |
| resource_library_post_proof | passed |    227ms |
| proof_environment           | failed |   8295ms |
| db_proof                    | passed |    227ms |
| operator_test               | failed |    241ms |
| maturity_lift               | passed |    218ms |
| daily_operating_loop        | passed |    212ms |
| portfolio_packaging         | passed |    215ms |
| public_proof_export         | passed |    228ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:813fdc27d66ec3a1c037ab880ac08060bab4f50317963e5386c1d3ff140519af` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:6284a2d7be33cbde8d2296c96bb1ea9eaea547c7c28da747535f65148d3a8c0f` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:2678704323b9ddce484081d8ed47e810afb9a13dfce2857a8b4bfd3c36835bd7` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:9849711ee3d37b1384b0239a1f64ddcf503ea60ba428b1e65463f02103fb9eae` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:12fe2bd584469976a97a715fac9e1e73097189c98d6df0a5509971c9866ad65f` |
| `data/golden-path-runs.public.json`              | stale  | 2421.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:66747a9bc8cda47a658e2ac0a40c99071fa78a6eecf8e4b196a75adca5843814` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:02442f3af2c341b1262e827c70e1c626149dfd3bfdcc664067a76154fb0e7591` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:3c303d5fb5d70b9f9f4b6c0a7a6450fe1a26ef2bf3d795ddf156468f801a080d` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:48d8fd47bfe22756a8be30c25a98952d1502b9fe743d27600e59bc7269c70085` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:5f81ca9bcbb19e1a487ec9107e40a17bfdaaf3f0b30949f39a833c261201706b` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:e169fa55e6bf572f2aebf7ae5747f644716421a3b247613b717aaa2c70417d19` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:9afe6d719f360bcc299a2016fa40124d226ee195d2d08a357491306833dca3bd` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:3c303d5fb5d70b9f9f4b6c0a7a6450fe1a26ef2bf3d795ddf156468f801a080d` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:cc34145b5232587b9b539e326a26e3e60abcf40d6e3c4667d666e6515ccf21a9` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2421.9h exceeds 168h.
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
