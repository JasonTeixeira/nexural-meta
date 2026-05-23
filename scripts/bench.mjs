#!/usr/bin/env node
/**
 * Performance benchmarks. Phase 11.x stress hardening.
 *
 * Measures:
 *   - nx ask latency over the live federation (67 docs)
 *   - nx ask scaling: synthetic corpora at 100, 500, 1000, 5000 docs
 *   - forge dry-run latency for each recipe
 *   - MCP server cold-start + round-trip
 *   - full `nx audit` duration
 *
 * Writes a structured report to evidence/benchmarks/<ISO-date>.json + a
 * `latest.json` pointer.
 *
 * Establishes the V1.0 baseline so future regressions are visible.
 */

import { execFileSync, spawn } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ASK_ENGINE_DIST = pathToFileURL(resolve(ROOT, "packages/ask-engine/dist/index.js")).href;

function ts() {
  return process.hrtime.bigint();
}
function ms(start) {
  return Number(process.hrtime.bigint() - start) / 1_000_000;
}

async function benchAsk() {
  const { collectDocs, AskIndex } = await import(ASK_ENGINE_DIST);
  const collectStart = ts();
  const docs = collectDocs({ root: ROOT });
  const collectMs = ms(collectStart);

  const indexStart = ts();
  const index = new AskIndex(docs);
  const indexMs = ms(indexStart);

  const queries = [
    "cost discipline LLM",
    "tenant isolation RLS",
    "prompt injection defense",
    "ledger double entry",
    "supabase SSR middleware",
    "stripe webhook idempotency",
  ];
  const queryTimings = [];
  for (const q of queries) {
    const qStart = ts();
    const hits = index.search(q, { limit: 5 });
    queryTimings.push({ query: q, ms: ms(qStart), hits: hits.length });
  }
  index.close();

  const avgQueryMs = queryTimings.reduce((a, t) => a + t.ms, 0) / queryTimings.length;
  return {
    doc_count: docs.length,
    collect_ms: round(collectMs),
    index_build_ms: round(indexMs),
    queries: queryTimings.map((t) => ({ ...t, ms: round(t.ms) })),
    avg_query_ms: round(avgQueryMs),
  };
}

async function benchAskScaling() {
  const { AskIndex } = await import(ASK_ENGINE_DIST);
  const scales = [100, 500, 1000, 5000];
  const results = [];
  for (const N of scales) {
    // Synthetic docs — each is a fake markdown body with ~500 chars of randomized text.
    const docs = [];
    for (let i = 0; i < N; i++) {
      docs.push({
        path: `synthetic/doc-${i}.md`,
        kind: "warehouse-doc",
        title: `Doc ${i}`,
        source: `synthetic:${i}`,
        body: `# Doc ${i}\n\n${randomLorem(i, 500)}\n\nkeyword-${i % 23} keyword-${i % 47}`,
      });
    }
    const indexStart = ts();
    const index = new AskIndex(docs);
    const indexMs = ms(indexStart);

    const queryStart = ts();
    const hits = index.search(`keyword-7 keyword-11 doc`, { limit: 5 });
    const queryMs = ms(queryStart);
    index.close();
    results.push({
      doc_count: N,
      index_build_ms: round(indexMs),
      query_ms: round(queryMs),
      hits: hits.length,
    });
  }
  return results;
}

function randomLorem(seed, chars) {
  const words = [
    "tenant",
    "isolation",
    "supabase",
    "cost",
    "discipline",
    "prompt",
    "injection",
    "ledger",
    "double-entry",
    "RLS",
    "warehouse",
    "recipe",
    "ADR",
    "forge",
    "audit",
    "manifest",
    "schema",
    "vector",
    "embed",
    "hybrid",
    "stripe",
    "webhook",
    "idempotent",
    "session",
    "middleware",
    "auth",
  ];
  let s = seed;
  let out = "";
  while (out.length < chars) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    out += words[s % words.length] + " ";
  }
  return out.slice(0, chars);
}

async function benchForgeDryRuns() {
  const recipesDir = resolve(ROOT, "recipes");
  if (!existsSync(recipesDir)) return [];
  const results = [];
  for (const recipe of readdirSync(recipesDir)) {
    const recipeYaml = join(recipesDir, recipe, "recipe.yaml");
    if (!existsSync(recipeYaml)) continue;
    if (!statSync(join(recipesDir, recipe)).isDirectory()) continue;
    const fixture = join(ROOT, "test/fixtures", `${recipe}.inputs.json`);
    if (!existsSync(fixture)) {
      results.push({ recipe, skipped: true, reason: "no fixture" });
      continue;
    }
    const start = ts();
    try {
      execFileSync(
        "npx",
        [
          "--yes",
          "tsx",
          resolve(ROOT, "apps/cli/src/bin/nx.ts"),
          "forge",
          recipe,
          `${recipe.slice(0, 30)}-bench`,
          `--inputs=${fixture}`,
          "--dry-run",
        ],
        { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], timeout: 60_000 },
      );
      results.push({ recipe, ms: round(ms(start)), ok: true });
    } catch (err) {
      results.push({ recipe, ms: round(ms(start)), ok: false, error: err.message.slice(0, 120) });
    }
  }
  return results;
}

async function benchMcpServer() {
  // Build a tiny synthetic warehouse + spawn the server + measure RPC round-trip.
  const work = mkdtempSync(join(tmpdir(), "bench-mcp-"));
  try {
    mkdirSync(join(work, "templates"), { recursive: true });
    mkdirSync(join(work, "documents"), { recursive: true });
    writeFileSync(
      join(work, "manifest.yaml"),
      `schema_version: 1
warehouse: bench-wh
version: 0.1.0
description: A synthetic benchmark warehouse used to measure MCP round-trip latency.
documents:
  - id: greeting
    path: documents/greeting.md
    title: Greeting
    audience: [agents]
    tags: [test]
templates:
  - id: tpl
    source: templates/tpl.txt.template
    target_path: tpl.txt
    consumers: ["*"]
`,
    );
    writeFileSync(join(work, "templates/tpl.txt.template"), "{{ slug }}");
    writeFileSync(join(work, "documents/greeting.md"), "# Hello\nbody");

    const serverDist = resolve(
      ROOT,
      "packages/warehouse-server/dist/bin/nexural-warehouse-server.js",
    );
    const wbDist = pathToFileURL(resolve(ROOT, "packages/warehouse-base/dist/index.js")).href;
    const { loadWarehouseViaMcp } = await import(wbDist);

    const spawnStart = ts();
    const handle = await loadWarehouseViaMcp({
      command: process.execPath,
      args: [serverDist, "--root", work],
    });
    const spawnMs = ms(spawnStart);

    // Read documents N times to measure RPC latency
    const N = 20;
    const start = ts();
    for (let i = 0; i < N; i++) {
      await handle.readDocument("greeting");
    }
    const totalMs = ms(start);
    await handle.close();
    return {
      cold_start_ms: round(spawnMs),
      rpc_calls: N,
      total_rpc_ms: round(totalMs),
      avg_rpc_ms: round(totalMs / N),
    };
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

async function benchAudit() {
  const start = ts();
  try {
    execFileSync("node", [resolve(ROOT, "apps/cli/dist/bin/nx.js"), "audit", "--json"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 300_000,
    });
    return { ms: round(ms(start)), ok: true };
  } catch (err) {
    return { ms: round(ms(start)), ok: false, error: err.message.slice(0, 120) };
  }
}

function round(n) {
  return Math.round(n * 100) / 100;
}

async function main() {
  console.error("[bench] starting…");
  const started_at = new Date().toISOString();

  console.error("[bench] running nx ask over live federation…");
  const ask = await benchAsk();
  console.error(
    `[bench]   ${ask.doc_count} docs, ${ask.collect_ms}ms collect, ${ask.index_build_ms}ms index, avg query ${ask.avg_query_ms}ms`,
  );

  console.error("[bench] scaling nx ask to synthetic 100/500/1000/5000 docs…");
  const askScaling = await benchAskScaling();
  for (const r of askScaling) {
    console.error(
      `[bench]   ${r.doc_count.toString().padStart(5)} docs: ${r.index_build_ms}ms index, ${r.query_ms}ms query, ${r.hits} hits`,
    );
  }

  console.error("[bench] running forge dry-runs for each recipe…");
  const forge = await benchForgeDryRuns();
  for (const r of forge) {
    if (r.skipped) {
      console.error(`[bench]   ⏭  ${r.recipe}: ${r.reason}`);
    } else {
      console.error(`[bench]   ${r.ok ? "✓" : "✖"} ${r.recipe}: ${r.ms}ms`);
    }
  }

  console.error("[bench] measuring MCP server round-trip…");
  const mcp = await benchMcpServer();
  console.error(
    `[bench]   cold start ${mcp.cold_start_ms}ms, avg RPC ${mcp.avg_rpc_ms}ms over ${mcp.rpc_calls} calls`,
  );

  console.error("[bench] running full nx audit…");
  const audit = await benchAudit();
  console.error(`[bench]   nx audit: ${audit.ms}ms`);

  const finished_at = new Date().toISOString();
  const report = {
    schema_version: 1,
    started_at,
    finished_at,
    federation_root: ROOT,
    benchmarks: { ask, askScaling, forge, mcp, audit },
  };

  const outDir = resolve(ROOT, "evidence/benchmarks");
  mkdirSync(outDir, { recursive: true });
  const iso = started_at.replace(/[:.]/g, "-");
  writeFileSync(join(outDir, `${iso}.json`), JSON.stringify(report, null, 2));
  writeFileSync(join(outDir, "latest.json"), JSON.stringify(report, null, 2));

  console.error("");
  console.error("[bench] ============================================================");
  console.error("[bench] V1.0 baseline established");
  console.error(`[bench]   ask: ${ask.avg_query_ms}ms avg over ${ask.doc_count} docs`);
  console.error(`[bench]   ask @ 5k docs: ${askScaling[3].query_ms}ms`);
  console.error(`[bench]   mcp: ${mcp.cold_start_ms}ms cold + ${mcp.avg_rpc_ms}ms/call`);
  console.error(`[bench]   audit: ${audit.ms}ms`);
  console.error(`[bench]   report: ${join("evidence/benchmarks", `${iso}.json`)}`);
  console.error("[bench] ============================================================");
}

main().catch((err) => {
  console.error("[bench] fatal:", err);
  process.exit(1);
});
