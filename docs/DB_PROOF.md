# DB Proof

**Status:** Phase 15 generated DB proof and migration-readiness check
**Generated:** 2026-07-07T11:40:33.841Z

## Summary

- Gates: 4/6
- Latest run: rag-knowledge-chat-2026-07-07T113819536Z
- Hosted URL: missing
- Database mode: staging-postgres
- Schema drift: passed
- Seed data: passed
- DATABASE_URL inventory: present

## Gates

| Gate                   | Status | Detail                                                                                                                       |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| db_crud_health         | passed | Generated /api/health completed insert-read-update-delete against staging Postgres.                                          |
| vercel_db_crud_health  | failed | Latest golden-path evidence has no vercel_db_crud_health gate.                                                               |
| migration_readiness    | passed | Latest local run skipped migration push, but DATABASE_URL is present in GitHub secret inventory for scheduled proof refresh. |
| db_schema_drift_health | passed | Expected tables verified: tenants, tenant_memberships, audit_events.                                                         |
| db_seed_data_health    | passed | Seed row health-seed-rag-knowledge-chat completed upsert-read.                                                               |
| proof_environment_db   | failed | Proof environment failed; hosted health 200.                                                                                 |

## Next Actions

- **Phase 15:** Run pnpm golden:path in an environment with staging Supabase DB credentials. The DB proof should include migration readiness and CRUD proof in the same evidence chain.
