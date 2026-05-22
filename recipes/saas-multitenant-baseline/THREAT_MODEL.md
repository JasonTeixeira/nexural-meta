# THREAT_MODEL — `saas-multitenant-baseline`

**Per ADR-0008 §7.** Per-recipe threat model.

This document covers threats specific to apps emitted from this recipe. The federation-level threat model lives in `nexural-meta/docs/THREAT_MODEL.md`; emitted apps inherit those controls + add these recipe-specific ones.

---

## 1. Assets

| Asset                                      | Confidentiality | Integrity | Availability |
| ------------------------------------------ | --------------- | --------- | ------------ |
| Tenant user accounts (Supabase Auth)       | High            | High      | High         |
| Per-tenant data (Postgres rows w/ RLS)     | High            | High      | High         |
| Billing records (Stripe-mirrored Postgres) | High            | Critical  | Medium       |
| Stripe webhook signing secret              | Critical        | n/a       | n/a          |
| Service-role Supabase key                  | Critical        | n/a       | n/a          |
| Sentry + PostHog session data              | Medium          | Low       | Low          |
| Email templates + Resend API key           | Medium          | Medium    | Medium       |

---

## 2. Threat actors (recipe-specific layer)

| Actor                                            | Realistic attack                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Curious tenant user                              | Tries to access another tenant's data — defended by Supabase RLS                                |
| Malicious authenticated user                     | SQL injection via user input fields — defended by parameterized client + RLS                    |
| Stripe webhook impersonator                      | Forges a webhook to mark account as paid — defended by signature verify                         |
| Account takeover via leaked session token        | Mitigated by short-lived JWT + refresh + audit log                                              |
| Insider with `service_role` access               | Catastrophic; mitigated by storing service-role key only in Vercel encrypted env, never in code |
| Public bot scanning for unprotected admin routes | Defended by middleware that requires auth on `/admin/**`                                        |
| Spam signup farm                                 | Defended by email verification + per-IP rate limit on `/auth/signup`                            |
| Crypto/SEO comment spam on public pages          | Defended by absent unauthenticated user input by default                                        |

---

## 3. Controls baked into emitted code

### Auth + session

- Supabase Auth with email + magic link (no passwords in app DB)
- Server-side session validation in middleware on every protected route
- JWT auto-refresh on response; httpOnly + secure + sameSite=lax cookies
- Session timeout: 14 days (configurable)
- No SMS 2FA (per THREAT_MODEL §3.1)

### Multi-tenancy

- Every tenant-scoped table uses Postgres Row-Level Security
- Server-side `getTenant()` helper enforces tenant_id matches authenticated user
- Cross-tenant access is impossible without service-role key (which is server-only)

### Stripe / billing

- Webhook signing secret verified on EVERY webhook call (no exceptions)
- Idempotency keys on every checkout-session + subscription mutation
- No PCI data — Stripe Elements + tokenization (per THREAT_MODEL §6 PCI policy)

### Security headers

- CSP with strict-dynamic + no inline scripts (allows Vercel + Next.js + Sentry + PostHog domains)
- Strict-Transport-Security max-age=63072000
- X-Content-Type-Options nosniff
- Referrer-Policy strict-origin-when-cross-origin
- Permissions-Policy restricting microphone/camera/geolocation by default

### Audit log (Postgres table `audit_events`)

- Every privileged action recorded (admin impersonation, role change, billing change)
- 7-year retention default (consistent with fintech baseline per ADR-0008 §8)
- Immutable: trigger blocks UPDATE/DELETE

### Observability

- Sentry captures exceptions + traces; PII scrubbed via `beforeSend` hook
- PostHog records product events with user/tenant id (NOT raw emails)
- OpenTelemetry traces via Vercel runtime

---

## 4. Cost runaway (LLM + bandwidth)

This recipe ships with **LLM features disabled by default**. If the forging operator enables them via inputs, the cost_envelope in recipe.yaml enforces hard caps via `@nexural/sdk.llmClient()` (per ADRs 0007 + 0010 §2.4).

If LLM is enabled and an attacker tries to exhaust the budget:

1. Per-request cap rejects oversized prompts pre-flight
2. Per-user-day cap stops the abuser after $5 of spend
3. Per-app-day cap circuit-breaks the whole app at $50

---

## 5. Out-of-scope (handled by the federation, not this recipe)

- Recipe signature verification (cosign — done at `nx forge` per ADR-0006)
- License gate on emitted deps (SBOM scan — done at `nx forge` per ADR-0006)
- Typosquat detection (done at `nx forge` per ADR-0009 §1.7)
- Federation conformance drift (runs in CI per ADR-0008 §3)
- Prompt-injection resilience on warehouse content (runs nightly per ADR-0008 §2)

---

## 6. Residual risks (accepted)

- Supply-chain compromise of Supabase / Stripe / Resend / Sentry / PostHog hosted services. Mitigated by vendor SOC 2 + the federation's annual vendor review (per OPS_CALENDAR §5).
- Vercel platform-level downtime → app unavailable. Mitigated by escape recipe `saas-multitenant-baseline-cf` (Cloudflare Pages variant).
- Postgres single-region — covered by Supabase automated backups + the federation's nightly B2 backup of every forged app per ADR-0010 §3.9.

---

## 7. Drift detection

Per ADR-0008 §3, `federation-conformance` runs in every forged app's CI on every push. It verifies the `.nexural/forged.lock.yaml` matches the recipe state. Drift produces a `federation-conformance` runner finding and reduces the scorecard.

If a recipe security fix is shipped (e.g., a CSP tightening), `nx upgrade <app>` migrates existing forged apps via codemod per ADR-0010 §2.6.

---

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial recipe scaffold per BUILD_PLAN §Phase 5.
