#!/usr/bin/env node
/**
 * GitHub ecosystem inventory for Sage Ideas Engineering OS.
 *
 * The full inventory may include private repository names and descriptions, so
 * it is written only to .nexural/private/. The committed artifacts are
 * public-safe summaries and public repository entries.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OWNER = process.env.SAGE_GITHUB_OWNER ?? "JasonTeixeira";
const GENERATED_BY = "scripts/ecosystem-inventory.mjs";
const SCHEMA_VERSION = 1;

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PRIVATE_DIR = join(ROOT, ".nexural", "private");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const PUBLIC_OVERRIDES_PATH = join(DATA_DIR, "ecosystem-public-overrides.json");

const GH_FIELDS = [
  "name",
  "nameWithOwner",
  "description",
  "isPrivate",
  "isArchived",
  "isFork",
  "isMirror",
  "isTemplate",
  "primaryLanguage",
  "languages",
  "updatedAt",
  "url",
  "repositoryTopics",
  "createdAt",
  "pushedAt",
  "homepageUrl",
  "parent",
  "stargazerCount",
  "diskUsage",
  "defaultBranchRef",
  "licenseInfo",
  "visibility",
];

const BASE_PUBLIC_OVERRIDES = {
  "nexural-meta": {
    canonical_name: "Sage Ideas Engineering OS Control Plane",
    layer: "control-plane",
    asset_type: "control-plane",
    maturity: "L4",
    role: "Registry, warehouses, ADRs, recipes, CLI, and service-level governance.",
  },
  "sageideas.dev": {
    canonical_name: "sageideas.dev",
    layer: "public-proof-surface",
    asset_type: "product-proof",
    maturity: "L3",
    role: "Public company and proof surface for Sage Ideas.",
  },
  Nexural_Automation: {
    canonical_name: "Nexural Automation",
    layer: "quant-trading",
    asset_type: "engine",
    maturity: "L3",
    role: "Local-first futures automation and strategy research hub.",
  },
  "nexural-automation-starter": {
    canonical_name: "Nexural Automation Starter",
    layer: "quant-trading",
    asset_type: "kit",
    maturity: "L2",
    role: "Paper-money-safe webhook and paper-order starter kit.",
  },
  JasonTeixeira: {
    canonical_name: "JasonTeixeira GitHub Profile",
    layer: "public-proof-surface",
    asset_type: "product-proof",
    maturity: "L2",
    role: "GitHub profile and public engineering identity surface.",
  },
};

const PUBLIC_OVERRIDES = loadPublicOverrides();

const PRIVATE_LAYER_HINTS = [
  ["platform", "app-factory-runtime"],
  ["athanor", "app-factory-runtime"],
  ["qa", "quality-system"],
  ["warehouse", "resource-library"],
  ["agent", "agent-engine"],
  ["voice", "voice-engine"],
  ["quant", "quant-trading"],
  ["strategy", "quant-trading"],
  ["trading", "quant-trading"],
  ["discord", "product-proof"],
  ["website", "product-proof"],
  ["commerce", "product-proof"],
  ["job", "product-proof"],
  ["learning", "product-proof"],
  ["ops", "ops-knowledge"],
  ["vault", "ops-knowledge"],
];

function main() {
  const now = new Date().toISOString();
  mkdirSync(PRIVATE_DIR, { recursive: true });
  mkdirSync(DATA_DIR, { recursive: true });

  let repos;
  try {
    repos = fetchRepos();
  } catch (err) {
    if (
      isTransientGitHubError(err) &&
      existsSync(join(DATA_DIR, "ecosystem-registry.public.json"))
    ) {
      console.error(
        `[ecosystem-inventory] GitHub inventory unavailable after retries; keeping cached public-safe registry: ${tailError(err)}`,
      );
      return;
    }
    throw err;
  }
  const overrides = loadPrivateOverrides();
  const classified = repos
    .map((repo) => classifyRepo(repo, overrides))
    .sort((a, b) => a.name.localeCompare(b.name));

  const full = {
    schema_version: SCHEMA_VERSION,
    generated_at: now,
    generated_by: GENERATED_BY,
    owner: OWNER,
    privacy: "internal-full",
    totals: summarize(classified),
    repositories: classified,
  };

  const publicRegistry = buildPublicRegistry(classified, now);

  writeJson(join(PRIVATE_DIR, "ecosystem-registry.internal.json"), full);
  writeJson(join(DATA_DIR, "ecosystem-registry.public.json"), publicRegistry);
  writeFileSync(join(DOCS_DIR, "ECOSYSTEM_INVENTORY.md"), renderMarkdown(publicRegistry), "utf8");

  console.error(
    `[ecosystem-inventory] ${classified.length} repos inventoried; ` +
      `${publicRegistry.public_repositories.length} public entries committed; ` +
      `${publicRegistry.private_summary.total_private} private repos summarized`,
  );
}

function fetchRepos() {
  const args = ["repo", "list", OWNER, "--limit", "1000", "--json", GH_FIELDS.join(",")];
  try {
    const raw = execFileSync("gh", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("gh repo list did not return an array");
    }
    return parsed;
  } catch (err) {
    if (!isTransientGitHubError(err)) throw err;
    return fetchReposViaRest();
  }
}

function fetchReposViaRest() {
  const endpoint =
    OWNER === authenticatedLogin()
      ? "/user/repos?visibility=all&affiliation=owner&per_page=100"
      : `/users/${encodeURIComponent(OWNER)}/repos?type=owner&per_page=100`;
  const raw = execFileSync("gh", ["api", "--paginate", "--slurp", endpoint], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const pages = JSON.parse(raw);
  const repos = pages
    .flat()
    .filter((repo) => repo?.owner?.login === OWNER || repo?.full_name?.startsWith(`${OWNER}/`))
    .map(normalizeRestRepo);
  if (repos.length === 0) {
    throw new Error(`REST inventory fallback returned no repositories for ${OWNER}`);
  }
  return repos;
}

function authenticatedLogin() {
  try {
    return execFileSync("gh", ["api", "user", "--jq", ".login"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function normalizeRestRepo(repo) {
  const language = repo.language ? { name: repo.language } : null;
  return {
    name: repo.name,
    nameWithOwner: repo.full_name,
    description: repo.description,
    isPrivate: Boolean(repo.private),
    isArchived: Boolean(repo.archived),
    isFork: Boolean(repo.fork),
    isMirror: Boolean(repo.mirror_url),
    isTemplate: Boolean(repo.is_template),
    primaryLanguage: language,
    languages: { nodes: language ? [language] : [] },
    updatedAt: repo.updated_at,
    url: repo.html_url,
    repositoryTopics: (repo.topics ?? []).map((name) => ({ name })),
    createdAt: repo.created_at,
    pushedAt: repo.pushed_at,
    homepageUrl: repo.homepage || null,
    parent: repo.parent?.full_name ? { nameWithOwner: repo.parent.full_name } : null,
    stargazerCount: repo.stargazers_count ?? 0,
    diskUsage: repo.size ?? null,
    defaultBranchRef: repo.default_branch ? { name: repo.default_branch } : null,
    licenseInfo: normalizeRestLicense(repo.license),
    visibility: String(repo.visibility ?? (repo.private ? "private" : "public")).toUpperCase(),
  };
}

function normalizeRestLicense(license) {
  if (!license) return null;
  return {
    spdxId: license.spdx_id && license.spdx_id !== "NOASSERTION" ? license.spdx_id : null,
    name: license.name ?? null,
  };
}

function isTransientGitHubError(err) {
  const message = `${err?.stderr ?? ""}\n${err?.message ?? ""}`;
  return /HTTP (429|500|502|503|504)|Bad Gateway|Service Unavailable|rate limit|cannot allocate memory|fatal error: runtime/i.test(
    message,
  );
}

function tailError(err) {
  return String(err?.stderr ?? err?.message ?? err)
    .trim()
    .split(/\r?\n/)
    .slice(-2)
    .join(" ");
}

function loadPrivateOverrides() {
  const path = join(PRIVATE_DIR, "ecosystem-overrides.json");
  if (!existsSync(path)) return new Map();
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const entries = raw?.repositories ?? {};
  return new Map(Object.entries(entries));
}

function loadPublicOverrides() {
  const configured = existsSync(PUBLIC_OVERRIDES_PATH)
    ? (JSON.parse(readFileSync(PUBLIC_OVERRIDES_PATH, "utf8"))?.repositories ?? {})
    : {};
  return new Map(Object.entries({ ...BASE_PUBLIC_OVERRIDES, ...configured }));
}

function classifyRepo(repo, privateOverrides) {
  const base = {
    name: repo.name,
    full_name: repo.nameWithOwner ?? `${OWNER}/${repo.name}`,
    url: repo.url,
    visibility: repo.visibility ?? (repo.isPrivate ? "PRIVATE" : "PUBLIC"),
    is_private: Boolean(repo.isPrivate),
    is_archived: Boolean(repo.isArchived),
    is_fork: Boolean(repo.isFork),
    is_mirror: Boolean(repo.isMirror),
    is_template: Boolean(repo.isTemplate),
    primary_language: repo.primaryLanguage?.name ?? null,
    languages: normalizeLanguages(repo.languages),
    topics: normalizeTopics(repo.repositoryTopics),
    homepage_url: repo.homepageUrl || null,
    created_at: repo.createdAt,
    pushed_at: repo.pushedAt,
    updated_at: repo.updatedAt,
    default_branch: repo.defaultBranchRef?.name ?? null,
    license: repo.licenseInfo?.spdxId ?? repo.licenseInfo?.name ?? null,
    parent: repo.parent?.nameWithOwner ?? null,
    disk_usage_kb: repo.diskUsage ?? null,
    stargazers: repo.stargazerCount ?? 0,
  };

  const override = PUBLIC_OVERRIDES.get(repo.name) ?? privateOverrides.get(repo.name) ?? {};
  const inferred = inferClassification(repo);

  return {
    ...base,
    canonical: {
      canonical_name: override.canonical_name ?? repo.name,
      layer: override.layer ?? inferred.layer,
      asset_type: override.asset_type ?? inferred.asset_type,
      maturity: override.maturity ?? inferred.maturity,
      role: override.role ?? inferred.role,
      maturity_gaps: override.maturity_gaps ?? [],
      public_exposure: repo.isPrivate ? "redacted" : "public",
    },
    operational: {
      status: inferStatus(repo),
      stale_days: daysSince(repo.pushedAt),
      needs_private_review: repo.isPrivate && !privateOverrides.has(repo.name),
    },
  };
}

function inferClassification(repo) {
  if (repo.isArchived || repo.isFork || repo.parent) {
    return {
      layer: "reference-library",
      asset_type: "reference",
      maturity: "L0",
      role: "Reference source kept for study, comparison, or implementation mining.",
    };
  }

  const text =
    `${repo.name} ${repo.description ?? ""} ${normalizeTopics(repo.repositoryTopics).join(" ")}`.toLowerCase();
  const layer =
    repo.isPrivate && matchPrivateLayer(text) ? matchPrivateLayer(text) : inferPublicLayer(text);
  const asset_type = inferAssetType(layer, text);
  const maturity = inferMaturity(repo, asset_type);

  return {
    layer,
    asset_type,
    maturity,
    role: inferRole(layer, asset_type),
  };
}

function matchPrivateLayer(text) {
  for (const [needle, layer] of PRIVATE_LAYER_HINTS) {
    if (text.includes(needle)) return layer;
  }
  return null;
}

function inferPublicLayer(text) {
  if (text.includes("trading") || text.includes("quant") || text.includes("backtest"))
    return "quant-trading";
  if (text.includes("portfolio") || text.includes("profile")) return "public-proof-surface";
  if (text.includes("template") || text.includes("boilerplate") || text.includes("starter"))
    return "resource-library";
  if (text.includes("agent") || text.includes("rag") || text.includes("workflow"))
    return "agent-engine";
  if (text.includes("cloud") || text.includes("terraform") || text.includes("kubernetes"))
    return "ops-knowledge";
  return "reference-library";
}

function inferAssetType(layer, text) {
  if (layer === "control-plane") return "control-plane";
  if (layer === "product-proof" || layer === "public-proof-surface") return "product-proof";
  if (text.includes("starter") || text.includes("template") || text.includes("boilerplate"))
    return "kit";
  if (text.includes("playbook") || text.includes("guide") || text.includes("awesome"))
    return "reference";
  if (layer.endsWith("engine") || layer === "quant-trading") return "engine";
  if (layer === "resource-library") return "resource-library";
  if (layer === "ops-knowledge") return "playbook";
  return "reference";
}

function inferMaturity(repo, assetType) {
  if (repo.isArchived || repo.isFork || repo.parent) return "L0";
  if (PUBLIC_OVERRIDES.has(repo.name)) return PUBLIC_OVERRIDES.get(repo.name).maturity;
  const staleDays = daysSince(repo.pushedAt);
  if (assetType === "reference") return "L0";
  if (repo.homepageUrl && staleDays <= 60) return "L2";
  if (repo.description && staleDays <= 45) return "L2";
  if (staleDays <= 90) return "L1";
  return "L0";
}

function inferRole(layer, assetType) {
  const roles = {
    "app-factory-runtime": "Factory runtime or app generation capability.",
    "quality-system": "Quality, verification, release confidence, or evidence capability.",
    "resource-library": "Reusable tool, SDK, stack, or playbook intelligence.",
    "agent-engine": "Agent runtime, workflow worker, memory, or RAG capability.",
    "voice-engine": "Reusable voice runtime or provider adapter capability.",
    "quant-trading": "Trading, strategy research, backtesting, or execution capability.",
    "product-proof": "Application proof that demonstrates reusable engines or workflows.",
    "public-proof-surface": "Public-facing identity, proof, or case-study surface.",
    "ops-knowledge": "Operational knowledge, automation, cloud, DevOps, or maintenance reference.",
    "reference-library": "Reference source kept for learning or future implementation mining.",
  };
  return roles[layer] ?? `${assetType} in the Sage Ideas Engineering OS.`;
}

function inferStatus(repo) {
  if (repo.isArchived) return "archived";
  if (repo.isFork || repo.parent) return "reference";
  const staleDays = daysSince(repo.pushedAt);
  if (staleDays <= 30) return "active";
  if (staleDays <= 120) return "watch";
  return "stale";
}

function buildPublicRegistry(repositories, now) {
  const publicRepos = repositories.filter((repo) => !repo.is_private);
  const privateRepos = repositories.filter((repo) => repo.is_private);

  return {
    schema_version: SCHEMA_VERSION,
    generated_at: now,
    generated_by: GENERATED_BY,
    owner: OWNER,
    privacy: "public-safe",
    note: "Private repositories are summarized by count only. Full inventory is generated locally at .nexural/private/ecosystem-registry.internal.json.",
    totals: summarize(repositories),
    private_summary: {
      total_private: privateRepos.length,
      by_layer: countBy(privateRepos, (repo) => repo.canonical.layer),
      by_asset_type: countBy(privateRepos, (repo) => repo.canonical.asset_type),
      by_maturity: countBy(privateRepos, (repo) => repo.canonical.maturity),
      needing_private_review: privateRepos.filter((repo) => repo.operational.needs_private_review)
        .length,
    },
    public_repositories: publicRepos,
  };
}

function renderMarkdown(registry) {
  const lines = [];
  lines.push("# Ecosystem Inventory");
  lines.push("");
  lines.push("**Status:** Phase 1 generated inventory");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${registry.generated_at}`);
  lines.push(`**Source:** GitHub owner \`${registry.owner}\``);
  lines.push("");
  lines.push("## Privacy Boundary");
  lines.push("");
  lines.push(
    "`nexural-meta` is public, so this committed inventory redacts private repository names and descriptions.",
  );
  lines.push(
    "The full local inventory is generated at `.nexural/private/ecosystem-registry.internal.json` and is intentionally ignored by git.",
  );
  lines.push("");
  lines.push("## Totals");
  lines.push("");
  lines.push(`- Total repositories: **${registry.totals.total}**`);
  lines.push(`- Public repositories: **${registry.totals.public}**`);
  lines.push(`- Private repositories: **${registry.totals.private}**`);
  lines.push(`- Archived repositories: **${registry.totals.archived}**`);
  lines.push(`- Fork/reference repositories: **${registry.totals.forks}**`);
  lines.push("");
  lines.push("## Layer Summary");
  lines.push("");
  lines.push("| Layer | Count |");
  lines.push("| --- | ---: |");
  for (const [layer, count] of Object.entries(registry.totals.by_layer).sort()) {
    lines.push(`| ${layer} | ${count} |`);
  }
  lines.push("");
  lines.push("## Private Repository Summary");
  lines.push("");
  lines.push(`- Private repos summarized: **${registry.private_summary.total_private}**`);
  lines.push(
    `- Private repos needing override review: **${registry.private_summary.needing_private_review}**`,
  );
  lines.push("");
  lines.push("| Private layer | Count |");
  lines.push("| --- | ---: |");
  for (const [layer, count] of Object.entries(registry.private_summary.by_layer).sort()) {
    lines.push(`| ${layer} | ${count} |`);
  }
  lines.push("");
  lines.push("## Public Repositories");
  lines.push("");
  lines.push("| Repository | Layer | Asset type | Maturity | Status |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const repo of registry.public_repositories) {
    lines.push(
      `| [${repo.name}](${repo.url}) | ${repo.canonical.layer} | ${repo.canonical.asset_type} | ${repo.canonical.maturity} | ${repo.operational.status} |`,
    );
  }
  lines.push("");
  lines.push("## Phase 1 Done Criteria");
  lines.push("");
  lines.push("- GitHub owner inventory is repeatable through `pnpm ecosystem:inventory`.");
  lines.push("- Full private inventory exists locally and is git-ignored.");
  lines.push("- Public-safe registry and summary are committed.");
  lines.push("- Private repos with generic inference are marked for override review.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function summarize(repositories) {
  return {
    total: repositories.length,
    public: repositories.filter((repo) => !repo.is_private).length,
    private: repositories.filter((repo) => repo.is_private).length,
    archived: repositories.filter((repo) => repo.is_archived).length,
    forks: repositories.filter((repo) => repo.is_fork || repo.parent).length,
    by_layer: countBy(repositories, (repo) => repo.canonical.layer),
    by_asset_type: countBy(repositories, (repo) => repo.canonical.asset_type),
    by_maturity: countBy(repositories, (repo) => repo.canonical.maturity),
    by_status: countBy(repositories, (repo) => repo.operational.status),
  };
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item) ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function normalizeLanguages(languages) {
  const nodes = languages?.nodes ?? [];
  return nodes.map((node) => node.name).filter(Boolean);
}

function normalizeTopics(topics) {
  if (!Array.isArray(topics)) return [];
  return topics.map((topic) => topic.name).filter(Boolean);
}

function daysSince(iso) {
  const timestamp = Date.parse(iso ?? "");
  if (!Number.isFinite(timestamp)) return null;
  return Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main();
