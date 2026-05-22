# @nexural/mcp-base

Opinionated base for warehouse MCP servers.

## What it provides

1. **`<warehouse_content>` envelope wrapping** (ADR-0008 §1) — defends synthesis against prompt-injection embedded in warehouse content.

2. **`buildHandler()`** — composed middleware: Zod request validation → decay check → tool execution → telemetry → Zod response validation.

3. **`SYNTHESIS_DIRECTIVE`** — the verbatim system prompt directive the router prepends to LLM synthesis calls.

## Usage in a warehouse MCP server

```ts
import { buildHandler, wrapInEnvelope } from "@nexural/mcp-base";

const handler = buildHandler(
  "auth", // warehouse name
  90, // decay_rate_days from meta.yaml
  "2026-06-01", // last_reviewed from meta.yaml
  async (request) => {
    // Your tool implementation
    const content = await loadEntry(request.args.id);
    return {
      data: {
        text: wrapInEnvelope(content.body, {
          warehouse: "auth",
          id: content.id,
        }),
      },
      citations: [{ warehouse: "auth", id: content.id }],
    };
  },
  (event) => {
    // emit tool_call telemetry to your local SQLite
    console.warn(JSON.stringify(event));
  },
);

// Wire `handler` into your MCP server's tool dispatch.
```

Per ADRs 0002, 0007, 0008.
