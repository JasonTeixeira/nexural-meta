/**
 * @nexural/mcp-base
 *
 * Base class + middlewares for warehouse MCP servers.
 *
 * Per ADRs 0002, 0007, 0008.
 *
 * Exports:
 *   - wrapInEnvelope(content, opts): wrap content in <warehouse_content> tags (ADR-0008 §1)
 *   - SYNTHESIS_DIRECTIVE: canonical instruction string for synthesis layer
 *   - buildHandler(warehouse, decayRateDays, lastReviewed, handler, emit): middleware-wrapped tool handler
 */

export * from "./envelope.js";
export * from "./middleware.js";
