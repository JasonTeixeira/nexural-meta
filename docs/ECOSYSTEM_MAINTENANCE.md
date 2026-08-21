# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-21T09:12:14.880Z
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
- Public proof hash: `sha256:3a1837432cdf9f77b8c524270e7fd2f8a44bfb4fbc51f15023778a63a842786f`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17332ms |
| golden_path                 | failed |   4568ms |
| golden_path_vercel          | passed |    318ms |
| recipe_catalog_post_proof   | passed |    333ms |
| resource_library_post_proof | passed |    322ms |
| proof_environment           | failed |  13252ms |
| db_proof                    | passed |    307ms |
| operator_test               | failed |    340ms |
| maturity_lift               | passed |    315ms |
| daily_operating_loop        | passed |    310ms |
| portfolio_packaging         | passed |    312ms |
| public_proof_export         | passed |    314ms |

## Artifact Freshness

| Artifact                                         | Status |    Age | Hash                                                                      |
| ------------------------------------------------ | ------ | -----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |     0h | `sha256:15134232c21a1826eb84ebe504891218a81cc33db859e8a614f5e77089fbfebb` |
| `data/ecosystem-scorecard.public.json`           | fresh  |     0h | `sha256:05ab8292981bb952be028c02db929a4c21bce3232aeac4d0609526718b31928a` |
| `data/ecosystem-resource-map.public.json`        | fresh  |     0h | `sha256:2bf989cadf6d7f16d0cbf2b3e214e57de22a0ca20267e0660a89f6cea18f10e5` |
| `data/recipe-catalog.public.json`                | fresh  |     0h | `sha256:ebbf8f10a9aa19e8f4f1006f3adf6b4f8f3683a54808109b8e928e1f11e2f1dc` |
| `data/resource-library.public.json`              | fresh  |     0h | `sha256:07fc76c813417572cad54cb599f72b3edd8b1296daa70d163935f3511eba874c` |
| `data/golden-path-runs.public.json`              | stale  | 598.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |     0h | `sha256:6a8b6fbfd6ff448a449f8939be858266c16d7041376630a200ac84a68d1bc83a` |
| `data/db-proof.public.json`                      | fresh  |     0h | `sha256:55e647844ce01700fadf26c186a457006b448c8c5338cf0cc0978d557861e458` |
| `data/public-proof-layer.public.json`            | fresh  |     0h | `sha256:3a50b595a5f2e16510ca762506ccb97c24a2b06a11977af1e35172b98cb6c7e7` |
| `data/operator-test.public.json`                 | fresh  |     0h | `sha256:af5b2cc30e531863cf88defc7b84be16e616fd500abd2fa21ab416988a7d9680` |
| `data/maturity-lift.public.json`                 | fresh  |     0h | `sha256:33a2a43684579843860c36cd0dbc58f2d19c09383a66e3d9448b9151f01cb61e` |
| `data/daily-operating-loop.public.json`          | fresh  |     0h | `sha256:d4dfa46b38c7cdf4b6e4542ec3feb3520ffaf6845163b470c9261139b32b0b79` |
| `data/portfolio-packaging.public.json`           | fresh  |     0h | `sha256:9163afd5dc64e813f853292cb2658399ea8c7ae12c749b4b3a5d86cd36a1d143` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |     0h | `sha256:3a50b595a5f2e16510ca762506ccb97c24a2b06a11977af1e35172b98cb6c7e7` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |     0h | `sha256:665629b760696fd8fd5165bd0433b95aa61e77a0712682f0ad5b63223c579dd1` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 598.1h exceeds 168h.
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
