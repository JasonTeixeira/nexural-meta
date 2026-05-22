# Recipe — `saas-agent-platform`

Agent-as-a-service product. Per BUILD_PLAN §Phase 6.

Extends `saas-multitenant-baseline`.

## Forge

```bash
nx forge saas-agent-platform my-agent \
  --displayName "My Agent Platform" \
  --rootDomain my-agent.com
```

## What you get (on top of the parent recipe)

- **Tool registry** — Zod-typed, statically declared
- **Per-session tool whitelist** (per ADR-0010 §2.10)
- **Hard step cap** (default 20, max 50)
- **Per-invocation cost cap** ($1.00, enforced by `@nexural/sdk.llmClient`)
- **Stuck-state detection** (3 identical consecutive tool calls = forced exit)
- **Observation persistence** in Postgres jsonb (30-day default; 7-year fintech)
- **Tool-call audit log** (immutable, per ADR-0010 §2.10)
- **Adversarial eval suite** (10 prompt-injection-via-tool-call cases)
- **6 initial tools**: search-knowledge-base, fetch-url, send-email,
  query-database, update-record, schedule-task

## Cost discipline

```yaml
hard_caps:
  per_request_usd: 1.00 # single agent invocation
  per_user_per_day: 10
  per_app_per_day: 200
```

Tighter than chat because agents make many LLM calls per invocation.

## Safety controls (per ADR-0010 §2.10)

| Threat                  | Defense                                               |
| ----------------------- | ----------------------------------------------------- |
| Tool-call injection     | Zod schemas + per-session whitelist                   |
| Out-of-band tool calls  | Reject + log security event                           |
| Destructive tool args   | Schema validation (e.g., `admin: true` not in schema) |
| Confirmation bypass     | `confirmationRequired: true` flag pauses for UI       |
| Infinite loop / runaway | Hard step cap + stuck-state detection + cost cap      |
| Cross-tenant tool calls | tenantScopedClient enforced in tool handlers          |

## Adversarial eval

10 cases ship in `templates/eval/adversarial.json`. `recipe-validity` requires
100% rejection of these at emit time.

## Inputs

See `inputs.zod.ts`. Notable knobs: `defaultTools`, `maxSteps`,
`observationRetentionDays`, `adversarialEvalStrict`.

## License

MIT (recipe). Output app: MIT (configurable).
