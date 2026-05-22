# DECISIONS — `saas-multitenant-baseline`

**Per ADR-0008 §7.** Every opinion locked by this recipe.

If an opinion is NOT in this document, it is undefined — that's a recipe bug.

---

## Stack choices

| Layer             | Choice                                          | Why                                                   |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------- |
| Framework         | Next.js 15 App Router                           | Per ARCHITECTURE §7 locked stack                      |
| UI                | shadcn/ui + Tailwind v4                         | Owned components; no library churn                    |
| Data              | Supabase (Postgres + Auth + Storage + Realtime) | Single platform; RLS for free; per ARCHITECTURE §7    |
| Payments          | Stripe Checkout + Customer Portal + Webhooks    | Universal; no PCI scope; per ARCHITECTURE §7          |
| Email             | Resend                                          | Cheap; React Email; dev-friendly; per ARCHITECTURE §7 |
| Hosting           | Vercel                                          | Next/Vercel tight integration; per ARCHITECTURE §7    |
| Errors            | Sentry                                          | Boring + universal                                    |
| Product analytics | PostHog                                         | Self-hostable escape                                  |
| Tracing           | OpenTelemetry → Vercel runtime                  | Standard                                              |

## Tenant model

| Decision                            | Choice                                                | Alternative considered                                                      |
| ----------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| Tenant routing                      | **Subdomain** (`<tenant>.app.com`)                    | path-based (`/t/<tenant>/`) — adds complexity for SEO; subdomain is cleaner |
| Tenant creation flow                | Org owner signs up → creates tenant → invites members | self-serve from a marketing page                                            |
| User can belong to multiple tenants | YES                                                   | single-tenant per user — too restrictive                                    |
| Tenant deletion                     | Soft delete + 30-day grace period                     | hard delete                                                                 |

## Billing model

| Decision        | Choice                                                                  | Reasoning                                                       |
| --------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| Pricing model   | Seat-based with optional metered overage                                | Pure usage-based is harder to forecast; pure seat is inflexible |
| Trial           | 14-day, no credit card                                                  | Lower friction; convert via in-app prompts                      |
| Invoice cadence | Monthly default; annual discount via Stripe Coupon                      | Industry standard                                               |
| Refund policy   | Pro-rated via Stripe automation                                         | Manual is too much overhead at scale                            |
| Failed payment  | 3-attempt dunning via Stripe + email + downgrade to free tier on day 14 | Aggressive cancellation loses trust                             |
| Tax handling    | Stripe Tax                                                              | Manual handling = lawsuit waiting (per ADR-0002 cost gate)      |

## Auth flow

| Decision           | Choice                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- |
| Sign-in method     | Email + magic link (no password)                                                   |
| OAuth providers    | Google, GitHub (configurable in `inputs`)                                          |
| Email verification | Required before first session                                                      |
| Session duration   | 14 days with auto-refresh; idle 24h logout                                         |
| Multi-factor       | TOTP (configurable) — never SMS per THREAT_MODEL §3.1                              |
| Account recovery   | Magic link to verified email                                                       |
| SSO                | Optional — Supabase Auth SAML for paid plans (configurable in `inputs.ssoEnabled`) |

## Invite flow

| Decision                 | Choice                                       |
| ------------------------ | -------------------------------------------- |
| Invite mechanism         | Email + signed magic-link token (24h expiry) |
| Manual approval needed   | No — anyone with a valid invite can join     |
| Default role for invitee | `member` (admin invites manually upgrade)    |
| Max pending invites      | 100 per tenant (rate-limited)                |

## Admin surface

| Decision            | Choice                                                                              |
| ------------------- | ----------------------------------------------------------------------------------- |
| Impersonation       | Allowed for tenant admins (logged); platform admin always logged + time-boxed 30min |
| Audit log retention | 7 years (default) — configurable via `inputs.auditRetentionYears`                   |
| Admin route         | `/admin/**` protected by role middleware                                            |
| Dashboard library   | Shared `internal-tool-dashboard` sub-recipe (Phase 7)                               |

## Data + RLS

| Decision                  | Choice                                                           |
| ------------------------- | ---------------------------------------------------------------- |
| Per-tenant data isolation | Postgres RLS via `tenant_id` column on every tenant-scoped table |
| Cross-tenant queries      | Forbidden — only via service-role key in server actions          |
| Soft delete pattern       | `deleted_at TIMESTAMP NULL` — purged after 90 days by cron       |
| Migration tool            | Supabase CLI migrations (committed in `supabase/migrations/`)    |

## SEO / accessibility

| Decision            | Choice                                                                        |
| ------------------- | ----------------------------------------------------------------------------- |
| Static landing page | YES — separate from `app.<domain>`                                            |
| Robots.txt          | Allow `app.<domain>/` (marketing); disallow `*.app.<domain>/` (tenant routes) |
| axe-core in CI      | YES via `nexural-qa-os` axe runner                                            |
| WCAG target         | 2.2 AA baseline; AAA where trivial                                            |

## Performance

| Decision               | Choice                                          |
| ---------------------- | ----------------------------------------------- |
| Lighthouse target      | ≥ 90 across all 4 dimensions on marketing pages |
| Tenant page TTI target | < 2.5s p95                                      |
| Bundle budget          | < 250 KB initial JS gzipped                     |

## Cost envelope (per ADR-0007)

LLM features OFF by default. If enabled via `inputs.llmEnabled=true`:

```yaml
hard_caps:
  per_request_usd: 0.01
  per_user_per_day_usd: 5
  per_app_per_day_usd: 50
```

These are conservative. Override in `recipe.yaml` if a forging operator needs higher caps + accepts the cost variance.

---

## Inputs the operator can override

See `inputs.zod.ts` for the parameter schema. Notable knobs:

- `ssoEnabled` — enable Supabase Auth SAML
- `defaultLocale` — `en` / `es` / `fr` / `de` / `ja`
- `auditRetentionYears` — default 7
- `oauthProviders` — list of {`google`, `github`, `apple`, `microsoft`}
- `llmEnabled` — opt-in for AI features; disabled by default
- `tenantRouting` — `subdomain` (default) or `path`
- `billingModel` — `seat` | `metered` | `seat+metered` (default)
- `trialDays` — default 14

---

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. Locks the opinions that downstream recipes inherit.
