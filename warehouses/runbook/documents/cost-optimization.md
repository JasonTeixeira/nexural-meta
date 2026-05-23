# Playbook: AI Cost Optimization

> **Trigger:** Your LLM bill is growing faster than revenue, or you've hit a pricing
> shock and need to cut costs without degrading quality. This playbook gives you
> the levers, in order of impact.

---

## The Four Cost Levers

Every dollar you spend on LLM inference is driven by four things:

```
1. Model size         — which model you're calling (GPT-4o vs gpt-4o-mini = ~15x cost diff)
2. Prompt size        — how many tokens you send per request
3. Cache hit rate     — fraction of tokens served from cache rather than computed fresh
4. Retry rate         — how often failed requests are retried (doubles cost silently)
```

Work through them in this order. Lever 1 and 2 have the highest ceiling; levers 3 and 4
are pure waste elimination. You can't optimize what you don't measure — add Langfuse traces
first, then attack the levers.

---

## Step 0: Measure First

```python
# Before doing anything, get a cost breakdown per request
# If you're using Langfuse, it tracks token costs automatically

# Manual cost logging if you're not using a platform yet:
import openai, time

def tracked_completion(messages, model="gpt-4o-mini"):
    start = time.perf_counter()
    response = openai.chat.completions.create(
        model=model,
        messages=messages,
    )
    latency = time.perf_counter() - start
    usage = response.usage

    cost = estimate_cost(model, usage.prompt_tokens, usage.completion_tokens)
    print(f"Model: {model} | Prompt: {usage.prompt_tokens} | "
          f"Completion: {usage.completion_tokens} | "
          f"Cost: ${cost:.5f} | Latency: {latency:.2f}s")
    return response

# Rough cost table (update quarterly — prices drop fast)
COST_PER_1M = {
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "claude-3-5-sonnet": {"input": 3.00, "output": 15.00},
    "claude-3-haiku": {"input": 0.25, "output": 1.25},
}

def estimate_cost(model, prompt_tokens, completion_tokens):
    rates = COST_PER_1M.get(model, {"input": 5.0, "output": 15.0})
    return (prompt_tokens * rates["input"] + completion_tokens * rates["output"]) / 1_000_000
```

Run this for 24 hours in production and group by feature. You'll find 80% of cost lives
in 20% of your prompt templates.

---

## Lever 1: Model Routing (Biggest Impact)

The cheapest model that produces acceptable quality is the right model. This sounds obvious
but requires an eval gate — "acceptable quality" must be measured, not guessed.

### The routing pattern

```python
# RouteLLM pattern: route cheap-then-expensive based on query complexity
# pip install routellm

from routellm.controller import Controller

# Router trained on LMSYS Arena data — predicts when cheap model will match expensive
controller = Controller(
    routers=["mf"],  # matrix factorization router
    strong_model="gpt-4o",
    weak_model="gpt-4o-mini",
)

response = controller.chat.completions.create(
    model="router-mf-0.11593",  # threshold: 0.11593 = ~40% of calls go to strong model
    messages=messages,
)
```

### Manual routing (no library)

```python
# Simple heuristic router based on task type and input features
def route_model(task: str, input_length: int, requires_reasoning: bool) -> str:
    if task in ("classification", "extraction", "summarize_short"):
        return "gpt-4o-mini"  # Mini handles these fine
    if input_length > 10_000:
        return "claude-3-5-sonnet"  # Long context; Sonnet has better long-context quality
    if requires_reasoning:
        return "gpt-4o"  # Reasoning tasks; don't cheap out
    return "gpt-4o-mini"  # Default to cheap
```

### Portkey for multi-provider routing

[Portkey](https://portkey.ai) provides a unified gateway with:

- Automatic fallbacks (if OpenAI is down, route to Anthropic)
- Cost-based routing (route to cheapest provider with acceptable quality)
- Load balancing across API keys

```python
from portkey_ai import Portkey

portkey = Portkey(api_key="PORTKEY_API_KEY")
response = portkey.chat.completions.create(
    messages=messages,
    config="cost-optimized",  # your saved config
)
```

### Cost impact at scale

| Scenario     | Baseline (100% GPT-4o) | After routing (60% mini, 40% 4o) |
| ------------ | ---------------------- | -------------------------------- |
| 100k req/day | ~$375/day              | ~$165/day (-56%)                 |
| 1M req/day   | ~$3,750/day            | ~$1,650/day (-56%)               |
| 10M req/day  | ~$37,500/day           | ~$16,500/day (-56%)              |

_Assumes 500 input tokens, 200 output tokens avg per request._

---

## Lever 2: Prompt Size Reduction

Every token in your prompt costs money. Bloated system prompts are the silent killer.

### Audit your system prompt

```python
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o-mini")

with open("prompts/system_prompt.txt") as f:
    system_prompt = f.read()

token_count = len(enc.encode(system_prompt))
print(f"System prompt: {token_count} tokens")
print(f"Daily cost of system prompt alone at 100k reqs: "
      f"${token_count * 100_000 * 0.00000015:.2f}")
```

Most system prompts can be cut 30-50% without quality loss. Common bloat:

- Redundant instructions ("Always be helpful. Be kind. Be thorough. Always be accurate.")
- Examples that aren't needed for the task
- XML/JSON schema descriptions that could be a Pydantic model instead
- Verbose role-playing preamble ("You are a helpful assistant who...")

### Context window stuffing vs retrieval

"Just put the whole document in the prompt" is seductive but expensive:

```
Document-in-prompt at 100k req/day:
  - 10k token document + 500 token query = 10,500 tokens/request
  - At GPT-4o-mini input pricing: $0.001575/request
  - Daily: $157/day for input tokens alone

RAG alternative:
  - Retrieve 5 relevant chunks (1,500 tokens) + 500 token query = 2,000 tokens
  - Daily: $30/day — 80% reduction
```

Use retrieval. The context window is your fallback, not your default retrieval strategy.

---

## Lever 3: Cache Hit Rate (Often the Fastest Win)

### Anthropic Prompt Caching

Anthropic's prompt caching is explicit — you mark which parts of your prompt to cache.
Cache writes cost 25% extra; cache hits cost 10% of normal price.

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a customer support agent for Acme Corp.",
        },
        {
            "type": "text",
            "text": open("knowledge_base.txt").read(),  # 50k tokens
            "cache_control": {"type": "ephemeral"},     # ← cache this prefix
        }
    ],
    messages=[{"role": "user", "content": user_message}],
)
```

**When Anthropic caching helps:** Long system prompts (>1024 tokens), RAG contexts where
the same document is used in multiple queries, multi-turn conversations where early turns
are stable. Cache TTL is 5 minutes (ephemeral) or up to 1 hour (requires higher tier).

**Break-even:** If the same context is used ≥4 times, caching is net cheaper
(1 cache write × 1.25 + 3 cache hits × 0.10 = 1.55 vs 4 × 1.0 = 4.0).

### OpenAI Prompt Caching

OpenAI's caching is automatic (no code changes needed) for prompts >1024 tokens.
Cache hits are 50% discount on input tokens. The cache key is the exact prompt prefix.

```python
# No code change needed — OpenAI caches automatically
# Check cache usage in the API response:
response = openai.chat.completions.create(
    model="gpt-4o-mini",
    messages=[system_message, *conversation_history, user_message],
)

# Cache metrics (available in usage object):
cached_tokens = response.usage.prompt_tokens_details.cached_tokens
print(f"Cached: {cached_tokens} / {response.usage.prompt_tokens} tokens")
```

**Key constraint:** The cached prefix must be stable. If you put dynamic content (timestamps,
request IDs) early in the prompt, you break caching for everything after it. Structure
prompts as: stable system prompt → stable context → dynamic user input.

```python
# WRONG: dynamic content early kills cache
messages = [
    {"role": "system", "content": f"Time: {datetime.now()} | {long_stable_prompt}"}
]

# RIGHT: stable prefix, dynamic content last
messages = [
    {"role": "system", "content": long_stable_prompt},  # ← cached
    {"role": "user", "content": f"[{datetime.now()}] {user_message}"},  # ← dynamic, last
]
```

### KV Cache Reuse in Agentic Chains

In multi-step agent loops, the same system prompt and tool definitions are resent on every
turn. This is expensive and unnecessary.

```python
# Pattern: front-load your stable context and let the provider cache it
# In Pydantic AI / OpenAI Agents SDK style:

SYSTEM = """
You are a research assistant with access to the following tools.
[... 2000 tokens of tool descriptions and instructions ...]
"""

# For multi-turn: preserve the history list across turns
# The system + early history are cached; only new messages add cost
history = []

def agent_turn(user_input: str) -> str:
    history.append({"role": "user", "content": user_input})

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": SYSTEM}] + history,
    )

    assistant_msg = response.choices[0].message.content
    history.append({"role": "assistant", "content": assistant_msg})
    return assistant_msg
```

---

## Lever 4: Batch API (50% Off, 24h SLA)

OpenAI's Batch API processes requests asynchronously within 24 hours at 50% cost reduction.
Anthropic has an equivalent.

### When to use Batch API

✓ Nightly data extraction pipelines
✓ Bulk document classification
✓ Generating embeddings for a large corpus
✓ Running evals (no latency requirement)
✓ Preprocessing data for fine-tuning
✗ User-facing features (not worth the latency)
✗ Anything with <1 hour SLA

```python
import openai, json
from pathlib import Path

client = openai.OpenAI()

# Step 1: Create batch file
requests = [
    {
        "custom_id": f"request-{i}",
        "method": "POST",
        "url": "/v1/chat/completions",
        "body": {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "Extract the company name from this text."},
                {"role": "user", "content": text},
            ],
            "temperature": 0,
        }
    }
    for i, text in enumerate(documents)
]

batch_file = Path("/tmp/batch_requests.jsonl")
batch_file.write_text("\n".join(json.dumps(r) for r in requests))

# Step 2: Upload and submit
with open(batch_file, "rb") as f:
    uploaded = client.files.create(file=f, purpose="batch")

batch = client.batches.create(
    input_file_id=uploaded.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
)

print(f"Batch submitted: {batch.id}")

# Step 3: Poll and download (run separately, hours later)
import time

while True:
    batch_status = client.batches.retrieve(batch.id)
    if batch_status.status in ("completed", "failed"):
        break
    time.sleep(60)

# Download results
output = client.files.content(batch_status.output_file_id)
results = [json.loads(line) for line in output.text.splitlines()]
```

**Cost impact:** At 1M classification requests/day using Batch API:

- Normal: $150/day (gpt-4o-mini, 1000 tokens avg)
- Batch: $75/day (-50%)
- Monthly savings: $2,250

---

## Embedding Cost Optimization

Embeddings are often overlooked but can be a significant line item at scale.

| Model                    | Cost per 1M tokens | Quality (MTEB avg) | Notes                                      |
| ------------------------ | ------------------ | ------------------ | ------------------------------------------ |
| `text-embedding-3-small` | $0.02              | 62.3               | OpenAI default, fine for most              |
| `text-embedding-3-large` | $0.13              | 64.6               | 6.5x more expensive, marginal quality gain |
| `voyage-3-large`         | $0.06              | 68.3               | Best quality/$ for retrieval               |
| `BGE-M3` self-hosted     | ~$0.001 (GPU cost) | 65.0               | 60x cheaper at scale; multilingual         |
| `nomic-embed` via Ollama | $0                 | 55.0               | Free, local, good for dev                  |

**The break-even for self-hosting BGE-M3:**

At $0.06/1M tokens (Voyage) vs $0.001/1M tokens (self-hosted BGE on A10G at $0.44/hr):

```
Break-even usage = GPU cost / (voyage price - self-host price)
= $0.44/hr / ($0.06 - $0.001) per 1M tokens
= Break-even at ~7.5M tokens/hour = ~180M tokens/day

If you're embedding >180M tokens/day, self-host.
Below that, pay the API.
```

**Always cache embeddings.** Re-embedding the same text is pure waste. Store embeddings
with a content hash as the cache key:

```python
import hashlib

def get_or_compute_embedding(text: str, model: str = "text-embedding-3-small") -> list[float]:
    key = hashlib.sha256(f"{model}:{text}".encode()).hexdigest()

    # Check DB cache first
    cached = db.execute("SELECT embedding FROM embedding_cache WHERE key = ?", [key]).fetchone()
    if cached:
        return json.loads(cached[0])

    # Compute and cache
    embedding = openai.embeddings.create(input=text, model=model).data[0].embedding
    db.execute("INSERT INTO embedding_cache VALUES (?, ?)", [key, json.dumps(embedding)])
    return embedding
```

---

## vLLM Self-Host Break-Even Math

When does running your own vLLM server beat paying OpenAI?

**Assumptions:** GPT-4o-mini equivalent quality at self-hosted Llama 3.1 8B Instruct.

```
API cost:      $0.15/1M input + $0.60/1M output tokens
               ≈ $0.225/1M total tokens (assuming 60/40 input/output mix)

Self-host on RunPod A10G ($0.44/hr):
  vLLM throughput on Llama 3.1 8B: ~3,000 tokens/sec
  Daily capacity at 100% utilization: 3,000 × 3600 × 24 = 259M tokens/day
  Daily server cost: $0.44 × 24 = $10.56/day
  Self-host cost: $10.56 / 259M = $0.000041/1M tokens

Break-even: API ($0.225/1M) / Self-host ($0.000041/1M) ratio = 5,500x cheaper at full utilization
BUT: utilization is never 100%.

Realistic break-even (20% utilization):
  Effective self-host cost: $0.000041 / 0.20 = $0.000205/1M tokens
  API cost: $0.225/1M tokens
  Still 1,100x cheaper per token

HOWEVER: API has zero ops overhead. Add $2,000-5,000/month in engineer time to manage
self-hosted inference. This changes the break-even:

At 100k req/day, 500 tokens avg = 50M tokens/day:
  API cost: $11.25/day = $337/mo
  Self-host: $10.56/day = $317/mo + ops overhead

At 1M req/day, 500 tokens avg = 500M tokens/day:
  API cost: $112.50/day = $3,375/mo
  Self-host: $10.56/day = $317/mo (still pays for itself even with ops overhead)
```

**Rule:** Self-host vLLM when your token volume exceeds 500M tokens/day OR when data
sovereignty/privacy requirements mandate it. Below that threshold, the ops overhead
erodes the cost savings.

---

## Speculative Decoding for Production

Speculative decoding uses a small "draft" model to predict multiple tokens at once, then
verifies them with the large model in parallel. Effective when:

- Output consists of predictable patterns (structured JSON, code, formulaic text)
- The draft model is 5-10x smaller than the target model
- Your serving infrastructure supports it (vLLM does, by default)

```python
# In vLLM: speculative decoding is a server config option
# vllm serve meta-llama/Llama-3.1-70B-Instruct \
#   --speculative-model meta-llama/Llama-3.2-1B-Instruct \
#   --num-speculative-tokens 5 \
#   --gpu-memory-utilization 0.9
```

**Throughput improvement:** 1.5-3x on structured output tasks. Less effective on
creative/conversational tasks where tokens are hard to predict.

---

## Concrete Dollar Examples

### Scenario: Customer support classifier, 100k req/day

```
Naive (100% GPT-4o, 2k token prompt):
  Input: 100k × 2,000 × $2.50/1M = $500/day = $15,000/mo

After optimization:
  1. Route to gpt-4o-mini (classification task, mini works fine): -93%
  2. Trim prompt from 2k to 500 tokens (remove redundant instructions): -75% on remaining
  3. OpenAI auto-caching on stable 400-token prefix: -50% on cached portion

  Optimized: 100k × 500 tokens × $0.15/1M × 0.5 (cache hit) = $3.75/day = $113/mo
  Savings: $14,887/mo (-99%)
```

### Scenario: RAG pipeline, 1M req/day

```
Naive (GPT-4o, 10k token context stuffed):
  Input: 1M × 10,000 × $2.50/1M = $25,000/day

After optimization:
  1. Model: route 70% to Claude Haiku ($0.25/1M), 30% to Claude Sonnet ($3/1M)
  2. RAG: retrieve 5 chunks (~1,500 tokens) instead of full doc (-85% input tokens)
  3. Anthropic prompt caching on 1,000-token system prompt + knowledge base prefix
  4. Batch API for non-realtime queries (50% discount on 60% of traffic)

  Optimized daily cost: ~$375/day
  Savings: $24,625/day = $738,750/mo (-98.5%)
```

### Scenario: Agentic coding assistant, 10M req/day

```
Naive (GPT-4o, 8k avg tokens per turn, 5 turns per session = 40k tokens/session):
  2M sessions × 40k tokens × $2.50/1M = $200,000/day

After optimization:
  1. Model routing: Haiku for simple turns, Sonnet for code generation, GPT-4o for debugging
  2. KV cache reuse: system prompt + tool definitions (~3k tokens) cached across all turns
  3. Session context pruning: summarize old turns rather than keeping full history
  4. Self-hosted vLLM for Llama 3.1 70B for Haiku-equivalent tasks (50% of volume)
  5. Batch processing for background analysis tasks

  Optimized: ~$8,000-12,000/day
  Savings: ~$188,000/day = $5.6M/mo (-94%)
```

---

## Related Warehouse Entries

- [`langfuse`] — tracing; gives you cost-per-request visibility before optimizing
- [`modal`] — serverless GPU for self-hosted inference
- [`routellm`] — open-source LLM router for cheap-then-expensive patterns
- [`portkey`] — multi-provider gateway with routing and fallbacks
- [`vllm`] — self-hosted inference server with PagedAttention and speculative decoding
- [`braintrust`] — eval platform; run evals before and after optimization to verify quality held

---

## Quick Reference Checklist

```
Week 1 (measure):
  [ ] Langfuse or manual cost logging in place
  [ ] Cost breakdown by feature/prompt template
  [ ] Identify top 3 cost drivers

Week 2 (quick wins):
  [ ] Trim bloated system prompts (>500 tokens is worth auditing)
  [ ] Move classification/extraction tasks to gpt-4o-mini or Claude Haiku
  [ ] Verify prompt structure enables caching (stable prefix first)

Week 3 (leverage):
  [ ] Implement LLM routing for your highest-volume feature
  [ ] Move non-realtime batch jobs to Batch API (50% off)
  [ ] Add embedding cache for repeat content

Month 2:
  [ ] Evaluate self-hosted embeddings if >10M tokens/day
  [ ] Evaluate vLLM self-host if >500M tokens/day
  [ ] Implement speculative decoding if running structured output at high volume
```
