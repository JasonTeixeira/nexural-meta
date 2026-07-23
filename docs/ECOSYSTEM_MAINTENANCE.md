# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-23T09:49:59.550Z
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
- Hosted golden paths: 78/187
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:dd41caab118a10f0ca0a0311c09fc79a1f3b90be19c8b6b770f4585a4c26790d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14809ms |
| golden_path                 | passed | 136022ms |
| golden_path_vercel          | failed |  89977ms |
| recipe_catalog_post_proof   | passed |    252ms |
| resource_library_post_proof | passed |    246ms |
| proof_environment           | failed |   1594ms |
| db_proof                    | passed |    239ms |
| operator_test               | failed |    264ms |
| maturity_lift               | passed |    240ms |
| daily_operating_loop        | passed |    237ms |
| portfolio_packaging         | passed |    243ms |
| public_proof_export         | passed |    246ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:ae8c3d4f8dd22bc9d5a9fc76dca851c3fc0ed6ffe052670761d941bba6e6bd4e` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:6165537bca33b9994be84a57dae0339b5fa27ecb2ed017a9be91d93708af0eb5` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:c2e74b1270a2d431d4df48674f59f280b661bb0218dd56b5e926b5c96dcbbf88` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:8680c541b54b61e4f31995e8f461204603f31f4b0636f44a44a38150aad41dab` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:9039bcbce2c4865e35f47dbdf6827c7a3147fe2baf1aebb0b5f75c57dc00cf2a` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:9d2a2d39bfc20d18df5a4fde1542ddc16af94d0b95735385598241c3cf233c12` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:bf184c13159a997ccc93aea88515bfb1bc674c9c6326540fef6375bec7faa6c7` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:eab69c7aab0563a2510c02192ebf36abc4bb0e926ffeadf402749c3a9fb20594` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:12a9e85ee42205ccdb05e3b9616e8efff91394f9ed868019d192d7f53de32560` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:84b07346466fb250eab0afddc4bfc95ca59d863226cec28ca4f38f0a32043c9e` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:464516ff6b96f47d8dfc43346dfb8bad06f70118c269c488fc3286fd8738691b` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:2b0d44a370da68611524a03cd45f78876fc82ff5428853f151e1f0c474d43ace` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:e0fbca163b488ff8f8845c7122bcb916ee242f6207bf977f084e0b3fa00e6ff5` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:12a9e85ee42205ccdb05e3b9616e8efff91394f9ed868019d192d7f53de32560` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:f62221a0488acbce63af9925b4856450b3340f8c0ccff31706956cb33be73dea` |

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
