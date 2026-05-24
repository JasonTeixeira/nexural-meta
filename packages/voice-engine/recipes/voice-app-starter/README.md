# Voice App Starter Recipe

A complete template you copy into a new Sage app to add a voice agent.
Five minutes from `cp -r` to working voice in your product.

## What's in here

```
voice-app-starter/
├── persona/
│   └── agent.yaml              ← edit prompt + voice for this app
├── mcp-server/                 ← optional: app-specific tools
│   ├── pyproject.toml
│   └── src/myapp_mcp/server.py ← rename + add tools
├── web/                        ← Next.js client (drop into your app)
│   └── app/
│       ├── page.tsx
│       └── api/voice/token/route.ts
├── ingest.sh                   ← script: ingest your docs into RAG
└── make-app.sh                 ← script: scaffold + rename for a new app
```

## Step 1 — Copy + rename

```bash
cp -r packages/voice-engine/recipes/voice-app-starter ../my-new-app
cd ../my-new-app
./make-app.sh chess-coach       # renames everything to your app
```

## Step 2 — Edit the persona

Open `persona/agent.yaml`. Three things to change:

```yaml
name: chess_coach
description: |
  What this app does — one sentence.
system_prompt: |
  You are <role>. Your job is <X>. Speak naturally...
greeting: |
  What this agent says when the call starts.
```

Everything else is inherited from the tier preset (default: balanced,
~$0.78/hr). Change tier in one line:

```yaml
extends: ../../packages/voice-engine/personas/_base/tier-premium.yaml
# Options: tier-free, tier-balanced, tier-premium, tier-realtime, tier-self-hosted
```

## Step 3 — (Optional) Ingest knowledge for RAG

```bash
./ingest.sh ./my-knowledge-docs    # any folder of .md/.txt/.html files
```

The agent now has `search_knowledge(query)` and will use it for app-
specific questions.

## Step 4 — (Optional) Add custom tools via the MCP server

Edit `mcp-server/src/myapp_mcp/server.py`. Add `@mcp.tool()` functions for
any action you want the agent to take in your app (book appointments,
update CRM, query DB, etc.). The pattern is in `mcp-servers/calendar/`
as a worked example.

## Step 5 — Run everything

```bash
# Terminal 1 — RAG server (if using):
cd ../../packages/voice-engine/mcp-servers/rag
rag-mcp serve --http --port 7800

# Terminal 2 — your MCP server (if using):
cd mcp-server
pip install -e . && myapp-mcp --http --port 7801

# Terminal 3 — voice agent worker:
cd ../my-new-app
nx-voice serve --persona persona/agent.yaml -- dev

# Terminal 4 — your Next.js app:
cd web
pnpm install && pnpm dev
```

Browser at http://localhost:3030 → Connect → talk.

## Step 6 — Deploy

```bash
# Voice agent worker:
fly deploy --config fly.toml

# Web app:
vercel deploy

# Or both together if you're using the next-forge monorepo pattern.
```

## What you get out of the box

- ✅ Voice agent runtime (LiveKit Agents + your provider keys)
- ✅ Tier-preset cost/quality stack — change one line
- ✅ Persona inheritance — keeps app YAML minimal
- ✅ RAG ready-to-wire — drop in your docs
- ✅ MCP server template for app-specific tools
- ✅ Telemetry + cost tracking
- ✅ Safety/moderation hooks
- ✅ Browser + mobile client patterns
- ✅ Deploys to Fly.io in one command

## Build the next app the same way

```bash
cp -r ./my-new-app ../my-other-app
cd ../my-other-app
./make-app.sh receptionist
# edit persona/agent.yaml + (optionally) add MCP tools + ingest knowledge
```

Same engine. Same providers. Same client. Different app.
