# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-20T09:10:34.402Z
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
- Public proof hash: `sha256:56270d02a9697be12ba444bdb14c015c7fcb2fb033c9b36241f0ec2cc93bba4d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  13728ms |
| golden_path                 | failed |   3867ms |
| golden_path_vercel          | passed |    317ms |
| recipe_catalog_post_proof   | passed |    328ms |
| resource_library_post_proof | passed |    333ms |
| proof_environment           | failed |   7926ms |
| db_proof                    | passed |    312ms |
| operator_test               | failed |    339ms |
| maturity_lift               | passed |    314ms |
| daily_operating_loop        | passed |    310ms |
| portfolio_packaging         | passed |    317ms |
| public_proof_export         | passed |    324ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |   0h | `sha256:084c39dca0bdfa7d0e5c64e6d8a328dd3345f62e8945aaad8a38f76423301edf` |
| `data/ecosystem-scorecard.public.json`           | fresh  |   0h | `sha256:d5fe06a88b64c0ccc8d08c1f99c0f62e729794aa0fa3c22ce70d3faf09b551e3` |
| `data/ecosystem-resource-map.public.json`        | fresh  |   0h | `sha256:3479a044e75f466b2ef55d2ad611d1e56a90d250a14d59a3f172577f5aad1c3b` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:f05d203f546d35680a731ed0fc359827307d131a162ff2cd23b0e3fd1e55f6b2` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:7c0f40d73542fd4b9591275ef73284d19f345bc8b6ec94cfb2c9c78e11dd9c2b` |
| `data/golden-path-runs.public.json`              | stale  | 574h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:60967a5b7fb0d4f7a03a898ab0b3e025bd2d110dd337f276a1c8192fb31bf607` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:b45bb70742d44eb63d268ad87cf7fee6d0f36de33f4acc5efcaa81443ac314fc` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:8fb45e5a9a12956ccdbc132a3ef84c71a3a1b565bd918358b43666fceb647fb6` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:b78ded2375a2888d9c22f0a243cd8d92f7cde165b768dff7105cdc8b99c16fe2` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:b579a481b84d7300b69f621cba64efee6882c002f67dc559e49b72448d9e214e` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:98017d2b7f5b28124838880f9ab4d6da38cb501da2c392ff03b781f22ff23b24` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:50b13d5d4c9d430d9238b2b92ec2a0b166b643370062f57144f4193489b2559a` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:8fb45e5a9a12956ccdbc132a3ef84c71a3a1b565bd918358b43666fceb647fb6` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:fd839bb98bc4f0c05ab42f8f3131d5d7508fcb512c9d1dca38b6f7e4ef5348ff` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 574h exceeds 168h.
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
