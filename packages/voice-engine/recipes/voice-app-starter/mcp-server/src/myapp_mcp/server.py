"""Per-app MCP server. Rename, then add @mcp.tool() functions for any
action the voice agent should take in your app — query the DB, hit a
private API, update a CRM, anything.

Tool design rules (per ai-warehouse playbook):
  1. ONE action per tool. Don't combine "search and filter".
  2. Descriptive name + rich docstring — the LLM picks tools by name+desc.
  3. Typed parameters with Pydantic where useful.
  4. Idempotent reads. Write tools should be explicit ("book_meeting",
     not "process").
"""

from __future__ import annotations

import argparse

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("myapp")


# ── Example tools — replace with yours ──────────────────────────────


@mcp.tool()
def example_read_tool(query: str) -> dict:
    """One-line description the LLM will read.

    Args:
        query: What to look up.

    Returns:
        Dict the agent can summarise out loud.
    """
    # TODO: hit your DB / API / cache here.
    return {"query": query, "result": "placeholder — implement me"}


@mcp.tool()
def example_write_tool(name: str, value: str) -> bool:
    """Performs a write. Use a verb-noun name. Be explicit.

    Args:
        name: Identifier.
        value: New value.

    Returns:
        True on success.
    """
    # TODO: perform the actual write.
    return True


# ── Entry point ─────────────────────────────────────────────────────


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--http", action="store_true",
                   help="HTTP+SSE transport (default: stdio).")
    p.add_argument("--host", default="0.0.0.0")
    p.add_argument("--port", type=int, default=7801)
    args = p.parse_args()

    if args.http:
        mcp.settings.host = args.host
        mcp.settings.port = args.port
        mcp.run(transport="sse")
    else:
        mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
