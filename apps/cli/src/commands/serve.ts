/**
 * `nx serve` — long-running federation daemon.
 *
 * Starts an HTTP server on localhost:7345 (configurable) that exposes the
 * whole federation as a callable API. This is the piece that turns the
 * federation from "library you invoke per command" into "background
 * service you query whenever you want."
 *
 * Endpoints:
 *   GET  /                       — minimal HTML status page
 *   GET  /api/health             — returns { ok: true, indexed: N, since: <iso> }
 *   GET  /api/ask?q=...&k=N&kinds=adr,warehouse-doc
 *   GET  /api/list-sources?kind=adr
 *   GET  /api/audit-latest       — returns evidence/audit/latest.json if present
 *   GET  /api/health-snapshot    — returns evidence/health/latest.json if present
 *   POST /api/reload             — re-indexes docs from disk
 *
 * Signals:
 *   SIGHUP  → reload index
 *   SIGINT/SIGTERM → graceful shutdown
 *
 * Wire into editor MCP via the `@nexural/federation-server` binary
 * (separate process; this one is HTTP for curl / browser / other tools).
 *
 * Recommended setup:
 *   Foreground:  `nx serve`
 *   Background:  ship a launchd plist (see evidence/operational/launchd-setup.md)
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { AskIndex, collectDocs, type DocKind } from "@nexural/ask-engine";
import type { NexuralConfig } from "../config.js";

export interface ServeOptions {
  /** Override port (default 7345). */
  readonly port?: number;
  /** Override host (default 127.0.0.1; use "0.0.0.0" to bind all interfaces). */
  readonly host?: string;
  /** Override federation root (default: NEXURAL_META_ROOT or config.meta_root). */
  readonly root?: string;
}

const DEFAULT_PORT = 7345;
const DEFAULT_HOST = "127.0.0.1";

const KNOWN_KINDS: ReadonlyArray<DocKind> = [
  "constitution",
  "adr",
  "warehouse-doc",
  "recipe-doc",
  "eval",
];

interface ServerState {
  root: string;
  indexedAt: string;
  docCount: number;
  index: AskIndex;
}

export async function runServe(config: NexuralConfig, opts: ServeOptions = {}): Promise<void> {
  const port = opts.port ?? DEFAULT_PORT;
  const host = opts.host ?? DEFAULT_HOST;
  const root = resolveRoot(opts.root, config);
  if (!root) {
    console.error(
      "✖ no federation root. Pass --root, set NEXURAL_META_ROOT, or add 'meta_root = \"/abs/path\"' to ~/.nexural/config.toml.",
    );
    process.exitCode = 1;
    return;
  }

  let state = buildState(root);
  console.error(`[nx-serve] indexed ${state.docCount} docs from ${root}`);
  console.error(`[nx-serve] listening at http://${host}:${port}`);
  console.error(`[nx-serve] try: curl 'http://${host}:${port}/api/ask?q=tenant%20isolation'`);
  console.error(
    `[nx-serve] reload: kill -HUP $(pgrep -f 'nx serve') OR curl -X POST http://${host}:${port}/api/reload`,
  );
  console.error(`[nx-serve] stop: Ctrl+C`);

  const server = createServer((req, res) => {
    handle(req, res, state).catch((err: unknown) => {
      writeJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
    });
  });

  // SIGHUP reloads the index without restart
  process.on("SIGHUP", () => {
    console.error(`[nx-serve] SIGHUP — reloading index from ${root}`);
    try {
      state.index.close();
    } catch {
      // ignore
    }
    state = buildState(root);
    console.error(`[nx-serve] reloaded ${state.docCount} docs`);
  });

  const shutdown = (signal: string): void => {
    console.error(`[nx-serve] ${signal} — graceful shutdown`);
    server.close();
    try {
      state.index.close();
    } catch {
      // ignore
    }
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  server.listen(port, host);
}

// ── handler ─────────────────────────────────────────────────────────────────

async function handle(
  req: IncomingMessage,
  res: ServerResponse,
  state: ServerState,
): Promise<void> {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname;
  const method = req.method ?? "GET";

  if (method === "GET" && path === "/") {
    return renderStatusPage(res, state);
  }
  if (method === "GET" && path === "/api/health") {
    return writeJson(res, 200, {
      ok: true,
      root: state.root,
      indexed: state.docCount,
      since: state.indexedAt,
      version: "1.0.0",
    });
  }
  if (method === "GET" && path === "/api/ask") {
    return handleAsk(url, res, state);
  }
  if (method === "GET" && path === "/api/list-sources") {
    return handleList(url, res, state);
  }
  if (method === "GET" && path === "/api/audit-latest") {
    return handleEvidence(res, state.root, "evidence/audit/latest.json");
  }
  if (method === "GET" && path === "/api/health-snapshot") {
    return handleEvidence(res, state.root, "evidence/health/latest.json");
  }
  if (method === "POST" && path === "/api/reload") {
    try {
      state.index.close();
    } catch {
      // ignore
    }
    const fresh = buildState(state.root);
    state.indexedAt = fresh.indexedAt;
    state.docCount = fresh.docCount;
    state.index = fresh.index;
    return writeJson(res, 200, { reloaded: true, indexed: state.docCount });
  }

  writeJson(res, 404, { error: `unknown route: ${method} ${path}` });
}

function handleAsk(url: URL, res: ServerResponse, state: ServerState): void {
  const q = url.searchParams.get("q") ?? "";
  if (q.trim().length === 0) {
    writeJson(res, 400, { error: "missing q param" });
    return;
  }
  const k = parseIntOr(url.searchParams.get("k"), 5);
  const kindsParam = url.searchParams.get("kinds");
  const kinds = kindsParam
    ? kindsParam
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is DocKind => (KNOWN_KINDS as ReadonlyArray<string>).includes(s))
    : undefined;
  const hits = state.index.search(q, {
    limit: k,
    ...(kinds !== undefined ? { kinds } : {}),
  });
  writeJson(res, 200, {
    query: q,
    indexed: state.docCount,
    hits,
  });
}

function handleList(url: URL, res: ServerResponse, state: ServerState): void {
  const kindParam = url.searchParams.get("kind");
  const kind =
    kindParam && (KNOWN_KINDS as ReadonlyArray<string>).includes(kindParam)
      ? (kindParam as DocKind)
      : undefined;
  // Re-collect lightweight to surface all sources (lazy; no body)
  const docs = collectDocs({ root: state.root });
  const filtered = kind ? docs.filter((d) => d.kind === kind) : docs;
  writeJson(res, 200, {
    count: filtered.length,
    sources: filtered.map((d) => ({
      source: d.source,
      kind: d.kind,
      title: d.title,
      path: d.path,
    })),
  });
}

function handleEvidence(res: ServerResponse, root: string, relPath: string): void {
  const p = join(root, relPath);
  if (!existsSync(p)) {
    writeJson(res, 404, { error: `evidence not found: ${relPath}` });
    return;
  }
  try {
    const body = JSON.parse(readFileSync(p, "utf8")) as unknown;
    writeJson(res, 200, body);
  } catch (err) {
    writeJson(res, 500, { error: `parse failed: ${(err as Error).message}` });
  }
}

function renderStatusPage(res: ServerResponse, state: ServerState): void {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(`<!doctype html>
<meta charset="utf-8">
<title>Nexural Federation — local server</title>
<style>
  body{font-family:system-ui;max-width:720px;margin:3rem auto;padding:0 1rem;color:#e5e5e5;background:#0a0a0a}
  h1{margin:0 0 0.5rem 0}
  p{color:#a3a3a3}
  code{background:#171717;padding:0.1rem 0.4rem;border-radius:3px;color:#fde68a}
  .row{padding:0.4rem 0;border-bottom:1px solid #262626}
  .ok{color:#10b981}
</style>
<h1>Nexural Federation</h1>
<p>Local daemon serving the federation as HTTP + reusable index.</p>
<div class="row"><strong>Root:</strong> <code>${escapeHtml(state.root)}</code></div>
<div class="row"><strong>Indexed:</strong> ${state.docCount} docs <span class="ok">✓</span></div>
<div class="row"><strong>Since:</strong> <code>${escapeHtml(state.indexedAt)}</code></div>
<h2>Try it</h2>
<ul>
  <li><a href="/api/health">/api/health</a></li>
  <li><a href="/api/ask?q=tenant%20isolation">/api/ask?q=tenant isolation</a></li>
  <li><a href="/api/ask?q=cost%20discipline&kinds=adr">/api/ask?q=cost discipline&kinds=adr</a></li>
  <li><a href="/api/list-sources?kind=adr">/api/list-sources?kind=adr</a></li>
  <li><a href="/api/audit-latest">/api/audit-latest</a></li>
  <li><a href="/api/health-snapshot">/api/health-snapshot</a></li>
</ul>
<h2>Reload</h2>
<p>After editing docs: <code>curl -X POST http://127.0.0.1:7345/api/reload</code> or <code>kill -HUP &lt;pid&gt;</code>.</p>
`);
}

// ── helpers ─────────────────────────────────────────────────────────────────

function buildState(root: string): ServerState {
  const docs = collectDocs({ root });
  return {
    root,
    indexedAt: new Date().toISOString(),
    docCount: docs.length,
    index: new AskIndex(docs),
  };
}

function resolveRoot(explicit: string | undefined, config: NexuralConfig): string | null {
  const fs = readFileSync;
  void fs;
  const candidates: ReadonlyArray<string | undefined> = [
    explicit,
    process.env.NEXURAL_META_ROOT,
    config.meta_root,
    process.cwd(),
  ];
  for (const c of candidates) {
    if (!c) continue;
    if (
      existsSync(join(c, "docs")) &&
      existsSync(join(c, "recipes")) &&
      existsSync(join(c, "warehouses"))
    ) {
      return c;
    }
  }
  return null;
}

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body, null, 2));
}

function parseIntOr(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
