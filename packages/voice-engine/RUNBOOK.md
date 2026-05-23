# Phase 1 Runbook — Talk to the engine in 10 minutes

This is the live test. Goal: prove the engine works end-to-end on real
hardware, on a real LiveKit room, with real audio. Everything else in
the project is theoretical until this happens once.

## 0. Prereqs

You already have:

- ✅ `.venv` at `packages/voice-engine/.venv` with engine + 11 plugins installed
- ✅ `.env` file (from `.env.example`), needs real keys
- ✅ Browser client deps installed at `examples/nextjs-client/node_modules`
- ✅ 16 personas validated
- ✅ Telemetry, doctor, recording config all wired

## 1. Fill keys (5 min)

Open `packages/voice-engine/.env` and paste in the keys you have. For the
first test we'll use **voice_coach** (cascaded — needs LiveKit + Deepgram

- Anthropic + Cartesia) and **therapist** (realtime — needs LiveKit +
  OpenAI).

Minimum to run both:

```
LIVEKIT_URL=wss://YOUR-PROJECT.livekit.cloud
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
ANTHROPIC_API_KEY=
DEEPGRAM_API_KEY=
CARTESIA_API_KEY=
OPENAI_API_KEY=
```

LiveKit Cloud: https://cloud.livekit.io → Settings → Keys.
Other providers: see `SETUP.md` for the full link list.

## 2. Verify with doctor (30 sec)

```bash
cd packages/voice-engine
.venv/bin/nx-voice doctor
```

You should see:

- ✓ LiveKit env + token mint OK
- ✓ all 11 plugins importable
- `voice_coach` and `therapist` (and others) marked ready

If anything's still ✗, doctor tells you exactly which env var to set.

## 3. First conversation — voice_coach (cascaded path, 3 min)

**Terminal 1 — agent worker:**

```bash
cd packages/voice-engine
.venv/bin/nx-voice serve --persona personas/voice_coach.yaml -- dev
```

You should see:

- `▸ persona  : voice_coach (v1.0.0)`
- `▸ stack    : deepgram/nova-3  →  anthropic/claude-haiku-4-5  →  cartesia/sonic-3`
- LiveKit worker registration log

**Terminal 2 — browser client:**

```bash
cd packages/voice-engine/examples/nextjs-client
cp .env.example .env.local           # paste your LIVEKIT_* values here too
pnpm dev
```

Open http://localhost:3030 → select "Voice Coach" → click **Connect**
→ allow mic when prompted → start talking.

**What "good" feels like:**

- Agent greets you within ~1 second of connecting
- You can interrupt mid-reply by talking over it (barge-in)
- Pauses while you think don't trigger premature responses
- Replies feel like a coach, not a chatbot

## 4. Second conversation — therapist (realtime/S2S path, 2 min)

Stop terminal 1 (Ctrl+C), then:

```bash
.venv/bin/nx-voice serve --persona personas/therapist.yaml -- dev
```

This uses **OpenAI gpt-realtime** end-to-end. Different feel — more
natural prosody, semantic VAD, lower perceived latency. Reconnect in the
browser with persona = "Reflective Companion".

## 5. Check what got recorded (1 min)

After both calls, in `packages/voice-engine/`:

```bash
# Quick latency report:
sqlite3 telemetry.sqlite "SELECT persona, turn_idx, role, ttft_ms, ttfa_ms, cost_usd_est FROM turns JOIN sessions USING(session_id) ORDER BY ts DESC LIMIT 20;"

# Per-session summary:
sqlite3 telemetry.sqlite "SELECT persona, turn_count, ROUND(cost_usd_est, 4) AS cost, ROUND(ended_at - started_at, 1) AS dur_s FROM sessions ORDER BY started_at DESC;"

# Or stream the JSONL:
tail -f telemetry.jsonl
```

If turns are recording, telemetry works. If `cost_usd_est` looks right
(roughly $0.01–0.05 per minute for cascaded, $0.06–0.12 for realtime),
cost estimation works.

## 6. Iterate

Things you'll want to try immediately:

```bash
# Change the prompt without restarting anything:
$EDITOR personas/voice_coach.yaml
.venv/bin/nx-voice serve --persona personas/voice_coach.yaml -- dev

# Try a different voice on the same persona — edit tts.voice in the YAML.
# Cartesia voice library: https://play.cartesia.ai/sonic

# Try the router (front-door persona):
.venv/bin/nx-voice serve --persona personas/router.yaml -- dev
# It greets you, then hands off to a specialist.
```

## Troubleshooting

| Symptom                                        | Fix                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Worker failed to register`                    | Wrong LIVEKIT_URL (must start `wss://`, not `https://`)                                                |
| Browser shows "Connection failed"              | `LIVEKIT_API_KEY`/`SECRET` mismatch between agent .env and client .env.local                           |
| Agent never speaks                             | Mic permission denied in browser; check the address-bar lock icon                                      |
| Long silence after you stop talking            | Increase `min_endpointing_delay`; or set `use_semantic_turn_detector: false` to fall back to plain VAD |
| Agent cuts you off mid-sentence                | Increase `min_endpointing_delay` and `max_endpointing_delay`                                           |
| `ImportError: livekit.plugins.X`               | `.venv/bin/pip install -e .` to re-resolve                                                             |
| `RemoteProtocolError` from a provider          | Check API key is valid + has credit (Anthropic, OpenAI commonly hit credit limits silently)            |
| Realtime persona errors with `model not found` | OpenAI realtime model name may have shifted; try `gpt-4o-realtime-preview` in the YAML                 |

## When to call Phase 1 done

✅ You've talked to **voice_coach** (cascaded) for 2+ minutes
✅ You've talked to **therapist** (realtime) for 2+ minutes
✅ `telemetry.sqlite` has rows for both sessions
✅ Latency feels acceptable (<1.5s perceived for cascaded, <500ms for realtime)
✅ You've adjusted at least one prompt and re-run the agent

Then we move to Phase 2 (Dockerfile, deploy, fallbacks, persona inheritance).

## Report back

When you finish Phase 1, tell me:

1. **Did both personas actually work?** (yes/no, and what went wrong if no)
2. **What did the agent get RIGHT** in conversation?
3. **What felt OFF** (slow, robotic, interrupted you, missed your intent)?
4. **Average TTFT and TTFA from the SQLite query** — paste the numbers.

That's the data we need to score Phase 1 honestly and plan Phase 2's
priority order.
