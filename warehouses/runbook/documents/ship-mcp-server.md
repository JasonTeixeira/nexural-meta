# Playbook: Ship an MCP Server

> **Trigger:** You have a tool, dataset, or workflow that your AI agents (Cursor, Claude Code,
> custom agents) need to call. You want to expose it as a proper MCP server so any
> MCP-compatible client can call it without custom integration code.

**Reference template:** `templates/template-mcp-server/`

---

## Concept: Tools vs Resources vs Prompts

MCP has three primitive types. Know which one to reach for:

| Primitive    | What it is                                                                   | When to use                                                  |
| ------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Tool**     | A function the LLM can call (has side effects, takes inputs, returns output) | Actions: search DB, send email, run query, create record     |
| **Resource** | Read-only data the LLM can read (like a file or endpoint)                    | Static/slow-changing content: a doc, a config file, a schema |
| **Prompt**   | A pre-built prompt template the client can use                               | Reusable prompt patterns, few-shot examples, personas        |

Most MCP servers are 90% tools. Resources are underused but great for injecting context
(e.g., your company style guide as a resource). Prompts are niche.

**Rule of thumb:** If it changes data or does something → Tool. If the LLM just needs
to read it → Resource.

---

## Stdio vs HTTP/SSE Transport

MCP supports two transport modes. Choose before you write a line of code.

### Stdio transport

```
Client (Cursor/Claude Code)
    │ spawns subprocess
    ▼
Your MCP server process
    │ stdin/stdout
    └─ JSON-RPC messages
```

**Use stdio when:**

- The server runs locally on the developer's machine
- You're integrating with Cursor, Claude Code, Claude Desktop
- Your data access doesn't require a persistent server (files, local DB)
- Distribution is "developer installs and runs locally"

**Stdio pros:** Zero auth complexity, no network, simple to debug, works offline.
**Stdio cons:** One process per client, no shared state across clients, can't be called from web.

### HTTP + SSE transport

```
Client (any MCP client)
    │ HTTP POST (tool calls)
    │ GET /sse (server-sent events for streaming)
    ▼
Your MCP server (FastAPI / any HTTP server)
```

**Use HTTP/SSE when:**

- Multiple clients need to share the same server
- You need auth (API keys, OAuth, JWT)
- The server manages persistent state (DB connection pool, cache)
- You're deploying as a hosted service (Railway, Fly.io, Modal)
- You want to add MCP to an existing FastAPI service

**HTTP pros:** Proper auth, sharable, deployable, scalable.
**HTTP cons:** Auth complexity, needs a real deploy, SSE has browser/proxy quirks.

**Decision:** Start with stdio. Promote to HTTP when you need multi-user or hosted access.

---

## Python MCP SDK Quickstart

### Install

```bash
pip install mcp
# Or with FastMCP for better DX:
pip install fastmcp
```

### Minimal stdio server (plain SDK)

```python
# server.py
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

app = Server("my-warehouse-server")

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="search_products",
            description=(
                "Search the product catalog by keyword. "
                "Returns up to 10 matching products with name, SKU, and price. "
                "Use when the user asks about specific products or pricing."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search terms, e.g. 'wireless headphones under $50'"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Max results to return (1-10)",
                        "default": 5,
                    }
                },
                "required": ["query"],
            },
        ),
        types.Tool(
            name="get_order_status",
            description=(
                "Look up the status of an order by order ID. "
                "Returns order status, estimated delivery, and line items."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "The order ID (format: ORD-XXXXXXXX)"
                    }
                },
                "required": ["order_id"],
            },
        ),
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "search_products":
        results = await search_product_catalog(arguments["query"], arguments.get("limit", 5))
        return [types.TextContent(type="text", text=str(results))]

    elif name == "get_order_status":
        order = await fetch_order(arguments["order_id"])
        if order is None:
            return [types.TextContent(type="text", text=f"Order {arguments['order_id']} not found.")]
        return [types.TextContent(type="text", text=order.to_text())]

    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

### Same server with FastMCP (much nicer DX)

```python
# server.py
from fastmcp import FastMCP
from pydantic import BaseModel, Field

mcp = FastMCP("my-warehouse-server")


class ProductSearchInput(BaseModel):
    query: str = Field(description="Search terms for product catalog")
    limit: int = Field(default=5, ge=1, le=10, description="Max results")


class OrderStatusInput(BaseModel):
    order_id: str = Field(description="Order ID in format ORD-XXXXXXXX")


@mcp.tool()
async def search_products(params: ProductSearchInput) -> str:
    """
    Search the product catalog by keyword.
    Returns up to 10 matching products with name, SKU, and price.
    Use when the user asks about specific products or pricing.
    """
    results = await search_product_catalog(params.query, params.limit)
    return "\n".join(f"{r.name} ({r.sku}): ${r.price}" for r in results)


@mcp.tool()
async def get_order_status(params: OrderStatusInput) -> str:
    """
    Look up the status of an order by order ID.
    Returns status, estimated delivery, and line items.
    """
    order = await fetch_order(params.order_id)
    if order is None:
        return f"Order {params.order_id} not found."
    return order.to_text()


# Resource example: inject read-only context
@mcp.resource("config://product-categories")
async def product_categories() -> str:
    """Returns the complete product category tree."""
    return await load_category_tree()


if __name__ == "__main__":
    mcp.run()  # stdio by default; mcp.run(transport="sse") for HTTP
```

### Adding resources and prompts

```python
# Resources: read-only data the LLM can reference
@mcp.resource("docs://api-reference")
async def api_reference() -> str:
    """The complete API reference documentation."""
    return Path("docs/api.md").read_text()

# Resource with dynamic URI
@mcp.resource("orders://{order_id}/notes")
async def order_notes(order_id: str) -> str:
    """Internal notes for a specific order."""
    return await fetch_order_notes(order_id)

# Prompts: reusable prompt templates
@mcp.prompt()
def analyze_order_prompt(order_id: str) -> list[dict]:
    """Prompt for deep order analysis."""
    return [
        {
            "role": "user",
            "content": f"Analyze order {order_id}: check for anomalies, flag delays, summarize items."
        }
    ]
```

---

## Testing Locally with MCP Inspector

The MCP Inspector is the official debugging tool. Use it before wiring into any IDE.

```bash
# Install
npm install -g @modelcontextprotocol/inspector

# Test a stdio server
mcp-inspector python server.py

# Test an HTTP/SSE server (must be running already)
mcp-inspector --url http://localhost:8000/sse
```

The Inspector opens a browser UI where you can:

- Browse all available tools, resources, and prompts
- Call tools manually with test inputs and see raw outputs
- Inspect the JSON-RPC messages in flight
- Verify your inputSchema is correctly enforced

**Run Inspector before every IDE integration. It's 10x faster than debugging via Cursor.**

---

## Wiring into Cursor and Claude Code

### Cursor (`~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "my-warehouse": {
      "command": "python",
      "args": ["/path/to/your/server.py"],
      "env": {
        "DATABASE_URL": "postgresql://...",
        "API_KEY": "sk-..."
      }
    }
  }
}
```

### Claude Code (`~/.claude/claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "my-warehouse": {
      "command": "python",
      "args": ["/path/to/your/server.py"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`)

Same format as Claude Code above.

### HTTP/SSE server (for hosted deployments)

```json
{
  "mcpServers": {
    "my-warehouse-hosted": {
      "url": "https://your-mcp-server.railway.app/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Virtual env best practice

```json
{
  "mcpServers": {
    "my-warehouse": {
      "command": "/path/to/project/.venv/bin/python",
      "args": ["server.py"],
      "cwd": "/path/to/project"
    }
  }
}
```

Always use the full path to the venv Python — global `python` is unreliable across environments.

---

## Auth Patterns for HTTP Transport

### Pattern 1: Bearer token (simplest)

```python
# FastAPI + FastMCP with bearer token auth
from fastapi import FastAPI, Depends, HTTPException, Header
from fastmcp import FastMCP

mcp = FastMCP("my-server")
app = FastAPI()

VALID_TOKENS = {"sk-warehouse-abc123", "sk-warehouse-def456"}  # or DB lookup

async def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()
    if token not in VALID_TOKENS:
        raise HTTPException(status_code=403, detail="Invalid token")
    return token

# Mount MCP under auth dependency
app.mount("/mcp", mcp.get_asgi_app())

# Or: middleware-level token check
from starlette.middleware.base import BaseHTTPMiddleware

class TokenMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.url.path.startswith("/mcp"):
            auth = request.headers.get("authorization", "")
            token = auth.removeprefix("Bearer ").strip()
            if token not in VALID_TOKENS:
                from starlette.responses import JSONResponse
                return JSONResponse({"error": "Unauthorized"}, status_code=401)
        return await call_next(request)

app.add_middleware(TokenMiddleware)
```

### Pattern 2: OAuth 2.0 (for user-delegated access)

Use OAuth when the MCP server needs to act on behalf of a specific user (access
their Google Drive, GitHub repos, etc.).

```python
# Simplified OAuth flow for HTTP MCP
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import httpx

app = FastAPI()

GITHUB_CLIENT_ID = "..."
GITHUB_CLIENT_SECRET = "..."

@app.get("/auth/github")
def github_auth():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}&scope=repo"
    )

@app.get("/auth/github/callback")
async def github_callback(code: str):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://github.com/login/oauth/access_token",
            json={"client_id": GITHUB_CLIENT_ID, "client_secret": GITHUB_CLIENT_SECRET, "code": code},
            headers={"Accept": "application/json"},
        )
    token = resp.json()["access_token"]
    # Store token, return session key to user
    session_key = store_token(token)
    return {"mcp_api_key": session_key}
```

### Pattern 3: mTLS (for internal/enterprise)

For internal enterprise MCP servers where clients are known services:

```python
import ssl
import uvicorn

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain("server.crt", "server.key")
ssl_context.load_verify_locations("ca.crt")
ssl_context.verify_mode = ssl.CERT_REQUIRED  # require client cert

uvicorn.run(app, ssl=ssl_context, host="0.0.0.0", port=443)
```

---

## Distribution

### Option A: PyPI package (pip install)

Best for developer tools with a Python-using audience.

```
your-mcp-server/
├── pyproject.toml
├── src/
│   └── your_mcp/
│       ├── __init__.py
│       └── server.py
└── README.md
```

```toml
# pyproject.toml
[project]
name = "my-warehouse-mcp"
version = "0.1.0"
dependencies = ["fastmcp>=0.5", "httpx"]

[project.scripts]
my-warehouse-mcp = "your_mcp.server:main"
```

Install and use:

```bash
pip install my-warehouse-mcp
# Then in mcp.json:
# "command": "my-warehouse-mcp"
```

### Option B: uvx (zero-install, pip package on PyPI)

```json
{
  "mcpServers": {
    "my-warehouse": {
      "command": "uvx",
      "args": ["my-warehouse-mcp"]
    }
  }
}
```

`uvx` runs a PyPI package in an isolated env without a global install.
This is the best distribution method for stdio MCP servers.

### Option C: npm package (npx)

```json
{
  "mcpServers": {
    "my-warehouse": {
      "command": "npx",
      "args": ["-y", "@your-org/warehouse-mcp"]
    }
  }
}
```

Use this if your audience is JavaScript-first (Next.js developers, etc.)
and you want zero-setup via npx.

### Option D: Single binary (PyInstaller / Nuitka)

```bash
pip install pyinstaller
pyinstaller --onefile server.py --name my-warehouse-mcp
# distribute the binary, no Python runtime needed
```

Good for non-developer users who don't have Python installed.

### Option E: Hosted HTTP/SSE

Deploy to Railway, Fly.io, or Modal. Users point at your URL.

```bash
# Railway deploy
railway new
railway up
# Expose /sse endpoint; add URL to client mcp.json
```

---

## Common Gotchas

### 1. Tool descriptions matter more than tool names

The LLM decides which tool to call based on the description, not the name. A tool
named `query` with a vague description will be ignored. A tool named `q` with a
precise description will be called correctly.

```python
# BAD: vague description
@mcp.tool()
async def query(params: QueryInput) -> str:
    """Query data."""
    ...

# GOOD: specific trigger conditions
@mcp.tool()
async def search_customer_orders(params: OrderSearchInput) -> str:
    """
    Search customer orders by email, order ID, or date range.
    Use when the user asks about their orders, delivery status, or purchase history.
    Returns: order list with status, items, and estimated delivery dates.
    Do NOT use for product catalog searches — use search_products instead.
    """
    ...
```

**Rule:** Every tool description should include (1) what it does, (2) when to use it,
(3) what it returns, and optionally (4) when NOT to use it.

### 2. JSON Schema enforcement is strict

Your inputSchema must be valid JSON Schema Draft 7. Common mistakes:

```python
# BAD: missing required field specification
inputSchema = {
    "type": "object",
    "properties": {"query": {"type": "string"}},
    # forgot "required": ["query"] — LLM may not pass it
}

# BAD: loose types that cause downstream errors
inputSchema = {
    "properties": {"limit": {"type": "string"}},  # should be "integer"
}

# GOOD: explicit, constrained schema
inputSchema = {
    "type": "object",
    "properties": {
        "query": {"type": "string", "description": "Search query", "minLength": 1},
        "limit": {"type": "integer", "minimum": 1, "maximum": 100, "default": 10},
    },
    "required": ["query"],
    "additionalProperties": False,  # reject unexpected fields
}
```

With FastMCP, Pydantic handles this automatically — another reason to prefer it.

### 3. Error handling: return errors as text, don't raise

MCP tools should return errors as structured text, not Python exceptions.
An unhandled exception terminates the tool call in a way the LLM can't recover from.

```python
# BAD: raises exception
@mcp.tool()
async def fetch_user(params: UserInput) -> str:
    user = await db.get_user(params.user_id)
    return user.to_text()  # raises AttributeError if user is None

# GOOD: return error as text
@mcp.tool()
async def fetch_user(params: UserInput) -> str:
    try:
        user = await db.get_user(params.user_id)
        if user is None:
            return f"User {params.user_id} not found. Check the ID format (UUID)."
        return user.to_text()
    except Exception as e:
        return f"Error fetching user: {type(e).__name__}: {e}"
```

The LLM can read the error text and decide what to do next. A silent crash just
looks like the tool returned nothing.

### 4. Stdio servers can't use `print()`

In stdio transport, stdout is the MCP communication channel. Any `print()` to stdout
breaks the protocol. Use `sys.stderr` or a log file.

```python
import sys
import logging

# WRONG: breaks stdio
print("Server started")

# CORRECT: stderr or log file
logging.basicConfig(stream=sys.stderr, level=logging.INFO)
logging.info("Server started")
```

### 5. Blocking calls block the whole server

MCP servers are async. Any synchronous blocking call stalls all concurrent requests.

```python
# BAD: blocks the event loop
import time
@mcp.tool()
async def slow_tool(params) -> str:
    time.sleep(2)  # blocks everything
    return "done"

# GOOD: use asyncio.sleep or run blocking code in a thread
import asyncio
@mcp.tool()
async def slow_tool(params) -> str:
    await asyncio.sleep(2)  # yields event loop
    return "done"

# For truly blocking CPU work (e.g., subprocess):
import asyncio
@mcp.tool()
async def run_subprocess(params) -> str:
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, blocking_function, params.input)
    return result
```

---

## Three MCP Servers Worth Studying

### 1. `modelcontextprotocol/servers` — official reference implementations

The official repo contains reference implementations for: filesystem, Postgres,
GitHub, GitLab, Brave search, Puppeteer, Slack, and more. Before building a custom
server for any of these domains, read the reference implementation first.

```
https://github.com/modelcontextprotocol/servers
```

Study: `src/filesystem/` for a clean stdio server pattern, `src/postgres/` for
a DB-backed resource + tool pattern.

### 2. `lastmile-ai/mcp-agent` — MCP-native agent framework

Shows how to build an agent that uses multiple MCP servers as its tool layer.
Good for understanding the client-side of MCP: how tools are discovered, called,
and composed into an agentic loop.

```
https://github.com/lastmile-ai/mcp-agent
```

### 3. `anthropics/anthropic-mcp-quickstart` — official Python FastMCP demo

The cleanest example of FastMCP with resources, tools, and prompts in a single file.
Also shows how to deploy to Claude.ai (requires Anthropic partnership).

---

## Quick Checklist

```
Before shipping:
  [ ] Tool descriptions explain when to use AND what they return
  [ ] All inputSchema fields have descriptions
  [ ] All tools return errors as text (no unhandled exceptions)
  [ ] Tested every tool in MCP Inspector
  [ ] Stdio: no print() to stdout
  [ ] HTTP: auth middleware in place before deploying

Config snippets ready:
  [ ] Cursor mcp.json snippet tested locally
  [ ] Claude Code config tested locally
  [ ] README has install steps + config copy-paste

Distribution chosen:
  [ ] Stdio: uvx (PyPI) or direct path
  [ ] HTTP: deployed URL + API key instructions
```

---

## Related Warehouse Entries

- Check `templates/template-mcp-server/` for the full Python skeleton
- [langfuse] — add tracing to MCP tool calls to see latency per tool
- [pydantic-ai] — build agents that consume your MCP server
- [fastapi] — HTTP transport layer for hosted MCP servers
