# Deploy a persona to production

One persona = one Fly.io app. Each persona has its own provider keys,
metrics, and scale rules. Sane defaults take you from `nx-voice serve`
on laptop to production worker in ~10 minutes.

## Why Fly.io and not Lambda

LiveKit Agents needs **persistent VMs**. Cold starts (Lambda, Cloud Run)
add 1-3 seconds to first-turn latency, which kills the "feels natural"
illusion the engine is designed to deliver. Fly.io persistent machines
also make telemetry persistence trivial via the mounted volume.

You can substitute Railway, Render, GCP/AWS EC2, or your own Kubernetes —
the Dockerfile is provider-agnostic. The Fly examples below are the
fastest path.

## One-time setup

```bash
brew install flyctl                              # or per https://fly.io/docs/flyctl/install/
fly auth login
```

## Per-persona deploy (~3 min)

```bash
cd packages/voice-engine

# 1. Copy + customise the template.
cp fly.toml.example fly.voice-coach.toml
$EDITOR fly.voice-coach.toml      # set app name + persona path + region

# 2. Create the app and persistent volume.
fly apps create nexural-voice-coach
fly volumes create voice_data --region iad --size 1

# 3. Set secrets (only the keys this persona needs — see SETUP.md matrix).
fly secrets set \
  LIVEKIT_URL=wss://your.livekit.cloud \
  LIVEKIT_API_KEY=... \
  LIVEKIT_API_SECRET=... \
  ANTHROPIC_API_KEY=... \
  DEEPGRAM_API_KEY=... \
  CARTESIA_API_KEY=... \
  --app nexural-voice-coach

# 4. Deploy.
fly deploy --config fly.voice-coach.toml
```

Check it registered with LiveKit:

```bash
fly logs --app nexural-voice-coach | grep "registered worker"
```

## Per-persona deploy: any browser/iOS/Android client now finds it

In your client app, mint a LiveKit token with `roomConfig.agents=[{agentName: "voice_coach"}]`
(see `examples/nextjs-client/app/api/token/route.ts`). LiveKit Cloud
auto-dispatches the matching worker into the room.

## Scaling

```bash
# Multiple machines in one region (for concurrent calls):
fly scale count 3 --app nexural-voice-coach --region iad

# Add a second region:
fly regions add lhr --app nexural-voice-coach
fly scale count 2 --app nexural-voice-coach --region lhr
```

LiveKit Agents handles load-balancing across workers automatically —
each call lands on the worker with the lowest load.

## Telemetry / debugging in production

```bash
# Stream live JSONL:
fly ssh console --app nexural-voice-coach -C "tail -f /data/telemetry.jsonl"

# Or pull the SQLite locally:
fly ssh sftp get /data/telemetry.sqlite ./prod-telemetry.sqlite
sqlite3 prod-telemetry.sqlite "SELECT persona, AVG(ttft_ms), AVG(ttfa_ms), COUNT(*) FROM turns JOIN sessions USING(session_id) GROUP BY persona;"
```

## Repeat for every persona

The whole point of the engine — `fly.voice-coach.toml`, `fly.tutor.toml`,
`fly.receptionist.toml`, etc. Each is ~20 lines of TOML, each is one
`fly deploy`, each is independently scalable + billable.

## Rollback

```bash
fly releases --app nexural-voice-coach
fly releases rollback <version> --app nexural-voice-coach
```

## Cost shape (per persona, IAD region, 1 VM 24/7)

- shared-cpu-2x / 1GB RAM: ~$4/mo idle
- 1GB volume: ~$0.15/mo
- - your LiveKit Cloud minutes + provider usage (variable)

Realistic minimum: ~$5/mo per persona kept warm.
