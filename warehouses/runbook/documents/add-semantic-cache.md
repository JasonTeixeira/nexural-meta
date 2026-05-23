# Playbook: Add Semantic Cache to a Production LLM App

**Last updated:** 2026-05-20
**Expected outcome:** 40–80% reduction in LLM API costs on repeated-query workloads
**Time to implement:** 2–4 hours (OSS path) or 30 min (managed path)

---

## Step 1: Pick Your Cache Layer

Not all caches are equal. Choose based on your query patterns:

| Pattern                                     | Cache type                     | Tool                                                      |
| ------------------------------------------- | ------------------------------ | --------------------------------------------------------- |
| Templated prompts with bounded variations   | **Exact-match**                | `redis-prompt-cache`                                      |
| Free-form queries with semantic repetition  | **Semantic (embedding-based)** | `gptcache` or `upstash-semantic-cache`                    |
| Multi-turn agents with session memory       | **Memory cache**               | `zep-cache` or `mem0-cache`                               |
| Shared prefix (system prompt + RAG context) | **KV/prefix cache**            | `vllm-prefix-cache` (inference layer)                     |
| Gateway-level, zero code change             | **Gateway cache**              | `cloudflare-ai-gateway`, `litellm-cache`, `portkey-cache` |

**Decision rule:**

- Serverless/edge → `upstash-semantic-cache`
- Self-hosted, OSS preference → `gptcache`
- Already on LiteLLM proxy → `litellm-cache`
- Already on Cloudflare → `cloudflare-ai-gateway`
- Already on Portkey → `portkey-cache`

---

## Step 2: Wire GPTCache (OSS path)

Install:

```bash
pip install gptcache
```

Basic LangChain integration:

```python
from gptcache import cache
from gptcache.adapter.langchain_models import LangChainLLMs
from gptcache.embedding import Onnx
from gptcache.manager import CacheBase, VectorBase, get_data_manager
from gptcache.similarity_evaluation.distance import SearchDistanceEvaluation
from langchain_openai import ChatOpenAI

# Initialize embedding model (runs locally, no API cost)
onnx = Onnx()

# Configure data manager: SQLite for responses + Faiss for vectors
data_manager = get_data_manager(
    CacheBase("sqlite"),
    VectorBase("faiss", dimension=onnx.dimension)
)

# Init cache with similarity threshold
cache.init(
    embedding_func=onnx.to_embeddings,
    data_manager=data_manager,
    similarity_evaluation=SearchDistanceEvaluation(),
)
cache.set_openai_key()

# Wrap your LLM — all calls now go through the cache
llm = LangChainLLMs(llm=ChatOpenAI(model="gpt-4o-mini"))
```

For non-LangChain OpenAI calls:

```python
from gptcache.adapter import openai

# Drop-in replacement — same API as openai.chat.completions.create
response = openai.ChatCompletion.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": query}]
)
```

---

## Step 3: Wire Upstash Semantic Cache (managed/serverless path)

Install:

```bash
npm install @upstash/semantic-cache @upstash/vector
# or
pip install upstash-semantic-cache
```

TypeScript (Next.js / Vercel):

```typescript
import { SemanticCache } from "@upstash/semantic-cache";
import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const cache = new SemanticCache({ index, minProximity: 0.85 });

async function cachedLLMCall(prompt: string): Promise<string> {
  // Check cache first
  const cached = await cache.get(prompt);
  if (cached) {
    console.log("cache hit");
    return cached;
  }

  // Cache miss — call LLM
  const response = await openai.chat.completions.create({ ... });
  const answer = response.choices[0].message.content!;

  // Store result
  await cache.set(prompt, answer);
  return answer;
}
```

---

## Step 4: Set the Similarity Threshold

**Start at 0.85 cosine similarity.** This is the most consequential parameter:

| Threshold | Behavior                                                 | Risk                                                        |
| --------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| 0.70      | Very aggressive — many similar prompts served from cache | False positives: wrong cached answer for different question |
| 0.85      | **Recommended starting point**                           | Balanced                                                    |
| 0.95      | Conservative — only near-identical prompts hit cache     | Low hit rate; minimal cost savings                          |

Tune based on your domain:

- **FAQ / support bots**: 0.80–0.85 (questions rephrase often)
- **Data extraction / classification**: 0.90–0.95 (precision matters)
- **Creative / generative**: don't cache — responses should vary

---

## Step 5: Measure Hit Rate

Add cache hit/miss logging from day one. In Langfuse or your observability tool:

```python
# Track cache performance as a custom metric
from langfuse import Langfuse

langfuse = Langfuse()

def track_cache_event(hit: bool, latency_ms: float, tokens_saved: int = 0):
    langfuse.score(
        name="cache_hit",
        value=1.0 if hit else 0.0,
        comment=f"latency={latency_ms}ms tokens_saved={tokens_saved}"
    )
```

Key metrics to track weekly:

- **Hit rate** (target: >30% before celebrating, >60% = excellent)
- **Latency p50/p95** (cache hit should be <10ms vs. LLM call 200-2000ms)
- **Tokens saved** (multiply by your model's cost per token for dollar savings)

---

## Step 6: Expected Cost Reduction

Realistic ranges by workload type:

| Workload                           | Expected hit rate | Cost reduction |
| ---------------------------------- | ----------------- | -------------- |
| Support / FAQ bot                  | 50–80%            | 50–80%         |
| Document summarization (same docs) | 40–70%            | 40–70%         |
| Search / retrieval augmentation    | 20–50%            | 20–50%         |
| Unique user queries (chat)         | 5–20%             | 5–20%          |
| Creative / coding                  | <5%               | Negligible     |

A support bot handling 100k queries/month at GPT-4o pricing ($2.50/1M input tokens):

- Avg 500 tokens/query → 50M tokens/month → $125
- With 70% cache hit rate → 15M tokens/month → $37.50
- **Savings: $87.50/mo** (70% reduction)

---

## Gotchas to Avoid

1. **Cache invalidation on prompt changes**: When you update your system prompt or few-shot examples, flush or namespace the cache. Stale caches return wrong answers silently.

2. **Embedding model drift**: If you switch embedding models (e.g., `text-embedding-ada-002` → `text-embedding-3-small`), old cache entries are based on a different embedding space. Old entries will generate incorrect similarity scores. Namespace by model version: `cache_v2_` prefix.

3. **Don't cache sensitive data**: Prompts containing PII, PHI, or confidential data should bypass the cache entirely. Add a filter before the cache check.

4. **Streaming + caching**: Most semantic cache implementations don't support SSE streaming. Return cached results as non-streamed responses; only non-cached results stream. Test your frontend handles mixed modes.

5. **Cold start period**: Cache hit rate will be near zero for the first 24-72 hours. Don't kill the cache because it "isn't working" — it needs traffic volume to warm up.

---

## Related Warehouse Resources

- `tools/caching/gptcache` — OSS default
- `tools/caching/upstash-semantic-cache` — managed/serverless default
- `tools/caching/cloudflare-ai-gateway` — gateway-native, zero code
- `tools/caching/redis-prompt-cache` — exact-match pattern
- `stacks/cost-optimized-llm-app` — full cost optimization stack reference
- `playbooks/cost-optimization` — broader cost reduction strategies
