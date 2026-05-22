# Sentry baseline for Next.js apps

Sentry is the error + perf telemetry backbone for every forged app. PostHog handles product analytics + session replay. Both ship with privacy defaults on.

## Locked defaults

| Setting                                   | Default | Reason                                                |
| ----------------------------------------- | ------- | ----------------------------------------------------- |
| `tracesSampleRate`                        | 0.1     | 10% perf sampling — enough signal, manageable cost.   |
| `replaysSessionSampleRate`                | 0.0     | Session replay only on errors. Privacy + cost.        |
| `replaysOnErrorSampleRate`                | 1.0     | Every error gets a replay (privacy-masked).           |
| `replayIntegration.maskAllText`           | true    | No text content leaves the user's browser by default. |
| `posthog.session_recording.maskAllInputs` | true    | Same idea on PostHog side.                            |

## Why three Sentry configs

Next.js 15 runs code in three runtimes: `nodejs`, `edge`, and the browser. Each needs its own init because they don't share globals. `instrumentation.ts` dispatches by `process.env.NEXT_RUNTIME`.

## PII discipline

Sentry's `beforeSend` hook should call the `pii-redaction` document's regex set before transmitting a breadcrumb's `data`. The redaction warehouse pattern (from `security/`) is the source of truth.
