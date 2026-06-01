# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T00:59:19.663Z
**Overall:** passed

## Purpose

Phase 7 turns the Sage Ideas Engineering OS from static proof artifacts into a repeatable maintenance loop. The loop regenerates the registry, maturity scorecard, resource map, golden-path proof, public proof export, and this machine-readable maintenance report.

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
- Fresh artifacts: 7/7
- Public repositories indexed: 136
- Public assets scored: 136
- Resource use cases: 7
- Golden path: 7/7 gates
- Public proof hash: `sha256:d3333044f4e57a7dbd5320b5896d7e4b9e7003c96baff489f1fda45d2871cb07`

## Commands

| Step       | Status | Duration |
| ---------- | ------ | -------: |
| check-only | passed |      0ms |

## Artifact Freshness

| Artifact                                          | Status |  Age | Hash                                                                      |
| ------------------------------------------------- | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`             | fresh  | 0.2h | `sha256:eccae4582652a1b26166e2ef685cbd1ba23e9046602381ead0ecf07d673aa6ad` |
| `data/ecosystem-scorecard.public.json`            | fresh  | 0.2h | `sha256:ca1c0b7b675a5f794f7b9992697fa9dcbc7d01aa4ccb63ce55d255c2b54eda42` |
| `data/ecosystem-resource-map.public.json`         | fresh  | 0.2h | `sha256:fc1c0fdc2eb8911f39f56e57d9a542c73caae3bfaf32f75a64ee250216241d9a` |
| `data/golden-path-runs.public.json`               | fresh  | 0.1h | `sha256:ac8126744dba143f6c62c5483b50ffb9151fc5989f050c6e8fe244ac3e90b098` |
| `data/public-proof-layer.public.json`             | fresh  | 0.1h | `sha256:6e8841ae84f4e6b682877ce88299cb7dd415c3afc473a51b3af55636504dc84d` |
| `exports/sageideas-dev/engineering-os-proof.json` | fresh  | 0.1h | `sha256:6e8841ae84f4e6b682877ce88299cb7dd415c3afc473a51b3af55636504dc84d` |
| `exports/sageideas-dev/engineering-os-proof.md`   | fresh  | 0.1h | `sha256:82330521117c50fa866195f38c758c3c82eaf7d0d4010799f794defe21f3812f` |

## Next Actions

- **warn: Raise load-bearing ecosystem average above 70** Current load-bearing average is 60/100.
- **warn: Provide live deploy credentials when Phase 8 requires hosted proof** blocked-no-vercel-token
- **info: Review public proof remaining gaps before publishing claims** 3 remaining gaps in public proof packet.
- **info: Review and commit generated maintenance artifacts** 29 changed path(s) after maintenance run.

## Generated Artifacts

- `data/ecosystem-maintenance.public.json`
- `evidence/maintenance/latest.json`
- `docs/ECOSYSTEM_MAINTENANCE.md`
