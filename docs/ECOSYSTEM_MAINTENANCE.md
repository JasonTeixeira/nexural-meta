# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-10-08T15:55:40.487Z
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
- Public proof hash: `sha256:9969366bb8302fcfa47cf34deddf076faad06e67246920cf4f514857c5f6dd7d`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16766ms |
| golden_path                 | failed |   3440ms |
| golden_path_vercel          | passed |    264ms |
| recipe_catalog_post_proof   | passed |    324ms |
| resource_library_post_proof | passed |    268ms |
| proof_environment           | failed |   8263ms |
| db_proof                    | passed |    255ms |
| operator_test               | failed |    279ms |
| maturity_lift               | passed |    252ms |
| daily_operating_loop        | passed |    248ms |
| portfolio_packaging         | passed |    263ms |
| public_proof_export         | passed |    262ms |

## Artifact Freshness

| Artifact                                         | Status |     Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ------: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  |      0h | `sha256:9bee55f3ec3f868ce03b6f13e4b8b05bef5a4b007d9f69a9094e0806fdb53c4a` |
| `data/ecosystem-scorecard.public.json`           | fresh  |      0h | `sha256:98a75bed26e3e62dcb3c075230b2307fe91d4ec677f51a74ccf5d6f9af89e160` |
| `data/ecosystem-resource-map.public.json`        | fresh  |      0h | `sha256:cacd834bf009ce104db4d7466c2ee30ba9468a9f9e89156fb0d5b789b925af5a` |
| `data/recipe-catalog.public.json`                | fresh  |      0h | `sha256:e59e1c4e16c9f4e3de92bae3af7a329263174acc52af6c857b16e62f832d8892` |
| `data/resource-library.public.json`              | fresh  |      0h | `sha256:307589978fd81770167eb884801ad51d004eaf71792beb2dc02d310ecb0ddb7c` |
| `data/golden-path-runs.public.json`              | stale  | 1756.8h | `sha256:60f43286876317a3dc5364873978b122266cb024610988a861407d5f1ca52897` |
| `data/proof-environment.public.json`             | fresh  |      0h | `sha256:5acbc7d5b8d38b022835dd8ec94a772992a2de06f2b5d92de34c74ab885dc73a` |
| `data/db-proof.public.json`                      | fresh  |      0h | `sha256:6495989d2043099f79f31f321d188d24eb10490034f54ebd5b66f68407ec10ab` |
| `data/public-proof-layer.public.json`            | fresh  |      0h | `sha256:ab798e1a396696a1166528265e73b213b47b4f71411bc7d5c815ef8f74380b00` |
| `data/operator-test.public.json`                 | fresh  |      0h | `sha256:ae6efa81fb1bebd717792d179c48c71ffe936e51c0d960847daaaa5a884e5425` |
| `data/maturity-lift.public.json`                 | fresh  |      0h | `sha256:d36b4a9864946733ccbce8fa3a7a4a2aa538f48d1eb5c11ad0b951df4f63112f` |
| `data/daily-operating-loop.public.json`          | fresh  |      0h | `sha256:41dbca7c38bbc1cb461c87a5399e0f2498ce8fd25df6f28f7e7df463a852eb15` |
| `data/portfolio-packaging.public.json`           | fresh  |      0h | `sha256:ce6b1538dd5152c65d81a9849a1ed9b9bac38eb63b82302a9f14da0b3b8893b4` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |      0h | `sha256:ab798e1a396696a1166528265e73b213b47b4f71411bc7d5c815ef8f74380b00` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |      0h | `sha256:f23d509ce0d42cfe6253d616b680735f4cda38508698c283da440f8823bc4376` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **warn: Refresh stale artifact: data/golden-path-runs.public.json** golden_path age 1756.8h exceeds 168h.
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
