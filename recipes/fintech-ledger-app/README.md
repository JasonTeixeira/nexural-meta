# Recipe — `fintech-ledger-app`

SaaS application with double-entry ledger, Stripe integration, and 7-year audit retention.

Extends `saas-multitenant-baseline`. Per BUILD_PLAN §Phase 7.

## Forge

```bash
nx forge fintech-ledger-app my-fintech-app \
  --inputs config/inputs.json
```

## What you get (on top of the parent recipe)

- **Double-entry ledger** with append-only `ledger_transactions` + `ledger_entries` tables (per `database/documents/rls-pattern.md`)
- **Precision-safe math** — money as `bigint` at configurable precision (default 4 decimal places), via `lib/ledger/decimal.ts`
- **Typed posting helper** (`lib/ledger/post.ts`) — only supported path for ledger writes; rejects unbalanced transactions
- **Stripe webhook handler** with signature verification + idempotency (`stripe_events` table)
- **Reconciliation runner** scaffold (`scripts/reconcile.ts`) — nightly cron at 03:00 UTC compares Stripe ↔ ledger
- **7-year retention** + immutable audit trail via Postgres triggers

## Cost discipline

```yaml
hard_caps:
  per_request_usd: 0.10 # tighter than baseline; LLM in finance = audit risk
  per_user_per_day: 2
  per_app_per_day: 50
```

LLM use restricted to advisory paths only (category tags, dashboards). Never the source-of-truth for any number.

## Stack (inherits parent)

- Next.js 15 + Supabase + Stripe + Sentry + PostHog
- Anthropic Opus primary (no fallback chain — finance defaults to single-provider deterministic)

## Safety controls

| Threat                               | Defense                                                           |
| ------------------------------------ | ----------------------------------------------------------------- |
| Ledger tampering                     | DB triggers reject UPDATE/DELETE; reversal-only corrections       |
| Double-spend via webhook redelivery  | `stripe_events` dedup + `ledger_transactions.external_ref` UNIQUE |
| Precision loss                       | Integer storage; JS Number forbidden in ledger paths              |
| Cross-tenant leak via reconciliation | One process per tenant; `auth.uid()` injected under service-role  |
| PII in metadata                      | Whitelist of allowed `jsonb` keys; redaction in logs              |

## Inputs

See `inputs.zod.ts`. Notable knobs:

- `baseCurrency` (ISO 4217)
- `decimalPrecision` (2-8)
- `ledgerRetentionYears` (7+ by default)
- `pastDueGraceDays` (1 by default)
- `reconciliationEnabled` (true by default)

## Status

**Scaffold** per ADR-0011. Slice gate not yet passed (deploy + qa-os clean + adversarial proof pending).

## License

MIT (recipe). Output app: MIT (configurable).
