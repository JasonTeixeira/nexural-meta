# Golden Path Proof

**Status:** Phase 5 golden path passed with public deployment evidence
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T15:59:59.200Z

## What This Proves

A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, deploy publicly, and capture evidence.

## Latest Run

- Run ID: `client-intake-portal-2026-06-01T155533774Z`
- Spec: `data/golden-path-specs/client-intake-portal.json`
- Recipe: `internal-tool-dashboard`
- App: `client-intake-portal`
- Local runtime: `http://127.0.0.1:3042`
- Deployed URL: `https://sage-client-intake-portal-vercel.vercel.app`
- Deploy status: `verified-vercel-url`
- Generated app hash: `sha256:a49620a467049a06e4aadff34971756aa01ec0d9cea61e69ff4a6d32e2522dad`
- Wall clock: 67s

## Gates

| Gate                             | Status | Detail                                                                              |
| -------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Resource selection               | passed | 1 recommended assets selected from 4 layers.                                        |
| Forge emit                       | passed | 31 files emitted by internal-tool-dashboard.                                        |
| Verify Supabase/Auth runtime     | passed | HTTP 200 from Supabase Auth settings for project xacwaprwlbqgmswgodsk.              |
| Apply Supabase migrations        | passed | Supabase migrations applied through Management API (0 applied, 2 already present).  |
| Install dependencies             | passed | exit 0                                                                              |
| Standalone lockfile              | passed | Generated app includes its own pnpm-lock.yaml for isolated Vercel installs.         |
| Typecheck generated app          | passed | exit 0                                                                              |
| Build generated app              | passed | exit 0                                                                              |
| Start local runtime              | passed | HTTP 200 from /api/health.                                                          |
| DB-backed CRUD health proof      | passed | Generated /api/health completed insert-read-update-delete against staging Postgres. |
| Verify live local app            | passed | 8/8 checks passed.                                                                  |
| Verify public Vercel deployment  | passed | 8/8 checks passed at https://sage-client-intake-portal-vercel.vercel.app.           |
| Verify deployed DB-backed health | passed | Deployed /api/health completed insert-read-update-delete against staging Postgres.  |

## Selected Resources

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100

## Remaining Gaps

- Production auth/database credentials are intentionally not committed.

## Run It

```bash
pnpm golden:path
pnpm golden:path:attach-deploy -- --url https://your-app.vercel.app
```
