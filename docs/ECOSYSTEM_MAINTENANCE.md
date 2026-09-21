# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-09-21T10:13:40.644Z
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
- Public proof hash: `sha256:ae747990d9c17f22591afac6f64003bd155b164c1abeafa66afb1b09fe85754a`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  17687ms |
| golden_path                 | failed |   3520ms |
| golden_path_vercel          | passed |    243ms |
| recipe_catalog_post_proof   | passed |    255ms |
| resource_library_post_proof | passed |    251ms |
| proof_environment           | failed |   7951ms |
| db_proof                    | passed |    238ms |
| operator_test               | failed |    263ms |
| maturity_lift               | passed |    237ms |
| daily_operating_loop        | passed |    236ms |
| portfolio_packaging         | passed |    243ms |
| public_proof_export         | passed |    270ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:b1b81b4d3c973de7cb272f9de531885b9248402d0461c71778f31916c4d8cdf3` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:328d276a404cbdba63fb7c03109acf218bbc9313ddff87c1f52f8c22d286ea7d` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:b9c54d0bb9bc0bd3f6b8c9ca0e3c67a71c922e82099bc2885efbdeb4a6c3ce39` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:849dd24662d082e15861e9b1404b93c3e419e7aa6315843391c3326a9efba15a` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:1c1fb12b56bc5feb1d818ef3febdcd294e9ddd01d2276e68563c0c293d48c0d0` |
| `data/golden-path-runs.public.json`              | stale  | 1343.1h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:975cabddfa67524b983a360a8b74d350f6415fc11609b84cf43e9667ae4d54bb` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:b373127a3fff7b65fc802740ae52af779e12ea8f1dbca32a544dd1f42a18b75b` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:3d528e7fa10a026dd4115d259089e65e2cf5c63583fd779b2c3ff67a0321493c` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:b2a3a8da2eef0ff1b785c2d82be50960b04b4c324f2082d21633a550e743c0bb` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:4503a3542e2bb7376dff3f0e7566532d2cfe94d25cea28d257e64717e9c7d8dd` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:667fd6f95f190660d87f7886707e245244dfddece9b3d99ce6c8c62abd8288d9` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:8ffe3f3e5a228b1c311b26680da52bfddd413424335085cdb7e443fd626d7b06` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:3d528e7fa10a026dd4115d259089e65e2cf5c63583fd779b2c3ff67a0321493c` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:092d2764d7722fa081e28836236bc0c6847f0dc230eb9b3dde9d5d5e30cbc370` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1343.1h exceeds 168h.
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
