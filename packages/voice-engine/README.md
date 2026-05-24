# @nexural/voice-engine

> **The reusable voice ingredient for any Sage Ideas app.**
> Build it once. Drop it into 100 future apps. Pay $0.78/hr at launch;
> drop to $0.05/hr when you scale.

A premium voice runtime — LiveKit Agents + your providers + RAG +
guardrails — designed to be the voice layer of every product you ever
ship. Pick a tier (free → premium → self-hosted), drop in a persona
YAML + optional MCP servers, and your app has a production voice agent
in minutes.

## Quick start — add voice to ANY app

```bash
# 1. Copy the starter recipe
cp -r packages/voice-engine/recipes/voice-app-starter ../my-new-app
cd ../my-new-app
./make-app.sh chess-coach

# 2. Edit one YAML (prompt + greeting)
$EDITOR persona/agent.yaml

# 3. Optionally ingest knowledge for RAG
./ingest.sh ./docs

# 4. Run the worker + your Next.js app
nx-voice serve --persona persona/agent.yaml -- dev   # terminal 1
cd web && pnpm dev                                    # terminal 2

# Open http://localhost:3030. Talk.
```

Total time from `cp` to talking agent: **~5 minutes**.

## Why this works as a reusable ingredient

Voice agents are 90% the same plumbing — WebRTC transport, STT, LLM,
TTS, VAD, turn detection, interruption handling, MCP tool wiring,
memory, telemetry, cost capping, safety. The 10% that's different per
app — voice ID, system prompt, tools, vibe, knowledge base — is the
**content layer.** This engine treats that distinction physically:

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

## Tier presets — one-line cost/quality dial

Every persona extends a tier. Switching tiers is one line in the YAML —
no code changes, no provider swaps to manage.

| Tier                  | `extends:`                    |              $/hr | Use for                                               |
| --------------------- | ----------------------------- | ----------------: | ----------------------------------------------------- |
| 🆓 Free               | `_base/tier-free.yaml`        | $0 (free credits) | Prototyping, demos, MVPs                              |
| ⚖️ Balanced (default) | `_base/tier-balanced.yaml`    |             $0.78 | Most shipped products                                 |
| 🚀 Premium            | `_base/tier-premium.yaml`     |             $1.05 | First impression matters: sales, receptionist         |
| ⚡ Realtime           | `_base/tier-realtime.yaml`    |             $4.80 | Emotional prosody: therapist, meditation, storyteller |
| 🏠 Self-hosted        | `_base/tier-self-hosted.yaml` |             $0.05 | When your app crosses ~50 concurrent users            |

Migration path: start free → balanced as you launch → self-hosted at
scale. Each switch is one YAML line. Persona prompts, MCP servers, RAG
knowledge — everything else stays identical.

## RAG — give your agent app-specific knowledge

```bash
# In your app dir:
./ingest.sh ./my-docs       # ingests once
rag-mcp serve --http --port 7800   # serve at runtime
```

Then in the persona:

```yaml
mcp_servers:
  - name: knowledge
    url: http://localhost:7800/sse
```

The agent now has a `search_knowledge` tool and uses it for app-specific
questions. See [docs/RAG.md](./docs/RAG.md).

## Guardrails

- **Pluggable moderation** (OpenAI Moderation API) — pre-input + post-output
- **Jailbreak pattern detection** — instant + cheap, before LLM call
- **PII redaction** — emails/phones/cards/SSNs stripped before memory writes
- **Per-session cost cap** — auto-disconnect on runaway costs
- **Structured outputs** — typed Pydantic schemas (SBAR, debrief, lead, message)

All opt-in per persona via YAML. See `src/voice_engine/safety.py` +
`guardrails.py`.

## Orchestration (multi-persona)

Three layers on top of the engine:

1. **Persona registry** (`voice_engine.orchestration.PersonaRegistry`) —
   discovers every YAML in `personas/`. The CLI uses it for
   `nx-voice list`.
2. **Router persona** — auto-generated meta-persona that greets a caller,
   classifies intent in 1–2 turns, and hands off to the right specialist.
   Regenerate any time you add a persona:
   ```bash
   nx-voice generate-router --out personas/router.yaml
   ```
3. **Chat-Supervisor** — for any persona that opts in
   (`orchestration.supervisor.enabled: true`), the voice agent gets a
   `consult_supervisor(question)` function tool backed by Claude Sonnet
   4.6. Fast voice + slow brain, in parallel. Used by `code_reviewer`
   and `financial_advisor` out of the box.

Handoffs use LiveKit Agents 1.5's native pattern: the `handoff_to(name)`
function tool returns a new Agent instance and the session swaps it
seamlessly mid-call.

## Shipped personas

| File                     | Mode         | Voice/TTS                          | Use case                                                |
| ------------------------ | ------------ | ---------------------------------- | ------------------------------------------------------- |
| `router.yaml`            | cascaded     | Cartesia Sonic 3                   | **Front-door router** — picks the right specialist      |
| `voice_coach.yaml`       | cascaded     | Cartesia Sonic 3                   | Speech & delivery coaching with memory                  |
| `tutor.yaml`             | cascaded     | Cartesia Sonic 3                   | Socratic 1:1 tutor for any subject                      |
| `therapist.yaml`         | **realtime** | OpenAI gpt-realtime (warm)         | Reflective companion — natural prosody matters most     |
| `sales_agent.yaml`       | cascaded     | ElevenLabs Flash v2.5              | Inside sales SDR with CRM + calendar MCP                |
| `customer_support.yaml`  | cascaded     | Cartesia Sonic 3                   | Tier-1 support with KB + ticketing MCP                  |
| `interviewer.yaml`       | cascaded     | OpenAI gpt-4o-mini-tts (steerable) | Mock interviewer with structured debrief                |
| `language_coach.yaml`    | **realtime** | OpenAI gpt-realtime                | Conversational language practice (any language)         |
| `fitness_coach.yaml`     | cascaded     | Cartesia Sonic 3 (speed 1.05)      | Hands-free in-ear workout coach with RPE adaptation     |
| `meditation_guide.yaml`  | **realtime** | OpenAI gpt-realtime (slow, warm)   | Calm guided meditation with long pauses                 |
| `music_teacher.yaml`     | cascaded     | Cartesia Sonic 3                   | Instrument-agnostic 1:1 music tutor                     |
| `code_reviewer.yaml`     | cascaded     | OpenAI gpt-4o-mini-tts (steerable) | Senior-engineer voice code review + **supervisor**      |
| `medical_intake.yaml`    | cascaded     | Cartesia Sonic 3 (speed 0.95)      | HIPAA-conscious pre-visit triage with SBAR output       |
| `financial_advisor.yaml` | cascaded     | Cartesia Sonic 3                   | Personal-finance educator with **supervisor** math      |
| `receptionist.yaml`      | cascaded     | Cartesia Sonic 3                   | AI front-desk: booking, FAQ, messages (telephony-ready) |
| `storyteller.yaml`       | **realtime** | OpenAI gpt-realtime (expressive)   | Interactive kids' storyteller with safety guardrails    |

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
