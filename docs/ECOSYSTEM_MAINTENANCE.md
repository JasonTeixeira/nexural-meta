# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T14:25:17.331Z
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
- Golden path: 10/10 gates
- Public proof hash: `sha256:d2b247e135bb5eed0dd8de7abb7d1f6ab05479d8d474f7f342c7a1161fb6c617`

## Commands

| Step       | Status | Duration |
| ---------- | ------ | -------: |
| check-only | passed |      0ms |

## Artifact Freshness

| Artifact                                          | Status |   Age | Hash                                                                      |
| ------------------------------------------------- | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`             | fresh  | 13.6h | `sha256:eccae4582652a1b26166e2ef685cbd1ba23e9046602381ead0ecf07d673aa6ad` |
| `data/ecosystem-scorecard.public.json`            | fresh  |   12h | `sha256:0578a0d8934e82d82a1f368e579e4aec11211921599d6258e54f53dfe166343b` |
| `data/ecosystem-resource-map.public.json`         | fresh  | 13.6h | `sha256:fc1c0fdc2eb8911f39f56e57d9a542c73caae3bfaf32f75a64ee250216241d9a` |
| `data/golden-path-runs.public.json`               | fresh  |    0h | `sha256:cfa152d4bb103d543b58aa1e92447f5a83b79c174a447e7d95b40973cf37cf6a` |
| `data/public-proof-layer.public.json`             | fresh  |    0h | `sha256:844ba42d5b30b913c8d97ba14f1765f1c69b0597c4b448078882da476f40b97b` |
| `exports/sageideas-dev/engineering-os-proof.json` | fresh  |    0h | `sha256:844ba42d5b30b913c8d97ba14f1765f1c69b0597c4b448078882da476f40b97b` |
| `exports/sageideas-dev/engineering-os-proof.md`   | fresh  |    0h | `sha256:6d7fc7374f3196a910efa210e1516cc4eca5f65383f49b62891e82306e6548e4` |

## Next Actions

- **info: Review public proof remaining gaps before publishing claims** 1 remaining gaps in public proof packet.
- **info: Review and commit generated maintenance artifacts** 14 changed path(s) after maintenance run.

## Generated Artifacts

- `data/ecosystem-maintenance.public.json`
- `evidence/maintenance/latest.json`
- `docs/ECOSYSTEM_MAINTENANCE.md`
