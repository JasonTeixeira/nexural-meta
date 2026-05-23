# Glossary

Plain definitions for terms that show up in this package.

| Term                             | Meaning                                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Agent**                        | A LiveKit `Agent` subclass instance — the runtime object that owns a session's conversation. Created per call.                    |
| **AgentSession**                 | LiveKit's runtime container — wires VAD, STT, LLM, TTS, turn detection, MCP, noise cancellation around an `Agent`.                |
| **Cascaded mode**                | STT → LLM → TTS pipeline. Default for most personas. Lower cost, debuggable, swappable.                                           |
| **EOU / End-of-utterance delay** | Time between the user stopping speech and the semantic turn detector firing. Telemetry tracks it as `eou_delay_ms`.               |
| **Function tool**                | A method on an `Agent` subclass marked with `@function_tool`. Visible to the LLM as a callable.                                   |
| **Handoff**                      | Mid-call swap from one persona to another. Implemented by `handoff_to(persona_name)` returning a new `Agent` instance.            |
| **MCP**                          | Model Context Protocol. The wire format we use for per-app tool surfaces. Each persona lists servers; tools appear automatically. |
| **Mode**                         | `cascaded` or `realtime`. Determines whether STT/LLM/TTS are separate plugins or one end-to-end S2S model.                        |
| **Persona**                      | A YAML file in `personas/` that fully defines one voice app — prompt, voice, providers, tools, dynamics. The "swap layer."        |
| **Persona inheritance**          | `extends: _base/<mode>.yaml` — pulls defaults from a base. Deep-merges nested dicts; child wins.                                  |
| **Realtime mode**                | End-to-end speech-to-speech model (gpt-realtime, Gemini Live). Lower latency, vendor-locked, costlier.                            |
| **Recording config**             | Per-persona switches for transcript / audio / telemetry persistence. Sensitive personas (medical, finance) disable transcript.    |
| **Router**                       | Auto-generated meta-persona that greets the caller and uses `handoff_to` to route to the right specialist.                        |
| **Session**                      | One LiveKit room = one session. Has a unique `session_id` in telemetry.                                                           |
| **SIP**                          | Telephony protocol. LiveKit Cloud bridges SIP ↔ WebRTC so the same agent answers phone calls.                                     |
| **Supervisor**                   | Heavier LLM (Claude Sonnet 4.6) the voice persona can consult mid-call via `consult_supervisor`. Fast voice + slow brain.         |
| **Telemetry**                    | SQLite + JSONL recording per-turn TTFT, TTFA, EOU, tokens, cost. Auto-attached to every session.                                  |
| **TTFA**                         | Time To First Audio — TTS time from prompt to first audio chunk out. Telemetry: `ttfa_ms`.                                        |
| **TTFT**                         | Time To First Token — LLM time from prompt to first generated token. Telemetry: `ttft_ms`.                                        |
| **Turn detector**                | Model that decides "the user has stopped speaking, fire the LLM." Sits between VAD and the LLM. We use LK's multilingual model.   |
| **VAD**                          | Voice Activity Detection — Silero by default. Coarser than the turn detector; just "audio is voice or silence."                   |
| **Worker**                       | One running `nx-voice serve` process. Bound to one persona via `agent_name`. Scales horizontally.                                 |
