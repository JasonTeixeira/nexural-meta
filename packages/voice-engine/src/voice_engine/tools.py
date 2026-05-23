"""MCP client wiring — THE swap layer.

Per-app tools and content live in MCP servers, not in the engine.
The same engine can serve a voice coach, a tutor, and a sales agent —
they differ only in which MCP servers their persona points to.
"""

from __future__ import annotations

import logging
from typing import Any

from livekit.agents import mcp

from voice_engine.config import MCPServerConfig

logger = logging.getLogger(__name__)


def build_mcp_servers(configs: list[MCPServerConfig]) -> list[Any]:
    """Convert persona MCP configs to LiveKit Agents MCP server instances.

    LiveKit's mcp module supports both remote (HTTP/SSE) and local (stdio).
    Each server exposes tools the LLM can call mid-conversation.
    """
    servers: list[Any] = []
    for c in configs:
        if c.url:
            logger.info("Registering MCP server '%s' at %s", c.name, c.url)
            servers.append(mcp.MCPServerHTTP(url=c.url))
        else:
            logger.info("Registering MCP server '%s' via stdio: %s", c.name, c.command)
            servers.append(
                mcp.MCPServerStdio(
                    command=c.command,
                    args=c.args,
                    env=c.env or None,
                )
            )
    return servers
