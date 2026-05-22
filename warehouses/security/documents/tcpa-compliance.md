# TCPA outbound-call compliance gate

`lib/security/tcpa.ts` ships the three-check gate every outbound automated call must pass. Inbound calls (recipient-initiated) are exempt.

## The three checks

1. **Time-of-day window** — 8am to 9pm in the recipient's local timezone. Outside that window: `TcpaViolationError(reason: "after_hours")`.
2. **Do-not-call list** — Phone number must not be on the DNC list. Match: `TcpaViolationError(reason: "dnc_match")`.
3. **Consent record** — A non-expired consent record exists for this number. Missing: `TcpaViolationError(reason: "consent_missing")`. Expired: `… "consent_expired"`.

## Fail-closed timezone

If `Intl.DateTimeFormat` rejects the recipient timezone string, the gate returns "outside window" rather than allowing the call. Better to drop a call than violate.

## Integration shape

```ts
import { assertTcpaCompliant } from "@/lib/security/tcpa";

await assertTcpaCompliant({
  phone: "+15551234567",
  recipientTimezone: "America/Los_Angeles",
  checkers: {
    isOnDncList: (phone) => dncService.lookup(phone),
    lookupConsent: (phone) => consentRepo.get(phone),
  },
});

// reaches here only if compliant; otherwise threw TcpaViolationError
await voiceProvider.placeCall({ to: phone, ... });
```

## Why it's a separate gate

It's small, frequently audited, and must be impossible to bypass. Inlining it into the provider adapter would put the gate behind whatever flags / fallbacks the adapter has — a regression waiting to happen.

## Provenance

Originally authored in the `sage-agents` repo (Sage Ideas LLC, 2026-05-06) for the outbound-SDR agent. Vendored per ADR-0011 §6. The DNC + consent stores remain app-specific; the gate logic is reusable across every recipe that places outbound calls.
