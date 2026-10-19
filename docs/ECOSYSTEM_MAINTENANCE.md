# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-19T10:12:58.557Z
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
- Public proof hash: `sha256:81e93576e1bc4da2543ff870006a3e67feb6c10335f1bf521827cee8e16b9e5c`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16226ms |
| golden_path                 | failed |   3738ms |
| golden_path_vercel          | passed |    331ms |
| recipe_catalog_post_proof   | passed |    343ms |
| resource_library_post_proof | passed |    343ms |
| proof_environment           | failed |   7860ms |
| db_proof                    | passed |    324ms |
| operator_test               | failed |    359ms |
| maturity_lift               | passed |    329ms |
| daily_operating_loop        | passed |    321ms |
| portfolio_packaging         | passed |    331ms |
| public_proof_export         | passed |    338ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:c12bdbacac2076293c21e47356612e651a78c5ea55bdd73f0d4bd4cdf3294306` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:15b143b4c263b1ba8668a4e3670427882114782e538f39ba4be11c8be8444050` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:bedb6ecb063b8b96c0ce1fb12f10006fb7f42feafa7ed75d277f4e7c8187c13b` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:04a93475be83986da3c0e987c63bd093a28cce69448cef7a9ebb5ececa1afb8f` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:6484c9f9148783a12c1a4ba90d18356abdd4ac7afae28737a4ca307d39ec5c82` |
| `data/golden-path-runs.public.json`              | stale  | 2015.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:77db715b1f3892939af9dbd5c0a625d946bbacd97e5bf73521a7c9f55ec6ba57` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:8634a3c622e1eba13d4c3e962f8fe5fd073c3762485c615033c96f7db3177314` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:fae9f0dc02569d50d9d946fe11fbfed2e4fa40ead9521e819c875df65d17b6a9` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:46734d85b0509fab352b5fce464f6c485769bb370724b560ec67f254b64fd6a0` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:b19cbf228dd31ed468b27c1779cbe69e93e8cce90d337ad47cdffc0541882a06` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:7aa521891e552caac40ecdbce74e44c1c5850bcfeb2eb872b2265dbf398998a7` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:81b97dcdaaaea78435d2fed85643913c76489d142558accdb362e91a1897a5fe` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:fae9f0dc02569d50d9d946fe11fbfed2e4fa40ead9521e819c875df65d17b6a9` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:cb0bbaef7e0ef6958fdcb01e42b60a45755e37b9ad6cd6b5547712b9dee4e146` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2015.1h exceeds 168h.
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
