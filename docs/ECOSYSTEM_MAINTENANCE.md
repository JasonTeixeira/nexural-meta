# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-03T10:15:22.945Z
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
- Public proof hash: `sha256:658d831c0736c16b051773c27d525b766b678effba405736f5ba47ccde8ddf48`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17301ms |
| golden_path                 | failed |   4445ms |
| golden_path_vercel          | passed |    346ms |
| recipe_catalog_post_proof   | passed |    350ms |
| resource_library_post_proof | passed |    347ms |
| proof_environment           | failed |   8307ms |
| db_proof                    | passed |    339ms |
| operator_test               | failed |    369ms |
| maturity_lift               | passed |    341ms |
| daily_operating_loop        | passed |    336ms |
| portfolio_packaging         | passed |    344ms |
| public_proof_export         | passed |    346ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:d348bd523447afde85027a6429e73d5bb63c5258d8793219fedc2756b83bc354` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:69bce084dc1f8e8ab7f3cc16a8e97ae03ac26b749739a52cb794081d58b6ba23` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:f6c552221420f4ea10c21b0dc7a39894e6d8c9fe2e9cb22312097c8745ab0e70` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:53c2f8744682e2e34d90593449bf72e9e6ffc8948cfbe8f67aeb47bede38a074` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:58d46f70fbb52fc33d29672698ac564ba2ad86925cb3e42d852d33e146727262` |
| `data/golden-path-runs.public.json`              | fresh  | 167.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:a8775a04ea738a5d8c3a87d7a6b2dc819110cbf815f1a60b78c112c84bac3578` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:59da342994daef092cac8bc32593551b780854913aa843993b0e8f4a18e66273` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:bf83ef2a61fe1b2006d344240e5c12b957214cb8016ed7435c3ee433b80c6b2e` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:21ddd852a6b2b9daefb7a775e2a46efc24987d65af363b11166c6a2bd4cafd9a` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:7c93f6b020ebe2dbcbbe0ff67740f6dad96e95acef7142771422e1e00586785d` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:31dee6d14a747317d470b43cc57fb34076cf787b71bc0f92ede0308a4dfb99f7` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:9200269e3d1b928df38bc39040f10194c4f7bdaf6f92b381a01c123677033f7c` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:bf83ef2a61fe1b2006d344240e5c12b957214cb8016ed7435c3ee433b80c6b2e` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:a0e70b287f80855794dc1320592c1234e81695f923b84665ea8eab646dd853f0` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
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
