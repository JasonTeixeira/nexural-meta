# @nexural/warehouse-base

## 1.1.0

- Added `loadWarehouseViaMcp(opts)` — MCP stdio client that spawns a warehouse server (typically `nexural-warehouse-server`) and returns the same `LoadedWarehouse` shape as the local-disk loader.
- Added `extractRootArg(args)` helper for parsing `--root` from arg arrays.
- New exported types: `McpClientOptions`, `McpWarehouseHandle`.
- New dep: `@modelcontextprotocol/sdk@^1.0.4`.
- Phase 11.1 deliverable per ADR-0012 §5.

## 1.0.0

- Republished from 0.1.0 as part of v1.0.0 federation GA. No code changes.

## 0.1.0

- Initial release. Phase 6.5 deliverable per ADR-0011 §2.
- `loadWarehouse(root)` — reads manifest.yaml + materializes templates.
- `composeForRecipe(req)` — multi-warehouse template composition with cross-warehouse duplicate detection.
- `readDocument(wh, id)` — lazy document body reader.
- Local-disk only. Phase 7+ adds MCP fetch via `@nexural/mcp-base`.
