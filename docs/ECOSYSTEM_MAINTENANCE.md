# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-25T09:02:32.500Z
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
- Public proof hash: `sha256:344677fa3a610d8ec953ae8ad6f8274b023888522854dc9c17878b617663cec8`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18125ms |
| golden_path                 | failed |   4079ms |
| golden_path_vercel          | passed |    314ms |
| recipe_catalog_post_proof   | passed |    327ms |
| resource_library_post_proof | passed |    319ms |
| proof_environment           | failed |   8423ms |
| db_proof                    | passed |    312ms |
| operator_test               | failed |    341ms |
| maturity_lift               | passed |    310ms |
| daily_operating_loop        | passed |    302ms |
| portfolio_packaging         | passed |    314ms |
| public_proof_export         | passed |    320ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:5886fe7e0fe13ec9f1b67b2873b625abf372adede8dde81d01005e4cddd04c1e` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:d9f97f44249fa2cbf976018a113b0f9cb0624fce0a473413a9d25c80854581fa` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:27bf2b1160f5ab434bae69ad54233a6420adf849db6dd74385292ab6ce2404ab` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:5400a7a38189189ba9f71bda8738f01552cd40aa409ee4c398e226a42a1e0dd3` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:e89903e50377c7afbb10cf25ee95a7f60623a3cb7eff5a1bb61cd54928e13bd1` |
| `data/golden-path-runs.public.json`              | stale  | 2157.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:4959ab1e9412590f2003d269e479bc1c279ff614b049f496dc92debcf72c2b63` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:e04637791c7cb6ee0680602223947be853fd15e898ecf032dba6643d7cd75c97` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:6c1c3ab5ffc21bc725cb055e295b646ba1822766e9bb2359e71f8230a9a2b318` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:6f6f67af43ebd6c22dcccc6879acfd8d4de116fd10a3e0157ee251a49c743193` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:18d1d4572ccaba626721f6fcd0512916e4a08c1e7bb2573d0964fa5bf01d8517` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:5a69982754ed3d79c8b0cefd4ac6aa0645f4940cc81330a1bcdee45e7af34cee` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:9522afb68ce54b956cb7acbdb083c3be06588b7c081be138da22f9999366c8ef` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:6c1c3ab5ffc21bc725cb055e295b646ba1822766e9bb2359e71f8230a9a2b318` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:85032780a2db7d37cd17eefad8dd06c0ef8f578c4ef3c4528e16c79f6b363ac1` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2157.9h exceeds 168h.
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
