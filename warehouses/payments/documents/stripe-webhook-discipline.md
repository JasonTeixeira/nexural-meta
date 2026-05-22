# Stripe webhook signature + idempotency discipline

The single most common Stripe production failure: a webhook handler that's slow, non-idempotent, or fails open. This document pins the discipline.

## Signature verification is non-negotiable

Every webhook request MUST be verified against `STRIPE_WEBHOOK_SECRET`. If signature verification fails, return 400. If the secret env var is missing in production, the handler refuses to start (caught at boot, not at request time).

## Idempotency

Stripe redelivers events on failure. Without dedup, a redelivery of `invoice.paid` charges the user twice OR double-records revenue.

Implementation: persist `event.id` in a `stripe_events` table with `created_at` and `last_processed_at`. Before handling, check if `event.id` exists. If yes and `last_processed_at` is set, return 200 immediately. If yes but unprocessed (handler crashed mid-flight), proceed. If no, insert + handle.

The `fintech-ledger-app` recipe ships the table + the dedup wrapper. The `saas-multitenant-baseline` recipe ships only the route stub — owners must add the table.

## Return codes

| Scenario                           | Status | Reason                                                  |
| ---------------------------------- | ------ | ------------------------------------------------------- |
| Signature invalid                  | 400    | Caller cannot retry to fix; permanent reject.           |
| Event type unknown                 | 200    | Stripe expects ack; future event types are not errors.  |
| Handler logic error (DB down, etc) | 500    | Stripe will retry with exponential backoff.             |
| Handler logic error (data bad)     | 200    | Avoid infinite retry loop; log + alert + manual triage. |

## Async work belongs in a job, not the handler

Stripe expects 200 within ~5 seconds. Long-running work (sending receipt emails, computing analytics) is dispatched to a job queue. The handler's job: dedup, persist event, ack.

## What NOT to put in the handler

- Direct user-facing side effects (emails, etc.). Those are best in a follow-up worker.
- Heavy SQL transactions on hot tables. Stripe's retry will pile up if the handler is slow.
- LLM calls. Cost + latency = unbounded handler runtime.
