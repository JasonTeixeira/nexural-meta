# ADR-0003: MCP servers are the per-app content/tool swap layer

**Status:** Accepted (2026-05-22)
**Owner:** Sage

## Context

Personas are 90% the same conversational machinery (greeting, listen,
respond, hand-off) and 10% app-specific tools (look up a calendar slot,
fetch a lesson plan, push a CRM record). Where should that 10% live?

Three options:

1. **Hardcode tools per persona in Python.** Tight coupling — adding a
   tool means a Python release.
2. **A custom tool-DSL per persona.** Invent a new spec. Wastes effort
   reinventing what MCP already does.
3. **MCP servers, listed in the persona YAML.**

## Decision

**Option 3.** Each persona declares its tool surface as a list of MCP
servers (URL or stdio command). The engine wires them in via
`livekit.agents.mcp`. Tools added to a server appear instantly in the
agent's tool list — no engine restart, no Python change.

## Rationale

- **It already exists.** MCP is the de-facto standard; OpenAI/Anthropic
  /LiveKit all support it natively. Our voice agents inherit that for
  free.
- **Reusable across products.** The same `mcp-calendar` server serves
  `receptionist`, `sales_agent`, `real_estate_agent`. Forge once, reuse.
- **Process isolation.** A misbehaving tool can't crash the voice
  runtime.
- **Polyglot.** Tools can be written in Python, TS, Go — whatever fits
  the data source.
- **Aligns with our federation principle** (ARCHITECTURE.md §2.4:
  "Federation, never coupling").

## Trade-offs accepted

- Latency: an MCP tool call adds a round-trip. Mitigation: gpt-realtime
  and LiveKit support async function calls so the conversation keeps
  flowing during tool work.
- Operational overhead: each MCP server is one more process to deploy.
  Mitigation: small servers, deploy alongside the agent worker on the
  same Fly app (or in-process via stdio).

## Consequences

- Reference MCP server (`mcp-servers/calendar/`) is the template for
  every per-app tool surface.
- `nx forge --with-voice=<persona>` should also offer to scaffold an
  MCP server for app-specific tools.
- "Build a new voice app" recipe = (1) new persona YAML, (2) one MCP
  server forked from `mcp-servers/<closest>/`, (3) deploy both to Fly.
