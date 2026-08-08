# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-08T09:13:36.144Z
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
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:4aeef0a5847e54e5219c6e08f0dc2575b6247394c67cb739c9d712b07fbf128a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16539ms |
| golden_path                 | failed |   3751ms |
| golden_path_vercel          | passed |    325ms |
| recipe_catalog_post_proof   | passed |    344ms |
| resource_library_post_proof | passed |    330ms |
| proof_environment           | failed |   8358ms |
| db_proof                    | passed |    320ms |
| operator_test               | failed |    352ms |
| maturity_lift               | passed |    317ms |
| daily_operating_loop        | passed |    317ms |
| portfolio_packaging         | passed |    326ms |
| public_proof_export         | passed |    336ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:934d89bc7eaa985b199d48e1919b36da02b439dd8fbc5528b00e7a8855e16054` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:b89aa56e9f45e12978bc1feaf48ce5af1a445c699fe1d5ac2fcc36ca98392832` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:f7b46fc1f1bbc92d23c1e95a8b2ff056f286eed02cda6055f9933577108c1bc1` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:1cbd335e199e34180fda0df4763ca3ff1c5e962eda71cf072f66711d34832673` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:7bf0739482e732f57ef5d586bc77322a0eed8e235567f2e55898d4cc1c712213` |
| `data/golden-path-runs.public.json`              | stale  | 286.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:bd88943643161ea35bcf3244b5d28965a9027d7e9d4db5f0fdc7ba92faa63bc4` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:52e02104f3ac261a5ea707b07a54246335e74a4aa823f70046173a70eca6caca` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:c16015f2d7f7a104fc5975b6c9972b805915abe0d9fbb9cd84d29430afb0e363` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:6c678d5f8a85fbb23448fa838284d5ad8f25b787d7c1777ae8fc9cf06c707fcb` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:7ceaf48e2e556767848ecbeac9865e0c64739fb98ab0ca0a24ba7f33fbb0cd42` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:657b068f4e306ee36932a1b48e2897925684e82b777acb5875fd61796f6b2083` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:29254a124574a8c068f67d99ad323c65960c71fb9cee3969dd7a2e69c08b6901` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:c16015f2d7f7a104fc5975b6c9972b805915abe0d9fbb9cd84d29430afb0e363` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:5e8007d65e188d53aa3494b07a1a756df0453acd04d0dc8b999d49fa401eec87` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 286.1h exceeds 168h.
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
