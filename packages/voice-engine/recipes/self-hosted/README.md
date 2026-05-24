# Self-hosted voice stack

When one of your apps crosses ~50 concurrent users, cloud-API costs
start to bite. Flip the persona to `tier-self-hosted.yaml` and route
through your own infrastructure. ~78× cheaper at scale.

## What's running

| Service        |  Port | Purpose                                      |
| -------------- | ----: | -------------------------------------------- |
| LiveKit Server |  7880 | WebRTC transport (replaces LiveKit Cloud)    |
| Ollama         | 11434 | Llama 4 / 3.3 LLM (OpenAI-compatible API)    |
| Kokoro TTS     |  8002 | Apache-2.0 TTS (OpenAI-compatible audio API) |
| Whisper STT    |  8001 | faster-whisper service                       |
| Qdrant         |  6333 | Vector DB for RAG + memory                   |

## Start the stack

```bash
cd recipes/self-hosted
docker compose up -d

# First time only: pull a model into Ollama
docker exec self-hosted-ollama-1 ollama pull llama3.3:70b
# or smaller for testing:
docker exec self-hosted-ollama-1 ollama pull llama3.2:3b
```

## Point the engine at it

In any persona YAML, change one line:

```yaml
extends: ../../personas/_base/tier-self-hosted.yaml
```

Then export the base-URL env vars before starting the worker:

```bash
export LIVEKIT_URL=ws://localhost:7880
export LIVEKIT_API_KEY=devkey
export LIVEKIT_API_SECRET=secret
export OPENAI_BASE_URL=http://localhost:11434/v1   # Ollama
export OPENAI_API_KEY=ollama                       # Ollama ignores it
# (Whisper STT shim left as TODO — engine falls back to cloud STT
# unless you wire a Deepgram-compatible shim or build a custom STT plugin.)

nx-voice serve --persona personas/my_app.yaml -- dev
```

## Cost shape

| Component                       |        Cloud |                                                   Self-hosted |
| ------------------------------- | -----------: | ------------------------------------------------------------: |
| Transport                       |   $0–0.06/hr |                                            $0 (one $20/mo VM) |
| LLM                             |    $0.012/hr | $0.30–1.10/hr per GPU, **shared across all concurrent users** |
| TTS                             |     $0.30/hr |                                                      $0 (CPU) |
| STT                             |     $0.46/hr |                                                    $0–0.05/hr |
| **Per concurrent user @ scale** | **$0.78/hr** |                                                 **~$0.05/hr** |

Break-even: ~50 concurrent users. Below that, cloud APIs are cheaper
(after accounting for your time). Above that, self-hosting saves
exponentially.

## When this isn't enough

- **>1000 concurrent users:** swap Ollama → vLLM + Triton for batched
  inference. Cuts cost per request by another ~3×.
- **Multi-region:** deploy this stack to one VM per region. Each app's
  Fly worker connects to the nearest LiveKit server.
- **Compliance (HIPAA/PCI):** all data stays on your hosts — that's the
  whole point. Audit logs land in Qdrant or your DB of choice.

## Hardware sizing

| User load        | Setup                                             |
| ---------------- | ------------------------------------------------- |
| Dev / smoke test | MacBook with docker (use llama3.2:3b)             |
| 1-10 concurrent  | One Fly GPU VM ($30/mo)                           |
| 50 concurrent    | One A10G GPU + 4 vCPU host (~$250/mo)             |
| 500 concurrent   | 3× A10G or 1× A100 + load balancer (~$1500/mo)    |
| 5000 concurrent  | Dedicated GPU cluster, vLLM/Triton, K8s (~$8K/mo) |

At 5000 concurrent users:

- Cloud cost would be ~$3900/hr = $2.8M/year
- Self-hosted: ~$8K/mo = $96K/year
- **Savings: $2.7M/year**
