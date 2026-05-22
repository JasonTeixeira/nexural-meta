# Recipe — `saas-rag-chat`

Chat product with Retrieval-Augmented Generation over user-uploaded documents.

Extends `saas-multitenant-baseline`. Per BUILD_PLAN §Phase 6.

## Forge

```bash
nx forge saas-rag-chat my-rag-app \
  --displayName "My RAG Chat" \
  --rootDomain my-rag.com
```

## What you get (on top of the parent recipe)

- **pgvector** with HNSW index (3072 dims, cosine similarity)
- **Hybrid search**: BM25 + dense, RRF fusion, optional Cohere rerank
- Document upload pipeline (PDF, MD, TXT, DOCX up to 50 MB)
- Chat UI with token-level streaming + inline citations
- Safe-link rewrite (defeats LLM URL exfiltration)
- 50-item eval golden set scaffold
- Conversation history (10k message cap, per-tenant LRU)

## Stack (inherits parent)

- Next.js 15 + Supabase + Stripe + Sentry + PostHog
- Anthropic Opus primary, OpenAI flagship fallback, Ollama emergency (per ADR-0007)

## Cost discipline

```yaml
hard_caps:
  per_request_usd: 0.50
  per_user_per_day: 5
  per_app_per_day: 100
```

500k-token Opus queries (~$7.50) are pre-flight rejected. Per-user/app caps
prevent abuse. Per ADR-0007 + ADR-0010 §2.4 streaming abort.

## Safety controls

| Threat                      | Defense                                                 |
| --------------------------- | ------------------------------------------------------- |
| Prompt injection in uploads | Envelope wrapping + citation validation (ADR-0008 §1)   |
| Cost runaway                | llmClient hard caps + streaming abort (ADRs 0007, 0010) |
| Hallucinated citations      | Post-synthesis stripping (ADR-0008 §1)                  |
| PII in embeddings           | Tenant-scoped queries + RLS                             |
| Output URL exfiltration     | Safe-link rewrite + log                                 |

## Escape recipes

- `saas-rag-chat-qdrant` — Qdrant primary for > 1M chunks
- `saas-rag-chat-openai-first` — OpenAI-primary model chain

## Inputs

See `inputs.zod.ts`. Notable knobs: `vectorStore`, `topK`, `rerankEnabled`,
`maxDocSizeMb`, `goldenSetStrict`.

## License

MIT (recipe). Output app: MIT (configurable).
