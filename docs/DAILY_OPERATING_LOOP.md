# Daily Operating Loop

**Status:** attention-required
**Generated:** 2026-09-20T09:02:22.914Z

## Refresh

- Maintenance: failed
- Hosted golden paths: 78
- DB proof: degraded
- Public hash: `sha256:b12cd4e1e87d245696011cecf644f97d3ebd7bcf8ac003e07d9cc671ed63bf37`

## Queue

- **warn:** data/golden-path-runs.public.json - golden_path is stale.
- **critical:** Fix failed maintenance command: golden_path - pnpm golden:path exited 1.
- **critical:** Fix failed maintenance command: proof_environment - pnpm proof:env exited 1.
- **critical:** Fix failed maintenance command: operator_test - pnpm operator:test exited 1.
- **warn:** Refresh stale artifact: data/golden-path-runs.public.json - golden_path age 1293.9h exceeds 168h.
- **critical:** Fix proof environment lock gates - proof environment status is failed.
- **warn:** Finish DB proof hardening - db proof status is degraded; migration status is passed.
- **info:** Review public-safe packet remaining gaps before making external claims - 1 remaining gaps in public-safe packet.
- **info:** Review and commit generated maintenance artifacts - 34 changed path(s) after maintenance run.
