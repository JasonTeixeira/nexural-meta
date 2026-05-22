# DECISIONS — `saas-rag-chat-qdrant`

Inherits from `saas-rag-chat/DECISIONS.md`.

## Vector store overrides

| Decision         | Parent        | This recipe                                                    |
| ---------------- | ------------- | -------------------------------------------------------------- |
| Vector store     | pgvector      | Qdrant Cloud (or self-hosted)                                  |
| Tenant isolation | Postgres RLS  | Collection-per-tenant (default) or filter-by-tenant-id (input) |
| Backup           | Supabase auto | Qdrant snapshots → S3 (cron)                                   |

## Inputs (new)

- `qdrantUrl` — Qdrant cluster URL
- `qdrantApiKey` — via op:// reference
- `qdrantTenantIsolation` — `collection-per-tenant` (default) | `filter-by-payload`
- `qdrantBackupSnapshotS3` — S3 bucket for snapshots (optional but recommended)

## When to use this vs parent

Use when:

- Chunk count > 1M
- Need sub-100ms p99 vector search at scale
- Tenant count > 10k (use filter-by-payload mode)

Stay on parent when:

- Chunk count < 1M
- Want fewer vendors
- HIPAA-covered (Supabase has BAA; Qdrant Cloud doesn't yet)
