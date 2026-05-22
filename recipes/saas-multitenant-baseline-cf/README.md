# Recipe — `saas-multitenant-baseline-cf`

Cloudflare Pages + Workers + D1 escape variant of `saas-multitenant-baseline`.
Per ADR-0008 §6 vendor escape recipes.

## When to use

- Vercel pricing is the bottleneck
- You need edge-first global low-latency
- Cloudflare-first compliance posture
- Fewer vendors (Cloudflare alone vs Vercel + Supabase + Resend)

## Forge

```bash
nx forge saas-multitenant-baseline-cf my-saas \
  --displayName "My SaaS" \
  --rootDomain mysaas.com \
  --cloudflareAccountId <32-char-hex>
```

## What you get

Same surface as parent recipe but:

- Cloudflare Pages hosting
- Cloudflare Workers functions
- D1 (SQLite at edge) instead of Supabase Postgres
- R2 instead of Supabase Storage
- Better Auth instead of Supabase Auth
- Durable Objects for realtime instead of Supabase Realtime

## Tradeoffs

Read `THREAT_MODEL.md` and `DECISIONS.md`. The main constraint: **D1 has no
Postgres RLS**, so tenant isolation is app-code-enforced via a `tenantSafeDb`
helper + ESLint rule. The parent recipe's RLS-everywhere approach is stricter
by default.

## Inherits from

`saas-multitenant-baseline@0.1.0`. Read its docs first.

## License

MIT (recipe itself). Output app license configured per recipe input.
