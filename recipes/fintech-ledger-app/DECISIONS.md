# DECISIONS — `fintech-ledger-app`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/DECISIONS.md` with these finance-specific opinions locked:

## Bookkeeping model

| Decision       | Choice                                     | Reasoning                                                                                                     |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Entry model    | **Double-entry** (debit + credit, sum = 0) | Industry standard; auditable; reversal-safe. Single-entry is unaudited and we've all seen what that produces. |
| Storage        | **bigint at {{decimalPrecision}}-decimal** | Integer math only. JS `number` for money is malpractice.                                                      |
| Mutability     | **Append-only**                            | Corrections via reversing transactions. UPDATEs / DELETEs blocked by trigger.                                 |
| Reconciliation | Nightly cron at 03:00 UTC                  | Cross-checks Stripe `BalanceTransaction.list()` ↔ `ledger_transactions`. Discrepancy = Sentry + banner.       |
| Retention      | **{{ledgerRetentionYears}} years**         | SOX / IRS baseline = 7 years. Override only with compliance signoff in this file.                             |

## Cost discipline (per ADR-0007)

```yaml
hard_caps:
  per_request_usd: 0.10 # tighter than baseline; LLM in finance = audit risk
  per_user_per_day_usd: 2
  per_app_per_day_usd: 50
```

Tighter than baseline because LLM use in regulated paths must be deliberate and bounded.

## LLM use policy

| Context                        | Allowed?                                |
| ------------------------------ | --------------------------------------- |
| Posting helper / ledger writes | **NO**                                  |
| Reconciliation runner          | **NO**                                  |
| Suggesting category tags (UI)  | Yes, advisory only, never auto-applied  |
| Owner-dashboard summarization  | Yes                                     |
| Support chat over ledger data  | Yes, with citation + redaction in place |

LLM responses are NEVER the source-of-truth for any number.

## Stripe integration

| Decision                | Choice                                                              |
| ----------------------- | ------------------------------------------------------------------- |
| Webhook idempotency     | `stripe_events` table (from `billing/`) dedupes by `event.id`       |
| Charge ↔ ledger mapping | `ledger_transactions.external_ref` UNIQUE (tenant_id, external_ref) |
| Past-due grace          | **{{pastDueGraceDays}} day(s)** (baseline = 7; fintech default = 1) |
| Reversal flow           | Refund → new reversing transaction; original transaction untouched. |

## Audit trail

`audit_events` (inherited) records every API write that produces a ledger entry. The recipe also adds:

- `posted_by uuid` on `ledger_transactions` — actor identity
- `posted_at timestamptz` — wall time at insertion
- `reversed_by_transaction_id` — linked reversal pointer

These are non-optional and the migration's `not null` constraints enforce population.

## Tenant isolation

| Path                     | Enforcement                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| API → app code           | RLS on all ledger tables                                               |
| Reconciliation runner    | `set local role = 'authenticated'` + injected `auth.uid()` claim       |
| Cross-tenant aggregation | **Forbidden**. One process per tenant. No cross-tenant ledger queries. |

## Reconciliation runner shape

```ts
// scripts/reconcile.ts (forge-time scaffold)
import { runReconciliationForTenant } from "@/lib/ledger/reconcile";

for (const tenantId of tenantsToProcess) {
  await runReconciliationForTenant(tenantId);
}
```

Each tenant: load yesterday's Stripe balance transactions → compare against `ledger_transactions.external_ref` → record discrepancy in `reconciliation_runs` → file Sentry issue if any.

## Eval golden set (when LLM advisory paths land)

50 Q&A pairs covering:

- 20 category-classification (LLM proposes tag for a transaction)
- 15 owner-dashboard summary (multi-month trend recap)
- 10 ambiguous (uncategorizable transaction)
- 5 adversarial (prompt injection via merchant memo field)

Per ADR-0010 §2.9 + ADR-0008 §2.

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. Bookkeeping model, precision strategy, LLM policy, reconciliation cadence locked.
