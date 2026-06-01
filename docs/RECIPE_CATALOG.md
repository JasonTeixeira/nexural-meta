# Recipe Catalog

**Status:** Phase 11 generated recipe readiness catalog
**Generated:** 2026-06-01T18:57:07.975Z

## Summary

- Recipes: 8
- Forge-ready: 7
- Proof-backed: 1
- Average readiness: 74.4/100

## Recipes

| Recipe                       | Score | Band       | Forge-ready | Proof-backed | Gaps                                       |
| ---------------------------- | ----: | ---------- | ----------- | ------------ | ------------------------------------------ |
| internal-tool-dashboard      |   100 | elite      | yes         | yes          | none                                       |
| fintech-ledger-app           |    80 | strong     | yes         | no           | missing-golden-path-proof                  |
| saas-agent-platform          |    80 | strong     | yes         | no           | missing-golden-path-proof                  |
| saas-multitenant-baseline    |    70 | usable     | yes         | no           | missing-golden-path-proof                  |
| saas-rag-chat                |    70 | usable     | yes         | no           | missing-golden-path-proof                  |
| saas-rag-chat-openai-first   |    70 | usable     | yes         | no           | missing-golden-path-proof                  |
| saas-rag-chat-qdrant         |    70 | usable     | yes         | no           | missing-golden-path-proof                  |
| saas-multitenant-baseline-cf |    55 | incomplete | no          | no           | missing-fixture, missing-golden-path-proof |

## Next Actions

- **Phase 11:** Add two more golden-path specs for high-value recipes. Only 1 recipe is proof-backed today.
- **Phase 11:** Add fixtures for saas-multitenant-baseline-cf. Fixtures make recipe validity automation deterministic.
- **Phase 14:** Promote fintech-ledger-app into the next hosted proof run. The factory should prove more than one app shape.
