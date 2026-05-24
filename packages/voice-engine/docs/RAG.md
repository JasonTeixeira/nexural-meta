# Production RAG for Voice Agents

How to give your voice agent knowledge about _your_ app, your product,
your domain — without retraining anything.

Inspired by ai-warehouse `stacks/production-rag.md` (CC BY-SA 4.0 © Jason Teixeira),
adapted for voice-engine personas.

---

## TL;DR

Run the bundled RAG MCP server (`mcp-servers/rag/`). Ingest your docs.
Point the persona at the server URL. The voice agent gets a
`search_knowledge` tool and uses it on-demand. Total setup: ~5 min.

```bash
cd mcp-servers/rag
pip install -e .
export OPENAI_API_KEY=sk-...
rag-mcp ingest-dir ./my-docs       # one-time
rag-mcp serve --http --port 7800   # runtime
```

In `persona.yaml`:

```yaml
mcp_servers:
  - name: knowledge
    url: http://localhost:7800/sse
```

In `system_prompt`:

> When the user asks about <topic>, ALWAYS call `search_knowledge` first.

---

## When you need RAG vs when you don't

**Use RAG when:**

- Your agent should know facts specific to your app (pricing, policies, docs)
- Content changes faster than you'd want to re-edit a prompt
- The knowledge is too large to fit in the system prompt (>2-3k tokens)
- You need traceable sources ("according to our docs…")

**Skip RAG when:**

- The agent's job is mostly conversational (coach, tutor, therapist)
- The "knowledge" is small + stable (just put it in the prompt)
- You need real-time data (use a regular MCP tool calling your API)

---

## Architecture (what the engine does for you)

```
                ┌──────────────────────────────┐
                │  User speaks                 │
                └──────────────┬───────────────┘
                               ▼
            ┌─────────────────────────────────┐
            │ Voice persona (LLM)             │
            │ "User asked about pricing →     │
            │  let me check our docs"         │
            └──────────────┬──────────────────┘
                           │ MCP call
                           ▼
            ┌─────────────────────────────────┐
            │ RAG MCP server                  │
            │  • Embed query (OpenAI)         │
            │  • sqlite-vec / Qdrant search   │
            │  • Return top-k chunks          │
            └──────────────┬──────────────────┘
                           ▼ chunks
            ┌─────────────────────────────────┐
            │ LLM composes spoken reply       │
            │ "Our Pro plan is $99/mo for…"   │
            └──────────────┬──────────────────┘
                           ▼
                ┌─────────────────────────────┐
                │  TTS speaks the reply       │
                └─────────────────────────────┘
```

The voice persona decides _when_ to retrieve — driven by the system
prompt's instructions. You don't have to retrieve on every turn (which
adds latency); only when the agent needs grounded facts.

---

## Embedding model choice

We default to **OpenAI `text-embedding-3-small`** (1536d, $0.02/1M tokens).
Reasons:

- Cheapest serious option ($0.001 per 1000 chunks)
- 1536d is small enough to be fast on sqlite-vec
- Already on your OpenAI key

When to switch:
| Model | Why | Cost |
|---|---|---|
| `text-embedding-3-large` (3072d) | Higher recall on technical docs | 6× more |
| **Voyage `voyage-3`** | Best retrieval quality 2026 | $0.06/1M |
| **bge-large-en-v1.5** (self-hosted) | Free at scale, runs on CPU | $0 |
| Cohere `embed-v4` | Best multilingual | $0.10/1M |

Swap by editing `_embed()` in `mcp-servers/rag/src/rag_mcp/store.py`.

---

## Chunking strategy

Default chunker: paragraph-aware, max 1200 chars, 200-char overlap.
Good for prose, docs, FAQs, marketing copy.

For other content types:

| Content                   | Strategy                                       |
| ------------------------- | ---------------------------------------------- |
| **Code/API docs**         | Function/class boundaries; preserve signatures |
| **Long-form transcripts** | Topic-modeled segments (BERTopic), 30s windows |
| **Tables / structured**   | Don't chunk — store rows whole                 |
| **Conversational logs**   | Per-turn or per-conversation                   |

When to customize: if `search_knowledge` returns chunks that "cut off
mid-thought", chunking is wrong. Tweak `chunk_text()` for your shape.

---

## Latency budget for RAG-enabled voice

Adds ~150-300ms per call to `search_knowledge`:

| Stage                      | Time                                |
| -------------------------- | ----------------------------------- |
| Embedding (OpenAI small)   | ~80ms                               |
| Vector search (sqlite-vec) | ~5-20ms (10k chunks) / ~50ms (100k) |
| Round-trip MCP call        | ~50ms                               |
| **Total**                  | **~150-300ms**                      |

That's ON TOP of the LLM latency. Mitigations:

1. **Don't search every turn.** Tell the persona in the prompt: "Only
   search when the user explicitly asks about <X>."
2. **Pre-warm embeddings** for the most common queries (cache hit rate
   ~80% for FAQ-style products).
3. **Top-k = 3, not 10.** Smaller results = faster LLM consumption =
   shorter answers.

For voice, **<500ms RAG round-trip** is the goal. Above that, users
notice "the agent is thinking."

---

## Multi-app RAG isolation

Each Sage app gets its own RAG DB. Set `RAG_DB` env var per worker:

```bash
# App 1
RAG_DB=./app1-rag.sqlite rag-mcp serve --http --port 7800

# App 2 (separate server, separate DB)
RAG_DB=./app2-rag.sqlite rag-mcp serve --http --port 7801
```

Persona points at the right one:

```yaml
mcp_servers:
  - name: knowledge
    url: http://localhost:7800/sse # app1
```

This is the cleanest isolation pattern: physical separation, no
cross-app leakage possible.

---

## Scaling cliff: when sqlite-vec stops being enough

| Chunks    | Default                   | Notes                               |
| --------- | ------------------------- | ----------------------------------- |
| < 100k    | sqlite-vec                | Default, no changes needed          |
| 100k – 1M | sqlite-vec with HNSW      | Add `vec_chunks` HNSW index         |
| 1M – 100M | **Qdrant**                | Same MCP interface, swap `store.py` |
| > 100M    | Qdrant cluster + sharding | Multi-region indexes                |

When you swap to Qdrant, the MCP server's tool surface stays identical.
Your persona YAML doesn't change. Only `store.py` changes.

---

## Evaluating retrieval quality

A retrieval is "good" if:

- The relevant chunk is in the top-3 ≥ 90% of the time
- The agent quotes/uses the chunk in its reply
- The user doesn't have to repeat or rephrase

Quick eval pattern (add to your `<persona>.scenarios.yaml`):

```yaml
- name: rag_finds_pricing
  persona: receptionist
  steps:
    - user: "What's your Pro plan cost?"
      assert:
        must_contain: ["99", "Pro"] # exact figures from your docs
        custom_check: |
          Agent should cite the pricing from search_knowledge, not guess.
```

When `nx-voice eval` shows this scenario failing repeatedly, retrieval
is broken — re-ingest, try a bigger embedding model, or fix chunking.

---

## Common mistakes to avoid

1. **Ingesting marketing fluff alongside operational facts.** Marketing
   pages are full of vague phrases the LLM will quote verbatim. Keep
   precise content (pricing, hours, policies, SLAs) in its own
   high-priority dataset.

2. **Forgetting to re-ingest after content changes.** RAG is a snapshot.
   Add `ingest-dir` to your deploy pipeline so docs stay fresh.

3. **Letting the agent search on every turn.** Costs add up; latency
   doubles. The prompt should be explicit about when retrieval is
   warranted.

4. **Returning the chunk text verbatim in the voice reply.** That's
   text, not speech. The LLM should _paraphrase_ the chunk into
   conversational language.

5. **Not chunking large tables.** A 50-row pricing table becomes one
   uninformative blob. Pre-process tables into row-per-chunk format.

---

## Reference implementation

Everything is in `mcp-servers/rag/`:

- `src/rag_mcp/store.py` — embedding + vector search
- `src/rag_mcp/server.py` — MCP tool definitions + CLI
- `tests/` — chunker + schema tests

Fork the whole directory per app, swap `KnowledgeStore` backend if
needed, and you've got a per-app RAG surface that the engine speaks
to seamlessly.

---

## Credit

Patterns + ranking framework distilled from
[ai-warehouse](https://github.com/JasonTeixeira/ai-warehouse)
(MIT for code, CC BY-SA 4.0 for content — © Jason Teixeira).
