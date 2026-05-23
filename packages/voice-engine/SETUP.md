# Setup — what to fill in `.env` before first run

`.env` is already created (copied from `.env.example`). Fill in **only the
keys for the personas you intend to run**.

## Universal (always required)

```
LIVEKIT_URL          wss://your-project.livekit.cloud
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
```

Get these from https://cloud.livekit.io → your project → Settings → Keys.
A free tier covers ~10k participant-minutes/month — enough to develop and
demo every persona shipped here.

## Per-persona key requirements

| Persona          | LiveKit | Deepgram | Anthropic | OpenAI | Cartesia | ElevenLabs |   mem0   |
| ---------------- | :-----: | :------: | :-------: | :----: | :------: | :--------: | :------: |
| voice_coach      |    ✓    |    ✓     |     ✓     |        |    ✓     |            | optional |
| tutor            |    ✓    |    ✓     |     ✓     |        |    ✓     |            | optional |
| therapist        |    ✓    |          |           |   ✓    |          |            | optional |
| sales_agent      |    ✓    |    ✓     |     ✓     |        |          |     ✓      | optional |
| customer_support |    ✓    |    ✓     |     ✓     |        |    ✓     |            | optional |
| interviewer      |    ✓    |    ✓     |     ✓     |   ✓    |          |            | optional |

OpenAI is used by `therapist` (gpt-realtime S2S) and `interviewer` (gpt-4o-mini-tts).

mem0 (`MEM0_API_KEY`) is only required if `memory.enabled: true` in the
persona — which is true for every shipped persona, but the engine silently
disables memory if the key is missing (no crash).

## Where to get keys

| Provider      | URL                           | Free tier       |
| ------------- | ----------------------------- | --------------- |
| LiveKit Cloud | https://cloud.livekit.io      | 10k mins/mo     |
| Deepgram      | https://console.deepgram.com  | $200 credit     |
| Anthropic     | https://console.anthropic.com | $5 credit       |
| OpenAI        | https://platform.openai.com   | pay-as-you-go   |
| Cartesia      | https://play.cartesia.ai      | free dev tier   |
| ElevenLabs    | https://elevenlabs.io         | 10k chars/mo    |
| mem0          | https://mem0.ai               | free hobby tier |

## First run

```bash
# 1. Activate the engine venv:
source /Users/Sage/code/nexural/nexural-meta/packages/voice-engine/.venv/bin/activate

# 2. Start the voice_coach worker (uses 4 keys: LiveKit, Deepgram, Anthropic, Cartesia):
cd /Users/Sage/code/nexural/nexural-meta/packages/voice-engine
nx-voice serve --persona personas/voice_coach.yaml -- dev

# 3. In a second terminal, start the browser client:
cd examples/nextjs-client
cp .env.example .env.local   # paste your LIVEKIT_* keys again here
pnpm dev    # → http://localhost:3030
```

Pick "Voice Coach" in the dropdown, click **Connect**, allow mic, talk.
