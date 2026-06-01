# Golden Path Proof

**Status:** Phase 5 local golden path passed
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T00:51:00.187Z

## What This Proves

A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, and capture evidence.

## Latest Run

- Run ID: `client-intake-portal-2026-06-01T004907152Z`
- Spec: `data/golden-path-specs/client-intake-portal.json`
- Recipe: `internal-tool-dashboard`
- App: `client-intake-portal`
- Local runtime: `http://127.0.0.1:3041`
- Generated app hash: `sha256:b9fbd4e6187a96a67160d20ea4c55f71b86d5c288974d0b92b86e4b9d69b3f6f`
- Wall clock: 113s

## Gates

| Gate                    | Status | Detail                                       |
| ----------------------- | ------ | -------------------------------------------- |
| Resource selection      | passed | 1 recommended assets selected from 4 layers. |
| Forge emit              | passed | 31 files emitted by internal-tool-dashboard. |
| Install dependencies    | passed | exit 0                                       |
| Typecheck generated app | passed | exit 0                                       |
| Build generated app     | passed | exit 0                                       |
| Start local runtime     | passed | HTTP 200 from /api/health.                   |
| Verify live local app   | passed | 8/8 checks passed.                           |

## Selected Resources

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100

## Remaining Gaps

- No public Vercel preview was created because VERCEL_TOKEN is not set in this shell.
- Runtime proof uses mock credentials and local Next server; production auth/database credentials are intentionally not committed.

## Run It

```bash
pnpm golden:path
```
