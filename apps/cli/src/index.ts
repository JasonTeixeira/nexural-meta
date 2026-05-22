/**
 * @nexural/cli — `nx` CLI exports + main entry.
 *
 * Per ARCHITECTURE.md §4.1, the CLI ships 6 commands at v1.0:
 * ask, sync, health, open, forge, play.
 * Plus `nx new` (ADR-0009 §1.5) and `nx session` for STATE.md continuity.
 */

export { loadConfig, renderDefaultConfig, NexuralConfig } from "./config.js";
export { runSync } from "./commands/sync.js";
export { runHealth } from "./commands/health.js";
export { runOpen } from "./commands/open.js";
export { runAsk } from "./commands/ask.js";
export { runForge } from "./commands/forge.js";
export { runPlay } from "./commands/play.js";
export { runNew } from "./commands/new.js";
export { runSessionSave } from "./commands/session.js";
