/**
 * Registry loader — reads registry-factory.yaml + registry-lifeops.yaml +
 * registry-external-mcp.yaml, returns a typed unified view of every endpoint
 * the router should fan out to.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface FederationEndpoint {
  readonly kind: "warehouse";
  readonly name: string;
  readonly federation: "factory" | "lifeops";
  readonly repo: string;
  readonly tier: "public" | "internal" | "private-encrypted";
  readonly tool_prefix: string;
}

export interface ExternalEndpoint {
  readonly kind: "external";
  readonly name: string;
  readonly federation: "factory" | "lifeops";
  readonly transport: "stdio" | "http" | "websocket";
  readonly command?: ReadonlyArray<string>;
  readonly url?: string;
  readonly tool_prefix: string;
  readonly schema_compatibility: "nexural-1" | "external";
}

export type RouterEndpoint = FederationEndpoint | ExternalEndpoint;

export interface LoadRegistriesResult {
  readonly endpoints: ReadonlyArray<RouterEndpoint>;
  readonly federations: { readonly factory: number; readonly lifeops: number };
  readonly externals: number;
}

/**
 * Load all registries from a directory (typically nexural-meta's root).
 * Returns a unified endpoint list ready for fan-out.
 */
export function loadRegistries(metaRoot: string): LoadRegistriesResult {
  const endpoints: RouterEndpoint[] = [];

  const factoryPath = join(metaRoot, "registry-factory.yaml");
  const lifeopsPath = join(metaRoot, "registry-lifeops.yaml");
  const externalPath = join(metaRoot, "registry-external-mcp.yaml");

  const factoryCount = loadFederationFile(factoryPath, "factory", endpoints);
  const lifeopsCount = loadFederationFile(lifeopsPath, "lifeops", endpoints);
  const externalCount = loadExternalFile(externalPath, endpoints);

  return {
    endpoints,
    federations: { factory: factoryCount, lifeops: lifeopsCount },
    externals: externalCount,
  };
}

function loadFederationFile(
  path: string,
  federation: "factory" | "lifeops",
  out: RouterEndpoint[],
): number {
  if (!existsSync(path)) return 0;
  const content = readFileSync(path, "utf8");
  const entries = parseFederationYaml(content);
  for (const entry of entries) {
    if (entry.status !== "active" && entry.status !== "seeded") continue;
    out.push({
      kind: "warehouse",
      name: entry.name,
      federation,
      repo: entry.repo,
      tier: entry.tier as FederationEndpoint["tier"],
      tool_prefix: entry.name,
    });
  }
  return entries.length;
}

function loadExternalFile(path: string, out: RouterEndpoint[]): number {
  if (!existsSync(path)) return 0;
  const content = readFileSync(path, "utf8");
  const entries = parseExternalYaml(content);
  for (const entry of entries) {
    out.push({
      kind: "external",
      name: entry.name,
      federation: entry.federation,
      transport: entry.transport,
      ...(entry.command ? { command: entry.command } : {}),
      ...(entry.url ? { url: entry.url } : {}),
      tool_prefix: entry.tool_prefix,
      schema_compatibility: entry.schema_compatibility,
    });
  }
  return entries.length;
}

/**
 * Minimal YAML parser for the federation registry shape.
 * For Phase 4 we keep it dependency-light.
 */
function parseFederationYaml(yaml: string): Array<{
  name: string;
  repo: string;
  tier: string;
  status: string;
}> {
  const lines = yaml.split("\n");
  const entries: Array<{
    name: string;
    repo: string;
    tier: string;
    status: string;
  }> = [];
  let current: Record<string, string> | null = null;
  for (const line of lines) {
    if (line.startsWith("  - name:")) {
      if (current && current.name) entries.push(current as never);
      current = { name: line.split(":").slice(1).join(":").trim() };
    } else if (current && line.startsWith("    ")) {
      const [k, ...rest] = line.trim().split(":");
      if (k) current[k] = rest.join(":").trim();
    }
  }
  if (current && current.name) entries.push(current as never);
  return entries;
}

function parseExternalYaml(yaml: string): Array<{
  name: string;
  federation: "factory" | "lifeops";
  transport: "stdio" | "http" | "websocket";
  command?: string[];
  url?: string;
  tool_prefix: string;
  schema_compatibility: "nexural-1" | "external";
}> {
  // The external-mcp registry is small (only ai-warehouse currently). Hand-parse.
  const blocks = yaml.split(/^  - schema_version:/m).slice(1);
  const out: Array<{
    name: string;
    federation: "factory" | "lifeops";
    transport: "stdio" | "http" | "websocket";
    command?: string[];
    url?: string;
    tool_prefix: string;
    schema_compatibility: "nexural-1" | "external";
  }> = [];
  for (const block of blocks) {
    const get = (key: string): string | undefined => {
      const m = block.match(new RegExp(`(?:^|\\n)\\s+${key}:\\s*(\\S+)`));
      return m?.[1];
    };
    const command: string[] = [];
    const cmdMatch = block.match(/command:\s*\n((?:\s+-\s+\S+\n?)+)/);
    if (cmdMatch?.[1]) {
      for (const line of cmdMatch[1].split("\n")) {
        const m = line.match(/^\s+-\s+(\S+)/);
        if (m) command.push(m[1]!);
      }
    }
    const fedMatch = block.match(/federations:\s*\n\s+-\s+(\S+)/);
    out.push({
      name: get("name") ?? "unknown",
      federation: (fedMatch?.[1] ?? "factory") as "factory" | "lifeops",
      transport: (get("transport") ?? "stdio") as "stdio" | "http" | "websocket",
      ...(command.length > 0 ? { command } : {}),
      ...(get("url") ? { url: get("url")! } : {}),
      tool_prefix: get("tool_prefix") ?? "unknown",
      schema_compatibility: (get("schema_compatibility") ?? "external") as "nexural-1" | "external",
    });
  }
  return out;
}
