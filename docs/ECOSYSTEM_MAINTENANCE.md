# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-26T10:08:14.989Z
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
- Public repositories indexed: 137
- Public assets scored: 137
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 149
- Golden path: 14/14 gates
- Hosted golden paths: 78/94
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:d470ebe263b21596bd1f73e00716107fd4bf651d10aa031afd11b63bc77d82c9`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14748ms |
| golden_path                 | passed | 164009ms |
| golden_path_vercel          | failed |  77839ms |
| recipe_catalog_post_proof   | passed |    313ms |
| resource_library_post_proof | passed |    303ms |
| proof_environment           | failed |   1760ms |
| db_proof                    | passed |    299ms |
| operator_test               | failed |    325ms |
| maturity_lift               | passed |    296ms |
| daily_operating_loop        | passed |    293ms |
| portfolio_packaging         | passed |    304ms |
| public_proof_export         | passed |    305ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:1c4e030e14cf280620082de8d3dc5d19786f7d1370ef4c1629df4d41b5a8f10b` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:cd67ff257c818850ffa3f2ede14a4cf333663d422a903b71f07f998247505fd3` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:4921779e7438971d09c9071bc11979dc03e3dd5a6f2ffc678df8d6110f48ee98` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:bfc14801ca3f1b7e444416ff5e94d8c1af48fe883e44464fcc37f53ab4f15e41` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:f5ed0abc27dc6beb19dfc8b43825f0e2401b4a1b88ab833cdbc1f17055454988` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:3941208cc18c73456a079f75a629b2fef24351490343f5ebb898896ca6abc3ab` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:75bac194bcd22e3fbf551f679042120bfc18d0fe5d7942170a43c65b37ae998d` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:d7dd869e549f296d85bf098ca046a86ff869fbfc49c6157ab28324f7339defcf` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:f8fbb90448782b002cddd4834361cb7bba92cd0efad290b34a918837acc7d717` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:d8bfa0cbad8a2e2580397e55278211fce34cc25e70b2e394d5855b84e0a76376` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:a114e71725224f3329b590f98547e67e91ad7d0e0477c322d5fab78dec4a3605` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:93e288468c1466bce2eb187d5a9e992c059bde46a557d431eb821f6d1817841c` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:9723b7da978e6e5c4108855d1edb0c60e2f540d69d17594335eb82368dd39b2f` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:f8fbb90448782b002cddd4834361cb7bba92cd0efad290b34a918837acc7d717` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:ba093c2e2d5b9512d304cb7946363b34fbd730f4d5be8bf3e5e011f6173ecf13` |

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
