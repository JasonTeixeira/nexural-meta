/**
 * @nexural/warehouse-base
 *
 * Shared kit for warehouse content loading. Phase 6.5 deliverable per
 * ADR-0011 §2 (Minimum Viable Warehouses).
 *
 * Public API:
 *   - loadWarehouse(root)         → reads manifest.yaml + materializes templates
 *   - readDocument(wh, id)         → lazily reads a document body
 *   - templatesForRecipe(wh, name) → filter by recipe consumer list
 *   - composeForRecipe(req)        → multi-warehouse template composition
 *
 * Types:
 *   - LoadedWarehouse, LoadedDocument
 *   - ComposeRequest, ComposeResult
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
