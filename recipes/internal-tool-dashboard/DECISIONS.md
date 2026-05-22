# DECISIONS — `internal-tool-dashboard`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/DECISIONS.md` with these admin-tool-specific opinions locked:

## Auth + RBAC

| Decision           | Choice                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| Sign-up gating     | `signupEmailDomains[]` allowlist (default: empty = admin UI is the only path) |
| Default roles      | `super_admin`, `admin`, `viewer` (configurable via `adminRoles[]`)            |
| Role storage       | `admin_users` table; one role per user; immutable history via `revoked_at`    |
| Role hierarchy     | `super_admin > admin > viewer` — strict hierarchy, no overlapping permissions |
| Role mutation gate | Only `super_admin` may grant/revoke; enforced at RLS                          |
| MFA                | Required for all admin roles (Supabase MFA enrollment hook + middleware gate) |
| Session expiry     | 1 hour JWT + 15 min inactivity timeout (multi-tab broadcast on sign-out)      |

## Bulk-action discipline

| Decision               | Choice                                                                      |
| ---------------------- | --------------------------------------------------------------------------- |
| Confirmation threshold | **{{bulkConfirmThreshold}} rows** (default 10)                              |
| Confirmation gesture   | Type the action name + row count (e.g. "suspend 47 tenants")                |
| Audit log              | `admin_bulk_actions` — immutable; records actor, action, count, IDs, IP, UA |
| Terminal vs reversible | Recipe-emitted action helpers declare which; terminal requires super_admin  |

## No-index policy

- `metadata.robots = { index: false, follow: false }` baked into root layout.
- Vercel project + Supabase project both flagged "internal".
- No marketing landing — root `/` redirects to `/login` or `/dashboard`.

## Cost discipline

```yaml
hard_caps:
  per_request_usd: 0.05
  per_user_per_day_usd: 1
  per_app_per_day_usd: 20
```

Internal tools = low traffic, predictable cost surface. Tighter than user-facing baseline.

## Observability

- Sentry `tracesSampleRate: 0.5` — higher than baseline (0.1) for forensic visibility.
- PostHog session replay: **disabled** for admin tools (PII risk in admin views).
- Every bulk action also captured as a custom Sentry breadcrumb + PostHog event.

## Error surface

- Production builds: source maps stripped, 5xx masked, only opaque `errorId` shown.
- All admin actions wrap in a typed `ActionResult<T>` so error-path branches are exhaustive at compile time.

## Tradeoffs accepted

- **No public marketing pages.** Lose the discoverability of the SaaS baseline. Worth it: internal tools must not be indexable.
- **No magic-link self-signup.** Admin must invite. Worth it: cuts the privilege-escalation attack surface to near-zero.
- **MFA required.** Adds friction at first login. Worth it: any admin tool without MFA is a breach waiting to happen.

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. RBAC model + bulk-action discipline + no-index + session policy locked.
