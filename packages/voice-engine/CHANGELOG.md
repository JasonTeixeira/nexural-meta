# Changelog

All notable changes to this package. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [SemVer](https://semver.org/).

## [Unreleased]

## [0.5.0] — 2026-05-24 — "Reusable voice ingredient"

### Added
- **5 tier-preset base personas** (`_base/tier-{free,balanced,premium,realtime,self-hosted}.yaml`). Switch tier with one `extends:` line.
- **RAG MCP server** (`mcp-servers/rag/`) — SQLite-vec + OpenAI embeddings. CLI: `rag-mcp ingest-dir ./docs && rag-mcp serve`. 6 tests passing.
- **Guardrails layer** (`src/voice_engine/guardrails.py`) — jailbreak pattern detection, PII redaction (email/phone/CC/SSN). Wired into `memory.add()` so PII never persists.
- **Voice-app-starter recipe** (`recipes/voice-app-starter/`) — `cp -r` + `./make-app.sh` + edit YAML = shippable voice app in 5 minutes.
- **Self-hosted Docker stack** (`recipes/self-hosted/docker-compose.yml`) — LiveKit Server + Ollama + Kokoro + Whisper + Qdrant. Break-even at ~50 concurrent users.
- **Three new docs** (distilled from ai-warehouse, CC BY-SA attributed): `docs/RAG.md`, `docs/MCP_SERVERS.md`, `docs/COST_OPTIMIZATION.md`.

### Changed
- README rewritten as single coherent reference doc.
- Default cascaded base persona uses OpenAI gpt-4o-mini (no Anthropic key required out of the box).
- Voice_coach polished: gpt-4o-mini-tts with steerable `instructions`, tighter timing (0.3s endpointing), shorter responses (220 max tokens).

### Fixed
- mem0 v2 API compatibility (`filters={"user_id": ...}` instead of top-level kwarg).
- `_worker_entrypoint` now module-level so multiprocessing.spawn can pickle it.
- Turn-detector defaults to off (LK 1.5 doesn't auto-wire its inference proc); plain VAD endpointing reliable instead.
- Doctor command correctly infers supervisor provider from model name.

## [0.4.0] — Phases 2-4 — "Production-ready"

### Added
- **Persona inheritance** via `extends:`. Deep-merge for dicts; child wins for lists/scalars. Cuts persona duplication ~70%.
- **Provider fallback chains** — STT/LLM/TTS accept `fallbacks: [...]`. Wrapped in LiveKit `FallbackAdapter`.
- **Per-session $ cap** (`src/voice_engine/cost_cap.py`) with graceful auto-disconnect.
- **Pluggable safety/moderation** (OpenAI Moderation API). Enabled on `storyteller` for kids.
- **Structured outputs** — 4 Pydantic schemas (SBAR, interview_debrief, qualified_lead, call_message). Engine auto-exposes `submit_output()` function tool.
- **Multi-stage Dockerfile** + `fly.toml.example` + `DEPLOY.md` for one-command Fly deploys.
- **`@nexural/voice-engine-client-react`** — Next.js/React drop-in package (`<VoiceProvider>`, `useVoice()`, `<ConnectButton>`).
- **iOS Swift Package** wrapping LiveKit Swift SDK.
- **React Native module** wrapping LiveKit RN.
- **`nx-voice init <name>`** — scaffold a new persona in 5 seconds.
- **Memory namespacing** via `memory.app_id` — different products never see each other's mem0 entries.
- **10 new personas** (16 → 26): legal_intake, recruiter_screen, journalist_interview, debate_partner, news_anchor, audiobook_narrator, journaling_coach, sleep_coach, study_buddy, real_estate_agent.
- **Eval harness** (`src/voice_engine/eval/`) — scenario YAML schema, text-mode runner against persona LLM, programmatic + LLM-as-judge assertions. `nx-voice eval` exits non-zero on failure for CI.
- **5 ADRs** capturing big architectural decisions.
- **Operational docs**: Glossary, Troubleshooting, Telephony (Telnyx + LiveKit SIP), Voice-cloning, Eval guide.

## [0.3.0] — Phase 1 — "Orchestration, telemetry, doctor"

### Added
- **`nx-voice doctor`** — pre-flight readiness check (LiveKit env, token mint, plugin imports, per-persona key matrix).
- **Telemetry** (`src/voice_engine/telemetry.py`) — SQLite + JSONL per-turn TTFT/TTFA/EOU/tokens/cost estimator. Auto-wires into every session.
- **Recording config per persona** — transcript/audio/telemetry switches. Medical + financial default to no-transcript.
- **Orchestration layer** — PersonaRegistry (auto-discovers YAMLs), Router (front-door meta-persona), Supervisor (Chat-Supervisor pattern with Claude Sonnet 4.6 or GPT-4o).
- **Function tools** dynamically wired per persona: `consult_supervisor`, `handoff_to`.
- **10 new personas** (6 → 16): language_coach, fitness_coach, meditation_guide, music_teacher, code_reviewer, medical_intake, financial_advisor, receptionist, storyteller (+ auto-generated router).

### Changed
- All LiveKit plugin versions pinned exactly to 1.5.12 to prevent API drift.

## [0.1.0] — Initial release — "The engine works"

### Added
- LiveKit Agents 1.5 runtime with provider-agnostic STT/LLM/TTS/Realtime factories.
- 16 production-grade personas across coaching, learning, support, sales, healthcare, finance, hospitality.
- MCP client wiring for per-app tool surfaces.
- mem0-backed cross-session memory.
- Pydantic-validated persona YAML schema.
- `nx-voice` CLI with validate/serve commands.
- Next.js browser client example.
- 25 schema/wiring tests passing.
