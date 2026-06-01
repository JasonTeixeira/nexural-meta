# Golden Path Proof

**Status:** Phase 5 local golden path passed
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T19:55:19.028Z

## What This Proves

A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, and capture evidence.

## Latest Run

- Run ID: `rag-knowledge-chat-2026-06-01T195349129Z`
- Spec: `data/golden-path-specs/rag-knowledge-chat.json`
- Recipe: `saas-rag-chat`
- App: `rag-knowledge-chat`
- Local runtime: `http://127.0.0.1:3042`
- Generated app hash: `sha256:73d32666d246cc83852b6657539eea304e6617980512adadbf66b2700bd5de14`
- Wall clock: 90s

## Gates

| Gate                            | Status | Detail                                                                           |
| ------------------------------- | ------ | -------------------------------------------------------------------------------- |
| Resource selection              | passed | 1 recommended assets selected from 4 layers.                                     |
| Forge emit                      | passed | 46 files emitted by saas-rag-chat.                                               |
| Generated app usability surface | passed | Generated app includes 8 required runtime, DB, and recipe-specific files.        |
| Verify Supabase/Auth runtime    | passed | Skipped real Supabase/Auth probe because staging credentials are not configured. |
| Apply Supabase migrations       | passed | Skipped Supabase migrations because staging credentials are not configured.      |
| Install dependencies            | passed | exit 0                                                                           |
| Standalone lockfile             | passed | Generated app includes its own pnpm-lock.yaml for isolated Vercel installs.      |
| Typecheck generated app         | passed | exit 0                                                                           |
| Build generated app             | passed | exit 0                                                                           |
| Start local runtime             | passed | HTTP 200 from /api/health.                                                       |
| DB-backed CRUD health proof     | passed | Skipped DB-backed health proof because staging credentials are not configured.   |
| DB schema drift health proof    | passed | Skipped schema proof because staging DB proof credentials are not configured.    |
| DB seed-data health proof       | passed | Skipped seed proof because staging DB proof credentials are not configured.      |
| Verify live local app           | passed | 8/8 checks passed.                                                               |

## Selected Resources

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100

## Remaining Gaps

- No public Vercel preview was created because VERCEL_TOKEN is not set in this shell.
- Runtime proof uses mock credentials because staging Supabase/Auth environment variables are not set in this shell.
- Database migrations and DB-backed CRUD proof are skipped because neither DATABASE_URL nor SUPABASE_ACCESS_TOKEN is set in this shell.
- Production auth/database credentials are intentionally not committed.

## Run It

```bash
pnpm golden:path
```
