# Roadmap

What's likely to land in future versions, ordered by likelihood + value.

Status legend: 🟢 high-confidence next · 🟡 probable · 🔵 speculative

## v0.6 — "Production polish" (next)

🟢 **Voice cloning workflow baked in**

- `nx-voice clone-voice <sample.wav>` → returns a Cartesia voice ID
- Brand-voice registry: `personas/_base/voices.yaml` with named references
- Personas reference `voice: $sage_warm` instead of UUID strings

🟢 **Per-persona scenario eval coverage**

- Each shipped persona gets 3-5 scenarios under `personas/<name>.scenarios.yaml`
- CI command: `nx-voice eval-all`
- Catches prompt regressions across the library

🟢 **Real LiveKit semantic turn detector wiring**

- Configure `inference_executor` in WorkerOptions properly
- Re-enable `use_semantic_turn_detector: true` by default
- Cuts the "wait, did they finish?" pause significantly

🟢 **Migrate remaining cascaded personas to gpt-4o-mini-tts**

- Currently many still use Cartesia by default
- Steerable TTS via per-persona `instructions:` block gives more personality, lower cost
- Cartesia kept for personas where latency is the product (sales, fitness, receptionist)

## v0.7 — "Mobile-first"

🟢 **iOS Swift Package: production-tested with Expo app**

- Currently scaffolded but not deployed
- Real example app + screenshots in `clients/ios/example/`

🟡 **Android Kotlin Package**

- Wraps livekit-android with the same shape as iOS
- Currently no Android-specific kit beyond React Native

🟡 **Flutter package**

- Wraps livekit_client Flutter SDK

## v0.8 — "Self-hosted ergonomics"

🟢 **Moonshine STT shim**

- HTTP service that exposes Moonshine v2 in a Deepgram-compatible streaming format
- Drops the cloud STT dependency completely for self-hosted tier
- Cuts cost from $0.46/hr (Deepgram) to $0/hr at scale

🟢 **Production GPU recipes**

- Modal app for autoscaling Llama serving
- RunPod / Fly.io GPU templates
- vLLM-based inference for batched throughput at scale

🟡 **Zep self-hosted memory adapter**

- Drop-in replacement for mem0 in `memory.py`
- Adds temporal state awareness ("user moved from London to Tokyo")

## v0.9 — "Eval ecosystem"

🟢 **Hamming integration**

- Wire `TelemetrySink` to push traces to Hamming
- Voice-quality eval (latency, prosody, interruption recovery) — not just text-mode scenarios

🟢 **Langfuse integration**

- Per-turn trace visualisation
- Free tier compatible
- Replaces ad-hoc SQLite querying for dev observability

🟡 **Conversation replay**

- Recordings → web UI → step through with full telemetry
- Required for debugging hard-to-reproduce issues at production

## v1.0 — "Stable API"

🟡 **Migrate to LiveKit Agents 2.0** when released

- Deprecation warnings show v2 will reshape `AgentSession` constructor
- One-time migration with a compat shim during transition

🟡 **First-class telephony recipe**

- Bundled scripts: provision Telnyx number → wire to LiveKit SIP → dispatch agent
- Demo: "call your AI receptionist" in <10 minutes from zero

## v1.1+ — "Whatever shipped products demand"

🔵 **Per-app provider quotas + rate limits**

- Useful if you start serving external customers (not currently a goal)

🔵 **Webhook event system**

- `call_started`, `call_ended`, `structured_output_emitted` → POST to a URL
- Lets external apps react without polling

🔵 **Multi-language persona variants**

- Same prompt structure, language-tagged
- Auto-dispatch by caller language detection

🔵 **Visual studio / persona designer UI**

- Edit persona YAMLs through a web interface
- Probably never built — git + YAML is fine for Sage's workflow

## Always-on backlog

- Keep LiveKit Agents pinned version current (monthly bump + re-verify)
- Add a new persona whenever a real Sage product needs one
- Update cost benchmarks quarterly (provider pricing shifts)
- Add ADRs whenever a big decision is made

## What's deliberately NOT on the roadmap

Per the engine's positioning:

- ❌ Multi-tenant SaaS platform (auth, billing, admin dashboard)
- ❌ Public API for external developers to consume
- ❌ SOC2 / compliance certifications (per-app concern, not engine concern)
- ❌ Customer-facing dashboards
- ❌ Stripe / payment integration
- ❌ Federated marketplace of personas

The engine is an **ingredient**, not a product. The products are the apps built on top.
