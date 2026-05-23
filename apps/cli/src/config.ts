/**
 * ~/.nexural/config.toml loader — per ARCHITECTURE §4.1.
 *
 * Resolves config in priority order:
 *   1. NEXURAL_* env vars (per NAMING.md §7)
 *   2. ~/.nexural/config.toml
 *   3. Compiled-in defaults
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { parse as parseToml } from "smol-toml";
import { z } from "zod";

export const NexuralConfig = z
  .object({
    nexural_home: z.string().default(join(homedir(), ".nexural")),
    /**
     * Absolute path to the nexural-meta repo. Resolved by `nx ask` so it
     * works from any project directory. Defaults to a common location;
     * override via NEXURAL_META_ROOT env or `meta_root` in config.toml.
     */
    meta_root: z.string().default(join(homedir(), "code/nexural/nexural-meta")),
    warehouses_root: z.string().default(join(homedir(), "code/nexural/warehouses")),
    apps_root: z.string().default(join(homedir(), "code/apps")),
    router_url: z.string().default("stdio://nexural-meta-router"),
    telemetry_destination: z.enum(["local", "turso", "none"]).default("local"),
    llm_provider: z.enum(["anthropic", "openai", "ollama"]).default("anthropic"),
    llm_model: z.string().default("anthropic:opus"),
    log_level: z.enum(["debug", "info", "warn", "error"]).default("info"),
    editor: z.string().default(process.env.EDITOR ?? "code -w"),
    federation: z.enum(["factory", "lifeops", "both"]).default("both"),
  })
  .strict();
export type NexuralConfig = z.infer<typeof NexuralConfig>;

const ENV_MAP: Record<string, keyof NexuralConfig> = {
  NEXURAL_HOME: "nexural_home",
  NEXURAL_META_ROOT: "meta_root",
  NEXURAL_WAREHOUSES_ROOT: "warehouses_root",
  NEXURAL_APPS_ROOT: "apps_root",
  NEXURAL_ROUTER_URL: "router_url",
  NEXURAL_TELEMETRY_DEST: "telemetry_destination",
  NEXURAL_LLM_PROVIDER: "llm_provider",
  NEXURAL_LLM_MODEL: "llm_model",
  NEXURAL_LOG_LEVEL: "log_level",
  EDITOR: "editor",
  NEXURAL_FEDERATION: "federation",
};

export function loadConfig(): NexuralConfig {
  const nexuralHome = process.env.NEXURAL_HOME ?? join(homedir(), ".nexural");
  const configPath = join(nexuralHome, "config.toml");

  const fromFile: Record<string, unknown> = existsSync(configPath)
    ? (parseToml(readFileSync(configPath, "utf8")) as Record<string, unknown>)
    : {};

  const fromEnv: Record<string, unknown> = {};
  for (const [envVar, key] of Object.entries(ENV_MAP)) {
    const v = process.env[envVar];
    if (typeof v === "string" && v !== "") fromEnv[key] = v;
  }

  return NexuralConfig.parse({ ...fromFile, ...fromEnv });
}

/** Inverse of loadConfig — used by `nx init` to write the initial file. */
export function renderDefaultConfig(): string {
  const defaults = NexuralConfig.parse({});
  const lines = [
    "# ~/.nexural/config.toml — Nexural CLI config (per NAMING.md §7)",
    "# Env vars NEXURAL_* override these at runtime.",
    "",
  ];
  for (const [k, v] of Object.entries(defaults)) {
    lines.push(`${k} = ${typeof v === "string" ? `"${v}"` : String(v)}`);
  }
  return lines.join("\n") + "\n";
}
