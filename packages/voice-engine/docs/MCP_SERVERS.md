# Per-App MCP Servers

The pattern that makes the voice engine truly reusable. Each Sage app
exposes its own actions as a small MCP server — fork the template,
add tools, plug in.

Distilled from ai-warehouse `playbooks/ship-mcp-server.md` (CC BY-SA 4.0
© Jason Teixeira), specialized for voice-agent tools.

---

## Mental model

```
   ┌───────────────────────────┐         ┌─────────────────────────┐
   │  Voice Engine             │ ◄─MCP─► │  Per-app MCP server     │
   │  (never changes)          │         │  (one per Sage product) │
   └───────────────────────────┘         └────────────┬────────────┘
                                                       │
                                         ┌─────────────┼─────────────┐
                                         ▼             ▼             ▼
                                    Your DB       Your APIs     Third-party
                                                                  services
```

The engine is general. The MCP server is your app-specific surface —
"book a slot", "look up customer", "submit lead", "search docs".

---

## When you need a per-app MCP server

| Need                                    | Solution                                 |
| --------------------------------------- | ---------------------------------------- |
| Agent needs to do an action in YOUR app | Per-app MCP server                       |
| Agent needs to know YOUR content        | RAG MCP (`mcp-servers/rag/`)             |
| Agent needs a generic tool (calendar)   | Use shared MCP (`mcp-servers/calendar/`) |
| Agent just needs to converse            | No MCP needed                            |

If your persona has `mcp_servers: []` and works fine — you don't need
this. Most coaches, tutors, therapists are MCP-less.

---

## Fork the template

```bash
cp -r mcp-servers/calendar mcp-servers/my-app
cd mcp-servers/my-app
$EDITOR pyproject.toml             # rename package
$EDITOR src/calendar_mcp/server.py # rename FastMCP() and tools
mv src/calendar_mcp src/myapp_mcp
pip install -e .
```

Or use `recipes/voice-app-starter/mcp-server/` which is pre-templated.

---

## Tool design rules (these matter — the LLM is the consumer)

### 1. ONE action per tool

Bad: `get_or_update_user`
Good: `get_user(id)` + `update_user(id, fields)`

Multi-action tools confuse the model. It will pick the right one ~80% of
the time. Single-action tools get picked 99%.

### 2. Verb-noun names

Bad: `userdata`, `data`, `q`
Good: `get_customer`, `book_appointment`, `cancel_subscription`

### 3. Rich docstrings — for the LLM, not for you

```python
@mcp.tool()
def book_appointment(
    customer_name: str,
    starts_at: str,
    duration_min: int = 30,
) -> dict:
    """Book an appointment in the calendar.

    Use this when the customer agrees to a specific date and time.
    Confirm the time aloud first by saying "So that's Tuesday at 3pm,
    correct?" before calling this tool.

    Args:
        customer_name: Caller's full name.
        starts_at: ISO-8601 datetime, e.g. "2026-05-25T15:00:00".
        duration_min: Length in minutes. Default 30.

    Returns:
        {"id": str, "confirmation_message": str}
    """
    ...
```

The docstring **trains the LLM at runtime**. Spend time on these.

### 4. Typed parameters

Use Pydantic types — FastMCP turns them into JSON Schema the LLM sees.

### 5. Idempotent reads, explicit writes

- `get_*`, `list_*`, `search_*` — safe to retry, safe to call freely
- `create_*`, `book_*`, `cancel_*`, `update_*` — name them like verbs
  the user said

### 6. Return short JSON

The LLM has to read the result. Return what's needed for the next
spoken reply:

Bad: dump the entire database row
Good: `{"id": "abc", "status": "confirmed", "time": "Tue 3pm"}`

---

## How many tools per server?

| Tool count | What it implies                               |
| ---------- | --------------------------------------------- |
| 1-5        | Single-purpose tool surface (booking, search) |
| 5-15       | Per-app server (recommended sweet spot)       |
| 15-30      | Multi-domain aggregator — split it up         |
| 30+        | LLM picks wrong tools too often; refactor     |

Each tool in the list adds tokens to the LLM's prompt. 15+ tools and
context bloat starts mattering.

---

## Transport: stdio vs HTTP+SSE

| Transport       | Use when                                                |
| --------------- | ------------------------------------------------------- |
| `--http` (SSE)  | Voice engine in production, server is separate process  |
| stdio (default) | Local dev with Claude Desktop, single-machine pipelines |

Recommended for voice engine: **HTTP+SSE on localhost** (or LAN). Let
each MCP server be its own process — restart independently, scale
independently.

---

## Wire it into a persona

```yaml
mcp_servers:
  - name: my_app
    url: http://localhost:7801/sse
  - name: knowledge # often paired with RAG
    url: http://localhost:7800/sse
  - name: calendar # if you also need calendar
    url: http://localhost:7700/sse
```

The agent sees the union of all tools across all servers. Tell it in
the system prompt when to use which:

> When the user asks about pricing, call `search_knowledge`.
> When the user wants to book, call `book_appointment`.
> When the user wants to cancel, call `cancel_appointment`.

---

## Deploying per-app MCP servers

Each MCP server is a tiny Python service. Deploy alongside the voice
worker:

| Where                            | Why                                                 |
| -------------------------------- | --------------------------------------------------- |
| Same Fly app as the voice worker | Simplest. Localhost. Low-volume.                    |
| Separate Fly app                 | When the MCP needs different scaling than the agent |
| Vercel Function                  | When the MCP is mostly stateless HTTP wraps         |
| Cloudflare Worker                | Edge-scale free MCP servers                         |

For most personas: bundle the MCP into the same Fly app as the worker
(`docker compose up`). Two processes, one deployment unit.

---

## When MCP isn't the right tool

- **Real-time streaming data** (live stock prices, sensor feeds) — MCP
  is request/response. Use a regular subscription pattern outside the
  tool flow.
- **Agent should ALWAYS do action X every turn** — don't make it a tool,
  bake it into the engine or the prompt.
- **The "tool" is just a SQL query against a public DB** — use a
  serverless function. MCP overhead isn't worth it.

---

## Two reference servers you can study

1. **`mcp-servers/calendar/`** — booking, slot search, cancellation.
   SQLite-backed. 4 tools. ~200 lines.
2. **`mcp-servers/rag/`** — knowledge retrieval. SQLite-vec + OpenAI
   embeddings. 2 tools (`search_knowledge`, `list_topics`).

Read both before forking. They show the production pattern.

---

## Credit

Tool-design rules + transport guidance distilled from
[ai-warehouse](https://github.com/JasonTeixeira/ai-warehouse)
`playbooks/ship-mcp-server.md` (CC BY-SA 4.0 © Jason Teixeira).
