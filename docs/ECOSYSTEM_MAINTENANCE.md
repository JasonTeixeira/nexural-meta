# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-27T09:44:53.335Z
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
- Hosted golden paths: 78/97
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:a44e87327af2952049b1be212ced05b8713ab0f6ebb68ef289c3559f702deba3`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14424ms |
| golden_path                 | passed | 158744ms |
| golden_path_vercel          | failed |  76752ms |
| recipe_catalog_post_proof   | passed |    328ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |   1614ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    339ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    319ms |
| portfolio_packaging         | passed |    319ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:bcc6c5d55d7a0412c3039b41c32226a883a92c8646447f0e425f4cf1c264c6d8` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:63eb24ca138f2445d4a04fd46874314b2d9472f006eeb7a81ec38fc35731e3e8` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:54e1989fc8a7fb6dca61b9ca7117a5361148ca5770cfb746fe80cfc199fc3e38` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:e947d05706ba5ece4639690f9e863b1692601108840741950368b5f997342bb6` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:219a30a9dc0504dd2a105781a29474beda1c2abfa981b06ae007fe71b6ff7ee4` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:574d66222f34a73cb33f511da4b48e0eb140c4ca3262b7cd4996687e39b10d1c` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:de9d6facdbb20925a0ab9e73db5671c8c89ce647143bcf09427aca82a6d666e5` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:91353ee8a1163227aa51536c2cf2b548023415b3e4c761529b5e56dd5045ec96` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:7b5d6e2ae49acf4254b8785e8bce5856872c53f1b4d87a43bab475f1d624fe5f` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:30424fd59d99cbf27f73595bc223b2ff63b7183738b7886909dfa54f620f45ed` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:a88ce782c5d2fffb8b2c30608bc8497136e46e1dca9c1a22a3ed54bdaa802253` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:a52808aa8ad8bbb116c56f4562e8328131d7f64a99c6db429e4493c148bf0bf5` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:74764f722e50ca4f74779bc3193441286b7289a503abeb0d69099bbe7a7d1f66` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:7b5d6e2ae49acf4254b8785e8bce5856872c53f1b4d87a43bab475f1d624fe5f` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:5a17326e3e4369efd340b423c8e6f63b4501485d3504e5e07336dd7e05c6a614` |

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
