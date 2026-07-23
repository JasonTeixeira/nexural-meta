# Golden Path Proof

**Status:** Phase 5 local golden path passed
**Owner:** Sage Ideas LLC
**Generated:** 2026-07-23T09:48:25.993Z

## What This Proves

A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, and capture evidence.

## Latest Run

- Run ID: `rag-knowledge-chat-2026-07-23T094743250Z`
- Spec: `data/golden-path-specs/rag-knowledge-chat.json`
- Recipe: `saas-rag-chat`
- App: `rag-knowledge-chat`
- Local runtime: `http://127.0.0.1:3040`
- Generated app hash: `sha256:6deb79385cde07b0fc96a306c6b54b5a415411303fa2e6eae7d02542daac1f3f`
- Wall clock: 43s

## Gates

| Gate                            | Status | Detail                                                                                                          |
| ------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| Resource selection              | passed | 2 recommended assets selected from 4 layers.                                                                    |
| Forge emit                      | passed | 46 files emitted by saas-rag-chat.                                                                              |
| Generated app usability surface | passed | Generated app includes 8 required runtime, DB, and recipe-specific files.                                       |
| Verify Supabase/Auth runtime    | passed | HTTP 200 from Supabase Auth settings for project xacwaprwlbqgmswgodsk.                                          |
| Apply Supabase migrations       | passed | No additional recipe-specific migrations are required for this proof; baseline schema is verified by DB health. |
| Install dependencies            | passed | exit 0                                                                                                          |
| Standalone lockfile             | passed | Generated app includes its own pnpm-lock.yaml for isolated Vercel installs.                                     |
| Typecheck generated app         | passed | exit 0                                                                                                          |
| Build generated app             | passed | exit 0                                                                                                          |
| Start local runtime             | passed | HTTP 200 from /api/health.                                                                                      |
| DB-backed CRUD health proof     | passed | Generated /api/health completed insert-read-update-delete against staging Postgres.                             |
| DB schema drift health proof    | passed | schema_drift_probe passed.                                                                                      |
| DB seed-data health proof       | passed | seed_data_probe passed.                                                                                         |
| Verify live local app           | passed | 8/8 checks passed.                                                                                              |

## Selected Resources

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100
- [micro-saas-starter](https://github.com/JasonTeixeira/micro-saas-starter) - resource-library, 63/100

## Remaining Gaps

- No public Vercel preview was created because VERCEL_TOKEN is not set in this shell.
- Production auth/database credentials are intentionally not committed.

## Run It

```bash
pnpm golden:path
```
