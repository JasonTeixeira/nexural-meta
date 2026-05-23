/**
 * @nexural/federation-server
 *
 * Single MCP stdio server exposing the whole Nexural Federation as one
 * tool surface. Phase 11.x daily-ops payoff.
 *
 * Public API:
 *   - buildFederationServer({ metaRoot }) → { server, docCount }
 *
 * Binary:
 *   - `nexural-federation-server --root <meta-repo-path>` — boots an
 *     MCP stdio server that any client (editor agent, etc.) can wire in.
 */

export { buildFederationServer } from "./server.js";
export type { BuildServerOptions, BuildResult } from "./server.js";
