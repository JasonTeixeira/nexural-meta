# THREAT_MODEL — `fintech-ledger-app`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/THREAT_MODEL.md` with these finance-specific deltas:

## 1. New assets

| Asset                                    | Confidentiality | Integrity                  | Availability |
| ---------------------------------------- | --------------- | -------------------------- | ------------ |
| Ledger transactions + entries            | High            | **CRITICAL** (regulated)   | High         |
| Account balances (derived)               | High            | **CRITICAL**               | High         |
| Reconciliation reports                   | Medium          | High                       | Medium       |
| `external_ref` mapping (Stripe ↔ ledger) | High            | **CRITICAL** (audit trail) | High         |

## 2. Headline threat: financial-record tampering (CRITICAL)

A successful tamper with `ledger_entries` voids the application's audit defensibility — every regulated jurisdiction expects an immutable audit trail.

**Controls:**

1. **Append-only at DB layer.** Triggers `prevent_ledger_mutation` reject UPDATE + DELETE on `ledger_entries` and `ledger_transactions`. There is no app-level path to mutation; corrections require a new reversing transaction.
2. **Balance invariant.** Every transaction's entries MUST sum to 0 (double-entry). The posting helper rejects unbalanced inserts client-side; the DB has no native constraint enforcing this across rows (Postgres limitation), so the recipe ships a **nightly reconciliation runner** (`scripts/reconcile.ts`) that re-checks every transaction since the last run + raises an alert on any imbalance.
3. **Tenant isolation.** RLS on all 4 ledger tables. Service-role bypass is the only path for the reconciliation runner; it MUST set `set local role = 'authenticated'` and pass through tenant_id explicitly per `database/documents/rls-pattern.md`.
4. **Audit trail.** Every transaction has `posted_by` (user UUID) and `posted_at` (timestamptz). `audit_events` (inherited from baseline) records every API write that produced a ledger entry.

## 3. Threat: double-spend via duplicate webhook delivery

Stripe webhooks redeliver on failure. Without idempotency, a `charge.succeeded` event processed twice creates two `ledger_transactions` for the same revenue — both balanced internally, but the tenant is credited twice.

**Controls:**

1. **`stripe_events` table** (from `billing/`) dedupes by `event.id`. Webhook handler aborts if event is already `last_processed_at != null`.
2. **`external_ref` uniqueness.** `ledger_transactions` has `unique (tenant_id, external_ref)` — second insert with the same Stripe charge ID fails at constraint level, even if the dedup table misses it.
3. **Reconciliation cross-checks.** The nightly runner compares Stripe's `BalanceTransaction.list()` against `ledger_transactions` for the same period; discrepancies opens a Sentry issue + tenant-visible banner.

## 4. Threat: precision loss

JS `0.1 + 0.2 = 0.30000000000000004`. Storing money as `numeric(15,2)` and round-tripping through JS Number = regulatory event.

**Controls:**

1. **Integer storage.** `amount_micro bigint` at `{{decimalPrecision}}`-decimal precision. Inputs parsed via `lib/ledger/decimal.ts`. No JS number arithmetic on money anywhere in the recipe.
2. **No floats in SQL.** All ledger SQL operates on bigints.
3. **Display layer formats only.** UI components call `formatAmount()` for render; never operate on the formatted string.

## 5. Threat: cross-tenant data exfiltration via reconciliation

The reconciliation runner runs with service-role privileges. A bug that doesn't filter by tenant_id leaks balances across tenants in the reconciliation report.

**Controls:**

1. Runner accepts a single `tenantId` per invocation. Loop-over-tenants is at the caller layer + uses one process per tenant.
2. RLS bypass is set via `set local role = 'authenticated'` + injected `auth.uid()` claim — RLS still applies even under service-role.
3. The reconciliation report writes to `reconciliation_runs` with explicit `tenant_id`; no cross-tenant aggregation.

## 6. Threat: PII in ledger metadata

`ledger_transactions.metadata` is `jsonb`. Sloppy callers stuff PII in there (full payment method, billing address, IP).

**Controls:**

1. App-layer enum of allowed metadata keys (per recipe DECISIONS.md). Any other key = reject at posting helper.
2. `lib/security/redaction.ts` (from `security/`) applied to all log lines containing `metadata`.
3. Audit table separately captures the strict subset of fields needed for regulatory traceability.

## 7. Cost runaway via LLM use in finance context

LLM use in finance is high-risk: a misclassification of a transaction can cascade. Default discipline: NO LLM calls in the ledger codepath.

**Controls:**

1. `cost_envelope.per_request_usd: 0.10` — tighter than baseline.
2. LLM calls allowed only in advisory paths (suggesting category tags, summarizing for owner dashboards); never in the posting pipeline.
3. Sentry alert on any error containing "LLM" or "model" in finance-tagged contexts.

## 8. Out-of-scope (handled by parent recipe)

All controls from `saas-multitenant-baseline/THREAT_MODEL.md` apply unchanged.

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. Double-entry ledger + reconciliation + precision-safe math locked.
