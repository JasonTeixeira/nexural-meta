# Daily Operating Loop

**Status:** attention-required
**Generated:** 2026-10-21T09:03:28.876Z

## Refresh

- Maintenance: failed
- Hosted golden paths: 78
- DB proof: degraded
- Public hash: `sha256:68c8d5f9a6282c9556473dd9d678bc78c669c9596ce1b52290d6954075b2f6b0`

## Queue

- **warn:** data/golden-path-runs.public.json - golden_path is stale.
- **critical:** Fix failed maintenance command: golden_path - pnpm golden:path exited 1.
- **critical:** Fix failed maintenance command: proof_environment - pnpm proof:env exited 1.
- **critical:** Fix failed maintenance command: operator_test - pnpm operator:test exited 1.
- **warn:** Refresh stale artifact: data/golden-path-runs.public.json - golden_path age 2037.9h exceeds 168h.
- **critical:** Fix proof environment lock gates - proof environment status is failed.
- **warn:** Finish DB proof hardening - db proof status is degraded; migration status is passed.
- **info:** Review public-safe packet remaining gaps before making external claims - 1 remaining gaps in public-safe packet.
- **info:** Review and commit generated maintenance artifacts - 34 changed path(s) after maintenance run.
