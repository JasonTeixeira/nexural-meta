# Proof Environment

**Status:** Internal proof environment lock
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T20:14:00.095Z
**Overall:** failed

## Purpose

This document defines the internal environment needed to keep the app factory proof repeatable. It records secret names, rotation policy, hosted health, and golden-path evidence without storing secret values.

## Run It

```bash
pnpm proof:env
```

## Gates

| Gate                           | Status | Detail                                                                                                                                                                                                 |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| secret_inventory_available     | failed | GitHub secret inventory unavailable: failed to get secrets: HTTP 403: Resource not accessible by integration (https://api.github.com/repos/JasonTeixeira/nexural-meta/actions/secrets?per_page=100)    |
|  |
| required_secrets_present       | failed | Missing required proof secrets: VERCEL_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID, VERCEL_PROOF_ALIAS, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL. |
| required_secrets_fresh         | passed | Required proof secrets are within rotation policy.                                                                                                                                                     |
| hosted_db_crud_health          | passed | Hosted /api/health completed DB CRUD proof.                                                                                                                                                            |
| golden_path_evidence_present   | passed | Latest run rag-knowledge-chat-2026-06-01T195349129Z has 14/14 gates.                                                                                                                                   |
| golden_path_has_hosted_db_gate | failed | Hosted DB CRUD gate status is missing.                                                                                                                                                                 |

## Required Secrets

| Name                            | Status  |  Age | Rotation | Purpose                                                    |
| ------------------------------- | ------- | ---: | -------- | ---------------------------------------------------------- |
| `VERCEL_TOKEN`                  | missing | n/ad | 90       | Automated hosted golden-path deployment.                   |
| `VERCEL_TEAM_ID`                | missing | n/ad | stable   | Vercel team/project binding.                               |
| `VERCEL_PROJECT_ID`             | missing | n/ad | stable   | Vercel project binding.                                    |
| `VERCEL_PROOF_ALIAS`            | missing | n/ad | stable   | Stable hostname used for hosted proof verification.        |
| `NEXT_PUBLIC_SUPABASE_URL`      | missing | n/ad | stable   | Staging Supabase project URL.                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | missing | n/ad | 180      | Browser-safe staging Supabase anon key.                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | missing | n/ad | 90       | Server-side CRUD proof and generated app admin operations. |
| `DATABASE_URL`                  | missing | n/ad | 90       | Staging Postgres migration path for generated apps.        |

## Hosted Runtime

- URL: https://sage-client-intake-portal-vercel.vercel.app
- HTTP status: 200
- Database mode: crud_probe
- Database operation: insert-read-update-delete

## Evidence

- Latest run: `rag-knowledge-chat-2026-06-01T195349129Z`
- App hash: `sha256:73d32666d246cc83852b6657539eea304e6617980512adadbf66b2700bd5de14`
- Gates: 14/14
- Evidence hash: `sha256:6765b25eafa18a97e3d5feadb3ca0b618a95b4ad3c9190190d3eb7be01f9f7f3`

## Operating Rules

- No secret values are written to evidence, docs, or generated public-safe JSON.
- SUPABASE_ACCESS_TOKEN is an operator-only personal token and must not be persisted as a GitHub secret.
- Any personal access token pasted into chat, logs, or screenshots must be revoked and replaced.
- Hosted proof is not green unless /api/health verifies DB CRUD against staging Postgres.
- Generated app evidence links run ID, app tree hash, deployed URL, and gate results.

## Next Actions

- **critical: Set GitHub secret VERCEL_TOKEN.** Automated hosted golden-path deployment.
- **critical: Set GitHub secret VERCEL_TEAM_ID.** Vercel team/project binding.
- **critical: Set GitHub secret VERCEL_PROJECT_ID.** Vercel project binding.
- **critical: Set GitHub secret VERCEL_PROOF_ALIAS.** Stable hostname used for hosted proof verification.
- **critical: Set GitHub secret NEXT_PUBLIC_SUPABASE_URL.** Staging Supabase project URL.
- **critical: Set GitHub secret NEXT_PUBLIC_SUPABASE_ANON_KEY.** Browser-safe staging Supabase anon key.
- **critical: Set GitHub secret SUPABASE_SERVICE_ROLE_KEY.** Server-side CRUD proof and generated app admin operations.
- **critical: Set GitHub secret DATABASE_URL.** Staging Postgres migration path for generated apps.
- **critical: Run golden path and attach a hosted DB CRUD deployment.** vercel_db_crud_health=missing
- **security: Revoke any Supabase personal access token exposed outside the terminal.** Personal access tokens are operator credentials and are never persisted by this repo.

## Generated Artifacts

- `data/proof-environment.public.json`
- `evidence/proof-environment/latest.json`
- `docs/PROOF_ENVIRONMENT.md`
