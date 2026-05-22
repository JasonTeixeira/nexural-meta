# Subscription state machine

Every forged SaaS recipe ships with the same 5-state machine. Customizations live on top, not inside.

## The states

```
trialing ─┬─→ active ─┬─→ past_due ─┬─→ canceled (terminal)
          │           │             │
          │           ↓             ↓
          ↓        paused           ↑
       canceled    └→ active ───────┘
```

| State    | Meaning                                                             |
| -------- | ------------------------------------------------------------------- |
| trialing | Trial in progress; no charge succeeded yet.                         |
| active   | Paid; current period not yet ended.                                 |
| past_due | At least one invoice payment failed; access continues per recipe.   |
| paused   | Owner-initiated pause; reactivation possible without re-onboarding. |
| canceled | Terminal; new subscription required to re-enter.                    |

## Why a machine instead of "just store Stripe status"

Stripe's `Subscription.status` enum changes meaning over time. Internal status decouples app logic from Stripe schema drift and makes downgrades / pauses recoverable.

## Source of truth

`tenants.subscription_status` is canonical. Every transition is recorded in `subscription_events` (immutable). The webhook handler is the ONLY writer.

## Past-due grace period

Recipes choose: hard-cutoff at first payment failure, or grace period (3/7/14 days) before access restriction. Default in baseline: 7-day soft grace, access continues but a banner shows. Fintech recipes default to hard-cutoff (1 day grace + readonly access) per ADR-0007 cost discipline + regulatory expectations.

## What this does NOT model

- Trial extensions (manual ops; insert directly into `subscription_events` + bump `trial_ends_at`).
- Plan upgrades/downgrades (Stripe handles; internal status doesn't change).
- Failed payment retry logic (Stripe owns; we just observe).
