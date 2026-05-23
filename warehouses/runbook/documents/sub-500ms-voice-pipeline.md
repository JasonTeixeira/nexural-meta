# Playbook: Sub-500ms Voice Pipeline

> **Trigger:** You want a voice agent that feels real-time — the user speaks,
> the agent responds before the awkward pause. "Alexa-fast" is the bar.
> Sub-500ms end-to-end (speech-in to audio-out) is achievable today.

**Reference template:** `templates/template-voice-agent/`
**Reference stack:** `stacks/voice-agent-sub-500ms.md`

---

## Latency Budget

The math before writing a line of code:

```
Phase                        P50      P99     Notes
──────────────────────────────────────────────────────────────
VAD (end-of-utterance)       ~50ms    ~120ms  silero or Deepgram built-in
STT first token              ~50ms    ~120ms  Deepgram Nova-3 streaming WS
LLM first token (TTFB)      ~150ms    ~400ms  gpt-4o-mini, prompt-cached
TTS first audio chunk        ~50ms    ~100ms  Cartesia Sonic streaming
Network + buffering           ~50ms    ~150ms  regional deploy critical
──────────────────────────────────────────────────────────────
Total P50:                  ~350ms
Total P99 target:           <700ms
```

**The rule:** Every phase must stream. If any phase waits for completion before
passing output downstream, your P99 will be 800ms+.

```
WRONG pipeline (waterfall):
  user speaks → wait for full STT → wait for full LLM → wait for full TTS → play audio
  latency: 600-1200ms, feels like a call center IVR

RIGHT pipeline (streaming):
  user speaks → STT streams partials → LLM streams tokens → TTS streams audio chunks
  latency: 300-500ms P50, feels conversational
```

---

## The Two Architectures

### Architecture A: STT → LLM → TTS Pipeline

```
User browser / app
    │ WebRTC audio (Opus)
    ▼
LiveKit SFU ─────────────────── LiveKit Agent (Python)
                                      │
                          ┌───────────┼──────────────────┐
                          │           │                  │
                   Deepgram WS    OpenAI API        Cartesia API
                   (streaming     (streaming         (streaming
                    transcript)    tokens)            audio)
                          │           │                  │
                          └───────────┴──────────────────┘
                                      │ audio chunks via LiveKit
                                      ▼
                              User hears response
```

**When to use:**

- You need to customize STT (diarization, custom vocabulary, domain terms)
- You need an intermediate transcript for logging, RAG lookup, or tool calling
- You want to swap any individual component without rewriting everything
- You want lowest cost (gpt-4o-mini + Deepgram + Cartesia ≈ $0.013/min vs Realtime $0.06+/min)

### Architecture B: Realtime API (speech-to-speech)

```
User browser / app
    │ WebRTC or WebSocket audio
    ▼
OpenAI Realtime API
    │ audio output stream
    ▼
User hears response
```

**When to use:**

- You want the absolute simplest implementation (no STT/TTS vendors to manage)
- Prototype: fastest time-to-working-demo (~50 lines of code)
- You need native audio understanding (tone, emotion, accent) that text transcription loses
- Budget is not the primary concern

**Realtime API tradeoffs:**

- ~$0.06/min input + $0.24/min output audio (vs $0.013/min for STT+LLM+TTS pipeline)
- Less control: you can't inject tool call results as easily, can't easily log the transcript
- Limited to OpenAI models only (no swapping to Claude or Groq)

**For production:** Architecture A. For prototypes and demos: Architecture B.

---

## Picking Each Component

### STT: Why Deepgram Nova-3

See DECISIONS.md → STT section for full decision tree.

**Short version:**

- Deepgram Nova-3 has ~50ms TTFB on streaming WebSocket — fastest available
- `interim_results: true` lets LLM start before STT is done (huge win)
- Best English WER (Word Error Rate) for conversational speech

```python
# Deepgram streaming config for voice agents
deepgram_config = {
    "model": "nova-3-general",
    "language": "en-US",
    "encoding": "opus",
    "sample_rate": 48000,
    "endpointing": 300,          # ms silence = end of utterance
    "interim_results": True,     # stream partials — critical for latency
    "utterance_end_ms": 1000,    # additional buffer before final result
    "smart_format": True,        # punctuation + casing for better TTS input
    "vad_events": True,          # get VAD events for interrupt handling
}
```

**Why not Groq Whisper for voice agents?** Groq is fastest for batch, but
Groq Whisper requires the full audio clip — it's not streaming. Use Groq for
async transcription (meeting notes, podcast transcripts), not real-time voice.

**Why not AssemblyAI?** Excellent async features but streaming latency lags
behind Deepgram for conversational English. Use AssemblyAI if you need
diarization or structured output from recordings.

### LLM: Why gpt-4o-mini (and when to use Realtime)

For the STT→LLM→TTS pipeline, gpt-4o-mini hits the sweet spot:

| Model          | TTFB   | Cost/min | Quality                                                |
| -------------- | ------ | -------- | ------------------------------------------------------ |
| gpt-4o-mini    | ~150ms | ~$0.001  | Great for conversation                                 |
| gpt-4o         | ~250ms | ~$0.01   | Marginal improvement for voice                         |
| claude-haiku   | ~180ms | ~$0.001  | Similar to mini; slightly better instruction-following |
| Groq llama3-8b | ~80ms  | ~$0.001  | Fastest; quality varies                                |

For voice conversations (not complex reasoning tasks), gpt-4o-mini or claude-haiku
are sufficient. The quality gap between mini and full gpt-4o is smaller for short
conversational turns than for complex writing tasks.

**Prompt caching matters here:** A 2000-token system prompt cached by OpenAI
saves ~50-80ms on every turn. Structure your system prompt to stay static
(no dynamic injection in the first ~2000 tokens).

```python
# System prompt optimized for voice
VOICE_SYSTEM_PROMPT = """You are a helpful voice assistant. Rules:
- Keep responses under 3 sentences unless the user explicitly asks for more.
- Never use bullet points, headers, or markdown — you are speaking, not writing.
- Use natural transitions: "Sure,", "Got it,", "Here's the thing..."
- If you don't know something, say so briefly and offer an alternative.
- Never start with "I" — lead with the answer or action.
"""
# This prompt stays static → gets cached after first call → ~50ms savings per turn
```

### TTS: Why Cartesia

See DECISIONS.md → Voice TTS section.

**Short version:**

- Cartesia Sonic: ~50ms TTFB, purpose-built for real-time, sentence-level streaming
- ElevenLabs: ~200ms TTFB — too slow for sub-500ms budget
- OpenAI TTS: ~150ms TTFB — usable but Cartesia is faster

**Cartesia streaming pattern:**

```python
import httpx
import asyncio

async def stream_tts(text: str, voice_id: str) -> AsyncIterator[bytes]:
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            "https://api.cartesia.ai/tts/bytes",
            headers={
                "X-API-Key": CARTESIA_API_KEY,
                "Cartesia-Version": "2024-06-10",
                "Content-Type": "application/json",
            },
            json={
                "model_id": "sonic-english",
                "voice": {"mode": "id", "id": voice_id},
                "transcript": text,
                "output_format": {"container": "raw", "encoding": "pcm_f32le", "sample_rate": 44100},
                "stream": True,
            },
        ) as response:
            async for chunk in response.aiter_bytes():
                yield chunk
```

**Critical:** Flush Cartesia at sentence boundaries (`.`, `!`, `?`), not word-by-word.
Word-by-word chunking degrades prosody. Sentence-by-sentence gives natural speech.

### Why Kokoro for Self-Hosted TTS

If API cost becomes dominant at >100k min/month, self-host Kokoro:

- Open-weight model, runs on CPU (good enough) or GPU (fast)
- Quality: noticeably below Cartesia but acceptable for internal tools
- Cost: server cost only (~$0 marginal beyond infrastructure)
- Latency: ~80-150ms TTFB on GPU, ~300ms on CPU

```bash
pip install kokoro-onnx
```

---

## Streaming Everywhere — How to Enable It

### STT streaming (Deepgram WebSocket)

```python
from deepgram import DeepgramClient, LiveTranscriptionEvents, LiveOptions
import asyncio

async def transcribe_stream(audio_source):
    dg_client = DeepgramClient(DEEPGRAM_API_KEY)

    connection = dg_client.listen.asyncwebsocket.v("1")

    options = LiveOptions(
        model="nova-3-general",
        interim_results=True,
        smart_format=True,
        endpointing=300,
    )

    async def on_transcript(self, result, **kwargs):
        sentence = result.channel.alternatives[0].transcript
        is_final = result.is_final
        if sentence:
            if is_final:
                await handle_final_transcript(sentence)
            else:
                await handle_interim_transcript(sentence)  # optional: show to user

    connection.on(LiveTranscriptionEvents.Transcript, on_transcript)
    await connection.start(options)

    async for audio_chunk in audio_source:
        await connection.send(audio_chunk)

    await connection.finish()
```

### LLM streaming (OpenAI)

```python
from openai import AsyncOpenAI

client = AsyncOpenAI()

async def stream_llm_response(transcript: str) -> AsyncIterator[str]:
    stream = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": VOICE_SYSTEM_PROMPT},
            {"role": "user", "content": transcript},
        ],
        stream=True,
        max_tokens=150,  # voice responses are short; cap token budget
        temperature=0.7,
    )

    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
```

### TTS streaming (Cartesia, sentence-buffered)

```python
import re

async def text_to_speech_stream(token_stream: AsyncIterator[str]) -> AsyncIterator[bytes]:
    """Buffer tokens until sentence boundary, then flush to TTS."""
    buffer = ""
    sentence_endings = re.compile(r'[.!?]')

    async for token in token_stream:
        buffer += token

        # Flush at sentence boundary
        if sentence_endings.search(buffer) and len(buffer) > 10:
            sentence = buffer.strip()
            buffer = ""
            async for audio_chunk in stream_tts(sentence, VOICE_ID):
                yield audio_chunk

    # Flush remainder
    if buffer.strip():
        async for audio_chunk in stream_tts(buffer.strip(), VOICE_ID):
            yield audio_chunk
```

---

## VAD and Turn Detection

VAD (Voice Activity Detection) decides when the user has finished speaking.
Getting this wrong is one of the top causes of bad voice agent UX.

### Options

**1. LiveKit built-in VAD (silero-based)**

```python
# LiveKit Agents uses silero VAD by default
from livekit.agents.vad import SileroVAD

vad = SileroVAD.load()
# LiveKit wires this into the pipeline automatically when using the agents framework
```

**2. Deepgram endpointing**

```python
# Deepgram's built-in endpointing handles VAD at the STT layer
deepgram_options = {
    "endpointing": 300,       # 300ms silence = end of turn
    "utterance_end_ms": 1000, # additional buffer for slow speakers
}
```

**3. Silero VAD standalone (if not using LiveKit)**

```python
# pip install silero-vad
import torch

model, utils = torch.hub.load(repo_or_dir='snakers4/silero-vad', model='silero_vad')
(get_speech_timestamps, _, read_audio, *_) = utils

# In your audio processing loop:
def is_speech(audio_chunk: bytes) -> bool:
    audio_tensor = torch.frombuffer(audio_chunk, dtype=torch.float32)
    return model(audio_tensor, 16000).item() > 0.5
```

### Tuning endpointing

```
endpointing: 200ms  → snappy but cuts off slow speakers mid-sentence
endpointing: 300ms  → good default for English conversational speech
endpointing: 500ms  → better for non-native speakers; feels slightly sluggish
endpointing: 800ms+ → noticeably laggy; avoid
```

For customer-facing voice agents: use 300ms with `utterance_end_ms: 1000`
to give a grace period before committing.

---

## Interruption Handling (The Part Everyone Screws Up)

Interruption handling is what separates a voice agent that "works" from one that
"feels natural." When the user starts speaking mid-response, the agent must:

1. Detect speech start (VAD)
2. Stop TTS playback immediately
3. Cancel the in-flight LLM stream (don't keep generating)
4. Process the new utterance from scratch

Most teams handle (1) and (2) but forget (3), leading to wasted LLM tokens and
state corruption.

### LiveKit Agents pattern

```python
from livekit.agents import Agent, AgentContext
from livekit.agents.llm import ChatContext

class VoiceAgent(Agent):
    def __init__(self):
        super().__init__(
            vad=silero_vad.VAD.load(),
            stt=deepgram.STT(model="nova-3-general"),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=cartesia.TTS(model="sonic-english"),
        )

    async def on_user_speech_started(self, ctx: AgentContext):
        """Called when VAD detects user started speaking."""
        # This is the interrupt: stop current TTS + cancel LLM stream
        await ctx.agent.interrupt()
        # LiveKit handles draining the TTS queue and cancelling the LLM stream

    async def on_user_speech_committed(self, ctx: AgentContext, speech: str):
        """Called when STT finalizes the user's utterance."""
        # Process the new input — previous streams already cancelled
        response = await self.generate_response(ctx, speech)
        await ctx.agent.say(response)
```

### Manual pipeline pattern (without LiveKit)

```python
import asyncio
from typing import Optional

class VoicePipeline:
    def __init__(self):
        self._current_task: Optional[asyncio.Task] = None
        self._tts_queue: asyncio.Queue[bytes] = asyncio.Queue()

    async def handle_utterance(self, transcript: str):
        # Cancel previous task if still running (this IS the interrupt)
        if self._current_task and not self._current_task.done():
            self._current_task.cancel()
            # Clear the TTS queue — discard buffered audio
            while not self._tts_queue.empty():
                self._tts_queue.get_nowait()

        # Start new pipeline for this utterance
        self._current_task = asyncio.create_task(
            self._run_pipeline(transcript)
        )

    async def _run_pipeline(self, transcript: str):
        try:
            async for audio_chunk in self._llm_and_tts(transcript):
                await self._tts_queue.put(audio_chunk)
        except asyncio.CancelledError:
            pass  # clean cancellation, don't re-raise

    async def _llm_and_tts(self, transcript: str):
        buffer = ""
        async for token in stream_llm_response(transcript):
            buffer += token
            if any(p in buffer for p in ['.', '!', '?']) and len(buffer) > 10:
                async for audio_chunk in stream_tts(buffer.strip(), VOICE_ID):
                    yield audio_chunk
                buffer = ""
        if buffer.strip():
            async for audio_chunk in stream_tts(buffer.strip(), VOICE_ID):
                yield audio_chunk
```

**Common mistake:** Checking `if user_is_speaking` inside the LLM token loop instead
of cancelling the task. The `asyncio.CancelledError` propagation is the right pattern.

---

## Sub-200ms TTFB Tricks

These are advanced optimizations. Apply only after the basic pipeline is working.

### 1. Speculative decoding at the TTS layer

Pre-warm TTS with the first expected tokens before LLM responds:

```python
# Start TTS with a filler phrase while LLM warms up
FILLER_PHRASES = ["Sure,", "Good question.", "Let me think...", "Of course,"]

async def respond_with_filler(transcript: str):
    # Stream filler to TTS immediately (zero LLM latency)
    filler = pick_contextual_filler(transcript)
    async for chunk in stream_tts(filler, VOICE_ID):
        yield chunk

    # Now LLM has had ~100ms head start
    async for chunk in stream_llm_to_tts(transcript):
        yield chunk
```

Use sparingly — fillers feel unnatural if overused. Good for: yes/no questions,
lookup queries. Bad for: open-ended questions where the filler doesn't fit.

### 2. Prompt caching (OpenAI / Anthropic)

OpenAI caches the first 1024 tokens of a prompt when the same content is reused
across requests. Anthropic caches via explicit `cache_control` headers.

```python
# OpenAI: system prompt is automatically cached if >1024 tokens and static
# Keep system prompt static — no dynamic injection in first 1024 tokens

# Anthropic: explicit cache control
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_KNOWLEDGE_BASE,  # docs, context, etc.
                "cache_control": {"type": "ephemeral"}  # cache this block
            },
            {
                "type": "text",
                "text": user_message  # dynamic, not cached
            }
        ]
    }
]
```

Prompt caching: ~50ms saved per turn on a 2000-token system prompt.

### 3. Regional deployment

LLM API latency is dominated by network RTT for the first token. Deploying
your agent close to both your users AND the LLM API endpoint matters.

```
OpenAI: primary infra in US-East (Azure East US) and EU-West
Anthropic: US-East primary
Deepgram: US, EU, Asia nodes available

Rule: if your users are EU-based, deploy to Fly.io fra (Frankfurt) or ams (Amsterdam).
      Don't route EU users through US-East — adds 80-120ms per request.
```

```bash
# Fly.io multi-region deploy
fly regions add fra ams nrt  # Frankfurt, Amsterdam, Tokyo
fly scale count 1 --region fra
fly scale count 1 --region nrt
```

### 4. Connection pre-warming

STT and TTS WebSocket connections have a setup cost (~50-100ms). Keep them warm.

```python
class WarmConnectionPool:
    def __init__(self):
        self._deepgram_conn = None
        self._cartesia_session = None

    async def warmup(self):
        """Call at app startup, not per-request."""
        self._deepgram_conn = await create_deepgram_websocket()
        self._cartesia_session = await create_cartesia_http_session()

    async def get_stt(self):
        if self._deepgram_conn is None or self._deepgram_conn.closed:
            self._deepgram_conn = await create_deepgram_websocket()
        return self._deepgram_conn
```

### 5. Avoid cold starts

Cold starts (Lambda, Modal, serverless) add 1-3 seconds. For voice agents,
this is catastrophic. Use always-warm processes:

```
Good:  Fly.io persistent VMs (always-on, low-latency)
Good:  LiveKit Cloud managed agents (pre-warmed, LiveKit manages it)
OK:    Railway (persistent container, $5/mo)
Bad:   AWS Lambda (cold starts, no WebSocket support over 30s)
Bad:   Modal (excellent for batch, cold starts hurt voice)
```

---

## Cost Shape

Per-minute costs at current (2026) pricing:

| Component          | Unit                          | Cost/min        | 1k min/mo   | 10k min/mo   |
| ------------------ | ----------------------------- | --------------- | ----------- | ------------ |
| Deepgram Nova-3    | streaming                     | $0.0059         | $5.90       | $59          |
| OpenAI gpt-4o-mini | ~500 tokens/turn, 4 turns/min | ~$0.003         | $3.00       | $30          |
| Cartesia Sonic     | streaming                     | $0.005          | $5.00       | $50          |
| LiveKit Cloud      | $1.50/1k participant-min      | $1.50           | $1.50       | $15          |
| Fly.io (2 VMs)     | fixed                         | —               | $20         | $20          |
| **Total**          |                               | **~$0.014/min** | **~$35/mo** | **~$174/mo** |

**Realtime API comparison:**

| Approach                | Cost/min | Notes                         |
| ----------------------- | -------- | ----------------------------- |
| STT+LLM+TTS pipeline    | ~$0.014  | Above breakdown               |
| OpenAI Realtime (audio) | ~$0.09   | gpt-4o-realtime audio pricing |

At >100k min/month, self-hosting components becomes economical:

- Self-hosted faster-whisper: replaces Deepgram at ~$0/min (GPU server fixed cost)
- Self-hosted Kokoro TTS: replaces Cartesia at ~$0/min
- Frontier LLM API remains (gpt-4o-mini can't be self-hosted cheaply)

---

## Full Pipeline Code (LiveKit Agents)

```python
# agent.py — complete LiveKit voice agent
import asyncio
import logging
from livekit import rtc
from livekit.agents import Agent, WorkerOptions, cli, AgentContext
from livekit.plugins import deepgram, cartesia, openai, silero

logger = logging.getLogger("voice-agent")

VOICE_SYSTEM_PROMPT = """You are a helpful voice assistant.
Keep responses under 3 sentences. Never use markdown.
Speak naturally and conversationally."""


class VoiceAssistant(Agent):

    async def entrypoint(self, ctx: AgentContext):
        chat_ctx = openai.LLM.create_chat_context()
        chat_ctx.messages.append({
            "role": "system",
            "content": VOICE_SYSTEM_PROMPT,
        })

        assistant = openai.realtime.RealtimeModel.with_defaults(
            model="gpt-4o-mini",
            voice="alloy",
        ) if USE_REALTIME else None

        # Pipeline: STT → LLM → TTS
        await ctx.connect(auto_subscribe=rtc.AutoSubscribe.AUDIO_ONLY)

        agent = ctx.create_agent(
            vad=silero.VAD.load(),
            stt=deepgram.STT(
                model="nova-3-general",
                smart_format=True,
                endpointing=300,
            ),
            llm=openai.LLM(
                model="gpt-4o-mini",
                chat_ctx=chat_ctx,
            ),
            tts=cartesia.TTS(
                model="sonic-english",
                voice="your-voice-id",
            ),
        )

        @agent.on("user_speech_committed")
        def on_speech(transcript: str):
            logger.info(f"User: {transcript}")

        @agent.on("agent_speech_committed")
        def on_agent_speech(text: str):
            logger.info(f"Agent: {text}")

        agent.start(ctx.room)
        await agent.say("Hello! How can I help you today?")
        await agent.run()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=VoiceAssistant().entrypoint))
```

```bash
# Run with:
python agent.py dev  # development mode with local LiveKit server
python agent.py start  # production mode against LiveKit Cloud
```

---

## Troubleshooting Latency Regressions

```
P50 > 500ms:
  → Check network RTT between agent and API endpoints (geo mismatch?)
  → Is interim_results: true on Deepgram?
  → Are you streaming TTS or waiting for full LLM response?

P99 > 1000ms:
  → Cold start issue? Use persistent VMs
  → LLM timeout/retry? Add observability to each phase
  → Deepgram endpointing too long? Reduce to 200ms and test

Choppy audio / bad prosody:
  → Are you flushing TTS word-by-word? Switch to sentence-level
  → Audio codec mismatch? Ensure Opus end-to-end
  → Buffer underrun? Check TTS queue depth

Agent talks over user / misses interrupts:
  → VAD threshold too low? Tune silero sensitivity
  → Interrupt handler not cancelling LLM stream? Check CancelledError handling
  → endpointing too short? User utterance split into two turns
```

---

## Related Warehouse Entries

- [deepgram] — STT, streaming WebSocket, endpointing config
- [cartesia] — TTS, Sonic model, streaming, sentence-level flushing
- [livekit] — WebRTC SFU, agents framework, VAD, interrupt handling
- [openai] — gpt-4o-mini, Realtime API, prompt caching
- [langfuse] — trace latency per pipeline stage in production
- See `stacks/voice-agent-sub-500ms.md` for the canonical stack summary
