# @nexural/voice-engine

> **One premium voice core. Infinite personas. Zero engine edits.**

A reusable LiveKit Agents-based voice runtime. To launch a new voice product
— coach, tutor, therapist, sales agent, support agent, interviewer, anything
— you write **one YAML file** and point the engine at it. The Python code
never changes.

Built for Nexural's "single-operator SaaS factory" — every forged app gets a
premium voice experience for free.

---

## Why this exists

Voice agents are 90% the same plumbing — WebRTC transport, STT, LLM, TTS,
VAD, turn detection, interruption handling, MCP tool wiring, memory. The 10%
that's different per app — voice ID, system prompt, tools, vibe — is the
"content layer." This engine treats that distinction physically:

| Layer                                                                   | Where it lives                   | Changes per app? |
| ----------------------------------------------------------------------- | -------------------------------- | ---------------- |
| Transport (WebRTC/SIP), VAD, turn detection, interruption, noise cancel | Engine code                      | Never            |
| Provider plumbing (Deepgram, Anthropic, Cartesia, etc.)                 | Engine code                      | Never            |
| MCP client wiring                                                       | Engine code                      | Never            |
| Memory persistence                                                      | Engine code                      | Never            |
| **Persona** (voice, prompt, providers, MCP server list, dynamics)       | `personas/*.yaml`                | **Per app**      |
| **Tools / app content**                                                 | MCP servers (separate processes) | **Per app**      |

Net result: a new voice product is **one YAML + one MCP server set + zero
engine code**.

---

## Architecture

```
                            ┌──────────────────────────────────┐
                            │   Browser / iOS / Android / RN   │
                            │     (LiveKit client SDKs)        │
                            └────────────────┬─────────────────┘
                                             │  WebRTC
                                             ▼
                              ┌──────────────────────────────┐
                              │       LiveKit Cloud / SIP    │
                              └───────────────┬──────────────┘
                                              │
                                              ▼
   ┌─────────────────────  voice_engine (this package) ───────────────────┐
   │                                                                      │
   │   PersonaConfig (YAML)  ──►  AgentSession                            │
   │                                ├─ Noise cancel (Krisp via plugin)    │
   │                                ├─ Silero VAD                         │
   │                                ├─ Turn-detector (multilingual)       │
   │                                ├─ STT  ◄── providers/stt.py          │
   │                                ├─ LLM  ◄── providers/llm.py          │
   │                                ├─ TTS  ◄── providers/tts.py          │
   │                                │   (or realtime model — S2S mode)    │
   │                                └─ MCP servers (per-app tools)        │
   │                                                                      │
   └──────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
                              ┌──────────────────────────────┐
                              │   App-specific MCP servers   │
                              │  (CRM, KB, curriculum, …)    │
                              └──────────────────────────────┘
```

---

## The premium default stack

These are the providers selected in the shipped personas. Swap any of them
in YAML — no code change.

| Slot           | Default                            | Why                                                      |
| -------------- | ---------------------------------- | -------------------------------------------------------- |
| Transport      | LiveKit Cloud                      | First-class clients on every platform; SIP for telephony |
| STT            | Deepgram Nova-3                    | Industry-best streaming latency (<300ms)                 |
| LLM            | Claude Haiku 4.5                   | Fast, MCP-native, premium quality                        |
| TTS            | Cartesia Sonic 3                   | ~90ms TTFA, lowest in the industry                       |
| Realtime (S2S) | OpenAI gpt-realtime                | Most natural prosody, semantic VAD, MCP-native           |
| Turn detector  | LiveKit multilingual turn-detector | 97% TNR, 14 languages                                    |
| VAD            | Silero                             | RTF 0.004 on CPU                                         |
| Noise cancel   | LiveKit BVC (Krisp)                | Server-side, before VAD                                  |
| Memory         | mem0                               | Drop-in persistent memory                                |
| Tools/content  | MCP                                | Per-app swap layer                                       |

Cascaded e2e latency: ~750ms. Realtime: ~300ms perceived. ~$0.04–0.15/min.

---

## Install

```bash
cd packages/voice-engine
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env
# Fill in LIVEKIT_*, ANTHROPIC_API_KEY, DEEPGRAM_API_KEY, CARTESIA_API_KEY, …
```

You only need keys for the providers your chosen personas reference.

---

## Run

```bash
# Validate a persona (no network):
nx-voice validate personas/voice_coach.yaml

# Start a worker for one persona (LiveKit dev mode):
nx-voice serve --persona personas/voice_coach.yaml -- dev

# Production:
nx-voice serve --persona personas/voice_coach.yaml -- start
```

Anything after `--` is forwarded to LiveKit's CLI (`dev`, `start`,
`download-files`, etc).

One worker = one persona. Run multiple workers (one per persona) on the
same machine or scale them independently in production.

---

## Build a new voice app in 60 seconds

1. **Copy a persona** that's closest to what you want:
   ```bash
   cp personas/tutor.yaml personas/my_chess_coach.yaml
   ```
2. **Edit** `name`, `system_prompt`, `greeting`, voice id, and optionally
   add MCP servers for any tools/content (e.g. a chess-engine MCP server).
3. **Validate**: `nx-voice validate personas/my_chess_coach.yaml`
4. **Run**: `nx-voice serve --persona personas/my_chess_coach.yaml -- dev`
5. **Connect** from any LiveKit client (see `examples/nextjs-client`).

That's the entire developer loop. Engine code is never touched.

---

## Shipped personas

| File                    | Mode         | Voice/TTS                          | Use case                                            |
| ----------------------- | ------------ | ---------------------------------- | --------------------------------------------------- |
| `voice_coach.yaml`      | cascaded     | Cartesia Sonic 3                   | Speech & delivery coaching with memory              |
| `tutor.yaml`            | cascaded     | Cartesia Sonic 3                   | Socratic 1:1 tutor for any subject                  |
| `therapist.yaml`        | **realtime** | OpenAI gpt-realtime (warm)         | Reflective companion — natural prosody matters most |
| `sales_agent.yaml`      | cascaded     | ElevenLabs Flash v2.5              | Inside sales SDR with CRM + calendar MCP            |
| `customer_support.yaml` | cascaded     | Cartesia Sonic 3                   | Tier-1 support with KB + ticketing MCP              |
| `interviewer.yaml`      | cascaded     | OpenAI gpt-4o-mini-tts (steerable) | Mock interviewer with structured debrief            |

Each YAML is the entire app definition. Read them to learn the schema.

---

## Browser client

`examples/nextjs-client/` is a drop-in Next.js 15 app that:

1. Mints a LiveKit access token server-side (`/api/token`).
2. Connects the browser to LiveKit and dispatches the chosen agent.
3. Renders a voice visualizer + control bar.

```bash
cd examples/nextjs-client
cp .env.example .env.local && fill in LIVEKIT_* keys
pnpm install && pnpm dev
# open http://localhost:3030, pick a persona, talk.
```

Reuse this client for every app you ship — change only the `agent` query
parameter to switch personas.

---

## Per-app tools & content (the swap layer)

The premium engine is content-agnostic. App-specific behaviour lives in
**MCP servers** declared in the persona:

```yaml
mcp_servers:
  - name: crm
    url: https://mcp.your-domain.com/crm
  - name: calendar
    url: https://mcp.your-domain.com/calendar
```

The LLM can call any tool exposed by these servers mid-conversation,
without blocking speech (LiveKit + OpenAI Realtime support async function
calls). Your voice coach, tutor, and sales agent all use the SAME engine —
they just point at different MCP servers and different prompts.

This is the same MCP federation pattern used elsewhere in nexural-meta;
voice apps inherit it for free.

---

## Memory across sessions

Set in any persona:

```yaml
memory:
  enabled: true
  user_id_strategy: participant_identity
```

On session start: relevant memories for that user are recalled (via mem0)
and appended to the system prompt. On session end: new memories are
extracted from the conversation. Requires `MEM0_API_KEY`.

---

## Tests

```bash
pytest tests/
```

Persona validation tests run without API keys or network.

---

## What's deliberately NOT in here

- **A web/admin UI for editing personas.** YAML in git is the source of
  truth; you can build a UI on top later if needed.
- **Eval/observability.** Wire in [Hamming](https://hamming.ai) or
  [Langfuse](https://langfuse.com/integrations/frameworks/livekit) when you
  productionise.
- **Telephony config.** It "just works" via LiveKit SIP — see
  [LiveKit docs](https://docs.livekit.io/telephony/). No code change here.
- **Provider-specific niceties.** Anything beyond the shared interface
  belongs in `providers/<name>.py`.

---

## Versioning

This package follows the same Changesets + 7-day soak rules as the rest of
`nexural-meta`. Persona YAML changes are versioned via the `version:` field
in each file — bump it when you change a prompt or stack.
