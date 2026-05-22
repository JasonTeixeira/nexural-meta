# @nexural/sdk

Shared helpers for warehouse MCP servers, recipes, and forged apps.

## `llmClient` — the cost wrapper every emitted app uses

Per ADRs 0007 + 0010, recipes that import provider SDKs directly fail `federation-conformance`. Use `llmClient()` instead.

```ts
import { llmClient } from "@nexural/sdk";

const client = llmClient({
  appName: "my-rag-app",
  recipeName: "saas-rag-chat",
  costEnvelope: {
    /* from recipe.yaml */
  },
  modelChain: ["anthropic:opus", "openai:flagship", "ollama:llama-large"],
  usageTracker, // your Postgres / SQLite-backed counter
  telemetry, // emits cost_event to nexural-meta
  providers, // Map of provider id → caller
});

const result = await client.invoke({
  userId: "user-123",
  messages: [{ role: "user", content: "..." }],
  inputTokenEstimate: 1500,
  maxOutputTokens: 500,
  streaming: false,
});
```

Hard caps from `costEnvelope.hard_caps`:

- `per_request_usd` — pre-flight reject; mid-stream abort
- `per_user_per_day_usd` — block individual users
- `per_app_per_day_usd` — circuit-break entire app

All breaches emit `cost_event` telemetry. Users hashed (sha256) — raw IDs never stored.

## `checkDecay` + `sha256Hex`

```ts
import { checkDecay, sha256Hex } from "@nexural/sdk";

const status = checkDecay("2026-01-01", 90);
// → { status: "stale" | "fresh" | "quarantined" | "auto-deprecate", ... }

const argsHash = sha256Hex(JSON.stringify(args)); // for telemetry
```
