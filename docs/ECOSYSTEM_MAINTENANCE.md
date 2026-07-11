# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-11T09:34:02.786Z
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
- Hosted golden paths: 78/145
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:2478e2a7844e6469b2cb49ccc3d9999d705d9fd271116d0151551c55250de811`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13971ms |
| golden_path                 | passed | 145649ms |
| golden_path_vercel          | failed |  84054ms |
| recipe_catalog_post_proof   | passed |    279ms |
| resource_library_post_proof | passed |    277ms |
| proof_environment           | failed |   1690ms |
| db_proof                    | passed |    266ms |
| operator_test               | failed |    286ms |
| maturity_lift               | passed |    265ms |
| daily_operating_loop        | passed |    257ms |
| portfolio_packaging         | passed |    263ms |
| public_proof_export         | passed |    270ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:e3ddcebb105a087d8f73cecdfc19dbab53014c350914aab708476571af95c676` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:255fdf30e9956d7520fcd2178284c72141434e7f26c59151486e7d902a5f6eb4` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:734db260896a458c304555580624400a05e5ff3c72dff71266aeec1af1318174` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:222e7df805b0e53cd958b953d711f62e75aed3f77193e12065efba58b6aa8072` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:e4e04c373dde44de950ae948d47574e5f537fa3b75435cf9d1a814d66160150b` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:aad3b4ccf84836265957b4edae92da1632ae57ce9905c564626a9b5dd9d109b8` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:a247c2774ef88c2295c182c9a958e9d0c1a08c2113e043131e71f09aac32be3a` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:381780e2600ec6cd01e755d60e9d8c7ed52fd09c8bd82908cdf0a19df8cdf886` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:0f940947a43ebba5296a01a6a25a4b568389ee9d4d337f73363ec5bfedcbb97d` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:fb8640bf5fa53be1847b7d1733bd072afe402477224de7a2b0ecc5621378a606` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:80841d4bfba84506f1385fbf59b63450373c10ba0e658b0cb9f6d57ed3c87ce9` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:143ed2a5a80f83b554d863aba04d44ee762a56ab8007906bff4a81a2e7496a4f` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:c7a6521fa92ab3cf89eba2adfa83581fc122fc15f4b322aa506ecb63bbcbd9eb` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:0f940947a43ebba5296a01a6a25a4b568389ee9d4d337f73363ec5bfedcbb97d` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:9a3ef224c362016225793b1489a3df86fa70970c69ee6426d6e96d464571870e` |

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
