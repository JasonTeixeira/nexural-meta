# PII redaction patterns

`lib/security/redaction.ts` ships a small set of regex replacers for the four PII classes that most commonly leak through logs, error reports, and LLM prompts:

| Class        | Pattern (approximate)                          | Replacement        |
| ------------ | ---------------------------------------------- | ------------------ |
| Card         | 13-19 digit sequences with optional separators | `[REDACTED_CARD]`  |
| SSN (US)     | `NNN-NN-NNNN`                                  | `[REDACTED_SSN]`   |
| Phone (NANP) | `(NNN) NNN-NNNN` with variants                 | `[REDACTED_PHONE]` |
| Email        | RFC-shaped addresses                           | `[REDACTED_EMAIL]` |

## How to use

```ts
import { redact } from "@/lib/security/redaction";

logger.info(redact(userMessage));
Sentry.addBreadcrumb({ message: redact(req.body) });
```

## Why not a library

The regexes are 4 lines. A library would add bundle weight, transitive deps, and an upstream supply chain we'd have to monitor.

## Known limitations

- International phone formats not matched. Add per-country patterns if you need broader coverage.
- Card-number regex matches any 13-19 digit run including some non-PAN strings (e.g. ULIDs). False-positive bias is intentional — better to over-redact than leak.
- Free-form names, addresses, DOBs, IPs are NOT redacted by default. Add separately if needed.
- For HIPAA workloads, swap in a dedicated PII pipeline (Presidio, Macie). This is the floor.

## Provenance

Originally authored in the `sage-agents` repo (Sage Ideas LLC, 2026-05-06) for the inbound-voice + outbound-SDR agents. Vendored into the security warehouse per ADR-0011 §6.
