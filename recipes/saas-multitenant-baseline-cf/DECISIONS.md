# DECISIONS — `saas-multitenant-baseline-cf`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/DECISIONS.md` with
these CF-specific overrides:

## Stack overrides

| Layer          | Parent                   | This recipe                                   |
| -------------- | ------------------------ | --------------------------------------------- |
| Hosting        | Vercel                   | Cloudflare Pages (Next.js compatible runtime) |
| Functions      | Vercel Edge / Serverless | Cloudflare Workers                            |
| Database       | Supabase Postgres        | Cloudflare D1 (SQLite at edge)                |
| Auth           | Supabase Auth            | Better Auth (Workers-compatible)              |
| Object storage | Supabase Storage         | Cloudflare R2                                 |
| Realtime       | Supabase Realtime        | Cloudflare Durable Objects                    |

## When to use this recipe vs parent

Pick this when:

- Vercel pricing is the bottleneck
- You need edge-first global low-latency (D1 + Workers at the edge)
- Compliance posture requires Cloudflare's PCI-DSS Level 1 attestation
- You want fewer vendors (Cloudflare alone vs Vercel + Supabase)

Pick the parent when:

- You need full Postgres (extensions, complex queries, materialized views)
- HIPAA / BAA required (Supabase has one; D1 doesn't yet)
- Heavy compute per request (>50ms CPU)
- You want Supabase's auth UI components out of the box

## Tenant isolation

**Different from parent.** D1 has no RLS. Tenant safety relies on:

1. A `tenantSafeDb` helper that all server actions MUST use
2. ESLint rule `nexural/no-raw-db` flagging direct `db.prepare` calls
3. `federation-conformance` runner checks for the rule's presence

Per `THREAT_MODEL.md`.

## Migrations

Use D1 migrations (`wrangler d1 migrations create`). Parent uses Supabase CLI.
Migration files live in `migrations/` (not `supabase/migrations/`).

Everything else inherits from the parent. Read it first.
