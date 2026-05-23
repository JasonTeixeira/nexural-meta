/**
 * @nexural/warehouse-base
 *
 * Shared kit for warehouse content loading. Per ADR-0011 §2.
 *
 * Public API:
 *   - loadWarehouse(root)            → local-disk: reads manifest.yaml + materializes templates
 *   - readDocument(wh, id)            → lazy local-disk document body read
 *   - templatesForRecipe(wh, names)   → filter by recipe consumer list (extends-aware)
 *   - composeForRecipe(req)           → multi-warehouse template composition
 *   - loadWarehouseViaMcp(opts)       → MCP stdio: spawns a server + returns the same shape (Phase 11.1)
 *
 * Types:
 *   - LoadedWarehouse, LoadedDocument
 *   - ComposeRequest, ComposeResult
 *   - McpClientOptions, McpWarehouseHandle
 *   - WarehouseLoadError, ComposeError
 */

export {
  loadWarehouse,
  readDocument,
  templatesForRecipe,
  WarehouseLoadError,
  type LoadedDocument,
  type LoadedWarehouse,
} from "./loader.js";
export {
  composeForRecipe,
  ComposeError,
  type ComposeRequest,
  type ComposeResult,
} from "./compose.js";
export {
  loadWarehouseViaMcp,
  extractRootArg,
  type McpClientOptions,
  type McpWarehouseHandle,
} from "./mcp-client.js";
