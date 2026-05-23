/**
 * MCP client for fetching warehouse content over stdio.
 *
 * Mirrors the local-disk `loadWarehouse()` interface, but spawns a child
 * process running `@nexural/warehouse-server` (or any MCP-compatible binary
 * with the same tool surface) instead of reading the filesystem directly.
 *
 * Phase 11.1 deliverable per ADR-0012 §5. The federation router calls this
 * for `nx ask` synthesis; forge stays on the local-disk fast path.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { TemplateFile } from "@nexural/forge-emit";
import { WarehouseManifest, type WarehouseDocument, type WarehouseTemplate } from "@nexural/schema";
import { WarehouseLoadError, type LoadedDocument, type LoadedWarehouse } from "./loader.js";

export interface McpClientOptions {
  /** Binary to spawn. Defaults to `nexural-warehouse-server`. */
  readonly command?: string;
  /** Args to pass to the binary (e.g. `["--root", "/path/to/warehouse"]`). */
  readonly args: ReadonlyArray<string>;
  /** Environment variables to pass through to the child process. */
  readonly env?: Readonly<Record<string, string>>;
  /** Spawn timeout (default 10s). */
  readonly spawnTimeoutMs?: number;
}

export interface McpWarehouseHandle {
  readonly warehouse: LoadedWarehouse;
  readonly readDocument: (id: string) => Promise<LoadedDocument>;
  readonly close: () => Promise<void>;
}

/**
 * Connect to a warehouse MCP server + return a handle with the same shape
 * as the local-disk loader. Templates are materialized eagerly (since most
 * callers want the full set). Documents stay lazy — body reads go through
 * the MCP `warehouse_read_document` tool.
 */
export async function loadWarehouseViaMcp(opts: McpClientOptions): Promise<McpWarehouseHandle> {
  const transport = new StdioClientTransport({
    command: opts.command ?? "nexural-warehouse-server",
    args: [...opts.args],
    ...(opts.env !== undefined ? { env: opts.env as Record<string, string> } : {}),
  });

  const client = new Client(
    { name: "nexural-warehouse-client", version: "1.0.0" },
    { capabilities: {} },
  );
  await client.connect(transport);

  // Load the manifest + materialize templates eagerly.
  let manifest;
  try {
    const manifestRes = await client.callTool({ name: "warehouse_manifest", arguments: {} });
    const text = pickText(manifestRes);
    const raw = JSON.parse(text);
    const parsed = WarehouseManifest.safeParse(raw);
    if (!parsed.success) {
      throw new WarehouseLoadError(
        `MCP server returned invalid manifest: ${parsed.error.message}`,
        { warehouseRoot: opts.args.join(" "), detail: { issues: parsed.error.issues } },
      );
    }
    manifest = parsed.data;
  } catch (err) {
    await safeClose(client);
    if (err instanceof WarehouseLoadError) throw err;
    throw new WarehouseLoadError(`MCP manifest fetch failed: ${(err as Error).message}`, {
      warehouseRoot: opts.args.join(" "),
    });
  }

  // Pull template bodies for the full set up front (matches local-disk semantics).
  const templates: TemplateFile[] = [];
  for (const t of manifest.templates) {
    const body = await fetchTemplateBody(client, t);
    templates.push({
      sourcePath: t.source,
      targetPath: t.target_path,
      body,
      binary: t.binary,
      ...(t.conditional_on !== undefined ? { conditionalOn: t.conditional_on } : {}),
      ...(t.mode !== undefined ? { mode: t.mode } : {}),
    });
  }

  const warehouse: LoadedWarehouse = {
    root: `mcp://${opts.args.join(" ")}`,
    manifest,
    documents: manifest.documents,
    templates,
  };

  async function readDocument(id: string): Promise<LoadedDocument> {
    const doc = warehouse.documents.find((d: WarehouseDocument) => d.id === id);
    if (!doc) {
      throw new WarehouseLoadError(`no document with id "${id}"`, {
        warehouseRoot: warehouse.root,
      });
    }
    const res = await client.callTool({
      name: "warehouse_read_document",
      arguments: { id },
    });
    if (res.isError) {
      const errText = pickText(res);
      throw new WarehouseLoadError(`MCP read_document failed: ${errText}`, {
        warehouseRoot: warehouse.root,
      });
    }
    return { meta: doc, body: pickText(res) };
  }

  async function close(): Promise<void> {
    await safeClose(client);
  }

  return { warehouse, readDocument, close };
}

// ── helpers ─────────────────────────────────────────────────────────────────

async function fetchTemplateBody(client: Client, template: WarehouseTemplate): Promise<string> {
  const res = await client.callTool({
    name: "warehouse_read_template",
    arguments: { id: template.id },
  });
  if (res.isError) {
    throw new WarehouseLoadError(`MCP read_template failed for "${template.id}"`, {
      warehouseRoot: "<mcp>",
    });
  }
  return pickText(res);
}

function pickText(res: unknown): string {
  // MCP SDK returns either `{ content: [...] }` (standard) or `{ toolResult: ... }`
  // (older variant). We only care about the text-content path.
  if (res === null || typeof res !== "object") return "";
  const content = (res as { content?: unknown }).content;
  if (!Array.isArray(content) || content.length === 0) return "";
  const first = content[0] as { text?: unknown };
  return typeof first?.text === "string" ? first.text : "";
}

async function safeClose(client: Client): Promise<void> {
  try {
    await client.close();
  } catch {
    // best-effort
  }
}

/**
 * Tolerant parser for the `--root` arg out of an args array (for diagnostic
 * messages when the spawn fails).
 */
export function extractRootArg(args: ReadonlyArray<string>): string | undefined {
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--root" || a === "-r") return args[i + 1];
    if (a !== undefined && a.startsWith("--root=")) return a.slice("--root=".length);
  }
  return undefined;
}
