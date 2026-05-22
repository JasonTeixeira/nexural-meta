/**
 * @nexural/sdk
 *
 * Shared helpers for warehouse MCP servers, recipes, and forged apps.
 *
 * Most-used:
 *   - `llmClient(config)` — cost-wrapped LLM helper (ADRs 0007, 0010)
 *   - `checkDecay(lastReviewed, rate)` — decay status
 *   - `sha256Hex(input)` — telemetry hashing
 */

export * from "./cost.js";
export * from "./decay.js";
export * from "./hash.js";
