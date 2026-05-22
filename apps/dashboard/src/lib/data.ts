/**
 * Server-side filesystem reads of nexural-meta artifacts.
 *
 * The dashboard is co-located with nexural-meta and reads registries/scorecard
 * via fs. Used in Server Components only — these helpers are not exposed to
 * the client.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Resolves nexural-meta root.
 *
 * In dev (`pnpm dev` from apps/dashboard/): cwd is apps/dashboard/, root is ../..
 * In prod (next build at workspace root): cwd is workspace root, root is .
 *
 * Override with NEXURAL_META_ROOT env if running the dashboard from a different
 * location (e.g., deployed standalone).
 */
function resolveMetaRoot(): string {
  const env = process.env.NEXURAL_META_ROOT;
  if (env) return resolve(env);

  const cwd = process.cwd();
  // If we're inside apps/dashboard, go up two levels.
  if (cwd.endsWith("/apps/dashboard")) return resolve(cwd, "../..");
  return cwd;
}

const META_ROOT = resolveMetaRoot();

export interface WarehouseEntry {
  readonly name: string;
  readonly tier: string;
  readonly status: string;
  readonly repo: string;
  readonly last_reviewed: string;
  readonly decay_rate_days: string;
  readonly discovered_via: string;
}

export interface ScorecardWarehouse {
  readonly name: string;
  readonly federation: "factory" | "lifeops";
  readonly score: number;
  readonly grade: string;
  readonly findings: ReadonlyArray<unknown>;
}

export interface ScorecardData {
  readonly present: boolean;
  readonly generated_at?: string;
  readonly warehouses: ReadonlyArray<ScorecardWarehouse>;
  readonly aggregate?: {
    mean_score: number;
    median_score: number;
    below_80_count: number;
    below_90_count: number;
  };
}

export interface RevocationEntry {
  readonly recipe_name: string;
  readonly recipe_version: string;
  readonly revoked_at: string;
  readonly reason: string;
}

export function readRegistry(federation: "factory" | "lifeops"): ReadonlyArray<WarehouseEntry> {
  const p = join(META_ROOT, `registry-${federation}.yaml`);
  if (!existsSync(p)) return [];
  const content = readFileSync(p, "utf8");
  return parseWarehouses(content);
}

export function readScorecard(): ScorecardData {
  const p = join(META_ROOT, "scorecard.json");
  if (!existsSync(p)) return { present: false, warehouses: [] };
  try {
    const sc = JSON.parse(readFileSync(p, "utf8"));
    return {
      present: true,
      generated_at: sc.generated_at,
      warehouses: sc.warehouses ?? [],
      aggregate: sc.aggregate,
    };
  } catch {
    return { present: false, warehouses: [] };
  }
}

export function readRevocations(): ReadonlyArray<RevocationEntry> {
  const p = join(META_ROOT, "security/revoked-recipes.yaml");
  if (!existsSync(p)) return [];
  const content = readFileSync(p, "utf8");
  const blocks = content.split(/^  - recipe_name:/m).slice(1);
  return blocks.map((b) => ({
    recipe_name: extractField(b, "recipe_name") ?? "unknown",
    recipe_version: extractField(b, "recipe_version") ?? "0.0.0",
    revoked_at: extractField(b, "revoked_at") ?? "",
    reason: extractField(b, "reason") ?? "",
  }));
}

export function readExternalMcps(): ReadonlyArray<{ name: string; score: number }> {
  const p = join(META_ROOT, "registry-external-mcp.yaml");
  if (!existsSync(p)) return [];
  const content = readFileSync(p, "utf8");
  const names = [...content.matchAll(/^\s+-\s+schema_version[\s\S]*?name:\s+(\S+)/gm)].map(
    (m) => m[1]!,
  );
  const scores = [...content.matchAll(/score:\s+(\d+)/g)].map((m) => parseInt(m[1]!, 10));
  return names.map((name, i) => ({ name, score: scores[i] ?? 0 }));
}

function parseWarehouses(yamlContent: string): WarehouseEntry[] {
  const entries: WarehouseEntry[] = [];
  let current: Partial<WarehouseEntry> | null = null;
  for (const line of yamlContent.split("\n")) {
    if (line.startsWith("  - name:")) {
      if (current?.name) entries.push(current as WarehouseEntry);
      current = { name: line.split(":").slice(1).join(":").trim() };
    } else if (current && line.startsWith("    ")) {
      const [k, ...rest] = line.trim().split(":");
      if (k) (current as Record<string, string>)[k] = rest.join(":").trim();
    }
  }
  if (current?.name) entries.push(current as WarehouseEntry);
  return entries;
}

function extractField(block: string, field: string): string | undefined {
  const m = block.match(new RegExp(`${field}:\\s*(\\S.*)`));
  return m?.[1]?.trim();
}
