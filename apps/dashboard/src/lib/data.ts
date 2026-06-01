/**
 * Server-side filesystem reads of nexural-meta artifacts.
 *
 * The dashboard is co-located with nexural-meta and reads registries/scorecard
 * via fs. Used in Server Components only — these helpers are not exposed to
 * the client.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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

export interface EcosystemRepository {
  readonly name: string;
  readonly full_name: string;
  readonly url: string;
  readonly visibility: string;
  readonly is_private: boolean;
  readonly is_archived: boolean;
  readonly is_fork: boolean;
  readonly primary_language: string | null;
  readonly topics: ReadonlyArray<string>;
  readonly homepage_url: string | null;
  readonly pushed_at: string;
  readonly canonical: {
    readonly canonical_name: string;
    readonly layer: string;
    readonly asset_type: string;
    readonly maturity: string;
    readonly role: string;
    readonly public_exposure: string;
  };
  readonly operational: {
    readonly status: string;
    readonly stale_days: number | null;
    readonly needs_private_review: boolean;
  };
}

export interface EcosystemRegistryData {
  readonly present: boolean;
  readonly generated_at?: string;
  readonly totals?: {
    readonly total: number;
    readonly public: number;
    readonly private: number;
    readonly archived: number;
    readonly forks: number;
    readonly by_layer: Record<string, number>;
    readonly by_asset_type: Record<string, number>;
    readonly by_maturity: Record<string, number>;
    readonly by_status: Record<string, number>;
  };
  readonly private_summary?: {
    readonly total_private: number;
    readonly by_layer: Record<string, number>;
    readonly by_asset_type: Record<string, number>;
    readonly by_maturity: Record<string, number>;
    readonly needing_private_review: number;
  };
  readonly public_repositories: ReadonlyArray<EcosystemRepository>;
}

export interface EcosystemScoredRepository extends EcosystemRepository {
  readonly score: {
    readonly total: number;
    readonly band: string;
    readonly load_bearing: boolean;
    readonly components: {
      readonly maturity: number;
      readonly status: number;
      readonly metadata: number;
      readonly load_bearing_bonus: number;
    };
    readonly gaps: ReadonlyArray<string>;
  };
}

export interface EcosystemScorecardData {
  readonly present: boolean;
  readonly generated_at?: string;
  readonly totals?: {
    readonly total: number;
    readonly average_score: number;
    readonly load_bearing_count: number;
    readonly load_bearing_average_score: number;
    readonly by_band: Record<string, number>;
    readonly by_maturity: Record<string, number>;
    readonly top_gap_types: Record<string, number>;
  };
  readonly private_summary?: {
    readonly total_private: number;
    readonly average_score: number;
    readonly by_band: Record<string, number>;
    readonly by_layer: Record<
      string,
      {
        readonly count: number;
        readonly average_score: number;
        readonly load_bearing_count: number;
      }
    >;
    readonly top_gap_types: Record<string, number>;
  };
  readonly public_layer_summary?: Record<
    string,
    { readonly count: number; readonly average_score: number; readonly load_bearing_count: number }
  >;
  readonly next_actions?: ReadonlyArray<{
    readonly action: string;
    readonly reason: string;
    readonly phase: string;
  }>;
  readonly public_repositories: ReadonlyArray<EcosystemScoredRepository>;
}

export interface EcosystemResourceAsset {
  readonly name: string;
  readonly url: string;
  readonly layer: string;
  readonly asset_type: string;
  readonly maturity: string;
  readonly role: string;
  readonly score: number;
  readonly band: string;
  readonly status: string;
  readonly language: string | null;
  readonly gaps: ReadonlyArray<string>;
}

export interface EcosystemResourceUseCase {
  readonly id: string;
  readonly title: string;
  readonly question: string;
  readonly layers: ReadonlyArray<string>;
  readonly minimum_maturity: string;
  readonly minimum_score: number;
  readonly guidance: ReadonlyArray<string>;
  readonly commands: ReadonlyArray<string>;
  readonly asset_counts: {
    readonly candidates: number;
    readonly recommended: number;
    readonly improve_first: number;
    readonly reference_only: number;
  };
  readonly recommended_assets: ReadonlyArray<EcosystemResourceAsset>;
  readonly improve_first: ReadonlyArray<EcosystemResourceAsset>;
  readonly reference_assets: ReadonlyArray<EcosystemResourceAsset>;
}

export interface EcosystemResourceMapData {
  readonly present: boolean;
  readonly generated_at?: string;
  readonly source_generated_at?: string;
  readonly totals?: {
    readonly use_cases: number;
    readonly public_assets_considered: number;
    readonly recommended_assets: number;
    readonly improve_first_assets: number;
  };
  readonly use_cases: ReadonlyArray<EcosystemResourceUseCase>;
}

export interface GoldenPathGate {
  readonly id: string;
  readonly label: string;
  readonly status: "passed" | "failed" | string;
  readonly detail: string;
  readonly command?: string;
  readonly duration_ms?: number;
}

export interface GoldenPathRun {
  readonly schema_version: number;
  readonly run_id: string;
  readonly generated_at: string;
  readonly generated_by: string;
  readonly privacy: string;
  readonly spec: {
    readonly id: string;
    readonly title: string;
    readonly path: string;
    readonly intent: string;
    readonly recipe: string;
    readonly app_slug: string;
    readonly use_case_id: string;
  };
  readonly selected_resources: ReadonlyArray<{
    readonly name: string;
    readonly url: string;
    readonly layer: string;
    readonly score: number;
    readonly maturity: string;
  }>;
  readonly generated_app: {
    readonly local_path: string;
    readonly file_count: number;
    readonly tree_hash: string;
    readonly hashed_files: number;
  };
  readonly runtime: {
    readonly mode: string;
    readonly url: string;
    readonly health_path: string;
    readonly deploy_status: string;
    readonly deployed_url: string | null;
  };
  readonly gates: ReadonlyArray<GoldenPathGate>;
  readonly evidence: {
    readonly gate5_report: string;
    readonly latest_report: string;
    readonly public_index: string;
  };
  readonly reusable_lessons: ReadonlyArray<{
    readonly lesson: string;
    readonly fed_back: string;
  }>;
  readonly remaining_gaps: ReadonlyArray<string>;
  readonly wall_clock_ms: number;
}

export interface GoldenPathRunsData {
  readonly present: boolean;
  readonly schema_version?: number;
  readonly generated_at?: string;
  readonly generated_by?: string;
  readonly privacy?: string;
  readonly current_run_id?: string;
  readonly totals?: {
    readonly runs: number;
    readonly passed_runs: number;
    readonly latest_gate_count: number;
    readonly latest_wall_clock_ms: number;
  };
  readonly runs: ReadonlyArray<GoldenPathRun>;
}

export interface PublicProofLayerData {
  readonly present: boolean;
  readonly schema_version?: number;
  readonly generated_at?: string;
  readonly generated_by?: string;
  readonly privacy?: string;
  readonly target_surface?: {
    readonly repo: string;
    readonly site: string;
    readonly recommended_route: string;
    readonly status: string;
  };
  readonly positioning?: {
    readonly company: string;
    readonly system_name: string;
    readonly one_liner: string;
    readonly audience: ReadonlyArray<string>;
    readonly brand_boundary: string;
  };
  readonly public_claims?: ReadonlyArray<{
    readonly claim: string;
    readonly evidence: string;
    readonly source: string;
  }>;
  readonly architecture?: ReadonlyArray<{
    readonly layer: string;
    readonly public_label: string;
    readonly public_detail: string;
  }>;
  readonly proof_metrics?: {
    readonly public_repositories_indexed: number;
    readonly private_repositories_summarized: number;
    readonly public_assets_scored: number;
    readonly average_public_score: number;
    readonly load_bearing_assets: number;
    readonly load_bearing_average_score: number;
    readonly resource_use_cases: number;
    readonly golden_path_wall_clock_seconds: number;
    readonly golden_path_gates_passed: number;
    readonly golden_path_gate_count: number;
    readonly golden_path_verify_checks: {
      readonly passed: number;
      readonly total: number;
    };
  };
  readonly recommended_assets?: ReadonlyArray<{
    readonly name: string;
    readonly url: string;
    readonly layer: string;
    readonly asset_type: string;
    readonly maturity: string;
    readonly score: number;
    readonly status: string;
  }>;
  readonly publishable_sections?: ReadonlyArray<{
    readonly slug: string;
    readonly title: string;
    readonly body: string;
  }>;
  readonly evidence?: {
    readonly source_files: ReadonlyArray<string>;
    readonly generated_files: ReadonlyArray<string>;
    readonly golden_path_hash: string;
    readonly golden_path_run_id: string;
    readonly packet_hash: string;
  };
  readonly redaction_policy?: ReadonlyArray<string>;
  readonly remaining_gaps?: ReadonlyArray<string>;
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

export function readEcosystemRegistry(): EcosystemRegistryData {
  const p = join(META_ROOT, "data/ecosystem-registry.public.json");
  if (!existsSync(p)) return { present: false, public_repositories: [] };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Omit<EcosystemRegistryData, "present">;
    return { ...raw, present: true, public_repositories: raw.public_repositories ?? [] };
  } catch {
    return { present: false, public_repositories: [] };
  }
}

export function readEcosystemScorecard(): EcosystemScorecardData {
  const p = join(META_ROOT, "data/ecosystem-scorecard.public.json");
  if (!existsSync(p)) return { present: false, public_repositories: [] };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Omit<EcosystemScorecardData, "present">;
    return { ...raw, present: true, public_repositories: raw.public_repositories ?? [] };
  } catch {
    return { present: false, public_repositories: [] };
  }
}

export function readEcosystemResourceMap(): EcosystemResourceMapData {
  const p = join(META_ROOT, "data/ecosystem-resource-map.public.json");
  if (!existsSync(p)) return { present: false, use_cases: [] };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Omit<EcosystemResourceMapData, "present">;
    return { ...raw, present: true, use_cases: raw.use_cases ?? [] };
  } catch {
    return { present: false, use_cases: [] };
  }
}

export function readGoldenPathRuns(): GoldenPathRunsData {
  const p = join(META_ROOT, "data/golden-path-runs.public.json");
  if (!existsSync(p)) return { present: false, runs: [] };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Omit<GoldenPathRunsData, "present">;
    return { ...raw, present: true, runs: raw.runs ?? [] };
  } catch {
    return { present: false, runs: [] };
  }
}

export function readPublicProofLayer(): PublicProofLayerData {
  const p = join(META_ROOT, "data/public-proof-layer.public.json");
  if (!existsSync(p)) return { present: false };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as Omit<PublicProofLayerData, "present">;
    return { ...raw, present: true };
  } catch {
    return { present: false };
  }
}

// ── Phase 11.3 additions — federation server view ───────────────────────────

export interface HealthSnapshot {
  present: boolean;
  started_at?: string;
  summary?: {
    runners: number;
    avg_score: number;
    errors: number;
    warnings: number;
    passed: boolean;
  };
  runners?: ReadonlyArray<{
    runner: string;
    passed: boolean;
    score: number;
    findings: ReadonlyArray<{ severity: string; category: string; message: string }>;
    duration_ms: number;
  }>;
}

export function readLatestHealth(): HealthSnapshot {
  const p = join(META_ROOT, "evidence/health/latest.json");
  if (!existsSync(p)) return { present: false };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as HealthSnapshot & { present?: boolean };
    return { ...raw, present: true };
  } catch {
    return { present: false };
  }
}

export interface AuditSnapshot {
  present: boolean;
  started_at?: string;
  summary?: {
    sections: number;
    avg_score: number;
    errors: number;
    warnings: number;
    passed: boolean;
  };
  sections?: ReadonlyArray<{
    name: string;
    passed: boolean;
    score: number;
    findings: ReadonlyArray<{ severity: string; category: string; message: string }>;
    duration_ms: number;
  }>;
}

export function readLatestAudit(): AuditSnapshot {
  const p = join(META_ROOT, "evidence/audit/latest.json");
  if (!existsSync(p)) return { present: false };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as AuditSnapshot & { present?: boolean };
    return { ...raw, present: true };
  } catch {
    return { present: false };
  }
}

export interface BenchmarkSnapshot {
  present: boolean;
  started_at?: string;
  benchmarks?: {
    ask: { doc_count: number; avg_query_ms: number; index_build_ms: number };
    askScaling: ReadonlyArray<{ doc_count: number; index_build_ms: number; query_ms: number }>;
    mcp: { cold_start_ms: number; avg_rpc_ms: number };
    audit: { ms: number };
  };
}

export function readLatestBenchmarks(): BenchmarkSnapshot {
  const p = join(META_ROOT, "evidence/benchmarks/latest.json");
  if (!existsSync(p)) return { present: false };
  try {
    const raw = JSON.parse(readFileSync(p, "utf8")) as BenchmarkSnapshot & { present?: boolean };
    return { ...raw, present: true };
  } catch {
    return { present: false };
  }
}

export interface RecipeInfo {
  name: string;
  templates_dir_exists: boolean;
  has_threat_model: boolean;
  has_decisions: boolean;
  has_fixture: boolean;
}

export function readRecipes(): ReadonlyArray<RecipeInfo> {
  const recipesDir = join(META_ROOT, "recipes");
  if (!existsSync(recipesDir)) return [];
  const out: RecipeInfo[] = [];
  for (const name of readdirSync(recipesDir)) {
    const dir = join(recipesDir, name);
    if (!statSync(dir).isDirectory()) continue;
    if (!existsSync(join(dir, "recipe.yaml"))) continue;
    out.push({
      name,
      templates_dir_exists: existsSync(join(dir, "templates")),
      has_threat_model: existsSync(join(dir, "THREAT_MODEL.md")),
      has_decisions: existsSync(join(dir, "DECISIONS.md")),
      has_fixture: existsSync(join(META_ROOT, "test/fixtures", `${name}.inputs.json`)),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export interface LocalWarehouse {
  name: string;
  has_manifest: boolean;
  document_count: number;
  template_count: number;
}

export function readLocalWarehouses(): ReadonlyArray<LocalWarehouse> {
  const dir = join(META_ROOT, "warehouses");
  if (!existsSync(dir)) return [];
  const out: LocalWarehouse[] = [];
  for (const name of readdirSync(dir)) {
    const whDir = join(dir, name);
    if (!statSync(whDir).isDirectory()) continue;
    const docs = existsSync(join(whDir, "documents"))
      ? readdirSync(join(whDir, "documents")).filter((f) => f.endsWith(".md")).length
      : 0;
    const tmpls = existsSync(join(whDir, "templates"))
      ? countFilesRecursive(join(whDir, "templates"))
      : 0;
    out.push({
      name,
      has_manifest: existsSync(join(whDir, "manifest.yaml")),
      document_count: docs,
      template_count: tmpls,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function countFilesRecursive(dir: string): number {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count += countFilesRecursive(join(dir, entry.name));
    else if (entry.isFile()) count++;
  }
  return count;
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
