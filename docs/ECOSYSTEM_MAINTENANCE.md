# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-24T10:08:20.404Z
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
- Public repositories indexed: 137
- Public assets scored: 137
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 149
- Golden path: 14/14 gates
- Hosted golden paths: 78/88
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:bc6e0399609bb40528a679712ed9f0031f4f0f078e50761ba2aa7b5f50ae7265`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16084ms |
| golden_path                 | passed | 177111ms |
| golden_path_vercel          | failed |  76873ms |
| recipe_catalog_post_proof   | passed |    356ms |
| resource_library_post_proof | passed |    345ms |
| proof_environment           | failed |   1999ms |
| db_proof                    | passed |    330ms |
| operator_test               | failed |    363ms |
| maturity_lift               | passed |    331ms |
| daily_operating_loop        | passed |    327ms |
| portfolio_packaging         | passed |    334ms |
| public_proof_export         | passed |    344ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:832897df95a597c369457d16642c689ea92d7ad5195cedcec55f38a1cc3ae577` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:5ff3fc5bc64c6c67a68c4981ab35b93c3a8599eb2f85c043fe7d5cdfa8bd3a42` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:49d45a9d7673650310714b866583ff9ae0fbfa8fa2fa80ddb2e2387c5bc9621c` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:b06698d294dee256b70ddc1ceeedb9aeb2ec33d3f0a0fea30a7d95efad323b89` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:6d14340605ef6b455256d83716713a949f252eb2294a63bc31de916e804e143e` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:781374fc609efff932698e9f9a499f901b2c7e1593551613ece0a13c0827cdda` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:5e02ba4b72b4b8540ea493bc31a2d11431efca12eb823199ef3ff5bfd0f1cae5` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:3485be479bb190e4c9365d5d49de249bf9ca5d73d0dfe7f9fb1f4c2d36625f76` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:f80e7568181a8d3907f56de280e9514fa193ee47823503847e7f9a8f28225444` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:43752d5d70c6b7cdb6110e2c661f96692a234fbf458cecc12b203227a9c6dced` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:2cb86f064d1964a8eb403a68ba548d3c3ed766a5e899a654b76fd9668890148c` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:f56b78d295dd935cc17bb517fe75e943166a15b0293cc3cc549402b970b8b034` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:1f4ec9f08eb700fa83664da7db3d13ecafcd38dacf74e3f071cf04b78f5fd2ab` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:f80e7568181a8d3907f56de280e9514fa193ee47823503847e7f9a8f28225444` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:358cf4583a027ce7b620e00e5f48fb637cf354014f0886a5020ce20da6281836` |

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
