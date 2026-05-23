/**
 * `nx ecosystem` — surface the multi-repo Sage Ideas ecosystem.
 *
 * Reads registry-external-mcp.yaml + reports which MCP servers are
 * registered, which binaries are installed, which env vars are set.
 *
 * Subcommands:
 *   nx ecosystem list      — show all registered MCP servers + their tools
 *   nx ecosystem health    — ping each registered MCP server binary
 *   nx ecosystem env       — show which env vars are set / missing
 *
 * This is the "is my ecosystem wired up?" entry point. For actual cross-
 * repo orchestration at query time, the editor agent calls each MCP server
 * directly via its MCP config — `nx ecosystem` is the maintainer-side
 * visibility layer.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type { NexuralConfig } from "../config.js";

export interface EcosystemOptions {
  readonly json?: boolean;
}

interface RegistryEntry {
  name: string;
  type: string;
  transport: string;
  command: string[];
  args?: string[];
  tool_prefix?: string;
  description?: string;
  quality_attestation?: {
    source?: string;
    score?: number;
    verified_at?: string;
    next_review?: string;
  };
}

interface Registry {
  schema_version: number;
  endpoints: RegistryEntry[];
}

export async function runEcosystem(
  config: NexuralConfig,
  subcommand: "list" | "health" | "env",
  opts: EcosystemOptions = {},
): Promise<void> {
  const root = resolveRoot(config);
  if (!root) {
    console.error(`✖ no federation root. Set NEXURAL_META_ROOT or run from inside nexural-meta.`);
    process.exitCode = 1;
    return;
  }

  const registry = loadRegistry(root);
  if (!registry) {
    console.error(`✖ no registry-external-mcp.yaml found at ${root}`);
    process.exitCode = 1;
    return;
  }

  if (subcommand === "list") {
    return list(registry, opts);
  }
  if (subcommand === "health") {
    return health(registry, opts);
  }
  if (subcommand === "env") {
    return env(registry, opts);
  }

  console.error(`✖ unknown subcommand: ${subcommand} (list | health | env)`);
  process.exitCode = 1;
}

function list(registry: Registry, opts: EcosystemOptions): void {
  if (opts.json) {
    console.log(JSON.stringify(registry, null, 2));
    return;
  }
  console.log(`📚 Sage Ideas Ecosystem — ${registry.endpoints.length} MCP servers registered`);
  console.log();
  for (const e of registry.endpoints) {
    const score = e.quality_attestation?.score ?? "—";
    console.log(`▸ ${e.name}  (score ${score})`);
    console.log(`  transport: ${e.transport}`);
    console.log(`  command:   ${e.command.join(" ")} ${(e.args ?? []).join(" ")}`);
    if (e.tool_prefix) console.log(`  tools:     ${e.tool_prefix}_*`);
    if (e.description) {
      const desc = e.description.replace(/\s+/g, " ").trim();
      console.log(`  about:     ${desc.slice(0, 100)}${desc.length > 100 ? "…" : ""}`);
    }
    console.log();
  }
  console.log(`To wire these into your editor, see docs/EDITOR_MCP_SETUP.md`);
}

function health(registry: Registry, opts: EcosystemOptions): void {
  const results = registry.endpoints.map((e) => ({
    name: e.name,
    command: e.command[0] ?? "(none)",
    installed: which(e.command[0] ?? ""),
    env_vars_resolved: (e.args ?? []).every(envResolves),
  }));

  if (opts.json) {
    console.log(JSON.stringify({ count: results.length, results }, null, 2));
    return;
  }

  console.log(`🏥 Ecosystem health check`);
  console.log();
  for (const r of results) {
    const installIcon = r.installed ? "✓" : "✖";
    const envIcon = r.env_vars_resolved ? "✓" : "⚠";
    console.log(`${installIcon} ${r.name.padEnd(24)} binary: ${r.command}`);
    console.log(
      `  ${envIcon} env vars in args:  ${r.env_vars_resolved ? "all resolved" : "unresolved (see `nx ecosystem env`)"}`,
    );
    if (!r.installed) {
      console.log(`     fix: install the binary (see docs/EDITOR_MCP_SETUP.md)`);
    }
    console.log();
  }
  const ready = results.filter((r) => r.installed && r.env_vars_resolved).length;
  console.log(`${ready}/${results.length} MCP servers ready to wire into your editor.`);
}

function env(registry: Registry, opts: EcosystemOptions): void {
  const tokens = new Set<string>();
  for (const e of registry.endpoints) {
    for (const a of e.args ?? []) {
      for (const m of a.matchAll(/\$\{([A-Z_][A-Z0-9_]*)\}/g)) {
        tokens.add(m[1]!);
      }
    }
  }

  const status = Array.from(tokens)
    .sort()
    .map((name) => ({
      name,
      set: process.env[name] !== undefined,
      value: process.env[name],
    }));

  if (opts.json) {
    console.log(JSON.stringify({ env_vars: status }, null, 2));
    return;
  }

  console.log(`🌐 Ecosystem environment variables`);
  console.log();
  for (const s of status) {
    const icon = s.set ? "✓" : "✖";
    console.log(`${icon} ${s.name.padEnd(30)} ${s.set ? s.value : "(unset)"}`);
  }
  const setCount = status.filter((s) => s.set).length;
  console.log();
  console.log(`${setCount}/${status.length} set.`);
  if (setCount < status.length) {
    console.log();
    console.log("Add to ~/.bash_profile (or ~/.zshrc):");
    for (const s of status) {
      if (!s.set) {
        console.log(`  export ${s.name}=/path/to/repo`);
      }
    }
  }
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

function loadRegistry(root: string): Registry | null {
  const p = join(root, "registry-external-mcp.yaml");
  if (!existsSync(p)) return null;
  try {
    const raw = parseYaml(readFileSync(p, "utf8")) as Registry;
    if (!raw || !Array.isArray(raw.endpoints)) return null;
    return raw;
  } catch {
    return null;
  }
}

function which(binary: string): boolean {
  if (!binary || binary === "python" || binary === "node") {
    // Common interpreters; assume installed
    try {
      execSync(`command -v ${binary}`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
  try {
    execSync(`command -v ${binary}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function envResolves(arg: string): boolean {
  // No ${VAR} → trivially resolved
  const matches = [...arg.matchAll(/\$\{([A-Z_][A-Z0-9_]*)\}/g)];
  if (matches.length === 0) return true;
  return matches.every((m) => process.env[m[1]!] !== undefined);
}
