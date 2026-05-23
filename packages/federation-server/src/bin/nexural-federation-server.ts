#!/usr/bin/env node
/**
 * `nexural-federation-server --root <meta-repo-path>` — single-binary MCP
 * server for the whole federation.
 *
 * Wire into an editor MCP config once:
 *
 *   {
 *     "mcpServers": {
 *       "nexural": {
 *         "command": "nexural-federation-server",
 *         "args": ["--root", "/Users/Sage/code/nexural/nexural-meta"]
 *       }
 *     }
 *   }
 *
 * Then the agent has two callable tools:
 *   - federation_ask(query, kinds?, limit?)
 *   - federation_list_sources(kind?)
 *
 * If --root is omitted, the server reads NEXURAL_META_ROOT from env or
 * falls back to the cwd.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildFederationServer } from "../server.js";

function parseArgs(argv: ReadonlyArray<string>): { root: string } {
  let root: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--root" || arg === "-r") {
      root = argv[i + 1];
      i++;
    } else if (arg !== undefined && arg.startsWith("--root=")) {
      root = arg.slice("--root=".length);
    }
  }
  if (!root) root = process.env.NEXURAL_META_ROOT;
  if (!root) root = process.cwd();
  root = resolve(root);

  // Sanity check — fail fast if the path doesn't look like a federation
  const looks =
    existsSync(join(root, "docs")) &&
    existsSync(join(root, "recipes")) &&
    existsSync(join(root, "warehouses"));
  if (!looks) {
    console.error(
      `[nexural-federation-server] ✖ "${root}" doesn't look like a nexural-meta repo (docs/, recipes/, warehouses/ required)`,
    );
    process.exit(1);
  }
  return { root };
}

async function main(): Promise<void> {
  const { root } = parseArgs(process.argv.slice(2));
  const { server, docCount } = buildFederationServer({ metaRoot: root });
  // stderr-only diagnostic — stdout is reserved for the JSON-RPC transport
  console.error(`[nexural-federation-server] serving ${docCount} docs from ${root}`);
  await server.connect(new StdioServerTransport());
}

main().catch((err: unknown) => {
  console.error("[nexural-federation-server] fatal:", err);
  process.exit(1);
});
