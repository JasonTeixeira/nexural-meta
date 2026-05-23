# Editor MCP setup — wire the federation into Cursor / Claude Desktop / Claude Code

After this is wired, your editor agent can query the whole federation any time without you typing `nx ask`. Two layers:

1. **`nx serve`** — long-running HTTP daemon on localhost:7345 (browser + curl + any HTTP client)
2. **MCP servers** — stdio-spawned per editor MCP config (warehouse-server per warehouse OR federation-server for the whole thing)

You can wire both. Most users want #2 (editor MCP) and use #1 occasionally for browser/curl.

---

## Quick start

```bash
# Install all 4 MCP server binaries
npm i -g @nexural/cli@latest                     # nx CLI
npm i -g @nexural/federation-server@latest       # whole-federation MCP
npm i -g @nexural/warehouse-server@latest        # per-warehouse MCP (optional)

pip install -e $AI_WAREHOUSE_ROOT                # ai-warehouse Python MCP
# nexural-qa-os + voice-engine: install per their READMEs (in active dev)

# Set the federation root once (so daemons + cli find it)
echo 'export NEXURAL_META_ROOT=/Users/Sage/code/nexural/nexural-meta' >> ~/.bash_profile
source ~/.bash_profile

# Run the HTTP daemon in a terminal tab (or auto-start via launchd — see below)
nx serve
# → http://127.0.0.1:7345
```

---

## The 4-server config (use this for every editor)

Replace `/Users/Sage/code/...` paths with your actual paths. The same JSON works in Cursor, Claude Desktop, Claude Code, and any other MCP-compatible client.

```json
{
  "mcpServers": {
    "nexural-federation": {
      "command": "nexural-federation-server",
      "args": ["--root", "/Users/Sage/code/nexural/nexural-meta"]
    },
    "ai-warehouse": {
      "command": "python",
      "args": ["/Users/Sage/code/sage-ideas/ai-warehouse/mcp-server/server.py"]
    },
    "nexural-qa-os": {
      "command": "nexural-qa-os-server",
      "args": ["--root", "/Users/Sage/code/sage-ideas/nexural-qa-os"]
    },
    "voice-engine": {
      "command": "voice-engine-server",
      "args": ["--root", "/Users/Sage/code/sage-ideas/voice-engine"]
    }
  }
}
```

After restart, your agent has these tools available across all 4 servers:

| Server               | Tools                                                                                                                              | Use when                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `nexural-federation` | `federation_ask`, `federation_list_sources`                                                                                        | "what's our pattern for X?" / "did we decide about Y?"     |
| `ai-warehouse`       | `search_warehouse`, `get_tool`, `compare_tools`, `recommend_stack`, `list_categories`, `list_stacks`, `get_decisions`, `inbox_add` | "which tool should I use for Z?" / "audit my stack"        |
| `nexural-qa-os`      | `qa_os_check`, `qa_os_scorecard`, `qa_os_list_runners`                                                                             | "is this app meeting our QA bar?"                          |
| `voice-engine`       | `voice_search`, `voice_tcpa_check`, `voice_redact`, `voice_persona_get`, `voice_persona_list`                                      | "add voice to my app" / "is this outbound call compliant?" |

## Editor-specific paths

| Editor                | Config path                                                       |
| --------------------- | ----------------------------------------------------------------- |
| **Cursor**            | `~/.cursor/mcp.json` (or Settings → MCP)                          |
| **Claude Desktop**    | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Claude Code (CLI)** | `~/.claude/mcp.json` (global) or `.claude/mcp.json` (per-project) |
| **Codex Cloud**       | No MCP support directly — see "Codex setup" section below         |

After saving the config, **restart the editor** so it re-reads MCP and spawns the servers.

## Codex setup (no MCP — relies on AGENTS.md)

Codex Cloud runs each task in a fresh container and clones the repo. It doesn't run local MCP servers. So for Codex:

1. Make sure **every repo has `AGENTS.md`** at the root (see `evidence/templates/repo-bootstrap/` for templates).
2. The AGENTS.md references `nexural-meta/docs/ECOSYSTEM.md`.
3. Codex reads AGENTS.md on session start → knows about the ecosystem → can clone other repos as needed for context.

For tasks that need cross-repo knowledge, instruct Codex explicitly: _"Before X, check the federation by cloning nexural-meta and reading docs/ECOSYSTEM.md + the relevant warehouses."_

## Claude.ai web setup (project knowledge)

For chats started in claude.ai (browser):

1. Create a project called **"Sage Ideas Ecosystem"** in claude.ai.
2. Upload these files as project knowledge:
   - `nexural-meta/docs/ECOSYSTEM.md`
   - `nexural-meta/CLAUDE.md`
   - `ai-warehouse/CLAUDE.md` (after templates applied)
   - `nexural-qa-os/CLAUDE.md` (after templates applied)
   - `voice-engine/CLAUDE.md` (after templates applied)
3. When starting a new chat, attach the project → instant ecosystem context.
4. Re-upload when major docs change (set a quarterly reminder).

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
