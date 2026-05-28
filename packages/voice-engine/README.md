<div align="center">

# 🎙️ Nexural Voice Engine

**The reusable voice ingredient for any application.**
Build it once. Drop it into 100 future apps. Pay $0.78/hr at launch; drop to $0.05/hr at scale.

[![tests](https://img.shields.io/badge/tests-79%20passing-brightgreen)]()
[![license](https://img.shields.io/badge/license-MIT-blue)]()
[![python](https://img.shields.io/badge/python-3.11%2B-blue)]()
[![livekit](https://img.shields.io/badge/livekit--agents-1.5.12-orange)]()

[Quick start](#-quick-start) · [Tier presets](#-tier-presets--one-line-costquality-dial) · [Architecture](#-architecture) · [Personas](#-26-shipped-personas) · [Docs](./docs/)

</div>

---

## What this is

A production-grade voice runtime designed to be the voice layer of every product you ship. Pick a tier (free → premium → self-hosted), drop in a persona YAML + optional MCP servers + optional RAG knowledge, and your app has a production voice agent in minutes.

Built on **LiveKit Agents 1.5** with first-class clients for web, iOS, Android, React Native, Flutter, and Unity. Provider-agnostic — every component (STT, LLM, TTS, realtime) swaps via one YAML field.

## Why this works as a reusable ingredient

Voice agents are 90% the same plumbing — WebRTC transport, STT, LLM, TTS, VAD, turn detection, interruption handling, MCP tool wiring, memory, telemetry, cost capping, safety, guardrails. The 10% that's different per app — voice ID, system prompt, tools, vibe, knowledge base — is the **content layer.** This engine treats that distinction physically:

| Layer                                                                    | Where it lives                   | Changes per app? |
| ------------------------------------------------------------------------ | -------------------------------- | ---------------- |
| Transport (WebRTC/SIP), VAD, turn detection, interruption, noise cancel  | Engine code                      | **Never**        |
| Provider plumbing (Deepgram, OpenAI, Anthropic, Cartesia, ElevenLabs, …) | Engine code                      | **Never**        |
| MCP client wiring                                                        | Engine code                      | **Never**        |
| Memory persistence + PII redaction                                       | Engine code                      | **Never**        |
| Cost capping, telemetry, eval harness                                    | Engine code                      | **Never**        |
| **Persona** (voice, prompt, providers, tier, tools, dynamics)            | `personas/*.yaml`                | **Per app**      |
| **Tools / app content**                                                  | MCP servers (separate processes) | **Per app**      |
| **Knowledge**                                                            | RAG MCP server (per app)         | **Per app**      |

Net result: a new voice product is **one YAML + (optionally) one MCP server set + (optionally) one knowledge ingest** = zero engine code changes.

---

## 🚀 Quick start

### Add voice to ANY app in 5 minutes

```bash
# 1. Copy the starter recipe into your new app
cp -r recipes/voice-app-starter ../my-new-app
cd ../my-new-app
./make-app.sh chess-coach           # renames slugs

# 2. Edit the persona (prompt + greeting)
$EDITOR persona/agent.yaml

# 3. (Optional) Ingest your knowledge for RAG
./ingest.sh ./my-docs

# 4. Run the worker + your Next.js app
nx-voice serve --persona persona/agent.yaml -- dev    # terminal 1
cd web && pnpm dev                                     # terminal 2

# 5. Open http://localhost:3030 and talk
```

### Install the engine itself

```bash
cd packages/voice-engine
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env
# Fill in: LIVEKIT_*, OPENAI_API_KEY, DEEPGRAM_API_KEY (minimum)
nx-voice doctor                     # green-light readiness check
nx-voice serve --persona personas/voice_coach.yaml -- dev
```

---

## 🎚️ Tier presets — one-line cost/quality dial

Every persona extends a tier. Switching is one line in YAML — no code changes, no provider swaps to manage.

| Tier                    | `extends:`                    |                       $/hr | Use for                                                 |
| ----------------------- | ----------------------------- | -------------------------: | ------------------------------------------------------- |
| 🆓 Free                 | `_base/tier-free.yaml`        | $0 (free credits, ~250 hr) | Prototyping, demos, MVPs                                |
| ⚖️ Balanced _(default)_ | `_base/tier-balanced.yaml`    |                      $0.78 | Most shipped products                                   |
| 🚀 Premium              | `_base/tier-premium.yaml`     |                      $1.05 | First impression matters — sales, receptionist, fitness |
| ⚡ Realtime             | `_base/tier-realtime.yaml`    |                      $4.80 | Emotional prosody — therapist, meditation, storyteller  |
| 🏠 Self-hosted          | `_base/tier-self-hosted.yaml` |                      $0.05 | When your app crosses ~50 concurrent users              |

**Migration path:** start free → balanced as you launch → self-hosted at scale. Each switch is one YAML line. Persona prompts, MCP servers, RAG knowledge — everything else stays identical.

**Cost shape at scale (50K monthly active users, ~5% concurrent):**

| Stage                          | Per concurrent user/hr |        Monthly |
| ------------------------------ | ---------------------: | -------------: |
| Cloud APIs (balanced tier)     |                  $0.78 |         ~$1.4M |
| Self-hosted (tier-self-hosted) |                  $0.05 |          ~$45K |
| **Savings at 50K users**       |                        | **~$1.35M/mo** |

---

## 🏗️ Architecture

```
                    ┌──────────────────────────────────┐
                    │  Browser · iOS · Android · RN    │
                    │     (LiveKit client SDKs)        │
                    └────────────────┬─────────────────┘
                                     │ WebRTC
                                     ▼
                      ┌──────────────────────────────┐
                      │   LiveKit Cloud / SIP         │
                      │   (or self-hosted server)     │
                      └───────────────┬───────────────┘
                                      │
   ┌─────────────  voice_engine (this package) ───────────────────────┐
   │                                                                   │
   │   PersonaConfig (YAML)  ─►  AgentSession                          │
   │                              ├─ Noise cancel (Krisp via plugin)   │
   │                              ├─ Silero VAD                        │
   │                              ├─ Turn-detector (optional)          │
   │                              ├─ STT  ◄── providers/stt.py         │
   │                              ├─ LLM  ◄── providers/llm.py         │
   │                              ├─ TTS  ◄── providers/tts.py         │
   │                              │    (or realtime model — S2S mode)  │
   │                              ├─ MCP servers (per-app tools)       │
   │                              ├─ Memory (mem0, PII-redacted)       │
   │                              ├─ Guardrails (jailbreak + safety)   │
   │                              ├─ Cost cap watcher                  │
   │                              └─ Telemetry (SQLite + JSONL)        │
   │                                                                   │
   └─────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   App-specific MCP servers   │
                  │  RAG · CRM · Calendar · KB   │
                  └──────────────────────────────┘
```

---

## 📦 What's in the box

```
voice-engine/
├── src/voice_engine/         ── the engine (never edited per app)
│   ├── agent.py              · orchestrator
│   ├── config.py             · persona schema (Pydantic, validated)
│   ├── inheritance.py        · `extends:` deep merge
│   ├── memory.py             · mem0 + auto PII redaction
│   ├── telemetry.py          · SQLite + JSONL per-turn metrics
│   ├── cost_cap.py           · per-session $ guardrail
│   ├── safety.py             · pluggable moderation (OpenAI)
│   ├── guardrails.py         · jailbreak detect + PII redact
│   ├── outputs.py            · typed deliverable schemas
│   ├── doctor.py             · pre-flight readiness check
│   ├── tools.py              · MCP client wiring
│   ├── server.py             · `nx-voice` CLI (7 commands)
│   ├── orchestration/        · registry + router + supervisor
│   ├── providers/            · STT / LLM / TTS / Realtime factories
│   └── eval/                 · scenario runner + LLM judge
│
├── personas/                 ── the swap layer (one file per app)
│   ├── _base/                · 5 tier presets + cascaded/realtime bases
│   ├── voice_coach.yaml      · 26 production-ready specialists
│   ├── router.yaml           · auto-generated front-door
│   └── *.scenarios.yaml      · eval scenarios per persona
│
├── mcp-servers/              ── per-app tool surfaces
│   ├── calendar/             · reference: booking + slot search
│   └── rag/                  · reference: knowledge retrieval (sqlite-vec)
│
├── recipes/                  ── drop-in templates
│   ├── voice-app-starter/    · `cp -r` + make-app.sh → working app in 5 min
│   └── self-hosted/          · docker-compose for scale-down-cost
│
├── clients/                  ── client SDKs (in addition to React kit)
│   ├── ios/                  · Swift Package
│   └── react-native/         · npm package
│
├── docs/
│   ├── adr/                  · 5 Architecture Decision Records
│   ├── RAG.md                · RAG playbook
│   ├── MCP_SERVERS.md        · per-app tool design rules
│   ├── COST_OPTIMIZATION.md  · scaling playbook
│   ├── TELEPHONY.md          · phone-number setup (Telnyx + LiveKit SIP)
│   ├── VOICE_CLONING.md      · clone your brand voice
│   ├── EVAL.md               · scenario regression testing
│   ├── TROUBLESHOOTING.md    · symptom → cause → fix
│   └── GLOSSARY.md           · plain definitions
│
├── tests/                    ── 79 tests, no API keys needed
├── examples/nextjs-client/   ── working browser demo
├── Dockerfile                ── production container (persona via env)
├── fly.toml.example          ── Fly.io deploy template
├── DEPLOY.md                 ── one-command production deploy
├── RUNBOOK.md                ── 10-minute live-test guide
├── SETUP.md                  ── per-persona key matrix
├── ROADMAP.md                ── what's next
├── WORLD_CLASS_GAPS.md       ── honest "what's still missing"
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE                   ── MIT
```

---

## 🛠️ CLI — `nx-voice`

```bash
nx-voice doctor                                    # readiness check (keys, plugins, personas)
nx-voice list                                      # list all personas
nx-voice validate personas/X.yaml                  # validate YAML without running
nx-voice init <name> --base cascaded|realtime      # scaffold a new persona
nx-voice generate-router --out personas/router.yaml # regenerate router from registry
nx-voice eval personas/X.scenarios.yaml            # run regression scenarios
nx-voice serve --persona personas/X.yaml -- dev    # start a worker
```

---

## 🎭 26 shipped personas

| Persona                | Mode     | Use case                                     |
| ---------------------- | -------- | -------------------------------------------- |
| `router`               | cascaded | Front-door — picks the right specialist      |
| `voice_coach`          | cascaded | Speech & delivery coaching with memory       |
| `tutor`                | cascaded | Socratic 1:1 tutor for any subject           |
| `therapist`            | realtime | Reflective companion — natural prosody       |
| `sales_agent`          | cascaded | Inside sales SDR with CRM + calendar MCP     |
| `customer_support`     | cascaded | Tier-1 support with KB + ticketing MCP       |
| `interviewer`          | cascaded | Mock interviewer with structured debrief     |
| `language_coach`       | realtime | Conversational language practice             |
| `fitness_coach`        | cascaded | Hands-free workout coach with RPE adaptation |
| `meditation_guide`     | realtime | Calm guided meditation, long pauses          |
| `music_teacher`        | cascaded | Instrument-agnostic 1:1 music tutor          |
| `code_reviewer`        | cascaded | Voice code review + Claude Sonnet supervisor |
| `medical_intake`       | cascaded | HIPAA-conscious triage with SBAR output      |
| `financial_advisor`    | cascaded | Personal-finance educator + supervisor       |
| `receptionist`         | cascaded | AI front-desk: booking, FAQ, messages        |
| `storyteller`          | realtime | Kids' interactive storyteller with safety on |
| `legal_intake`         | cascaded | Pre-consult legal intake                     |
| `recruiter_screen`     | cascaded | 15-min phone screen                          |
| `journalist_interview` | cascaded | Practice interviewer (soft/neutral/hostile)  |
| `debate_partner`       | cascaded | Steelman debate partner                      |
| `news_anchor`          | realtime | Daily briefing reader                        |
| `audiobook_narrator`   | realtime | Expressive narration with character voices   |
| `journaling_coach`     | realtime | Reflective journaling companion              |
| `sleep_coach`          | realtime | Bedtime wind-down companion                  |
| `study_buddy`          | cascaded | Pomodoro + on-demand explainer               |
| `real_estate_agent`    | cascaded | Buyer's agent + calendar booking             |

Each YAML is the entire app definition. Read them to learn the schema.

---

## 🧪 Tests

```bash
pytest tests/                              # 67 engine tests
pytest mcp-servers/calendar/tests/         # 6 reference MCP tests
pytest mcp-servers/rag/tests/              # 6 RAG MCP tests
# Total: 79 tests, all passing, zero API keys required
```

---

## 🛡️ Guardrails

- **Pluggable moderation** — OpenAI Moderation API, pre-input + post-output, per-persona opt-in
- **Jailbreak pattern detection** — regex + heuristic, runs before the LLM call (cheap, sync)
- **PII redaction** — emails, phones, credit cards, SSNs stripped before memory writes
- **Per-session $ cap** — auto-disconnect on runaway costs (e.g. broken supervisor loop)
- **Structured outputs** — typed Pydantic schemas (SBAR, debrief, lead, message) enforce shape
- **Recording config per persona** — transcript/audio/telemetry switches; sensitive personas (medical, financial) default to no-transcript

See `src/voice_engine/safety.py` + `guardrails.py`.

---

## 🧠 RAG — give your agent app-specific knowledge

```bash
cd mcp-servers/rag
pip install -e .
rag-mcp ingest-dir ./my-docs               # one-time ingest
rag-mcp serve --http --port 7800           # runtime
```

In the persona YAML:

```yaml
mcp_servers:
  - name: knowledge
    url: http://localhost:7800/sse
```

The agent gets a `search_knowledge` tool. See [docs/RAG.md](./docs/RAG.md).

---

## 🚢 Deploy

```bash
# Per persona, one Fly.io app:
cp fly.toml.example fly.voice-coach.toml
fly apps create my-voice-coach
fly volumes create voice_data --size 1
fly secrets set LIVEKIT_URL=... OPENAI_API_KEY=... DEEPGRAM_API_KEY=...
fly deploy --config fly.voice-coach.toml
```

See [DEPLOY.md](./DEPLOY.md) for the full walkthrough including scaling, multi-region, and rollback.

---

## 📚 Documentation

- [SETUP.md](./SETUP.md) — per-persona API key matrix + acquisition links
- [RUNBOOK.md](./RUNBOOK.md) — 10-minute live test guide
- [DEPLOY.md](./DEPLOY.md) — production deployment recipe
- [ROADMAP.md](./ROADMAP.md) — what's next
- [WORLD_CLASS_GAPS.md](./WORLD_CLASS_GAPS.md) — honest gap analysis
- [docs/RAG.md](./docs/RAG.md) — give your agent knowledge
- [docs/MCP_SERVERS.md](./docs/MCP_SERVERS.md) — build per-app tool surfaces
- [docs/COST_OPTIMIZATION.md](./docs/COST_OPTIMIZATION.md) — keep cost low at scale
- [docs/TELEPHONY.md](./docs/TELEPHONY.md) — phone numbers via SIP
- [docs/VOICE_CLONING.md](./docs/VOICE_CLONING.md) — your brand voice everywhere
- [docs/EVAL.md](./docs/EVAL.md) — regression test your personas
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) — symptom → cause → fix
- [docs/GLOSSARY.md](./docs/GLOSSARY.md) — plain definitions
- [docs/adr/](./docs/adr/) — 5 Architecture Decision Records

---

## 🙏 Credits

Built on the work of the open-source voice AI ecosystem:

- [LiveKit Agents](https://github.com/livekit/agents) — runtime framework (Apache 2.0)
- [Silero VAD](https://github.com/snakers4/silero-vad) — voice activity detection (MIT)
- Knowledge & patterns distilled from [ai-warehouse](https://github.com/JasonTeixeira/ai-warehouse) by Jason Teixeira (MIT code, CC BY-SA 4.0 content)

Default provider stack: OpenAI, Anthropic, Deepgram, Cartesia, ElevenLabs, mem0, LiveKit.

---

## 📄 License

MIT. See [LICENSE](./LICENSE).
