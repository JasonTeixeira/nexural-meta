# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-22T09:06:21.517Z
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
- Public proof hash: `sha256:a23bd820515221124c1cb1bb7e27a83ce9e22203ac6d9d6d6f0aa85abbc3bf1d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15029ms |
| golden_path                 | failed |   4508ms |
| golden_path_vercel          | passed |    326ms |
| recipe_catalog_post_proof   | passed |    334ms |
| resource_library_post_proof | passed |    335ms |
| proof_environment           | failed |   8193ms |
| db_proof                    | passed |    316ms |
| operator_test               | failed |    354ms |
| maturity_lift               | passed |    327ms |
| daily_operating_loop        | passed |    320ms |
| portfolio_packaging         | passed |    327ms |
| public_proof_export         | passed |    329ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:330f49ac3e897cbbd14c81b4f89c02b85de178742756681bc9e3e0b484f7f635` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:d606db78a8d323277c0a36df39b5ef15465ee7f34699718a361171b7e467f322` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:87ab2eba89c8fdc922606ca28d5a474f1e5a4aff7600357e58db695ac692c401` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:dd4c7a74f0c1edf6edcdd59ef05a112a40aae625bf5a2e0529213888a75e0c60` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:0cd2ee7d28710d6e9ffac2b75e1c6c06bfda0b64a50662a36d952debd7f432d3` |
| `data/golden-path-runs.public.json`              | stale  | 622h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:b9c02e1bc530f388c82c1e06e2546bcacf0eca67d692793ebc847ef718a5d2a9` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:c3e6828cbdf865b7d8d0e36a481e91aeb8576659cd80ecde09c9d237572e3e34` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:be9f16ae052fa993fe9f2ca49dcfd9227c6311706a4adb9dfe6fa0432c5a2e15` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:66464cbbf89568fa56600b459c506903a6bb0f57b5a6eb5ac5a0466df242a585` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:054806921b68024db48dee6dd9342a37abee14e6ff2f0578248a48f0015aa12b` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:98fdb67a379af7e49d70cb512f56313554fc460a5a933a7c823b8eb4f25b6f70` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:8358c156bc874da9b1030fa968245ebf2cf546c987092dfc34d92905fa46865b` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:be9f16ae052fa993fe9f2ca49dcfd9227c6311706a4adb9dfe6fa0432c5a2e15` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:d483a4530e1fa430d0c4d3f7626fb6d71a315367ed3ea6270d79d07bc45c8cdd` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 622h exceeds 168h.
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
