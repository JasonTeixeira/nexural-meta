# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-14T10:16:22.453Z
**Overall:** passed

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

- Commands passed: 12/12
- Fresh artifacts: 15/15
- Public repositories indexed: 136
- Public assets scored: 136
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 148
- Golden path: 16/16 gates
- Hosted golden paths: 45/52
- Proof-backed recipes: 3
- Proof environment: passed
- DB proof: passed
- Public proof hash: `sha256:325f6c9b5ed49ca41cdc79b69e333573ce97f6c0e6562bdad05786d0d05db759`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14105ms |
| golden_path                 | passed | 160047ms |
| golden_path_vercel          | passed | 258551ms |
| recipe_catalog_post_proof   | passed |    347ms |
| resource_library_post_proof | passed |    337ms |
| proof_environment           | passed |   3384ms |
| db_proof                    | passed |   3466ms |
| operator_test               | passed |    368ms |
| maturity_lift               | passed |    331ms |
| daily_operating_loop        | passed |    312ms |
| portfolio_packaging         | passed |    310ms |
| public_proof_export         | passed |    309ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:e4e8c62ca4d2444d909891c9026a97d2547ac4b86ccfd315eb68b028e0bf87be` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:22cb8ebcb94db409daabfac11d42a183a4b0da5c6cf3b70b4ceea1d93751209b` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:5afcd19c46ca7eeda018cc0fe5840be68879124099cdd20fc91dcda5835312b0` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:712c03515a89c775d48b7f4e4376cd188c1e55067fbb17ea6652a0f79e8dd1a3` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:dd07366848c574ce3b5ca32f4f2d219effb097a61b3c75a52633272555a3b93a` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:9110fac82761985c2bb963216cf3364852b9d2ddefe92d70870d747e663b6afc` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:71d6e1eb7f29b02bc052b4f727bf1f39597c0b2a2f73b6e5e35dc3af06ad74c0` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:adaee32058204ed7466605532dedc4f91fa83667b498a6cdf5d9b1b07665eac9` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:364c4d63143220b91f647cec468c6a971b2eb0ff25dfa6c853e87423e5120147` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:7d089e7415ff7a1c146ab3981f8f1b44e94727d527e8d86722fdfa41786afb37` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:cc7de6ff69d3c5f9cae4f5dbd518673fd76f201380590b699ffc1ef4ebc0750d` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:5d11e824b22d5ecb14b8ac4b33b6e33e19e1fa8b2d7083efd73252614d36d459` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:c20cbd32d1fd2f0bd06499e2778fedb446bd0a817ac162e0021b7fdb059b51f6` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:364c4d63143220b91f647cec468c6a971b2eb0ff25dfa6c853e87423e5120147` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:4766d27ab0c9fce8b4bc2afd6792b4b2bcd2fcf88454ea86b402dd26722a665e` |

## Next Actions

- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 46 changed path(s) after maintenance run.

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
