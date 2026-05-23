# ADR-0004: Cascaded by default; realtime per-persona opt-in

**Status:** Accepted (2026-05-22)
**Owner:** Sage

## Context

Voice agents can run in two architectural modes:

- **Cascaded:** STT → LLM → TTS as separate streaming components.
  Latency ~750ms e2e. Each component swappable. Debuggable text logs at
  every stage.
- **Realtime (speech-to-speech):** A single model like OpenAI
  `gpt-realtime` or Gemini Live processes audio in and out directly.
  Latency ~300ms perceived. Locks you to that vendor. No text logs at
  the audio boundaries.

## Decision

**Default to cascaded.** Each persona opts into realtime explicitly
via `mode: realtime` when its product value depends on it (emotional
prosody, very long pauses, expressive delivery).

## Rationale

- **Debuggability:** "Why did the agent say X?" answerable from logs
  in cascaded mode. In realtime mode, audio→audio is a black box.
- **Vendor swappability:** Cascaded lets us substitute providers per
  YAML field. Realtime locks us to one vendor's pricing curve.
- **Cost:** Cascaded ~$0.04/min. Realtime ~$0.10/min. 2-3× over time
  matters for products with high usage.
- **Maturity:** Cascaded is a 3-year-old proven pattern. Realtime APIs
  are 1 year old and still shifting.

## Realtime is the right choice for

| Persona              | Why                                              |
| -------------------- | ------------------------------------------------ |
| `therapist`          | Emotional prosody matters more than cost or logs |
| `meditation_guide`   | Long pauses, slow cadence essential              |
| `storyteller`        | Expressive character voices                      |
| `language_coach`     | Native-quality pronunciation modelling           |
| `sleep_coach`        | Slow tapering voice                              |
| `news_anchor`        | Polished broadcast prosody                       |
| `audiobook_narrator` | Character voices, dramatic pacing                |
| `journaling_coach`   | Warm, patient presence                           |

## Trade-offs accepted

- Realtime personas can't reuse the cascaded fallback chain
  infrastructure. Mitigation: realtime providers are stable; outages
  are rare.
- Realtime transcripts come from the model's own ASR — not from
  Deepgram — which means our keyterms config is ignored. Acceptable.
- Eval is harder for realtime (no per-step text). Mitigation: rely on
  call-end summaries + human review for realtime personas.

## Consequences

- Base persona files: `_base/cascaded.yaml` is the default extends
  target.
- Cost cap and provider fallback configs are most useful for cascaded
  personas.
- When in doubt, write the persona as cascaded first; promote to
  realtime only if a real user test shows the difference is felt.
