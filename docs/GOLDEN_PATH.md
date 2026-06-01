# Golden Path Proof

**Status:** Phase 5 golden path passed with public deployment evidence
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T02:20:09.791Z

## What This Proves

A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, deploy publicly, and capture evidence.

## Latest Run

- Run ID: `client-intake-portal-2026-06-01T021207279Z`
- Spec: `data/golden-path-specs/client-intake-portal.json`
- Recipe: `internal-tool-dashboard`
- App: `client-intake-portal`
- Local runtime: `http://127.0.0.1:3041`
- Deployed URL: `https://sage-client-intake-portal-vercel.vercel.app`
- Deploy status: `verified-vercel-url`
- Generated app hash: `sha256:559b63641017c3ed7377476f5f5590391a571cf0c2e6f1bc98954abad95960fc`
- Wall clock: 83s

## Gates

| Gate                            | Status | Detail                                                                      |
| ------------------------------- | ------ | --------------------------------------------------------------------------- |
| Resource selection              | passed | 1 recommended assets selected from 4 layers.                                |
| Forge emit                      | passed | 31 files emitted by internal-tool-dashboard.                                |
| Install dependencies            | passed | exit 0                                                                      |
| Standalone lockfile             | passed | Generated app includes its own pnpm-lock.yaml for isolated Vercel installs. |
| Typecheck generated app         | passed | exit 0                                                                      |
| Build generated app             | passed | exit 0                                                                      |
| Start local runtime             | passed | HTTP 200 from /api/health.                                                  |
| Verify live local app           | passed | 8/8 checks passed.                                                          |
| Verify public Vercel deployment | passed | 8/8 checks passed at https://sage-client-intake-portal-vercel.vercel.app.   |

## Selected Resources

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100

## Remaining Gaps

- Runtime proof uses mock credentials because staging Supabase/Auth environment variables are not set in this shell.
- Production auth/database credentials are intentionally not committed.

## Run It

```bash
pnpm golden:path
pnpm golden:path:attach-deploy -- --url https://your-app.vercel.app
```
