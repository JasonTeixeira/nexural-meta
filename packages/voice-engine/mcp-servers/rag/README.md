# nexural-mcp-rag

Drop-in RAG server for any Nexural voice persona. SQLite + sqlite-vec
backed — zero ops, runs anywhere, scales to ~1M chunks before you need
a real vector DB. Fork the directory per app.

## Why this exists

Your voice agents need to know things about your app — product docs,
policies, knowledge base, FAQs. RAG is how. This server:

1. Ingests your content (markdown, txt, html).
2. Embeds + stores it in SQLite locally.
3. Exposes `search_knowledge(query)` as an MCP tool.
4. The voice persona calls it mid-conversation; LLM cites the result.

Same wire interface (MCP) as the bigger vector DBs — when you outgrow
sqlite-vec, swap `store.py` for Qdrant/pgvector; personas don't change.

## Install

```bash
cd packages/voice-engine/mcp-servers/rag
pip install -e .
export OPENAI_API_KEY=sk-...   # for embeddings (~$0.001 per 1000 chunks)
```

## Ingest your knowledge

```bash
# One file:
rag-mcp ingest --file ./docs/about.md --title "About Us"

# A whole directory (.md / .txt / .html recursively):
rag-mcp ingest-dir ./docs

# Check what's in there:
rag-mcp stats
```

## Wire it into a persona

```yaml
mcp_servers:
  - name: knowledge
    url: http://localhost:7800/sse
```

Run the server: `rag-mcp serve --http --port 7800`.

The voice agent now has a `search_knowledge(query)` tool. Update the
persona's `system_prompt` to tell it when to use it:

```yaml
system_prompt: |
  ...
  When the user asks about our product, pricing, or policies, ALWAYS
  call `search_knowledge` first. Quote the result sparingly — this is
  voice. Summarise in one or two sentences.
```

## Tools the agent gets

| Tool                           | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| `search_knowledge(query, k=5)` | Top-k relevant chunks                            |
| `list_topics()`                | List document titles ("what do you know about?") |

## Fork pattern (per app)

```bash
cp -r mcp-servers/rag mcp-servers/rag-myapp
$EDITOR mcp-servers/rag-myapp/pyproject.toml   # rename to nexural-mcp-rag-myapp
$EDITOR mcp-servers/rag-myapp/src/rag_mcp/server.py   # rename FastMCP("nexural-rag-myapp")
```

Each app gets its own knowledge store (`./rag-myapp.sqlite`), its own
server, its own MCP URL. Voice engine stays identical.

## When to outgrow this

- **<100K chunks:** SQLite is great.
- **100K–1M chunks:** still fine, may want to add HNSW indexing.
- **>1M chunks or multi-region:** swap `store.py` for Qdrant or
  pgvector. Tool surface stays the same; persona YAML stays the same.

## Cost

- Embeddings: $0.02 per 1M tokens (text-embedding-3-small).
- Storage: SQLite, on disk, free.
- Search: pure SQL, no API cost.

For a 50-page product doc (~150K chars), one-time ingest cost ≈ $0.005.
Search at runtime: $0.0001 per query.
