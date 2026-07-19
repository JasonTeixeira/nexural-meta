# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-19T09:37:35.110Z
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
- Hosted golden paths: 78/172
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:76580d4f24c6c41d294fc194da4c3247b406566964a4b9dca49af72fb2417366`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14984ms |
| golden_path                 | passed | 172790ms |
| golden_path_vercel          | failed |  79206ms |
| recipe_catalog_post_proof   | passed |    352ms |
| resource_library_post_proof | passed |    351ms |
| proof_environment           | failed |   1618ms |
| db_proof                    | passed |    339ms |
| operator_test               | failed |    365ms |
| maturity_lift               | passed |    343ms |
| daily_operating_loop        | passed |    340ms |
| portfolio_packaging         | passed |    344ms |
| public_proof_export         | passed |    345ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:537d49b8e731c88b461cf8060e0cd0d0b4ceaa0e1fbd22f7c724187a4776ece8` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:4a11b9a7792b02b95d0d4f2d41dbebb01d0c56d964563ca02b2c5e5e677267bb` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:8f428791bb9015555abdd8ba443bad9836b417f95c6fb34d023d075a39b77cb6` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:992e4486c469e6419556dc8ba79b6b3edd984ab16269b82b25a0f7b4798a9b88` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:56d859a38b5296fbdd2ca906b39c6bb9117001dda0084d001f1d8beda61d4ec2` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:0b59f6489eed9f69cb20037eb796d12019f0e82811f85a37c2ca06a9cef6465d` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:b1e13ebef1c935131d904d92375ea76559270bdb99493e850ec96c8b78fdad4f` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:9ef5a54189d25f46f1ab67f8ddd26792a5ae826b5ef832fbc7c2f83cdf34a6e2` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:8b183e89d8d56ee8371ed84029eba5ee992547be8db38f08a27f0f8a47e48862` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:2f2bb209fe07f3cd548ae76a33606555541710eca60673538d0ac540bb988295` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:214194caeeead8217d1b79293104f6da5bf7fdc408edc761f276609758944700` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:f12abf3c65a757ae18918225e8adbed89793b7266ab30b46d941207d44a149d7` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:43fec9efee8eae3588f8a7feee7c658746d57204f8956cac46c2d2b51e2910e1` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:8b183e89d8d56ee8371ed84029eba5ee992547be8db38f08a27f0f8a47e48862` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:d280fe1098f12e83594776627d3a42c4c9f882ae49b8dff46784171c6d654489` |

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
