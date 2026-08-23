# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-23T09:06:25.660Z
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
- Public proof hash: `sha256:07b315017c34742101bda66cd2a4e4921b9216c17475eec21271d822ee52a91a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  14288ms |
| golden_path                 | failed |   4418ms |
| golden_path_vercel          | passed |    320ms |
| recipe_catalog_post_proof   | passed |    339ms |
| resource_library_post_proof | passed |    327ms |
| proof_environment           | failed |   7959ms |
| db_proof                    | passed |    324ms |
| operator_test               | failed |    353ms |
| maturity_lift               | passed |    325ms |
| daily_operating_loop        | passed |    313ms |
| portfolio_packaging         | passed |    320ms |
| public_proof_export         | passed |    326ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:2a8edfe8352ba555e018d4f7fc36be6d61795e4d58304c31fbd76672eb19d4fd` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:a28a7855a191db90d756bde206bfe5ca1669e6940a5950fc1eea71483747b62b` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:e27e4391c256e6e32588fba749414cde55b7a879e83ec49589b9c75251c04009` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:d7d7b7aa5d716a4f816b1e553fe4e65bed38a520ead23fbdb3715a1c7feb9538` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:35f49817bf3f39910136b70e071342f463fce3cd09fab940e365059762e16422` |
| `data/golden-path-runs.public.json`              | stale  | 646h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:11a739f786a1a0b4fc51152567ed642173c5a889bfcdd8dc1bdc3ae444af43c3` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:00a5d4731c8d228dd755512a04971d4fddfaa22ec9f1d557261b7bd5691807b5` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:015c2e86b59d60c6faf6b2eb0e1c9d45c8c2c8237285d694370dc79f02d879f5` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:31d3981b6c06acd7e1bab641dcf588c841abbd7a3540660c09f39556581fe409` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:e0f3c784a823cbd829a3b12995aeba63de7ccf6fbb49ea699da8d51e62014120` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:0b0f2443550386426da10b7f6e4f016d9b21a3b087ac9074e4330637154d0c68` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:5975e7e5729e6fd5c4f6930983312445ae57823fd495f37f0ab30768ae4f1a99` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:015c2e86b59d60c6faf6b2eb0e1c9d45c8c2c8237285d694370dc79f02d879f5` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:e35a5d06c571b81a8a51bc24ca1a1be8bb6507a4bf1f5c4255018f6c2840a790` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 646h exceeds 168h.
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
