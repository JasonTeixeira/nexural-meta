# DB Proof

**Status:** Phase 15 generated DB proof and migration-readiness check
**Generated:** 2026-06-17T10:38:34.659Z

## Summary

- Gates: 6/6
- Latest run: rag-knowledge-chat-2026-06-17T103347330Z
- Hosted URL: https://sage-client-intake-portal-vercel-1o5a19m4r-sage-ideas.vercel.app
- Database mode: staging-postgres
- Schema drift: passed
- Seed data: passed
- DATABASE_URL inventory: present

## Gates

| Gate                   | Status | Detail                                                                                                                       |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| db_crud_health         | passed | Generated /api/health completed insert-read-update-delete against staging Postgres.                                          |
| vercel_db_crud_health  | passed | Deployed /api/health completed insert-read-update-delete against staging Postgres.                                           |
| migration_readiness    | passed | Latest local run skipped migration push, but DATABASE_URL is present in GitHub secret inventory for scheduled proof refresh. |
| db_schema_drift_health | passed | Expected tables verified: tenants, tenant_memberships, audit_events.                                                         |
| db_seed_data_health    | passed | Seed row health-seed-rag-knowledge-chat completed upsert-read.                                                               |
| proof_environment_db   | passed | Proof environment passed; hosted health 200.                                                                                 |

## Next Actions

- **Phase 15:** Expand schema drift proof to recipe-specific invariants and RLS policy checks. CRUD, migration readiness, schema drift, and seed-data proof are green.
