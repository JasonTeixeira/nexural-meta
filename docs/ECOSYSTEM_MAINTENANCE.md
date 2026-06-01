# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T02:23:57.101Z
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
- Golden path: 9/9 gates
- Public proof hash: `sha256:443d3b63cd075a0babfa4a72b754d0a84f210a2ade6b7522a2b4044f594a0b97`

## Commands

| Step       | Status | Duration |
| ---------- | ------ | -------: |
| check-only | passed |      0ms |

## Artifact Freshness

| Artifact                                          | Status |  Age | Hash                                                                      |
| ------------------------------------------------- | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`             | fresh  | 1.6h | `sha256:eccae4582652a1b26166e2ef685cbd1ba23e9046602381ead0ecf07d673aa6ad` |
| `data/ecosystem-scorecard.public.json`            | fresh  |   0h | `sha256:08b20b4030d8f2d5c02a0325544c2838e9b5772116b5796f158d10bbdb3230e4` |
| `data/ecosystem-resource-map.public.json`         | fresh  | 1.6h | `sha256:fc1c0fdc2eb8911f39f56e57d9a542c73caae3bfaf32f75a64ee250216241d9a` |
| `data/golden-path-runs.public.json`               | fresh  | 0.1h | `sha256:1eb06058864f148404f02cdfd442562b4ef283fb7b0858c1947ee6d166d5e4d9` |
| `data/public-proof-layer.public.json`             | fresh  |   0h | `sha256:ba8c344e806a806b6fe2b866e603363689279103606e345c0741b5ceefe1f50d` |
| `exports/sageideas-dev/engineering-os-proof.json` | fresh  |   0h | `sha256:ba8c344e806a806b6fe2b866e603363689279103606e345c0741b5ceefe1f50d` |
| `exports/sageideas-dev/engineering-os-proof.md`   | fresh  |   0h | `sha256:fb76dc039404e45619cce3df19c98c29aa672341add459bce14588bb97bdc625` |

## Next Actions

- **info: Review public proof remaining gaps before publishing claims** 1 remaining gaps in public proof packet.
- **info: Review and commit generated maintenance artifacts** 27 changed path(s) after maintenance run.

## Generated Artifacts

- `data/ecosystem-maintenance.public.json`
- `evidence/maintenance/latest.json`
- `docs/ECOSYSTEM_MAINTENANCE.md`
