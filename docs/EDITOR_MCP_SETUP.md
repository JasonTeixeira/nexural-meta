# Editor MCP setup — wire the federation into Cursor / Claude Desktop / Claude Code

After this is wired, your editor agent can query the whole federation any time without you typing `nx ask`. Two layers:

1. **`nx serve`** — long-running HTTP daemon on localhost:7345 (browser + curl + any HTTP client)
2. **MCP servers** — stdio-spawned per editor MCP config (warehouse-server per warehouse OR federation-server for the whole thing)

You can wire both. Most users want #2 (editor MCP) and use #1 occasionally for browser/curl.

---

## Quick start

```bash
# Install once
npm i -g @nexural/cli@latest
npm i -g @nexural/federation-server@latest    # pending: token rotation per evidence/operational/sage-blockers.md
npm i -g @nexural/warehouse-server@latest

# Set the federation root once (so daemons + cli find it)
echo 'export NEXURAL_META_ROOT=/Users/Sage/code/nexural/nexural-meta' >> ~/.bash_profile
source ~/.bash_profile

# Run the HTTP daemon in a terminal tab (or auto-start via launchd — see below)
nx serve
# → http://127.0.0.1:7345
```

---

## Cursor MCP config

Path: `~/.cursor/mcp.json` (or via Cursor Settings → MCP).

```json
{
  "mcpServers": {
    "nexural-federation": {
      "command": "nexural-federation-server",
      "args": ["--root", "/Users/Sage/code/nexural/nexural-meta"]
    },
    "nexural-warehouse-architecture": {
      "command": "nexural-warehouse-server",
      "args": ["--root", "/Users/Sage/code/nexural/nexural-meta/warehouses/architecture"]
    }
  }
}
```

Restart Cursor. Agent will see `federation_ask`, `federation_list_sources`, and the per-warehouse `warehouse_*` tools.

## Claude Desktop MCP config

Path: `~/Library/Application Support/Claude/claude_desktop_config.json`.

```json
{
  "mcpServers": {
    "nexural-federation": {
      "command": "nexural-federation-server",
      "args": ["--root", "/Users/Sage/code/nexural/nexural-meta"]
    }
  }
}
```

Restart Claude Desktop.

## Claude Code MCP config

Path: `~/.claude/mcp.json` (or per-project `.claude/mcp.json`).

```json
{
  "mcpServers": {
    "nexural-federation": {
      "command": "nexural-federation-server",
      "args": ["--root", "/Users/Sage/code/nexural/nexural-meta"]
    }
  }
}
```

---

## Auto-start `nx serve` at login (macOS, launchd)

Save this as `~/Library/LaunchAgents/com.sageideas.nexural.serve.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.sageideas.nexural.serve</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/nx</string>
    <string>serve</string>
    <string>--port</string>
    <string>7345</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>NEXURAL_META_ROOT</key>
    <string>/Users/Sage/code/nexural/nexural-meta</string>
    <key>PATH</key>
    <string>/usr/local/bin:/usr/bin:/bin</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/nexural-serve.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/nexural-serve.log</string>
</dict>
</plist>
```

Then:

```bash
# Verify path of nx binary first (it may not be /usr/local/bin/nx)
which nx
# Edit the plist to match if needed.

launchctl load -w ~/Library/LaunchAgents/com.sageideas.nexural.serve.plist

# Verify
curl -s http://127.0.0.1:7345/api/health | jq .

# Logs
tail -f /tmp/nexural-serve.log

# Stop / restart
launchctl unload ~/Library/LaunchAgents/com.sageideas.nexural.serve.plist
launchctl load -w ~/Library/LaunchAgents/com.sageideas.nexural.serve.plist
```

After this, the federation auto-starts at login, survives crashes (KeepAlive), and is always reachable at `http://127.0.0.1:7345`.

---

## Verify everything works

```bash
# HTTP daemon
curl http://127.0.0.1:7345/api/health
curl 'http://127.0.0.1:7345/api/ask?q=tenant%20isolation'

# In your editor: open a project and ask the agent
# "search the federation for what we've decided about cost discipline"
# Agent should call federation_ask + return ranked answers.
```

If the agent doesn't see the tools after restart:

- Confirm `which nexural-federation-server` returns a path
- Check editor's MCP logs (Cursor: View → Output → MCP)
- Verify `NEXURAL_META_ROOT` is exported in the env the editor runs in (GUI apps on macOS don't always inherit shell env — pass `--root` explicitly in the args array)

---

## Two parallel surfaces, one knowledge base

```
                        ┌── nx serve (HTTP daemon, port 7345) ─── you, curl, browser
                       │
   ~/code/nexural/    ─┤
   nexural-meta       │
                       └── federation-server (MCP stdio) ─── editor agent
```

Both share the same `@nexural/ask-engine` FTS5 index. Indexing is fast (~10ms) so each process keeps its own; no coordination needed.

---

## Stop using it that way

If MCP wiring causes any editor friction:

```bash
# Disable launchd
launchctl unload ~/Library/LaunchAgents/com.sageideas.nexural.serve.plist
rm ~/Library/LaunchAgents/com.sageideas.nexural.serve.plist

# Remove from editor MCP config (delete the nexural-* entries from the JSON)
# Restart the editor.

# nx ask + nx forge still work as CLI tools, regardless.
```

The federation degrades gracefully: even with zero MCP wiring + no daemon, `nx ask` from the terminal is still useful.
