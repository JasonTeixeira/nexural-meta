# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-04T10:51:26.636Z
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
- Public repositories indexed: 138
- Public assets scored: 138
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 150
- Golden path: 14/14 gates
- Hosted golden paths: 78/121
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:81cdf20170089ab0f1f0c8a5ddc6fe509f9be32536f331c5ede333cdb43f0ea1`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16330ms |
| golden_path                 | passed | 167461ms |
| golden_path_vercel          | failed |  78545ms |
| recipe_catalog_post_proof   | passed |    340ms |
| resource_library_post_proof | passed |    334ms |
| proof_environment           | failed |   1569ms |
| db_proof                    | passed |    329ms |
| operator_test               | failed |    360ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    327ms |
| portfolio_packaging         | passed |    331ms |
| public_proof_export         | passed |    332ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:f4d31ef6d811d1d79d218a7b491caac8dc48463a20b2cb3913095a2051f787b4` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:5a004a1b9a5d46c13517795c39fcd79c2878f83844fd5ec32e810328908e718c` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:01bad431d7b47f76e47a7b272359d5bd71a7f415fdbdd392c076c507e14e3f78` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:1900d1f353dfb84cd22f2aaf6656ea161d8cfdb4bac86e03c6fbc1e10fb69af0` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:877bb7bc6a570e69827bb4b0c73a5b785b1a9b3868c67814849a8a2744d4fdcd` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:8e96a782a55f71eaae3fb53ce26b4ec3db25106a609a07ecb0f219001d8c8c28` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:1398479d92057fc1fa030d83de6b37155d4637ff792fcf5f5fe0b3c2647731a2` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:578d237f175ae7b080fd6d9389c1916284ed5176a761befc8a219d464385f28b` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:9960f4e608bb7460af88c7bcf954ddb2c471992f207ccde4686237cca671ec94` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:0698fa6358066a5433f043aaa52bea8ae751a7ed56f9dbdca78c2f7dcd2b959b` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:48d988344a9a4c07fc3b00de1c2ee9f29425d5d96827c7cf3f515b2d175bb171` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:5ecaf584e30f63153569ec131fe2a57905d11743eeb21b25f7b925b50b55aff0` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:d0c2831009ae6f8a6dfa6a486a518dd2dfa6da495980916fcd2e21617eb8eb8c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:9960f4e608bb7460af88c7bcf954ddb2c471992f207ccde4686237cca671ec94` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:54cf2222e507d8e54c4b2989964e1f35ce88d494640d69cbdfa25742e50f6191` |

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
