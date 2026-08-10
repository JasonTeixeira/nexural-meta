# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-10T10:31:20.937Z
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
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:effb5e3fb497fc5fb53f7f2c183efa1c5d8d2e7e0c1fda3c4bcfa32fc54cccc5`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15808ms |
| golden_path                 | failed |   4684ms |
| golden_path_vercel          | passed |    332ms |
| recipe_catalog_post_proof   | passed |    338ms |
| resource_library_post_proof | passed |    333ms |
| proof_environment           | failed |   8153ms |
| db_proof                    | passed |    320ms |
| operator_test               | failed |    352ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    321ms |
| portfolio_packaging         | passed |    330ms |
| public_proof_export         | passed |    333ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:d1ce5e409255cc5808aa30c61c43f63aa993bda235d0baf1763b501d76d5d890` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:9ce33545a10ccc7c4a8f90fa0d0d8590bb3ec6f02ec37bd9ac15233bb009934e` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:10ecb810408e27cb1908021c3df99d98887fb9242e3258c48c3422f22269e549` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:6346383fa0daa155ff02ff4641f3cb0c5a4d45308f60abbee9785e7fea608f31` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:41d31e0bbb03ade0ccda0714445399f260bff820429ca5f09b144a166f39d481` |
| `data/golden-path-runs.public.json`              | stale  | 335.4h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:05a0d2f8e50bfe9818cdb7279defea8ea809ae5824ea111a54eea88a080c6982` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:bd669122a998623aa1a6ff98ab2fe710288b95cf4a6927df745b6d55011ef637` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:f516f0cda26c20c75b6d6caca72efd30589aab7390279dc6a429cd044253897a` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:2878009407c0af5cc851feca30515ab87c6455fd53e920df86c2b4390763b900` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:525775e0f31ae6cb7b0974e12f2abf8bebe225b16b02902698b69e22b2e556ea` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:3c0c7a0981a3d96849321f8d74725ee2ee4740bce51acc3a798a6351922ae276` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:9d8e0ed54011a1517f992eaf448113c98e436133e75bacb1d5554edeb6c99cc4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:f516f0cda26c20c75b6d6caca72efd30589aab7390279dc6a429cd044253897a` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:74b147480bf24f05c079b6fd0ce2516833ccd3d7e716bd9ee903d874509914f7` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 335.4h exceeds 168h.
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
