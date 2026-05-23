/**
 * @nexural/ask-engine
 *
 * Federation-wide doc collector + FTS5 search engine. Phase 11.2 per ADR-0012 §5.
 *
 * Powers `nx ask`. Indexes:
 *   - constitution (docs/*.md)
 *   - ADRs (docs/adr/*.md)
 *   - warehouse documents (warehouses/<name>/documents/*.md)
 *   - recipe THREAT_MODEL/DECISIONS/README docs
 *   - eval golden + adversarial sets
 *
 * Public API:
 *   - collectDocs(opts)      → returns CollectedDoc[] from disk
 *   - new AskIndex(docs)     → FTS5-backed search index
 *   - index.search(query, k) → ranked SearchHit[] with snippets
 */

export { collectDocs, type CollectedDoc, type CollectOptions, type DocKind } from "./collector.js";
export { AskIndex, type SearchOptions, type SearchHit } from "./index-fts.js";
