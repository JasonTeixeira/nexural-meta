/**
 * @nexural/schema — canonical Zod schemas for the Nexural Federation.
 *
 * See README.md for the full module catalog.
 * See docs/SCHEMA_CHARTER.md and docs/SCHEMA_AMENDMENTS.md for governance.
 */

// Primitives
export * from "./primitives.js";

// Errors
export * from "./errors.js";

// Core schemas
export * from "./meta.js";
export * from "./frontmatter.js";
export * from "./index-file.js";
export * from "./mcp.js";
export * from "./telemetry.js";
export * from "./scorecard.js";
export * from "./registry.js";
export * from "./cross-refs.js";
export * from "./decay.js";
export * from "./adr.js";

// ADR-introduced schemas
export * from "./recipe.js";
export * from "./external-mcp.js";
export * from "./model-router.js";
export * from "./revocation.js";
export * from "./warehouse-manifest.js";
