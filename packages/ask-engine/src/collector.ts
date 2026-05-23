/**
 * Doc collector. Walks the federation root and returns every queryable
 * markdown document with normalized metadata.
 *
 * Sources covered:
 *   - docs/*.md                       — constitution
 *   - docs/adr/*.md                   — architecture decisions
 *   - warehouses/<name>/documents/*.md — warehouse-authored material
 *   - recipes/<name>/*.md             — recipe THREAT_MODEL, DECISIONS, README
 *   - recipes/<name>/templates/eval/*.json — golden + adversarial sets (jsonish docs)
 *
 * Each doc is tagged with a kind (`constitution`, `adr`, `warehouse-doc`,
 * `recipe-doc`, `eval`) for filtered queries. The collector is intentionally
 * filesystem-based — it doesn't go through MCP. `nx ask` runs in the
 * federation repo itself; direct disk read is faster + simpler.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";

export type DocKind = "constitution" | "adr" | "warehouse-doc" | "recipe-doc" | "eval";

export interface CollectedDoc {
  /** Path relative to the federation root. Stable id for citations. */
  readonly path: string;
  /** Doc category. */
  readonly kind: DocKind;
  /** First H1 heading or stem of the filename. */
  readonly title: string;
  /** Full body, untrimmed. */
  readonly body: string;
  /** Display label (e.g. "warehouse:auth", "adr:0011", "recipe:saas-rag-chat"). */
  readonly source: string;
}

export interface CollectOptions {
  /** Federation root path. Defaults to process.cwd(). */
  readonly root?: string;
  /** Override which sources to collect. Defaults to all. */
  readonly include?: ReadonlyArray<DocKind>;
  /** Max bytes per doc (over-large files skipped + warned). Default 1MB. */
  readonly maxBytes?: number;
}

const DEFAULT_KINDS: ReadonlyArray<DocKind> = [
  "constitution",
  "adr",
  "warehouse-doc",
  "recipe-doc",
  "eval",
];

export function collectDocs(opts: CollectOptions = {}): CollectedDoc[] {
  const root = opts.root ?? process.cwd();
  const kinds = new Set<DocKind>(opts.include ?? DEFAULT_KINDS);
  const maxBytes = opts.maxBytes ?? 1024 * 1024;
  const out: CollectedDoc[] = [];

  if (kinds.has("constitution")) {
    out.push(...collectFromDir(join(root, "docs"), root, maxBytes, "constitution", "constitution"));
  }
  if (kinds.has("adr")) {
    out.push(...collectFromDir(join(root, "docs/adr"), root, maxBytes, "adr", "adr"));
  }
  if (kinds.has("warehouse-doc")) {
    out.push(...collectWarehouseDocs(join(root, "warehouses"), root, maxBytes));
  }
  if (kinds.has("recipe-doc")) {
    out.push(...collectRecipeDocs(join(root, "recipes"), root, maxBytes));
  }
  if (kinds.has("eval")) {
    out.push(...collectEvalSets(join(root, "recipes"), root, maxBytes));
  }
  return out;
}

function collectFromDir(
  dir: string,
  root: string,
  maxBytes: number,
  kind: DocKind,
  sourcePrefix: string,
): CollectedDoc[] {
  if (!existsSync(dir)) return [];
  const out: CollectedDoc[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (!stat.isFile()) continue;
    if (!entry.endsWith(".md")) continue;
    if (stat.size > maxBytes) continue;
    const body = readFileSync(full, "utf8");
    out.push({
      path: relative(root, full),
      kind,
      title: extractTitle(body, entry),
      body,
      source: `${sourcePrefix}:${stem(entry)}`,
    });
  }
  return out;
}

function collectWarehouseDocs(
  warehousesDir: string,
  root: string,
  maxBytes: number,
): CollectedDoc[] {
  if (!existsSync(warehousesDir)) return [];
  const out: CollectedDoc[] = [];
  for (const wh of readdirSync(warehousesDir)) {
    const docsDir = join(warehousesDir, wh, "documents");
    if (!existsSync(docsDir)) continue;
    for (const f of readdirSync(docsDir)) {
      if (!f.endsWith(".md")) continue;
      const full = join(docsDir, f);
      const stat = statSync(full);
      if (stat.size > maxBytes) continue;
      const body = readFileSync(full, "utf8");
      out.push({
        path: relative(root, full),
        kind: "warehouse-doc",
        title: extractTitle(body, f),
        body,
        source: `warehouse:${wh}:${stem(f)}`,
      });
    }
  }
  return out;
}

function collectRecipeDocs(recipesDir: string, root: string, maxBytes: number): CollectedDoc[] {
  if (!existsSync(recipesDir)) return [];
  const out: CollectedDoc[] = [];
  const wantedFiles = ["THREAT_MODEL.md", "DECISIONS.md", "README.md"];
  for (const recipe of readdirSync(recipesDir)) {
    const dir = join(recipesDir, recipe);
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
    for (const f of wantedFiles) {
      const full = join(dir, f);
      if (!existsSync(full)) continue;
      const stat = statSync(full);
      if (stat.size > maxBytes) continue;
      const body = readFileSync(full, "utf8");
      out.push({
        path: relative(root, full),
        kind: "recipe-doc",
        title: extractTitle(body, `${recipe} ${f}`),
        body,
        source: `recipe:${recipe}:${stem(f).toLowerCase()}`,
      });
    }
  }
  return out;
}

function collectEvalSets(recipesDir: string, root: string, maxBytes: number): CollectedDoc[] {
  if (!existsSync(recipesDir)) return [];
  const out: CollectedDoc[] = [];
  for (const recipe of readdirSync(recipesDir)) {
    const evalDir = join(recipesDir, recipe, "templates/eval");
    if (!existsSync(evalDir)) continue;
    for (const f of readdirSync(evalDir)) {
      if (!f.endsWith(".json.template") && !f.endsWith(".json")) continue;
      const full = join(evalDir, f);
      const stat = statSync(full);
      if (stat.size > maxBytes) continue;
      const body = readFileSync(full, "utf8");
      out.push({
        path: relative(root, full),
        kind: "eval",
        title: `${recipe} ${stem(f)}`,
        body,
        source: `eval:${recipe}:${stem(f)}`,
      });
    }
  }
  return out;
}

function extractTitle(body: string, fallback: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  if (m && m[1]) return m[1].trim();
  return stem(fallback);
}

function stem(filename: string): string {
  const base = basename(filename);
  const dot = base.indexOf(".");
  return dot >= 0 ? base.slice(0, dot) : base;
}
