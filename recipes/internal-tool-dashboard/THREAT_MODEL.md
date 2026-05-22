# THREAT_MODEL — `internal-tool-dashboard`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/THREAT_MODEL.md` with these internal-tool-specific deltas:

## 1. New assets

| Asset                                           | Confidentiality | Integrity | Availability |
| ----------------------------------------------- | --------------- | --------- | ------------ |
| `admin_users.role`                              | High            | CRITICAL  | High         |
| Bulk-action log                                 | High            | CRITICAL  | High         |
| Underlying business data the admin tool acts on | varies          | varies    | varies       |

## 2. Headline threat: privilege escalation

A regular user gains admin role. From there: unlimited blast radius on whatever business data the dashboard exposes.

**Controls:**

1. **Only super_admin can mutate `admin_users`.** Enforced at RLS layer; no app-level service-role bypass for role assignments.
2. **`granted_by` is required** — every role grant has provenance. Self-grants (where `granted_by = user_id`) are flagged by a Sentry query that runs daily.
3. **No public sign-up path.** Sign-up is gated by `signupEmailDomains[]` allowlist (forge-time input). Default: empty array — admin UI is the only path to creating users.

## 3. Headline threat: bulk-action mistake (operator error, not malice)

An admin clicks "delete all suspended tenants" expecting 3 rows; it affects 3000. Without a confirmation gesture, this is the kind of mistake that ends careers.

**Controls:**

1. **Typed-confirmation threshold.** Any bulk action affecting > `bulkConfirmThreshold` (default 10) rows requires the operator to type a specific phrase (e.g. the action name + row count) before proceeding.
2. **Immutable audit.** Every bulk action records actor, action, affected count, affected IDs (jsonb), the typed phrase, IP, and user-agent. UPDATE / DELETE forbidden by trigger.
3. **Reversibility flag in DECISIONS.** Bulk actions are labeled `reversible` or `terminal`. Terminal actions require super_admin role + extra confirmation.

## 4. Threat: indexing of internal URLs

Default Next.js apps are indexable. Internal tools should NOT appear in search results.

**Controls:**

1. `metadata.robots = { index: false, follow: false }` on the root layout.
2. `/robots.txt` placeholder denies all (Phase 7.5).
3. Vercel project setting + Supabase project setting both flagged as "internal" — auth routes never accept anonymous traffic.

## 5. Threat: session theft via long-lived cookies

Internal tools often have admins on shared workstations. Long-lived sessions are a stronger threat surface than for end-user SaaS.

**Controls:**

1. Supabase Auth `jwt_expiry = 3600` (1 hour) — already inherited from `database/templates/supabase-config.toml.template`. Recipe-level override is forbidden.
2. Inactivity timeout (15 min by default; configurable) clears local storage + forces re-auth.
3. Multi-tab logout: a sign-out from any tab broadcasts via BroadcastChannel; all tabs clear state immediately.

## 6. Threat: information disclosure in error paths

Stack traces leaking internal data, table names, query shapes.

**Controls:**

1. Production `next.config.mjs` strips source maps + masks 5xx errors before render.
2. Sentry captures full trace; only an opaque `errorId` is shown to the user.
3. `next.config.mjs` `poweredByHeader: false` (inherited).

## 7. Threat: SQL/PII exposure via export features

Admins can typically export filtered lists (CSV, etc). Without limits, an export of "all users" leaks the whole table.

**Controls:**

1. Export jobs run server-side via the audit-logged action helper. Direct DB exports forbidden.
2. Row cap per export (10k default; configurable). Exceeding the cap requires super_admin + typed confirmation.
3. PII fields auto-redacted at export time via `lib/security/redaction.ts`.

## 8. Out-of-scope (handled by parent recipe)

All controls from `saas-multitenant-baseline/THREAT_MODEL.md` apply unchanged.

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. RBAC + bulk-action discipline + no-index + session policy locked.
