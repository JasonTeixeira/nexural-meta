# @nexural/warehouse-base

Shared kit for warehouse content loading. Phase 6.5 deliverable per ADR-0011 §2.

## What it does

- Reads a warehouse's `manifest.yaml` (validated against `@nexural/schema`'s `WarehouseManifest`).
- Materializes declared templates as `@nexural/forge-emit` `TemplateFile[]`.
- Composes templates from multiple warehouses for a given recipe, with cross-warehouse duplicate-path detection.
- Lazily reads document bodies by id.

## Why local-disk only for now

Phase 6.5 vertical-slice doctrine: prove the pipeline works before adding MCP fetch. The local-disk loader unblocks the slice. Phase 7+ will swap in `@nexural/mcp-base` fetch — the `LoadedWarehouse` interface stays stable so the swap is transparent to `nx forge`.

## License

MIT.
