/**
 * `nx status` — "what should I look at first today?"
 *
 * One-screen view of:
 *   • Federation health (last audit + run timestamp)
 *   • Last weekly snapshot
 *   • Tracked projects (count by status + any failing health checks)
 *   • Operational blockers count
 *   • Tier-2 daily-ops payoff: the dashboard you check first thing.
 *
 * Reads everything from disk — fast, no spawning.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { NexuralConfig } from "../config.js";

export interface StatusOptions {
  readonly json?: boolean;
}

interface Snapshot {
  ok: boolean;
  score?: number;
  errors?: number;
  warnings?: number;
  finishedAt?: string;
}

interface ProjectsFile {
  schema_version: number;
  projects: Array<{
    slug: string;
    status: string;
    deploy_url?: string;
    last_verify?: string;
    last_verify_score?: number;
  }>;
}

export async function runStatus(config: NexuralConfig, opts: StatusOptions = {}): Promise<void> {
  const root = resolveRoot(config);
  if (!root) {
    console.error(`✖ no federation root. Set NEXURAL_META_ROOT or cd into nexural-meta.`);
    process.exitCode = 1;
    return;
  }

  const audit = readSnapshot(join(root, "evidence/audit/latest.json"));
  const health = readSnapshot(join(root, "evidence/health/latest.json"));
  const ecosystem = readEcosystemDigest(root);
  const projects = readProjects(root);
  const adrCount = countFiles(join(root, "docs/adr"), ".md");
  const warehouseCount = listWarehouses(root);
  const recipeCount = listRecipes(root);

  if (opts.json) {
    console.log(
      JSON.stringify(
        {
          root,
          audit,
          health,
          ecosystem,
          projects: {
            total: projects.length,
            by_status: countByStatus(projects),
            failing: projects.filter(
              (p) => p.last_verify_score !== undefined && p.last_verify_score < 80,
            ).length,
          },
          counts: {
            adrs: adrCount,
            warehouses: warehouseCount,
            recipes: recipeCount,
          },
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`📡 Nexural Federation — status`);
  console.log(`   ${root}`);
  console.log();

  // ── Federation health ──
  console.log(`▸ Federation health`);
  if (audit.ok) {
    const icon = audit.errors === 0 ? "✓" : "✖";
    console.log(
      `  ${icon} last audit:      ${audit.score ?? "?"}/100   ${audit.errors ?? 0} errors, ${audit.warnings ?? 0} warns   (${short(audit.finishedAt)})`,
    );
  } else {
    console.log(`  ⏳ no audit yet — run \`nx audit\``);
  }
  if (health.ok) {
    const icon = health.errors === 0 ? "✓" : "✖";
    console.log(
      `  ${icon} last weekly:     ${health.score ?? "?"}/100   ${health.errors ?? 0} errors, ${health.warnings ?? 0} warns   (${short(health.finishedAt)})`,
    );
  } else {
    console.log(`  ⏳ no weekly snapshot yet — run \`node scripts/health-check.mjs\``);
  }
  console.log();

  // ── Projects ──
  console.log(`▸ Tracked projects (${projects.length})`);
  if (projects.length === 0) {
    console.log(`  (none — \`nx project add <slug> --recipe <name>\` to track your first)`);
  } else {
    const counts = countByStatus(projects);
    for (const [status, count] of Object.entries(counts)) {
      console.log(`  • ${status.padEnd(12)} ${count}`);
    }
    const stale = projects.filter(
      (p) => p.last_verify_score !== undefined && p.last_verify_score < 80,
    );
    if (stale.length > 0) {
      console.log();
      console.log(
        `  ⚠ ${stale.length} ${stale.length === 1 ? "project" : "projects"} with last verify <80:`,
      );
      for (const p of stale.slice(0, 5)) {
        console.log(
          `    - ${p.slug} (${p.last_verify_score}/100; checked ${short(p.last_verify)})`,
        );
      }
    }
  }
  console.log();

  // ── Ecosystem digest ──
  console.log(`▸ Ecosystem`);
  if (ecosystem) {
    console.log(
      `  • latest digest:  ${ecosystem.date}   ${ecosystem.commits} commits, ${ecosystem.releases} releases`,
    );
    console.log(`  • view:           evidence/ecosystem/latest.md`);
  } else {
    console.log(`  ⏳ no digest yet — run \`node scripts/ecosystem-digest.mjs\``);
  }
  console.log();

  // ── Federation surface ──
  console.log(`▸ Federation surface`);
  console.log(`  • ADRs:           ${adrCount}`);
  console.log(`  • Warehouses:     ${warehouseCount}`);
  console.log(`  • Recipes:        ${recipeCount}`);
  console.log();

  // ── Operational ──
  const blockerPath = join(root, "evidence/operational/sage-blockers.md");
  if (existsSync(blockerPath)) {
    console.log(`▸ Operational`);
    console.log(`  • Sage blockers:  evidence/operational/sage-blockers.md`);
    console.log();
  }

  console.log(`Next things to do:`);
  if (!audit.ok) console.log(`  • \`nx audit\`                  — run the full federation check`);
  if (projects.filter((p) => p.deploy_url && !p.last_verify).length > 0) {
    console.log(`  • \`nx project check\`          — verify deployed projects`);
  }
  console.log(`  • \`nx ask "<question>"\`       — search the federation`);
  console.log(`  • \`nx serve\`                  — start the HTTP daemon`);
}

// ── helpers ──────────────────────────────────────────────────────────────

function resolveRoot(config: NexuralConfig): string | null {
  const cwd = process.cwd();
  if (isFederationRoot(cwd)) return cwd;
  if (config.meta_root && isFederationRoot(config.meta_root)) return config.meta_root;
  return null;
}

function isFederationRoot(root: string): boolean {
  return (
    existsSync(join(root, "docs")) &&
    existsSync(join(root, "recipes")) &&
    existsSync(join(root, "warehouses"))
  );
}

function readSnapshot(path: string): Snapshot {
  if (!existsSync(path)) return { ok: false };
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as {
      summary?: { avg_score?: number; errors?: number; warnings?: number; passed?: boolean };
      finished_at?: string;
      started_at?: string;
    };
    const summary = raw.summary ?? {};
    return {
      ok: true,
      ...(summary.avg_score !== undefined ? { score: summary.avg_score } : {}),
      ...(summary.errors !== undefined ? { errors: summary.errors } : {}),
      ...(summary.warnings !== undefined ? { warnings: summary.warnings } : {}),
      ...(raw.finished_at
        ? { finishedAt: raw.finished_at }
        : raw.started_at
          ? { finishedAt: raw.started_at }
          : {}),
    };
  } catch {
    return { ok: false };
  }
}

function readEcosystemDigest(
  root: string,
): { date: string; commits: number; releases: number } | null {
  const path = join(root, "evidence/ecosystem/latest.md");
  if (!existsSync(path)) return null;
  try {
    const body = readFileSync(path, "utf8");
    const dateMatch = body.match(/^#\s*Ecosystem digest\s+—\s+(\d{4}-\d{2}-\d{2})/m);
    const commitsMatch = body.match(/Total commits across ecosystem:\s+\*\*(\d+)\*\*/);
    const releasesMatch = body.match(/Total releases this week:\s+\*\*(\d+)\*\*/);
    return {
      date: dateMatch?.[1] ?? "?",
      commits: commitsMatch ? parseInt(commitsMatch[1]!, 10) : 0,
      releases: releasesMatch ? parseInt(releasesMatch[1]!, 10) : 0,
    };
  } catch {
    return null;
  }
}

function readProjects(root: string): ProjectsFile["projects"] {
  const path = join(root, "projects.yaml");
  if (!existsSync(path)) return [];
  try {
    const raw = parseYaml(readFileSync(path, "utf8")) as ProjectsFile;
    return Array.isArray(raw?.projects) ? raw.projects : [];
  } catch {
    return [];
  }
}

function countByStatus(projects: ProjectsFile["projects"]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of projects) {
    out[p.status] = (out[p.status] ?? 0) + 1;
  }
  return out;
}

function countFiles(dir: string, ext: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((f) => f.endsWith(ext)).length;
}

function listWarehouses(root: string): number {
  const dir = join(root, "warehouses");
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() && existsSync(join(p, "manifest.yaml"));
  }).length;
}

function listRecipes(root: string): number {
  const dir = join(root, "recipes");
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() && existsSync(join(p, "recipe.yaml"));
  }).length;
}

function short(s: string | undefined): string {
  if (!s) return "—";
  return s.replace("T", " ").replace(/\..*Z?$/, "");
}
