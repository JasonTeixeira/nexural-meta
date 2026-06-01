# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T20:14:01.869Z
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

- Commands passed: 3/6
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
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:20f145c19f73db17da732e6d250c77489a8a13c0893d1ff59e8c4253726880ac`

## Commands

| Step                | Status | Duration |
| ------------------- | ------ | -------: |
| ecosystem_refresh   | failed |  11260ms |
| golden_path         | failed |   3118ms |
| golden_path_vercel  | passed |    320ms |
| proof_environment   | failed |   1450ms |
| db_proof            | passed |    317ms |
| public_proof_export | passed |    322ms |

## Artifact Freshness

| Artifact                                         | Status |   Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 19.4h | `sha256:eccae4582652a1b26166e2ef685cbd1ba23e9046602381ead0ecf07d673aa6ad` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 17.8h | `sha256:0578a0d8934e82d82a1f368e579e4aec11211921599d6258e54f53dfe166343b` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 19.4h | `sha256:fc1c0fdc2eb8911f39f56e57d9a542c73caae3bfaf32f75a64ee250216241d9a` |
| `data/recipe-catalog.public.json`                | fresh  |  0.3h | `sha256:8e90e6727cc64ac0d333b952a8e22f8136c5dc77c0c3f9c7d725c671fcab8c30` |
| `data/resource-library.public.json`              | fresh  |  0.3h | `sha256:5bccf20ccde4a38f9c5d75c6469ff7984f8447ad51bb77b759e9f67778e46aca` |
| `data/golden-path-runs.public.json`              | fresh  |  0.3h | `sha256:127dc072378eaa6ae148d9cbecabf2577a78411bd1c4a8e8e3fd39f89fda1afd` |
| `data/proof-environment.public.json`             | fresh  |    0h | `sha256:927d059ddcb65f012e4694c2074c6423836d55e7135481d0536f98632dd91bd0` |
| `data/db-proof.public.json`                      | fresh  |    0h | `sha256:46c64bd022f357edd280f28ba0a6ab59a2630b4c3756ce73745ff5edfef5fe2e` |
| `data/public-proof-layer.public.json`            | fresh  |    0h | `sha256:a86a15de833edf33d5da828fc30eb0ac0b2f5e26ffefec8193d91caf6619ffc2` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |    0h | `sha256:a86a15de833edf33d5da828fc30eb0ac0b2f5e26ffefec8193d91caf6619ffc2` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |    0h | `sha256:d7116d08ba19d26a7e149d6e7e0fbc992c6eb115714e9742226de9c021407a2d` |

## Next Actions

- **critical: Fix failed maintenance command: ecosystem_refresh** pnpm ecosystem:refresh exited 1.
- **critical: Fix failed maintenance command: golden_path** pnpm golden:path exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **warn: Provide live deploy credentials when Phase 8 requires hosted proof** blocked-no-vercel-token
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 11 changed path(s) after maintenance run.

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
