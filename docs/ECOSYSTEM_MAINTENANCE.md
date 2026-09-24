# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-24T09:02:29.386Z
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
- Public proof hash: `sha256:d742d157a825c5faeb696702bae6c82f5c4010a1958882102976db369b003d25`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16002ms |
| golden_path                 | failed |   5094ms |
| golden_path_vercel          | passed |    251ms |
| recipe_catalog_post_proof   | passed |    257ms |
| resource_library_post_proof | passed |    251ms |
| proof_environment           | failed |   7969ms |
| db_proof                    | passed |    246ms |
| operator_test               | failed |    271ms |
| maturity_lift               | passed |    242ms |
| daily_operating_loop        | passed |    242ms |
| portfolio_packaging         | passed |    254ms |
| public_proof_export         | passed |    249ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:be22c9bcf6261ef9fe9d7d1dfff0cd9861756fcd740bfe829be124c41d8fe72d` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:bdb9f4cdf58178df504ac8625be345407695b6417abdfd8b145866c0f60913e0` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:e85c0c68ba3516e198fb728f1c46ae4f5894a8bbbee191cc8538f803552b430d` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:2cccf895a9e627424cb39cfcf582608dbf2369951f1add630fbd57ac3c761545` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:dd691151f337841dba8a42c01b2b1b502ceacf30a7a99470cd92ca1f6067c1d0` |
| `data/golden-path-runs.public.json`              | stale  | 1413.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:e5311194d923a5d5856d94206652a7cef49766ff9bd8f24bf00ae59afb87bbd1` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:2888e72c2f6df25b18d2139cb7a271a7fd45729221825fc930973c3c9161a19c` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:397078c2396c167fc6a076c79f0522316c494e471178e857d34765a157e293ef` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:82ae43b90a948f0adb8e8b9144efbd3445604ea897b02927cbfa6f51608d9a1e` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:cdb1ea609751bc3690c6c77fcb64eb50331361267e34c8c3a21c33d1bbedcfc8` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:42578ec7f8421428473a674d5d342b23ec12eb036e3d000707f5fbf314528711` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:88bcfc92cf71f25cc5a0e6bfdf66fb004ac4a22bea427dee525d192e03dd168d` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:397078c2396c167fc6a076c79f0522316c494e471178e857d34765a157e293ef` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:0181d99294395657d9c10b3306ed0e6c29a8226be22d1e5c845f260b8d03e8b5` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1413.9h exceeds 168h.
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
