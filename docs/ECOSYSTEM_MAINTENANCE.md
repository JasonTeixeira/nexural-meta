# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-09T09:02:42.952Z
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
- Public repositories indexed: 157
- Public assets scored: 157
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 169
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:a7cda6f20ec2d88925fb14c2847b45b8eaa07b548e9adba73ee4f482b401c6fa`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17804ms |
| golden_path                 | failed |   3806ms |
| golden_path_vercel          | passed |    337ms |
| recipe_catalog_post_proof   | passed |    349ms |
| resource_library_post_proof | passed |    346ms |
| proof_environment           | failed |   8245ms |
| db_proof                    | passed |    325ms |
| operator_test               | failed |    358ms |
| maturity_lift               | passed |    328ms |
| daily_operating_loop        | passed |    328ms |
| portfolio_packaging         | passed |    335ms |
| public_proof_export         | passed |    338ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:446e9250ff76f3fe1fa1f5886a800f95d3134c151d7a42a19218a13a5d49ef1b` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:b8bfe379408ce9b3f11e77fe687d325a5f420d17ef0489fe75d7fb2d91dc69b2` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:81f6329ab14793c5218ea15ec5eeffe59fe36d795f45222b7824eb8fa67b77c5` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:566a8b1b44fc99efcf02f83594937a157ad36079bfff7cad67bcd99e2988fdf5` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:1b4e3c120c8ea29f1a5bc19a743dd10bbc21bf0fdc3cc0e743d695e223c6c74c` |
| `data/golden-path-runs.public.json`              | stale  | 2517.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:3bddc879f101e3df65af9353d17ea925f343fae99e47b7da2e0985beae1c67df` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:32f655de09dc2d0305cc41b27e5317a18d3afa8d63fe01639726d025d3ef6735` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:c5f4628480fa636c2876b297c2b64b8fa1ca8c2f1a0d71a7a89167468b6a6474` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:49f27ec1ef8406ac2cfbfe8e99c4600f22734a8d31e062a66ce549398e3f17f0` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:19296a8987cbf3abceb1b02649fff62a8498993d8e76144e6eaf0dcf25635a9d` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:0f14fad17bf836ad853ecf0bfec1406fedf103c099b2b26a168c7dce414612a5` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:9a187d8e57139801399b8eaf4cdb66a4d62bd1a5dd78af4bdf845f718bd4a5ba` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:c5f4628480fa636c2876b297c2b64b8fa1ca8c2f1a0d71a7a89167468b6a6474` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:2fc8cc2174fc4750285beebb4b73842d8e65de9071f48c2d9aef4cf3e078c188` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2517.9h exceeds 168h.
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
