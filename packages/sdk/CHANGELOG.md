# @nexural/sdk

## 0.1.0

Initial release.

- `llmClient(config)` — cost-wrapped LLM helper enforcing 3-tier caps per ADRs 0007 + 0010
  - Pre-flight cost estimate via `@nexural/model-router`
  - Per-request / per-user / per-app hard caps
  - 80% warning threshold
  - Streaming-aware mid-call cancellation (ADR-0010 §2.4)
  - `cost_event` telemetry emission
  - PII safety: user IDs hashed via sha256
- `checkDecay(lastReviewed, decayRateDays)` — decay status calculator (fresh / stale / quarantined / auto-deprecate)
- `sha256Hex(input)` — telemetry hashing (per SCHEMA_CHARTER §4.5 privacy rule)
