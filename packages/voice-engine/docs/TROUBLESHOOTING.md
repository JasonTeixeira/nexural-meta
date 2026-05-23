# Troubleshooting

Symptoms → causes → fixes. Most common issues first.

## Connection / startup

### `Worker failed to register` in agent logs

- **Wrong URL.** `LIVEKIT_URL` must start with `wss://`, not `https://`.
- **Wrong key/secret pair.** `nx-voice doctor` mints a test token; if
  that fails, regenerate the keys at https://cloud.livekit.io.
- **Network blocked.** Some corporate networks block port 443 outbound
  WebSocket. Try a hotspot.

### Browser shows "Connection failed"

- **Mismatched LiveKit creds** between agent `.env` and client
  `.env.local`. They must point at the same project.
- **Token expired** (15-min TTL by default). Reconnect.
- **No worker for the agent name.** The token's `roomConfig.agents`
  must match the worker's `agent_name` (= persona name). Run
  `nx-voice list` and check.

### `ImportError: livekit.plugins.X` on `nx-voice serve`

- `pip install -e .` from `packages/voice-engine/` to re-resolve all
  pinned plugins.
- Verify versions: `pip freeze | grep livekit-plugins`.

## Audio behaviour

### Agent never speaks

- **Mic permission denied.** Check the browser address-bar lock icon.
- **OPUS / WebRTC codec mismatch.** Restart browser; some Chromium
  beta builds break.
- **Persona `greeting` is empty.** The agent only auto-speaks if the
  YAML has a non-empty `greeting:`.

### Agent cuts you off mid-sentence

- Increase `turn_detection.min_endpointing_delay` (try +0.2s) and
  `max_endpointing_delay` (try +2s).
- Disable semantic turn detector temporarily:
  `turn_detection.use_semantic_turn_detector: false`. Plain VAD is
  more conservative — if the cuts stop, the semantic detector is
  over-firing for your audio quality.

### Long silence after you stop talking

- `min_endpointing_delay` too high.
- Persona is in `realtime` mode but `use_semantic_turn_detector: true`
  — realtime models handle EOU themselves, so the LK turn detector
  competes and adds latency. Set it `false` for realtime personas.

### Agent talks over you when you barge in

- LiveKit Agents handles barge-in by default; verify
  `livekit-plugins-noise-cancellation` is installed (it suppresses
  echo). If you're on Safari, try Chrome — Safari's WebRTC echo
  cancellation is less aggressive.

## Provider errors

### `RemoteProtocolError` from Anthropic / OpenAI / Deepgram mid-call

- API key valid? Check the provider dashboard for credit balance.
- Rate limit? Anthropic free tier is 50 req/min on Haiku.
- Set up a fallback in the persona:
  ```yaml
  llm:
    provider: anthropic
    model: claude-haiku-4-5
    fallbacks:
      - provider: openai
        model: gpt-4o-mini
  ```

### Realtime: `model not found`

- The OpenAI realtime model name shifts occasionally. Try alternates
  in the YAML:
  ```yaml
  realtime:
    model: gpt-4o-realtime-preview-2025-06-03
  ```

## Telemetry / cost

### `telemetry.sqlite` is empty after a call

- `recording.telemetry: false` in the persona — flip it on.
- The agent never reached the `_on_item` event (no completed turns —
  did you actually talk to it?).

### Telemetry rows have `cost_usd_est = 0`

- The model isn't in `DEFAULT_COSTS` in `src/voice_engine/telemetry.py`.
  Add it or treat costs as estimates.

### Cost cap fires unexpectedly

- Cap is too aggressive — supervised personas can burn $0.20 per
  consultation. Default cap of $0 (off) is intentional; turn it on
  only with realistic ceilings (e.g. $5/session).

## Persona / orchestration

### `nx-voice list` shows ⚠ with `parse error`

- YAML syntax error or schema violation. Run `nx-voice validate <file>`
  for the exact pydantic error.

### `extends: foo.yaml` says "not found"

- Path is relative to the child file. Use `extends: _base/cascaded.yaml`
  when the child is in `personas/`.

### Router never picks the right persona

- Re-run `nx-voice generate-router --out personas/router.yaml` after
  adding a persona; the router prompt is a snapshot.
- Reduce specialist count or write a custom router YAML — at 30+
  personas the prompt gets long.

## Deployment

### Fly app starts then crashes

- `fly logs` is your friend.
- Missing secrets: `fly secrets list --app <app>` to verify.
- Onnxruntime missing system libs: rebuild against the supplied
  Dockerfile, don't roll your own.

### Audio is bad in production but fine locally

- Worker region too far from users — `fly regions add` a closer one.
- Multiple workers in different regions but client always lands on the
  far one — LiveKit Cloud routes by user RTT; usually self-corrects
  once each region has a healthy worker.

## When all else fails

1. `nx-voice doctor` — full readiness report.
2. `tail -f telemetry.jsonl` while you reproduce.
3. LiveKit Agents debug: `LOG_LEVEL=DEBUG nx-voice serve …`.
4. Bisect persona changes via git.
5. Compare against `personas/voice_coach.yaml` (the most-validated
   reference).
