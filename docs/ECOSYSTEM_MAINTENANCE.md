# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-20T09:02:37.167Z
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
- Public proof hash: `sha256:68c8d5f9a6282c9556473dd9d678bc78c669c9596ce1b52290d6954075b2f6b0`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15368ms |
| golden_path                 | failed |   3710ms |
| golden_path_vercel          | passed |    354ms |
| recipe_catalog_post_proof   | passed |    344ms |
| resource_library_post_proof | passed |    349ms |
| proof_environment           | failed |   8215ms |
| db_proof                    | passed |    324ms |
| operator_test               | failed |    356ms |
| maturity_lift               | passed |    324ms |
| daily_operating_loop        | passed |    323ms |
| portfolio_packaging         | passed |    326ms |
| public_proof_export         | passed |    335ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:1c53ec1f31cb2eaea8c26dc52143c3276039662b0565e75936910d21270469e9` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:1453f43b51422b3cf99227a8b473ff15feafcd5eaab971f80f633fbfaa8858cc` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:4deed1ad30ec49382cff92854c6f5353271e006722f240a5ab8bd36c562184e6` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:e29a6610d7c0056596237aa0784e78a2ee63f599c8e23efd03a1de60acc31cdf` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:b8e27a65d0c7ace2bbf321760c4d7e96883bf9fb0e038f635a4dbc1bef1ae3f3` |
| `data/golden-path-runs.public.json`              | stale  | 2037.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:dfed7681c21072748fb0fd441730464d69dfa2beb8da7562b91194c25700d09d` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:c4f2d40d35acec3f1d9bc8e53e7cecf8f840681de54e22772125fd60ab2dc384` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:a7beb2f8fc0423c525ff014368fcafe18641ddf21966e523eb8692a8825d67e1` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:df06d45185959f7639ae51cde00e2f1cb3e721cac9ff6901bbc8b7fa62bc07fb` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:867771950fa379b9577ee48e2c81d94ebeb8f0d19b990367418d2aa247b28f5b` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:174bc64614d2e02c8b2ee8a36e886f4a9ab3e3218b3dad7e822c777f6b01be25` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:14c13b97970e7d1ed01c215b4a5b3f6ce6684495bd0fbaf06e1c256bc0184e70` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:a7beb2f8fc0423c525ff014368fcafe18641ddf21966e523eb8692a8825d67e1` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:c076fbd9574649baa0896547921594510f0b586626d141ca3484216e18c8d9ed` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2037.9h exceeds 168h.
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
