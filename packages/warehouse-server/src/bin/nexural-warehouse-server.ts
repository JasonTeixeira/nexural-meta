#!/usr/bin/env node
/**
 * `nexural-warehouse-server --root <path>` — MCP stdio server for a warehouse.
 *
 * Usage:
 *   nexural-warehouse-server --root warehouses/auth
 *   nexural-warehouse-server --root /abs/path/to/warehouse
 *
 * Wire it into your MCP client config (e.g. claude.json, an editor's MCP
 * config) by pointing at the binary + the warehouse you want served.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { resolve } from "node:path";
import { buildWarehouseServer } from "../server.js";

interface ParsedArgs {
  readonly root: string;
}

function parseArgs(argv: ReadonlyArray<string>): ParsedArgs {
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
  if (!root) {
    console.error("Usage: nexural-warehouse-server --root <warehouse-path>");
    process.exit(1);
  }
  return { root: resolve(root) };
}

async function main(): Promise<void> {
  const { root } = parseArgs(process.argv.slice(2));
  const { server, warehouse } = buildWarehouseServer({ warehouseRoot: root });
  // Diagnostic to stderr (stdout is reserved for the JSON-RPC transport).
  console.error(
    `[nexural-warehouse-server] serving "${warehouse.manifest.warehouse}@${warehouse.manifest.version}" from ${root}`,
  );
  await server.connect(new StdioServerTransport());
}

main().catch((err: unknown) => {
  console.error("[nexural-warehouse-server] fatal:", err);
  process.exit(1);
});
