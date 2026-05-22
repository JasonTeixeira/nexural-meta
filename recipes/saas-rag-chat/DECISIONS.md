# DECISIONS — `saas-rag-chat`

Per ADR-0008 §7. Inherits from `saas-multitenant-baseline/DECISIONS.md` with
these RAG-specific opinions locked:

## RAG pipeline

| Decision               | Choice                                                              | Reasoning                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Chunk size             | **800 tokens**                                                      | Larger = fewer chunks = cheaper retrieval but loses precision; smaller = noisier. 800 is the sweet spot for general docs. |
| Chunk overlap          | **100 tokens**                                                      | Bridges semantic units; reduces lost-in-middle.                                                                           |
| Splitter               | Recursive character text splitter (langchain-equivalent in pure TS) | Markdown/code-aware would be better; phase 6.5                                                                            |
| Embedding model        | `text-embedding-3-large` (OpenAI)                                   | 3072 dims; best price/performance benchmark Q4 2025                                                                       |
| Vector store (default) | **pgvector** in Supabase                                            | One platform; <1M chunks; per ARCHITECTURE §7                                                                             |
| Vector store (escape)  | **Qdrant**                                                          | Use `saas-rag-chat-qdrant` recipe when >1M chunks                                                                         |
| Retrieval method       | **Hybrid** (BM25 + dense, RRF fusion)                               | Pure dense misses keyword matches; pure BM25 misses semantic                                                              |
| Top-k retrieval        | 20 → rerank to 5                                                    | Wider net for hybrid; rerank narrows                                                                                      |
| Rerank                 | **Cohere rerank-3** (optional) — falls back to RRF score            | Cohere is best-in-class; degraded gracefully without                                                                      |
| Citations              | `[[warehouse:id]]` post-synthesis validation                        | Strips hallucinations per ADR-0008 §1                                                                                     |

## Models (per ADR-0007)

| Use case  | Model chain                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| Synthesis | `anthropic:opus` → `openai:flagship` → `ollama:llama-large`                   |
| Embedding | OpenAI `text-embedding-3-large` (no fallback — embeddings must be consistent) |
| Rerank    | `cohere:rerank-3` (optional)                                                  |

Per-chunk embeddings are immutable. Switching embedding models requires a
full re-index. Locked.

## Cost discipline (per ADR-0007)

```yaml
hard_caps:
  per_request_usd: 0.50 # 500k-token query at Opus = ~$7.50 → REJECTED
  per_user_per_day_usd: 5 # blocks individual abusers
  per_app_per_day_usd: 100 # circuit breaks the whole app
```

Higher than baseline because RAG is LLM-heavy.

## Eval golden set

50 Q&A pairs ship with the recipe in `templates/eval/golden-set.json`. Covers:

- 15 factual recall ("What was the revenue in Q3?")
- 10 multi-hop ("Compare Q3 to Q2 across all regions")
- 10 edge cases (empty doc, single sentence, 100k+ token)
- 10 ambiguous ("How's the company doing?")
- 5 adversarial (prompt injection attempts in the docs)

`recipe-validity` (per ADR-0008 §4) requires ≥80% pass rate baseline.

`golden-set-drift` (per ADR-0010 §2.9) re-evaluates monthly; >5% answer drift
= PR auto-opens.

## Safety

| Threat                   | Defense                                                           |
| ------------------------ | ----------------------------------------------------------------- |
| Prompt injection in docs | Envelope wrapping + citation validation per ADR-0008 §1           |
| Cost runaway             | `@nexural/sdk.llmClient()` cost caps per ADR-0007                 |
| Hallucinated citations   | Post-synthesis validation strips them                             |
| PII leak via embeddings  | Tenant-scoped queries + planned `ai-pii-leak` runner              |
| Output URL exfiltration  | Safe-link rewrite (all LLM-emitted URLs proxied through a logger) |

## Document upload limits

| Decision                    | Choice                                                          |
| --------------------------- | --------------------------------------------------------------- |
| Max doc size                | 50 MB                                                           |
| Max docs per tenant (trial) | 10                                                              |
| Max docs per tenant (paid)  | 10,000                                                          |
| Supported formats           | PDF, MD, TXT, DOCX (DOCX via `mammoth`; native PDF via `unpdf`) |
| OCR                         | Disabled at v0.1 — defer to Phase 6.5                           |
| Re-indexing                 | Manual via `Settings → Reindex documents`                       |

## Chat UX

| Decision             | Choice                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| Streaming            | Yes — token-level streaming via `@nexural/sdk.llmClient` streaming path |
| Citation rendering   | Inline `[[wh:id]]` → hyperlink to source chunk                          |
| Conversation history | Per-tenant, per-user. 10k message cap; LRU eviction                     |
| Retry on failure     | 3× exponential backoff via `@nexural/sdk.llmClient`                     |

## CHANGELOG

- **2026-05-22** v0.1.0 — Initial. RAG opinions locked.
