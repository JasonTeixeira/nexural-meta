# Proof Environment

**Status:** Internal proof environment lock
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-24T09:15:01.987Z
**Overall:** failed

## Purpose

This document defines the internal environment needed to keep the app factory proof repeatable. It records secret names, rotation policy, hosted health, and golden-path evidence without storing secret values.

## Run It

```bash
pnpm proof:env
```

## Gates

| Gate                           | Status | Detail                                                               |
| ------------------------------ | ------ | -------------------------------------------------------------------- |
| secret_inventory_available     | passed | GitHub secret inventory is readable without exposing values.         |
| required_secrets_present       | passed | All required proof secrets are present.                              |
| required_secrets_fresh         | passed | Required proof secrets are within rotation policy.                   |
| hosted_db_crud_health          | failed | Hosted /api/health did not return the expected DB CRUD proof.        |
| golden_path_evidence_present   | passed | Latest run rag-knowledge-chat-2026-07-27T110807333Z has 14/14 gates. |
| golden_path_has_hosted_db_gate | failed | Hosted DB CRUD gate status is missing.                               |

## Required Secrets

| Name                            | Status  |  Age | Rotation | Purpose                                                    |
| ------------------------------- | ------- | ---: | -------- | ---------------------------------------------------------- |
| `VERCEL_TOKEN`                  | present | n/ad | 90       | Automated hosted golden-path deployment.                   |
| `VERCEL_TEAM_ID`                | present | n/ad | stable   | Vercel team/project binding.                               |
| `VERCEL_PROJECT_ID`             | present | n/ad | stable   | Vercel project binding.                                    |
| `VERCEL_PROOF_ALIAS`            | present | n/ad | stable   | Stable hostname used for hosted proof verification.        |
| `NEXT_PUBLIC_SUPABASE_URL`      | present | n/ad | stable   | Staging Supabase project URL.                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | present | n/ad | 180      | Browser-safe staging Supabase anon key.                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | present | n/ad | 90       | Server-side CRUD proof and generated app admin operations. |
| `DATABASE_URL`                  | present | n/ad | 90       | Staging Postgres migration path for generated apps.        |

## Hosted Runtime

- URL: https://sage-client-intake-portal-vercel.vercel.app
- HTTP status: 503
- Database mode: crud_probe
- Database operation: insert

## Evidence

- Latest run: `rag-knowledge-chat-2026-07-27T110807333Z`
- App hash: `sha256:35abbf8fd27fad92617d16ff3cf024922118ea0711f4129e95cb31919b50b849`
- Gates: 14/14
- Evidence hash: `sha256:3e0909c32e368b572af5338611f3ea486c4b437d6a9ea0f97b5b20b811be8d67`

## Operating Rules

- No secret values are written to evidence, docs, or generated public-safe JSON.
- SUPABASE_ACCESS_TOKEN is an operator-only personal token and must not be persisted as a GitHub secret.
- Any personal access token pasted into chat, logs, or screenshots must be revoked and replaced.
- Hosted proof is not green unless /api/health verifies DB CRUD against staging Postgres.
- Generated app evidence links run ID, app tree hash, deployed URL, and gate results.

## Next Actions

- **critical: Restore hosted DB-backed proof.** Hosted /api/health did not return the expected DB CRUD proof.
- **critical: Run golden path and attach a hosted DB CRUD deployment.** vercel_db_crud_health=missing
- **security: Revoke any Supabase personal access token exposed outside the terminal.** Personal access tokens are operator credentials and are never persisted by this repo.

## Generated Artifacts

- `data/proof-environment.public.json`
- `evidence/proof-environment/latest.json`
- `docs/PROOF_ENVIRONMENT.md`
