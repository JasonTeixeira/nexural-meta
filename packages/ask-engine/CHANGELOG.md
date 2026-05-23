# @nexural/ask-engine

## 1.0.0

- Initial release. Phase 11.2 deliverable per ADR-0012 §5.
- `collectDocs(opts)` — walks the federation root + returns normalized `CollectedDoc[]`.
- `AskIndex` — FTS5-backed search with BM25 ranking, kind-filtering, snippet highlighting.
- Sources: constitution, ADRs, warehouse docs, recipe THREAT_MODEL/DECISIONS/README, eval sets.
- 18 tests across collector + index-fts.
