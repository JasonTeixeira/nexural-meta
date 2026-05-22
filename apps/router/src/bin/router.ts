/**
 * Router CLI entry — boots the MCP fan-out server.
 *
 * Usage:
 *   nexural-router                  # serve via stdio (default)
 *   NEXURAL_META_PATH=. nexural-router
 *
 * Connect Claude Desktop / Cursor via MCP client config; this process
 * relays calls to federation warehouse MCPs + external MCPs.
 *
 * Phase 4: prints config + endpoint summary on startup. Full MCP serve
 * loop lands in Phase 5 once warehouse MCPs exist to fan out TO.
 */

import { loadRegistries } from "../registry.js";

const metaPath = process.env.NEXURAL_META_PATH ?? process.cwd();
const { endpoints, federations, externals } = loadRegistries(metaPath);

console.error(`[nexural-router] started — meta=${metaPath}`);
console.error(
  `[nexural-router] endpoints: factory=${federations.factory}, lifeops=${federations.lifeops}, externals=${externals}`,
);
for (const e of endpoints) {
  console.error(
    `  · ${e.kind === "warehouse" ? "wh" : "ext"} ${e.federation}/${e.name} → ${
      e.kind === "warehouse"
        ? e.repo
        : e.transport === "stdio"
          ? `[${e.command?.join(" ")}]`
          : e.url
    }`,
  );
}

if (endpoints.length === 0) {
  console.error(
    "[nexural-router] no endpoints — populate registries (Phase 5+) or check working dir.",
  );
}

console.error(
  "[nexural-router] Phase 4 — child MCP spawn loop lands in Phase 5 when warehouse MCPs exist.",
);

// Keep the process alive so Claude Desktop / Cursor can hold the stdio session.
process.stdin.resume();
