# THREAT_MODEL — `saas-multitenant-baseline-cf`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/THREAT_MODEL.md`
with these Cloudflare-specific deltas:

## Differences from parent

| Layer          | Parent (Vercel + Supabase) | This recipe (Cloudflare)                         |
| -------------- | -------------------------- | ------------------------------------------------ |
| Hosting        | Vercel Edge Functions      | Cloudflare Workers (V8 isolates)                 |
| Database       | Supabase Postgres + RLS    | Cloudflare D1 (SQLite) + app-level tenant guards |
| Auth           | Supabase Auth              | Better Auth / Lucia self-hosted on Workers       |
| Object storage | Supabase Storage           | Cloudflare R2                                    |

## D1 implications

D1 is SQLite at the edge. **It does NOT have Postgres RLS.** Tenant isolation
must be enforced in application code via a tenant-scoped query helper that
every server action uses. Direct `db.prepare` calls without the helper are
forbidden and caught by ESLint rules in the emitted app.

## Workers KV / D1 limits

- D1 row limit: 10GB per database (vs Supabase's effectively unlimited tier)
- Workers CPU time: 50ms per request (vs Vercel's 1s on Hobby, 10s on Pro)
- Heavy compute → spill to Cloudflare Queues or Durable Objects

## Sentry on Workers

Sentry has a Cloudflare Workers integration — wired via `@sentry/cloudflare`.
Error reporting parity with parent recipe.

## Compliance posture

Cloudflare is SOC 2 Type II + ISO 27001 + PCI-DSS (their edge, not your data).
For HIPAA-covered apps: do NOT use this recipe — D1 isn't yet HIPAA-eligible.
Use parent recipe with HIPAA Supabase BAA when shipping health data.

---

Beyond the above, all controls in the parent threat model apply. Read it first.
