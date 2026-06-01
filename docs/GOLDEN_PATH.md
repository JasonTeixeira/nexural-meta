# Golden Path Proof

**Status:** Phase 5 golden path passed with public deployment evidence
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T21:35:28.910Z

## What This Proves

A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, deploy publicly, and capture evidence.

## Latest Run

- Run ID: `rag-knowledge-chat-2026-06-01T213051295Z`
- Spec: `data/golden-path-specs/rag-knowledge-chat.json`
- Recipe: `saas-rag-chat`
- App: `rag-knowledge-chat`
- Local runtime: `http://127.0.0.1:3040`
- Deployed URL: `https://sage-client-intake-portal-vercel-8f62ooaxe-sage-ideas.vercel.app`
- Deploy status: `verified-vercel-url`
- Generated app hash: `sha256:3747581a28b026151e03af27ae35282aeaab8c4c98724e58a4da737986b1abd4`
- Wall clock: 50s

## Gates

| Gate                             | Status | Detail                                                                                                          |
| -------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| Resource selection               | passed | 1 recommended assets selected from 4 layers.                                                                    |
| Forge emit                       | passed | 46 files emitted by saas-rag-chat.                                                                              |
| Generated app usability surface  | passed | Generated app includes 8 required runtime, DB, and recipe-specific files.                                       |
| Verify Supabase/Auth runtime     | passed | HTTP 200 from Supabase Auth settings for project xacwaprwlbqgmswgodsk.                                          |
| Apply Supabase migrations        | passed | No additional recipe-specific migrations are required for this proof; baseline schema is verified by DB health. |
| Install dependencies             | passed | exit 0                                                                                                          |
| Standalone lockfile              | passed | Generated app includes its own pnpm-lock.yaml for isolated Vercel installs.                                     |
| Typecheck generated app          | passed | exit 0                                                                                                          |
| Build generated app              | passed | exit 0                                                                                                          |
| Start local runtime              | passed | HTTP 200 from /api/health.                                                                                      |
| DB-backed CRUD health proof      | passed | Generated /api/health completed insert-read-update-delete against staging Postgres.                             |
| DB schema drift health proof     | passed | schema_drift_probe passed.                                                                                      |
| DB seed-data health proof        | passed | seed_data_probe passed.                                                                                         |
| Verify live local app            | passed | 8/8 checks passed.                                                                                              |
| Verify public Vercel deployment  | passed | 8/8 checks passed at https://sage-client-intake-portal-vercel-8f62ooaxe-sage-ideas.vercel.app.                  |
| Verify deployed DB-backed health | passed | Deployed /api/health completed insert-read-update-delete against staging Postgres.                              |

## Selected Resources

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100

## Remaining Gaps

- Production auth/database credentials are intentionally not committed.

## Run It

```bash
pnpm golden:path
pnpm golden:path:attach-deploy -- --url https://your-app.vercel.app
```
