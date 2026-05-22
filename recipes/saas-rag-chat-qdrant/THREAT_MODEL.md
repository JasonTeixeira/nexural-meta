# THREAT_MODEL — `saas-rag-chat-qdrant`

Per ADR-0008 §7. Inherits from `saas-rag-chat/THREAT_MODEL.md` with these
Qdrant-specific deltas:

## Differences

| Layer            | Parent (pgvector)             | This recipe (Qdrant)                                |
| ---------------- | ----------------------------- | --------------------------------------------------- |
| Vector store     | pgvector in Supabase Postgres | Qdrant managed cloud or self-hosted                 |
| Tenant isolation | Postgres RLS                  | Qdrant collection-per-tenant or filter-by-tenant-id |
| Backup           | Supabase auto-backup          | Qdrant snapshots → S3 (manual setup)                |
| Scale ceiling    | ~1M chunks practical          | Multi-billion chunks                                |

## New asset: Qdrant API key

Critical. Lives in 1Password + Vercel env. Never in code.

## New threat: tenant isolation in Qdrant

Qdrant doesn't have Postgres RLS. Tenant safety options:

1. **Collection per tenant** (preferred for strict isolation; ~10k tenants max)
2. **Single collection + filter by `tenant_id` payload** (preferred for scale;
   relies on app code to always filter)

This recipe defaults to option 1 (collection-per-tenant) for fewer tenants /
stricter isolation, with input to switch.

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial.
