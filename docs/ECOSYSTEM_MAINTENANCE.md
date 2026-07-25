# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-25T09:35:05.476Z
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
- Fresh artifacts: 15/15
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/193
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:86289be1bf9ff2a98f3e923042113c5fdf01061eb86c247769ef9a4980187401`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13894ms |
| golden_path                 | passed | 151712ms |
| golden_path_vercel          | failed |  78661ms |
| recipe_catalog_post_proof   | passed |    319ms |
| resource_library_post_proof | passed |    318ms |
| proof_environment           | failed |   1562ms |
| db_proof                    | passed |    304ms |
| operator_test               | failed |    337ms |
| maturity_lift               | passed |    301ms |
| daily_operating_loop        | passed |    303ms |
| portfolio_packaging         | passed |    307ms |
| public_proof_export         | passed |    315ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:28b521d9cb41477b526dc5df95b536c164cccb070a5e95b9eefff87beb691605` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:c2534e32ff2aa5a5418c378d7433d149bde02396bb91a6f85c244c757329c769` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:85b6e350a69535321202203b366ea4f52f843e532a896c2740f7bd3a678b362c` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:0e20688a4ae01aaf60eff8ebf5a35dc24bddc74440c30868fcefdb4b45e66474` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:709b7c5fdbebfc86b40c47426bda1a2a5389f1fa3455e97d69130083966b2b40` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:d8967e407234ed99d0a38c5a60432814f8649baee3fa1f4e0a573ce43e83f6e0` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:03821a5d3a408b29613f68454cf005b84f5447fbabe2ecd38e9c61cd4ff18ef8` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:8c78d68991f7974bdf9783c86d7137de3a9ea491035cef54503e8abf0cd690fd` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:315774396b808f4e9344f7f7d1fa8d180609eb935e7c51740cadadac505a02a5` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:ad5a3b54fcc5637cf0a0ee1227f225c988396565a6b638c236156752ac92228d` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:ddb74037fc9fba97715b9bb922db2355353245dc2b4761cd6178be9f39c4671b` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:982b5ce7228cb2c3b397bf24026fb8082ceb472ea43995b3645ec80d2efbc611` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:100bd9e9c822b6ae65d032e9c285375dd3735c057dd8014916fcb3bd39ee00ec` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:315774396b808f4e9344f7f7d1fa8d180609eb935e7c51740cadadac505a02a5` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:9e81ad81ee6d5c6513c09a666885b28efd9f468a5c78a0af571db5f913f9165b` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
