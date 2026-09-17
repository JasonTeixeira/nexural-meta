# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-17T09:02:59.005Z
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
- Public proof hash: `sha256:42411c1b6b801ad2719c1249cfde6426e3cc462a3767b861a7b9b2bb6153cb28`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16707ms |
| golden_path                 | failed |   4160ms |
| golden_path_vercel          | passed |    255ms |
| recipe_catalog_post_proof   | passed |    258ms |
| resource_library_post_proof | passed |    257ms |
| proof_environment           | failed |   8174ms |
| db_proof                    | passed |    249ms |
| operator_test               | failed |    289ms |
| maturity_lift               | passed |    244ms |
| daily_operating_loop        | passed |    247ms |
| portfolio_packaging         | passed |    258ms |
| public_proof_export         | passed |    255ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:65664652b23d62c0047b148f496b2324e61e0eb6de410d29988fb0f8d180ac3e` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:1f52bd11a0d558c35a29f4fa77b4f1a0ace2f8035d7b400ab19e66cf6a077e99` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:3d568ed6fedae5c2d5ba162376ab31aeedd8dffb3954fcfb105c3cb01bb3ee90` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:c9d180e4e176e31aa4c478f5da9bb7e57d5295f7c9b960e6bab35d45a7252df0` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:32e8c35fa88b198ebbfa0cfc4a6200b878507b697d4c1116fe2e576d636fe1a5` |
| `data/golden-path-runs.public.json`              | stale  | 1245.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:a0a15e24e5f00c9c0849c872e93c97a850d7289705ec2856718c5ab27bbb0b52` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:c7d1dcfffdcb71365524ab277dd9f51dbe3e6d98444e83b8c88a41cb0d4dd91b` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:3a3f2a3451b3ce8416495c75a200479f2de4c215a323ee911cbc26f0fb9ab845` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:7d35610ba21e8e87b26076bfcdff3afca43e74fbf707bcb204d0cca2051cda99` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:eb12af4947d004d1ae687415d368b0159fb61ecb064d547a73c37d5a123b652d` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:52eb5b7983918a36e5e24132a1730c33589e73821a278032cd2ece79b84ad8d8` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:908e211775e53b10a3119c046f4753ac4255a2681ef94a3d827fb2c1717a8ac9` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:3a3f2a3451b3ce8416495c75a200479f2de4c215a323ee911cbc26f0fb9ab845` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:f264693890e26a02cb17710516646c4a8e019c72b1258663ac275980c8440ff1` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1245.9h exceeds 168h.
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
