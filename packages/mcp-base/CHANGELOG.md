# @nexural/mcp-base

## 0.1.0

Initial release.

- `wrapInEnvelope(content, { warehouse, id, sha? })` — wraps content in `<warehouse_content>` envelope per ADR-0008 §1
  - Escapes literal closing tags inside content (envelope-injection defense)
  - Escapes attribute special characters
- `SYNTHESIS_DIRECTIVE` — canonical system-prompt directive for the router to use
- `buildHandler(warehouse, decayRateDays, lastReviewed, handler, emit)` — middleware-wrapped tool handler
  - Zod request validation
  - Decay check (stale / quarantined / auto-deprecate warnings prepended)
  - Telemetry emission on success + error
  - Schema-validated response envelope
