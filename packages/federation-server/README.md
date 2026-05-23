# @nexural/federation-server

Single MCP stdio server exposing the whole Nexural Federation knowledge base as one tool surface. Phase 11.x.

## What it does

Wire ONCE into your editor's MCP config. Your agent gains two callable tools:

| Tool                                    | Returns                                                                                                                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `federation_ask(query, kinds?, limit?)` | Ranked excerpts from constitution, ADRs, warehouse docs, recipe THREAT_MODEL/DECISIONS/README, and eval sets — with source labels and citation paths |
| `federation_list_sources(kind?)`        | All sources currently indexed (for browsing or filtering subsequent asks)                                                                            |

## Setup

```bash
npm i -g @nexural/federation-server
```

In your editor's MCP config (Cursor / Claude Desktop / etc.):

```json
{
  "mcpServers": {
    "nexural": {
      "command": "nexural-federation-server",
      "args": ["--root", "/Users/Sage/code/nexural/nexural-meta"]
    }
  }
}
```

Or set `NEXURAL_META_ROOT` in your env and omit `--root`:

```json
{
  "mcpServers": {
    "nexural": {
      "command": "nexural-federation-server"
    }
  }
}
```

## Usage from the agent's perspective

```
agent: I'll check the federation for what we've decided about cost discipline.
agent → tool: federation_ask({ query: "cost discipline LLM caps" })
tool → agent: {
  hits: [
    { source: "adr:0007-cost-guardrails-model-deprecation", title: "Cost Guardrails + Model Deprecation Handler", path: "docs/adr/0007-cost-guardrails-model-deprecation.md", snippet: "...streaming abort is mandatory..." },
    ...
  ]
}
agent: ADR-0007 has it covered. The pattern is X.
```

## Compared to `nx ask`

`nx ask` is the CLI for humans. `federation_ask` (this server) is the same engine exposed to AI agents over MCP. Both query the same docs.

## License

MIT.
