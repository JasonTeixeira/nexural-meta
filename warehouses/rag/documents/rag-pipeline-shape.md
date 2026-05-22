# RAG pipeline shape

Every RAG recipe in the federation follows this 5-stage shape. Deviations need an ADR.

```
ingest:  upload → chunk → embed → store
query:   embed → hybrid retrieve → optional rerank → LLM synthesize → citation validate → safe-link rewrite
```

## Locked stages

1. **Chunk:** Recursive splitter, 800 tokens / 100 overlap default. Markdown-aware splitter in v1.1.
2. **Embed:** OpenAI `text-embedding-3-large`, 3072 dims. NO fallback chain (mixing embeddings = retrieval garbage).
3. **Store:** pgvector with HNSW index (recipe baseline). Qdrant via escape recipe for >1M chunks.
4. **Hybrid retrieve:** BM25 + dense, RRF fusion at k=60. Pure dense misses keyword matches; pure BM25 misses semantic.
5. **Synthesize:** LLM with `<warehouse_content>` envelope wrapping (defends against prompt injection in retrieved chunks) + citation validation post-synthesis.

## Why tenant-scoped through the whole pipeline

The retrieve fn accepts a Supabase server client carrying the user's session. RLS enforces tenant isolation at the DB. Service-role clients are NEVER passed to retrieve — they'd bypass tenant gates silently.

## Why immutable embeddings

The chunks table stores `vector(3072)` with the model name implicit. Switching embedding models would invalidate every existing row. Migration path: dump → re-chunk → re-embed → swap table.

## RRF over learned ensembling

Reciprocal Rank Fusion is naive but well-understood. Per ADR-0008 §2 we prefer well-understood over learned-but-opaque for safety-critical paths. v1.1 may add learned ensemble behind a feature flag.

## What's NOT in this warehouse

- Reranking — sits in the recipe (Cohere rerank-3 is the default; gracefully degrades to RRF score when unavailable).
- Citation parsing + validation — sits in `prompt/` warehouse.
- Safe-link rewriting — sits in `safety/` warehouse.
- LLM client — sits in `@nexural/sdk` (cost-wrapped per ADR-0007).
