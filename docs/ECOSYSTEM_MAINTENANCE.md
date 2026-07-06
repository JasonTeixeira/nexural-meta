# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-06T12:38:55.798Z
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
- Hosted golden paths: 78/130
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:990ae6b24815e4a1708e27f4ff5e9ff99762299f1927776fb0bb6c7d347fc548`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  18464ms |
| golden_path                 | passed | 175992ms |
| golden_path_vercel          | failed |  82257ms |
| recipe_catalog_post_proof   | passed |    344ms |
| resource_library_post_proof | passed |    344ms |
| proof_environment           | failed |   1624ms |
| db_proof                    | passed |    329ms |
| operator_test               | failed |    357ms |
| maturity_lift               | passed |    327ms |
| daily_operating_loop        | passed |    334ms |
| portfolio_packaging         | passed |    338ms |
| public_proof_export         | passed |    338ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:85a05d2fe8a9815e3e0c17fcfa591f5eb3f0a98ef05d2360dd54a49d3a0bebcd` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:2f8034a8e3ef3454b838a4a220e0a260080f1d2aeb85ca734ac6a65a04ae54e3` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:4eb77188d130dcd5c227983d0ad672786dae3d662c9c124894499364fc24b259` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:1d08d6a966dbb806dd1bbbe661f85a1e569a4bbbac336f39cc86c9ca8cf833eb` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:4d45778e1b5605b3b1d87b53405719a8a7285da927e890bf8337c78b4ce4f8f6` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:66882c2249fa14663dd108eb4e778332def72bcf95b9bb3b28c7c2c52aef3be7` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:c2a478fb1d672aea73cc2e403256d604ba5143258738a6ac473de49e0dd0a1d2` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:771f2e371efac9847a675fbb518db52b336a12b8dd2d57983c877b0d985d3270` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:e43aaf5ea0e4daec7708496986257df640031c0164ce098da0b450a2b1daa76b` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:fc2703380fff255da170d5928054a1e99538aabb621f0a6924389da3f8f9f077` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:66f3412e25045693893b96ed9d0c466288677723b4e2c7049c0b3eda06dbf100` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:563eec35cb33392f41d77b82d968111abab7d6507a5bcba9c69b5f119345e15e` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:24e9d95f38ca3b7e79857e7ed1b1f5397d6db3481081238e07be9056a5c5ad91` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:e43aaf5ea0e4daec7708496986257df640031c0164ce098da0b450a2b1daa76b` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:36268649eb7f9182a297da63fd75e661f11487b3cd161bb2ac4d06a95c1dff8b` |

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
