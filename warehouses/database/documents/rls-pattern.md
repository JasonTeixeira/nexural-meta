# Postgres RLS pattern for multi-tenancy

Every multi-tenant table follows the same shape. Deviating requires an ADR.

## The shape

1. Tenant table with `id uuid primary key`.
2. Per-tenant data table has `tenant_id uuid not null references tenants(id) on delete cascade`.
3. RLS enabled (`alter table … enable row level security`).
4. SELECT policy: row visible if `EXISTS (SELECT 1 FROM tenant_memberships WHERE tenant_id = <table>.tenant_id AND user_id = auth.uid())`.
5. INSERT policy: same membership check + role gate where needed.
6. UPDATE/DELETE: typically owner-or-admin role.

## Why memberships, not direct user_id

A user can belong to multiple tenants. Direct `user_id` columns collapse that to one and force re-engineering when team-switching ships.

## Audit log is immutable

`audit_events` is special:

- RLS for SELECT (tenant members can read their tenant's events).
- A trigger blocks UPDATE + DELETE entirely.
- Service-role writes only — never the anon client.

## Tradeoff: no `bypassrls`

Service-role connections have `bypassrls = on` by default. Background jobs that rewrite tenant data MUST set `set local role = 'authenticated';` to re-enter RLS, or they bypass tenant isolation silently. There is no "trust the application code" fallback.
