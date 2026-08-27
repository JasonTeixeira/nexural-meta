# Daily Operating Loop

**Status:** attention-required
**Generated:** 2026-08-27T12:28:58.197Z

## Refresh

- Maintenance: failed
- Hosted golden paths: 78
- DB proof: degraded
- Public hash: `sha256:bf1de7474d8b7a9d900c0f5c6bc307b8c380d29e01f9fac9f4f6f675562e34ff`

## Queue

- **warn:** data/golden-path-runs.public.json - golden_path is stale.
- **critical:** Fix failed maintenance command: golden_path - pnpm golden:path exited 1.
- **critical:** Fix failed maintenance command: proof_environment - pnpm proof:env exited 1.
- **critical:** Fix failed maintenance command: operator_test - pnpm operator:test exited 1.
- **warn:** Refresh stale artifact: data/golden-path-runs.public.json - golden_path age 718.1h exceeds 168h.
- **critical:** Fix proof environment lock gates - proof environment status is failed.
- **warn:** Finish DB proof hardening - db proof status is degraded; migration status is passed.
- **info:** Review public-safe packet remaining gaps before making external claims - 1 remaining gaps in public-safe packet.
- **info:** Review and commit generated maintenance artifacts - 34 changed path(s) after maintenance run.
