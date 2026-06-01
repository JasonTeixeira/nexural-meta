# DB Proof

**Status:** Phase 15 generated DB proof and migration-readiness check
**Generated:** 2026-06-01T20:14:01.532Z

## Summary

- Gates: 2/6
- Latest run: rag-knowledge-chat-2026-06-01T195349129Z
- Hosted URL: missing
- Database mode: not-configured
- Schema drift: failed
- Seed data: failed
- DATABASE_URL inventory: present

## Gates

| Gate                   | Status | Detail                                                                                                                       |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| db_crud_health         | passed | Skipped DB-backed health proof because staging credentials are not configured.                                               |
| vercel_db_crud_health  | failed | Latest golden-path evidence has no vercel_db_crud_health gate.                                                               |
| migration_readiness    | passed | Latest local run skipped migration push, but DATABASE_URL is present in GitHub secret inventory for scheduled proof refresh. |
| db_schema_drift_health | failed | Schema drift proof missing or failed. Hosted health: Latest golden-path run has no deployed URL.                             |
| db_seed_data_health    | failed | Seed-data proof missing or failed. Hosted health: Latest golden-path run has no deployed URL.                                |
| proof_environment_db   | failed | Proof environment failed; hosted health 200.                                                                                 |

## Next Actions

- **Phase 15:** Run pnpm golden:path in an environment with staging Supabase DB credentials. The DB proof should include migration readiness and CRUD proof in the same evidence chain.
