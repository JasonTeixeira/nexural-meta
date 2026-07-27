# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-27T11:10:20.603Z
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
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:5aefc4a3d277aba43a3c11a8b5fba818361e6d4daebcf05d8ff85128b5fea328`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13602ms |
| golden_path                 | passed | 150584ms |
| golden_path_vercel          | failed |  80079ms |
| recipe_catalog_post_proof   | passed |    304ms |
| resource_library_post_proof | passed |    296ms |
| proof_environment           | failed |   1628ms |
| db_proof                    | passed |    288ms |
| operator_test               | failed |    316ms |
| maturity_lift               | passed |    284ms |
| daily_operating_loop        | passed |    286ms |
| portfolio_packaging         | passed |    296ms |
| public_proof_export         | passed |    303ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:43737446cf48b10418a7f31511cb63b09f845e6e73481d9560eb531dfb64e264` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:d8d97a4947bf95acea9b735040c0662a23041ee759a809e935700da2803873a8` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:5662e1362e45d598907ebb9197e27a52dfd88d50324eb7fb3d5799b4479c2d4b` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:24fb6a85f5334285cca2ddd802989b4d86daa0e2a8f6a2f52af915e25563c7bf` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:00d33ed26b338ccbe53d7ab19adbfa6328f4f090fd67d62f1967c2fcc624ffde` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:3385ed741dac84578ae90862add8c39b18f740ffe7acad9947fa22920cfb8c2c` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:2ec4907b152613190d44c28224b9c6613f68f52921489932ab9812cd4c23e3ec` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:5064a0e176530810e9b63be5f65bcd24ee03635a42fccd861e9abb5478651152` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:6c70eae5eea2f839dc1992017de963af33c6189339ae21d257f50097e4bfd1ff` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:d3fc6a0f9962e6b1e6273daf830e89025bc7fd43fa5856f5ddae10f45e53762b` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:061abe9a21bcbc860e3b5d98606e1310db08086e1b2ccbad6201a264d3a855b6` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:433e8cc842468e7ee4178e318360c0a25bda8af00c4f4b0cb4084b9f9b193fad` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:d1e2c0e9728490b5760e42d917893a93345d85496ecf50b1290ee48b2c9e52fd` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:6c70eae5eea2f839dc1992017de963af33c6189339ae21d257f50097e4bfd1ff` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:5a04b5e6cd95d9be84de31cd1302d8581c93cfdd4e0a4ffa364d96ecd8a79721` |

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
