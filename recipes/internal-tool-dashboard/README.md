# Recipe — `internal-tool-dashboard`

Internal-team admin tool with role-based access control, bulk-action discipline, and no-index posture.

Extends `saas-multitenant-baseline`. Per BUILD_PLAN §Phase 7.

## Forge

```bash
nx forge internal-tool-dashboard my-admin-tool \
  --inputs config/inputs.json
```

## What you get (on top of the parent recipe)

- **RBAC middleware** (`lib/rbac.ts`) — `requireRole(role)` for every protected route or action; throws `ForbiddenError`
- **`admin_users` + `admin_bulk_actions`** tables with immutable audit trail
- **Bulk-action typed-confirmation gate** — actions affecting > threshold rows require typing the action name + count
- **No-index posture** — `robots: { index: false, follow: false }` in root layout; no marketing pages
- **Admin-only sign-up** — `signupEmailDomains[]` allowlist; empty by default (must invite)
- **Higher Sentry sampling** (0.5 vs baseline 0.1) for forensic visibility

## Cost discipline

```yaml
hard_caps:
  per_request_usd: 0.05
  per_user_per_day: 1
  per_app_per_day: 20
```

Lower than baseline because internal tools = low traffic, predictable surface.

## Stack (inherits parent)

- Next.js 15 + Supabase + Sentry + PostHog (session replay DISABLED for admin tools)
- No Stripe / billing integration by default — admin tools rarely transact

## Safety controls (per THREAT_MODEL.md)

| Threat                     | Defense                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| Privilege escalation       | super_admin-only role mutation; `granted_by` provenance; daily self-grant alert |
| Bulk-action mistakes       | Typed-confirmation > threshold; immutable audit log                             |
| Indexing / discoverability | `robots: noindex,nofollow`; no marketing routes; project-level "internal" flag  |
| Session theft              | 1hr JWT + 15min inactivity; multi-tab sign-out broadcast                        |
| Export PII leak            | Row cap per export; PII auto-redacted; export action audit-logged               |

## Inputs

See `inputs.zod.ts`. Notable knobs:

- `adminRoles[]` (default `super_admin/admin/viewer`)
- `signupEmailDomains[]` (default empty — invite-only)
- `bulkConfirmThreshold` (default 10)
- `sentryTracesSampleRate` (default 0.5)

## Status

**Scaffold** per ADR-0011. Slice gate not yet passed (deploy + adversarial proof pending).

## License

MIT (recipe). Output app: MIT (configurable).
