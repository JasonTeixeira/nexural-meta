# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T19:55:39.468Z
**Overall:** passed

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

- Commands passed: 0/0
- Fresh artifacts: 11/11
- Public repositories indexed: 136
- Public assets scored: 136
- Resource use cases: 7
- Recipes indexed: 8
- Forge-ready recipes: 8
- Resource library assets: 144
- Golden path: 14/14 gates
- Hosted golden paths: 1/7
- Proof-backed recipes: 1
- Proof environment: passed
- DB proof: degraded
- Public proof hash: `sha256:70d3d644a4e50e0711d731418847572c55c3a496aa563aca44b8178fe37c9fc8`

## Commands

| Step       | Status | Duration |
| ---------- | ------ | -------: |
| check-only | passed |      0ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 19.1h | `sha256:eccae4582652a1b26166e2ef685cbd1ba23e9046602381ead0ecf07d673aa6ad` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 17.5h | `sha256:0578a0d8934e82d82a1f368e579e4aec11211921599d6258e54f53dfe166343b` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 19.1h | `sha256:fc1c0fdc2eb8911f39f56e57d9a542c73caae3bfaf32f75a64ee250216241d9a` |
| `data/recipe-catalog.public.json`                | fresh  |    0h | `sha256:bbda6421c54fd9db10cfe7c62ec4233191c24f30f07f829174c3ce2cdd462568` |
| `data/resource-library.public.json`              | fresh  |    0h | `sha256:4a14cc8d632c9b85b6449d91dcb96c469035f3baa91e70bbc7e7e5d3d435605a` |
| `data/golden-path-runs.public.json`              | fresh  |    0h | `sha256:b1a4bf7c38a77314afcb5453dd9aa991e041bcda0f6f8c4de857aa74c0afe313` |
| `data/proof-environment.public.json`             | fresh  |  2.9h | `sha256:068a91de918ea17522352ce83de31df94a18c004b7f4a8844507dd6afd6ded3b` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:d25a9cf19d1f8c5a207f16d3747f88d31d73028cc512b12fec910d38f5fe6fb5` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:766a4eb50bec1131db653c65a2d05bddac01f534192c9c90da4cd3c82fe42157` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:766a4eb50bec1131db653c65a2d05bddac01f534192c9c90da4cd3c82fe42157` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:bb06d30dc5c180c9f39b140ba00aa93467157b8bb50ff8ae09c7b5f565a8a59f` |

## Next Actions

- **warn: Provide live deploy credentials when Phase 8 requires hosted proof** blocked-no-vercel-token
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 51 changed path(s) after maintenance run.

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
