# Ecosystem Maintenance

**Status:** Phase 7 self-maintenance loop
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-20T10:04:51.930Z
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
- Fresh artifacts: 15/15
- Public repositories indexed: 140
- Public assets scored: 140
- Resource use cases: 7
- Recipes indexed: 12
- Forge-ready recipes: 12
- Resource library assets: 152
- Golden path: 14/14 gates
- Hosted golden paths: 78/175
- Proof-backed recipes: 3
- Proof environment: failed
- DB proof: degraded
- Public proof hash: `sha256:b146cfc260f4c93916b9f7108c6963aeb886f21c69a3a97c1980269669c1136b`

## Commands

| Step                        | Status | Duration |
| --------------------------- | ------ | -------: |
| ecosystem_refresh           | passed |  16910ms |
| golden_path                 | passed | 165982ms |
| golden_path_vercel          | failed |  84428ms |
| recipe_catalog_post_proof   | passed |    334ms |
| resource_library_post_proof | passed |    328ms |
| proof_environment           | failed |   1927ms |
| db_proof                    | passed |    313ms |
| operator_test               | failed |    343ms |
| maturity_lift               | passed |    312ms |
| daily_operating_loop        | passed |    315ms |
| portfolio_packaging         | passed |    321ms |
| public_proof_export         | passed |    325ms |

## Artifact Freshness

| Artifact                                         | Status |  Age | Hash                                                                      |
| ------------------------------------------------ | ------ | ---: | ------------------------------------------------------------------------- |
| `data/ecosystem-registry.public.json`            | fresh  | 0.1h | `sha256:7ca202b6bf202f07f205c17fb869c0f8897bc61d1bba12c11877f5e5ddddff8b` |
| `data/ecosystem-scorecard.public.json`           | fresh  | 0.1h | `sha256:80e6aba745b30907480faf17d906385d552f7c96fc692895fd6b2d8ad046f7c9` |
| `data/ecosystem-resource-map.public.json`        | fresh  | 0.1h | `sha256:b9913117d66d32c9c236a75ddd308e66c692c08e1f37cdbd3c2c95705ecddf0d` |
| `data/recipe-catalog.public.json`                | fresh  |   0h | `sha256:66a716fed838e660326952a601f73fb54b77648520d1088cc57683c3b706cc06` |
| `data/resource-library.public.json`              | fresh  |   0h | `sha256:a573ef62711206e5fc913f06a38fcbf906456a248a06e47c28ce4f4c3895d926` |
| `data/golden-path-runs.public.json`              | fresh  |   0h | `sha256:819dad472c74080b35738b43188448b00fbd8ac30e6a1a0fb658b055a2063a4f` |
| `data/proof-environment.public.json`             | fresh  |   0h | `sha256:145c255c493c2098052d643f4e4940f343b20e3e002e6fc777f65ed9044b4053` |
| `data/db-proof.public.json`                      | fresh  |   0h | `sha256:669c172481dc354d0b9cf3b992029481ecfd7f5226923ccc88c9f57d06a975da` |
| `data/public-proof-layer.public.json`            | fresh  |   0h | `sha256:474d835a479fd500e330bca100e6494e7e3f19dbed6d811c043b05eeff49af65` |
| `data/operator-test.public.json`                 | fresh  |   0h | `sha256:9a65c23b4719ad808b1daa60708128eadb6d3b6702e2d2bb64e559aee9c9b7a3` |
| `data/maturity-lift.public.json`                 | fresh  |   0h | `sha256:00ea96120c40c6681f361281fa57a458d1d07c1f3b5160b2c8dd81f45c080293` |
| `data/daily-operating-loop.public.json`          | fresh  |   0h | `sha256:02dd8c68c8cbacf7102fdea904bc6668132b2fe3c65f1330f195bfc6d514f28b` |
| `data/portfolio-packaging.public.json`           | fresh  |   0h | `sha256:9c11a0ee7dd3b992632273f8cf048a59ad515ffeeb4292a81652fdf6310045f1` |
| `exports/proof-packet/engineering-os-proof.json` | fresh  |   0h | `sha256:474d835a479fd500e330bca100e6494e7e3f19dbed6d811c043b05eeff49af65` |
| `exports/proof-packet/engineering-os-proof.md`   | fresh  |   0h | `sha256:8f287e70323b8acbfe7118f76c5f5e436c869ea906b55b2e58bb778a578b4ed0` |

## Next Actions

- **critical: Fix failed maintenance command: golden_path_vercel** pnpm golden:path:deploy exited 1.
- **critical: Fix failed maintenance command: proof_environment** pnpm proof:env exited 1.
- **critical: Fix failed maintenance command: operator_test** pnpm operator:test exited 1.
- **critical: Fix proof environment lock gates** proof environment status is failed.
- **warn: Finish DB proof hardening** db proof status is degraded; migration status is passed.
- **info: Review public-safe packet remaining gaps before making external claims** 1 remaining gaps in public-safe packet.
- **info: Review and commit generated maintenance artifacts** 44 changed path(s) after maintenance run.

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
