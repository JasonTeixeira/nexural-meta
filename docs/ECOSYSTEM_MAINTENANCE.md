# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-08T09:50:08.614Z
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
- Public repositories indexed: 138
- Public assets scored: 138
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 150
- Golden path: 14/14 gates
- Hosted golden paths: 78/136
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:2cb0279e452fff5156b1ec8e36f7f1d8df81bb39709837c9b7319e3233526ffa`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15875ms |
| golden_path                 | passed | 154608ms |
| golden_path_vercel          | failed |  85424ms |
| recipe_catalog_post_proof   | passed |    332ms |
| resource_library_post_proof | passed |    323ms |
| proof_environment           | failed |   1625ms |
| db_proof                    | passed |    327ms |
| operator_test               | failed |    344ms |
| maturity_lift               | passed |    316ms |
| daily_operating_loop        | passed |    321ms |
| portfolio_packaging         | passed |    324ms |
| public_proof_export         | passed |    327ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:7bf07e53bc13014fe789b8d5b2a413fb152d1d5c19482aa54fa9487ede89d290` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:ef0608449873a7e649d744c73f41ac5991191ae4fa797da519a2f81951158ab4` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:4d4ee02b12f63745431ac8d4bfb23b34d805529d9490f60db6cbff9fd17792c0` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:1efd8db7c5110bbf593c307ccfa30ae5eb15e78c9766b2adcf5e6286708d633d` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:03bb9583c470023709e300a9c54ce9325cce9fa13cb7133493282d7cb4690b45` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:815baf6038cd8eee87008a359a6004596796dcb9b29d3257550b5ae24bcb3b01` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:3878ce83573eaf692f801179a9d7a039337b970e1fe930e08f5396e5a0b9481f` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:3feb12e617a752b34825a33c876919310f525b057383d7cf50128e7ac2274b91` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:474658d1f081cf635fbbfadde5ae0df81b820f08398380f9ccd94c5d6c77cf11` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:48d437f081b006bc3b9864a1d5f2861a709b5703cde089c4c4472e943c355a8e` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:1ad6bd7896f5ec99c9ad1f41948a422b824f649121542a8cf7e8e5e9fee30cc4` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:25d7a16458521cfdb55021f91ee2f56a1867159ad235069d44976fbc28a29861` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:67e637b86e651931a771933b9e3727d7150fee24d2a34831d582bec5b69fa133` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:474658d1f081cf635fbbfadde5ae0df81b820f08398380f9ccd94c5d6c77cf11` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:ff486ba869bb53c27340a946f1b1339327fddceec449b8fca61c297c29d8d16f` |

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
