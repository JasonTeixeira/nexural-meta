# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-26T09:02:30.452Z
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
- Public proof hash: `sha256:2d6f241e828b22f476189b47f13be1f6df69563ad4b4eaa04e3512080af4d1a6`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15685ms |
| golden_path                 | failed |   3688ms |
| golden_path_vercel          | passed |    323ms |
| recipe_catalog_post_proof   | passed |    335ms |
| resource_library_post_proof | passed |    329ms |
| proof_environment           | failed |   7873ms |
| db_proof                    | passed |    315ms |
| operator_test               | failed |    343ms |
| maturity_lift               | passed |    314ms |
| daily_operating_loop        | passed |    319ms |
| portfolio_packaging         | passed |    323ms |
| public_proof_export         | passed |    328ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:aaa118ef0c842a17d83d705dae8a98724be2dbcaeefae4b29ad08c70f5565240` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:b91be83213742167596655833be38ee83536c3034e409b9ca4626a886f5507b5` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:e6fbf89ffcb8ced1cedf0bde05913498f3813952a9efb6d7f3f94a65951f39f5` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:56b3ad7abdb17928867909decf8ceb5c9a417d5e835810de87dd39579f18cc25` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:5c7c0bada3e4a89303b6f064faa6c23f28a299f8886e2102e29976b1da061021` |
| `data/golden-path-runs.public.json`              | stale  | 1461.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:dd0688c25cb87a20e176ee6e20025d437bd258989d344102525a4ea936b8257a` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:2585d54c5f56d894e45ca770c236964b1468f1b37e4151d8be978c2eb853104c` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:c02b74a4ed3109b422079cc07426e273787cf1b13a3fb3b57964ca03a603ccdd` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:6bb9e839a29ffe60310961f7c9b608605870e7ed11bfaa5696bfc054745f5475` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:7ebef0b121e23eda4351b0333266b034139cbc013caf3cb646d6cb5a5ca33b5b` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:cc785cb09a9b91041791dddf7c542b8af599d0c2067ad5aa9193169d24ed554c` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:847e94ddec3761964942085806a6c7c852db8ae52181f75d50a0fa14f4a7b4c4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:c02b74a4ed3109b422079cc07426e273787cf1b13a3fb3b57964ca03a603ccdd` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:0fe56ec3d653602d9aa46406065df368f9f23c46236031b13ead77d3ce03a3c3` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1461.9h exceeds 168h.
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
