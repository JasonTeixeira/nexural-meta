# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-29T11:48:19.110Z
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
- Hosted golden paths: 78/106
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:25d7172a30bd8f286c9c85438a54ad4b84b1dc373d5c624df2085d9267f5434f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15247ms |
| golden_path                 | passed | 159469ms |
| golden_path_vercel          | failed |  83152ms |
| recipe_catalog_post_proof   | passed |    328ms |
| resource_library_post_proof | passed |    331ms |
| proof_environment           | failed |   1554ms |
| db_proof                    | passed |    314ms |
| operator_test               | failed |    344ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    314ms |
| portfolio_packaging         | passed |    321ms |
| public_proof_export         | passed |    323ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:ca3ff873b2361b34ad86f7c0f86068658d8235a1f2502c997d242bf335746506` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:6c221a43721adf6b875c3168e569fbaab56bc78ad654eb146a905acba4a037db` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:0cf347026172ec19e459039b549eaef58b6dcf340db9853e64baeee977af7d4e` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:13d5001f4e33b43709c1cae75b26c83a88a7d6b31eaf4abfecec9a8ea4fc8b9d` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:9b5894d46ff57d23017521e4cf763f6ef22cdb6b25d484dd0c9bd52f5c9542e1` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:94502031c004a5610e8713c87ae8255af9e340e13185e00bc3e989a83aa3cba8` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:91a5cdec03d4ec50b25ec19f23d5bce7f0f7089d297e38a29525e48fc3e3e29c` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:662f0192b2c10e6fac08f484b995e393bbbfe39e672b58c5e93c4af6aa379b47` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:502643822548e1b7b50ec1ef8dc0ef0c595a94271fd07ff7bf284b06bb17bd94` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:64abc5653e28fd4ef25d12361c1a505742da76d141602a698ed2669bdd1903fc` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:4343581ceb20867c4b11885ef823faafe8357e279cd21fb6e769b6a3deebc664` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:333b870b897753c60b3ebf67fbc62ea494a7faf4cc8d1501b521a761502b4281` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:888c130b05239734e9250144982542319944dc657183f318d655570c64cad15c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:502643822548e1b7b50ec1ef8dc0ef0c595a94271fd07ff7bf284b06bb17bd94` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:d99e13b0f7341ea0b7406018a094b068c35fab4928550b479299495c8534ffd6` |

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
