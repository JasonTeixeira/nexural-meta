# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-18T09:33:15.041Z
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
- Public repositories indexed: 139
- Public assets scored: 139
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 151
- Golden path: 14/14 gates
- Hosted golden paths: 78/169
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:0c19f3ae1ca019753cd813c20e5ca984cbb58c800bcc80f6d538382747aa6a9a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13831ms |
| golden_path                 | passed | 156551ms |
| golden_path_vercel          | failed |  84357ms |
| recipe_catalog_post_proof   | passed |    325ms |
| resource_library_post_proof | passed |    322ms |
| proof_environment           | failed |   1431ms |
| db_proof                    | passed |    326ms |
| operator_test               | failed |    343ms |
| maturity_lift               | passed |    307ms |
| daily_operating_loop        | passed |    305ms |
| portfolio_packaging         | passed |    314ms |
| public_proof_export         | passed |    318ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:b9735a5d9400a27d055c0b42ba293ab19d040d74141dc4a669aa02d00ef55e27` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:c16618703451d5fb5c30a9fc1b7d8e10b66acb7cc8c224341e04bd89b835b52d` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:deb428cfa433d1ed1e7cb91ba2f09f2835a259fdb5341675359e8ea0f74436cc` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:463edf9f1db0b5899169fba8755f8d993085e00abf512cf21c84aa422a36daf2` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:20a4767c7801c7abf662536824d3bad66e6a716d5f4a24280b907827c6492671` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:572808abae2fa08a694bc8eccffd197b2a7ca8608ac1d1f9ee75392d933a5d30` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:c1dac83be6224664a4510fea119eba639f0e637d6f8a6a7994008b81f8dd0d74` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:0b942b6289b9daf8903735b3ba0263d698bde6552a8151e1f7105b8c78d8a68e` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:d67ca23bcc35e667dcf13f880a3bfd42f523180c2cc305892319178995885100` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:fb5cc1e2661cdc01fb54fe3b6e3a22e86b4b1f5584eba69f487cd8eec21cf8f2` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:93d295f1022907125eae52f1b54349ab0a274920ddeedf8764f1b45bda0ee06c` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:f7d4c4d6c9202b71ca98c8be113b91e6d54648eff3de83ab0a806c3bd54380e6` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:b1ae60ef3e95c592ecbf7453c60270b5862f551591c22b0fa757a7a33b6c53b8` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:d67ca23bcc35e667dcf13f880a3bfd42f523180c2cc305892319178995885100` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:d6201eda70db81a8f8f0a4a19a6b3af29b2155ecbdcc68e986509bb7e10e9252` |

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
