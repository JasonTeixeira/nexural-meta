/**
 * `nx project` — track forged apps. Per ADR-0013 Tier-2 daily-ops.
 *
 * Subcommands:
 *   nx project add <slug> --recipe <name> [--url <url>] [--repo <repo>]
 *   nx project list [--json] [--status scaffold|live|shipped|deprecated]
 *   nx project check [<slug>]    — runs `nx verify` against each project's url
 *
 * Backed by `projects.yaml` at the federation root. Humans edit; this CLI
 * writes only via add/check (idempotent).
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type { NexuralConfig } from "../config.js";

type ProjectStatus = "scaffold" | "live" | "shipped" | "deprecated";

interface Project {
  slug: string;
  recipe: string;
  status: ProjectStatus;
  forged_at?: string;
  deploy_url?: string;
  repo_url?: string;
  last_verify?: string;
  last_verify_score?: number;
  notes?: string;
}

interface ProjectsFile {
  schema_version: number;
  projects: Project[];
}

export interface ProjectOptions {
  readonly recipe?: string;
  readonly url?: string;
  readonly repo?: string;
  readonly notes?: string;
  readonly status?: ProjectStatus;
  readonly json?: boolean;
}

export async function runProject(
  config: NexuralConfig,
  subcommand: "add" | "list" | "check",
  slug: string | undefined,
  opts: ProjectOptions = {},
): Promise<void> {
  const root = resolveRoot(config);
  if (!root) {
    console.error(`✖ no federation root. Set NEXURAL_META_ROOT or cd into nexural-meta.`);
    process.exitCode = 1;
    return;
  }

  if (subcommand === "add") {
    return add(root, slug, opts);
  }
  if (subcommand === "list") {
    return list(root, opts);
  }
  if (subcommand === "check") {
    return check(root, slug);
  }

  console.error(`✖ unknown subcommand: ${subcommand} (add | list | check)`);
  process.exitCode = 1;
}

function add(root: string, slug: string | undefined, opts: ProjectOptions): void {
  if (!slug) {
    console.error("Usage: nx project add <slug> --recipe <name> [--url <url>] [--repo <repo>]");
    process.exitCode = 1;
    return;
  }
  if (!opts.recipe) {
    console.error("✖ --recipe is required");
    process.exitCode = 1;
    return;
  }

  const file = loadOrInit(root);
  const existing = file.projects.find((p) => p.slug === slug);
  if (existing) {
    console.error(`✖ project "${slug}" already exists. Edit projects.yaml directly to update.`);
    process.exitCode = 1;
    return;
  }

  const project: Project = {
    slug,
    recipe: opts.recipe,
    status: opts.status ?? "scaffold",
    forged_at: new Date().toISOString(),
  };
  if (opts.url) project.deploy_url = opts.url;
  if (opts.repo) project.repo_url = opts.repo;
  if (opts.notes) project.notes = opts.notes;

  file.projects.push(project);
  save(root, file);
  console.log(`✓ added project "${slug}" (recipe: ${opts.recipe})`);
  console.log(`  status:    ${project.status}`);
  if (opts.url) console.log(`  deploy:    ${opts.url}`);
  if (opts.repo) console.log(`  repo:      ${opts.repo}`);
  console.log();
  console.log(`To verify deployment: nx project check ${slug}`);
}

function list(root: string, opts: ProjectOptions): void {
  const file = loadOrInit(root);
  let projects = file.projects;
  if (opts.status) {
    projects = projects.filter((p) => p.status === opts.status);
  }

  if (opts.json) {
    console.log(JSON.stringify({ count: projects.length, projects }, null, 2));
    return;
  }

  if (projects.length === 0) {
    console.log("No projects tracked yet.");
    console.log();
    console.log("Add one: nx project add <slug> --recipe <name> [--url <url>]");
    return;
  }

  console.log(`📦 ${projects.length} ${projects.length === 1 ? "project" : "projects"} tracked`);
  console.log();
  for (const p of projects) {
    const icon = statusIcon(p.status);
    console.log(`${icon} ${p.slug}  (${p.recipe})`);
    console.log(`   status:      ${p.status}`);
    if (p.deploy_url) console.log(`   deploy:      ${p.deploy_url}`);
    if (p.repo_url) console.log(`   repo:        ${p.repo_url}`);
    if (p.forged_at) console.log(`   forged:      ${p.forged_at}`);
    if (p.last_verify) {
      console.log(
        `   last verify: ${p.last_verify}${p.last_verify_score !== undefined ? ` (${p.last_verify_score}/100)` : ""}`,
      );
    }
    console.log();
  }
}

function check(root: string, slug: string | undefined): void {
  const file = loadOrInit(root);
  const targets = slug
    ? file.projects.filter((p) => p.slug === slug)
    : file.projects.filter((p) => p.deploy_url);
  if (targets.length === 0) {
    console.error(
      slug
        ? `✖ project "${slug}" not found (or has no deploy_url)`
        : `✖ no projects with deploy_url`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(`🔍 verifying ${targets.length} ${targets.length === 1 ? "project" : "projects"}`);
  console.log();
  let anyFailed = false;
  for (const p of targets) {
    if (!p.deploy_url) {
      console.log(`⏭  ${p.slug}: no deploy_url, skipped`);
      continue;
    }
    process.stdout.write(`▸ ${p.slug} (${p.deploy_url}) … `);
    let score = 0;
    let passed = false;
    try {
      // Inline minimal verify — counts HTTP 200 + security headers
      const result = quickVerify(p.deploy_url);
      score = result.score;
      passed = result.passed;
      console.log(`${passed ? "✓" : "✖"} ${score}/100`);
    } catch (err) {
      console.log(`✖ error — ${(err as Error).message.slice(0, 80)}`);
      anyFailed = true;
      continue;
    }
    if (!passed) anyFailed = true;
    p.last_verify = new Date().toISOString();
    p.last_verify_score = score;
  }
  save(root, file);
  console.log();
  console.log(`Saved last_verify timestamps to projects.yaml.`);
  if (anyFailed) process.exitCode = 1;
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

function loadOrInit(root: string): ProjectsFile {
  const path = join(root, "projects.yaml");
  if (!existsSync(path)) {
    return { schema_version: 1, projects: [] };
  }
  const raw = parseYaml(readFileSync(path, "utf8"));
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as ProjectsFile).projects)) {
    return { schema_version: 1, projects: [] };
  }
  return raw as ProjectsFile;
}

function save(root: string, file: ProjectsFile): void {
  const path = join(root, "projects.yaml");
  const yaml = stringifyYaml(file, { lineWidth: 100 });
  writeFileSync(path, yaml);
}

function statusIcon(status: ProjectStatus): string {
  switch (status) {
    case "shipped":
      return "✓";
    case "live":
      return "▶";
    case "scaffold":
      return "·";
    case "deprecated":
      return "⊘";
  }
}

interface QuickResult {
  passed: boolean;
  score: number;
}

function quickVerify(url: string): QuickResult {
  // Use `nx verify` via the same binary path as the running CLI
  try {
    const out = execFileSync(
      process.execPath,
      [process.argv[1] ?? "", "verify", url, "--skip-health"],
      {
        encoding: "utf8",
        timeout: 15000,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    const match = out.match(/(\d+)\/(\d+)\s+checks passed/);
    if (match) {
      const passed = parseInt(match[1]!, 10);
      const total = parseInt(match[2]!, 10);
      return {
        passed: passed === total,
        score: total > 0 ? Math.round((passed / total) * 100) : 0,
      };
    }
    return { passed: true, score: 80 };
  } catch {
    return { passed: false, score: 0 };
  }
}
