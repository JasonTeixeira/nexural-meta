# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-21T09:03:29.548Z
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
- Public proof hash: `sha256:45c615f2cdb62387634b0dcbe020098c3c69c7f6c6b7c8851676c9ea545875c2`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17522ms |
| golden_path                 | failed |   3961ms |
| golden_path_vercel          | passed |    326ms |
| recipe_catalog_post_proof   | passed |    336ms |
| resource_library_post_proof | passed |    334ms |
| proof_environment           | failed |   8456ms |
| db_proof                    | passed |    320ms |
| operator_test               | failed |    349ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    316ms |
| portfolio_packaging         | passed |    327ms |
| public_proof_export         | passed |    328ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:c5dd25e2cf8b5b3efea7d08fbaa12d222682a949acb6130318da5a07d7df1912` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:de66a0e85a7175ec1750f9119f7eaaca6a99d7710a3dd39b8ca4bb26ce0ef881` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:cf6ab11ce6e890ba5bf3083e0383a8c6bd8562cab7fff607d0112558bd64dfda` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:6af3247f9c38fdee5e3605f620849a0d551addeaea8e79677340b9626861ae7e` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:c420370d6b123eafba648971079aefb64ae43ce32b261c088164bd65288a6ace` |
| `data/golden-path-runs.public.json`              | stale  | 2061.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:2b2834d62e56dc448d0f44d8f608a37c4d1c8ddb5114c54c3d25101b9789924c` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:30557b799cd1f14076e83f2444feed4e91eca91375a0cf944c606a55cf51bc53` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:bba5147158368bad1e0be8435d9c36a2bfb29d71f351cae25b9ee87dcf212357` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:c30a13ac150eb911351a49c58bfca0559300be7e027dc8b688d4f7f3d6aa6b5a` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:ef7eca187aac87166a10f1e728c3c3bee1bb11d97c60a1cc6459adc6aa9626c7` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:0e2aeb02618fae7aadd94eb129c0aab92768c1f0cccef33d0c960f7005de598b` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:5fa44d22eb7e49615705de08cee25427176d4b98ebade95fe8f22b6d0b750cc5` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:bba5147158368bad1e0be8435d9c36a2bfb29d71f351cae25b9ee87dcf212357` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:e45a6f7ee601565963640e403b8880a74214e95db8e012b1771baafea9bd19cd` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2061.9h exceeds 168h.
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
