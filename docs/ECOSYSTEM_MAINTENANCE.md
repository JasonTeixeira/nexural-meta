# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T16:00:11.653Z
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
- Golden path: 13/13 gates
- Public proof hash: `sha256:b2f98eca2ddca00e3009b0d9ae14e3ebbb593eb6812206fc6c5c4208c8da6ca5`

## Commands

| Step       | Status | Duration |
| ---------- | ------ | -------: |
| check-only | passed |      0ms |

## Artifact Freshness

| Artifact                                          | Status |   Age | Hash                                                                      |
| ------------------------------------------------- | ------ | ----: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`             | fresh  | 15.2h | `sha256:eccae4582652a1b26166e2ef685cbd1ba23e9046602381ead0ecf07d673aa6ad` |
| `data/ecosystem-scorecard.public.json`            | fresh  | 13.6h | `sha256:0578a0d8934e82d82a1f368e579e4aec11211921599d6258e54f53dfe166343b` |
| `data/ecosystem-resource-map.public.json`         | fresh  | 15.2h | `sha256:fc1c0fdc2eb8911f39f56e57d9a542c73caae3bfaf32f75a64ee250216241d9a` |
| `data/golden-path-runs.public.json`               | fresh  |    0h | `sha256:e4fd10dadd5f955ed187761b1d800deb3394e3b89591d5d11a0dc68355f804ee` |
| `data/public-proof-layer.public.json`             | fresh  |    0h | `sha256:59f4cf69d9568ec5c82e3c65f7eb80b882d803d15a145df6ce302d69e6279e58` |
| `exports/sageideas-dev/engineering-os-proof.json` | fresh  |    0h | `sha256:59f4cf69d9568ec5c82e3c65f7eb80b882d803d15a145df6ce302d69e6279e58` |
| `exports/sageideas-dev/engineering-os-proof.md`   | fresh  |    0h | `sha256:b823a6b29b0a755513a65a57a72836e98ec07308ccd906e0e6980260fd5f92b2` |

## Next Actions

- **info: Review public proof remaining gaps before publishing claims** 1 remaining gaps in public proof packet.
- **info: Review and commit generated maintenance artifacts** 15 changed path(s) after maintenance run.

## Generated Artifacts

- `data/ecosystem-maintenance.public.json`
- `evidence/maintenance/latest.json`
- `docs/ECOSYSTEM_MAINTENANCE.md`
