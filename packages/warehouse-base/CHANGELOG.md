# @nexural/warehouse-base

## 0.1.0

- Initial release. Phase 6.5 deliverable per ADR-0011 §2.
- `loadWarehouse(root)` — reads manifest.yaml + materializes templates.
- `composeForRecipe(req)` — multi-warehouse template composition with cross-warehouse duplicate detection.
- `readDocument(wh, id)` — lazy document body reader.
- Local-disk only. Phase 7+ adds MCP fetch via `@nexural/mcp-base`.
