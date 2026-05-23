/**
 * @nexural/warehouse-server
 *
 * Generic MCP stdio server for any Nexural warehouse. Phase 11.1 per ADR-0012 §5.
 *
 * Public API:
 *   - buildWarehouseServer(opts) → { server, warehouse }
 *
 * Binary:
 *   - `nexural-warehouse-server --root <path>` — boots a stdio server for the warehouse at <path>
 */

export { buildWarehouseServer } from "./server.js";
export type { BuildServerOptions } from "./server.js";
