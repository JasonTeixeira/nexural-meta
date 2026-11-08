# Daily Operating Loop

**Status:** attention-required
**Generated:** 2026-11-08T09:02:13.988Z

## Refresh

- Maintenance: failed
- Hosted golden paths: 78
- DB proof: degraded
- Public hash: `sha256:2c599b341add2d0ac46dc9031d86f5651e304144ddbc312084ef9912450555b0`

## Queue

- **warn:** data/golden-path-runs.public.json - golden_path is stale.
- **critical:** Fix failed maintenance command: golden_path - pnpm golden:path exited 1.
- **critical:** Fix failed maintenance command: proof_environment - pnpm proof:env exited 1.
- **critical:** Fix failed maintenance command: operator_test - pnpm operator:test exited 1.
- **warn:** Refresh stale artifact: data/golden-path-runs.public.json - golden_path age 2469.9h exceeds 168h.
- **critical:** Fix proof environment lock gates - proof environment status is failed.
- **warn:** Finish DB proof hardening - db proof status is degraded; migration status is passed.
- **info:** Review public-safe packet remaining gaps before making external claims - 1 remaining gaps in public-safe packet.
- **info:** Review and commit generated maintenance artifacts - 34 changed path(s) after maintenance run.
