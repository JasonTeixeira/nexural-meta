# Recipe — `saas-multitenant-baseline`

Multi-tenant SaaS baseline. Parent of all SaaS recipes per ADR-0002.

## Quick start (Sage)

```bash
# Forge a new app
nx forge saas-multitenant-baseline my-saas \
  --displayName "My SaaS" \
  --rootDomain mysaas.com \
  --primaryColor "#3b82f6"

# Then
cd ~/code/apps/my-saas
op inject -i .env.example -o .env.local
pnpm install
supabase start && pnpm db:migrate
pnpm dev   # → http://localhost:3000
```

## What you get

A deployable Next.js 15 + Supabase + Stripe + Sentry + PostHog app with:

- Multi-tenancy via Postgres RLS (per `DECISIONS.md`)
- Auth (email + magic link; OAuth optional)
- Stripe Checkout + Customer Portal + webhook handler
- Strict security headers + CSP
- Audit log table with immutability trigger
- 14-day no-card-required trial
- Sentry + PostHog wired
- Federation conformance hooks (`.nexural/forged.lock.yaml`)

## Inputs

See `inputs.zod.ts` for the parameter schema. Defaults reflect the locked
opinions in `DECISIONS.md`.

## Per-recipe docs

- `THREAT_MODEL.md` — threats specific to this recipe
- `DECISIONS.md` — every opinion locked

## Verification

Runs in `nexural-meta` CI nightly via `@nexural/qa-runners-federation`:

- `recipe-validity` — recipe structure + required fields
- `prompt-injection-resilience` — content fuzzing (when content is present)

When forged apps are produced, those run `federation-conformance` in their CI.

## Escape recipe

`saas-multitenant-baseline-cf` — paired Cloudflare Pages + Workers + D1 variant
per ADR-0008 §6 (vendor escape recipes). Use when Vercel pricing or compliance
posture requires it.

## License

MIT (recipe itself). Output app license is configured per recipe input — default MIT.
