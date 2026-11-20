# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-11-20T09:01:55.404Z
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
- Public repositories indexed: 163
- Public assets scored: 163
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 175
- Golden path: 14/14 gates
- Hosted golden paths: 78/202
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:2fe0991a6081e898979e88c7d465c21dc556cd2b2ac23186958ef4d83d3a7d6a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  15584ms |
| golden_path                 | failed |   2718ms |
| golden_path_vercel          | passed |    218ms |
| recipe_catalog_post_proof   | passed |    227ms |
| resource_library_post_proof | passed |    225ms |
| proof_environment           | failed |   8239ms |
| db_proof                    | passed |    210ms |
| operator_test               | failed |    235ms |
| maturity_lift               | passed |    214ms |
| daily_operating_loop        | passed |    212ms |
| portfolio_packaging         | passed |    219ms |
| public_proof_export         | passed |    218ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:1bb2d9c89577018caa13d09678224fa889c8cc0b832fd5e24791ec5ae605f8e1` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:eaa2b3de6ed9309a9e53282c5aad3692a50d7bd8a90fdac95d505cd3dca11fa1` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:9f5395f4c6ce6a789d3c96970fe64f8b9524ddde1ba05861caeec92f6a6b9364` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:b58166edcf781c077d188acef674a784c4710619eb772846b560e83470e6ce19` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:13f5be7d6f5b66696b1b64685b98eb9fab2e754c1466d6c97d0a4805a8e515d2` |
| `data/golden-path-runs.public.json`              | stale  | 2781.9h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:0f4fa6ec1e0ec5c355816e20afcb00f570eaf23046573687e4e7f5d43ab44e3f` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:cae93d26243a3a6446646cdd6ca1b9be5eac2b4fee9e96511860d2ee0edf9d54` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:67f27447ad5101120dffb80b58154bd5e34b7e9cee11cfab36f36c28c800d8a8` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:d7f5ebe164ccab7b56b36fba159bb70528297b4b8588f7a7bf09432f28c67718` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:6078e3f9f616a96c3ac59430ea1395fc55aaa0a177c7fee5575c6eb53a159cb6` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:6760d73179ac6ae7c27c31ee7a419f77bac4f2ff9af7f12aa8e609359aa0044e` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:bb47f1747de89f10c024adebe1fa20b447c2de66deeac583d545876dbaa38486` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:67f27447ad5101120dffb80b58154bd5e34b7e9cee11cfab36f36c28c800d8a8` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:ddc31e260292b417bbc9fa80cd9d785cac030722444b28a418387180d1e54d39` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 2781.9h exceeds 168h.
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
