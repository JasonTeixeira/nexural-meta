#!/usr/bin/env node
/**
 * Maturity scorecard for Sage Ideas Engineering OS.
 *
 * Reads the full local inventory when present, but commits only public-safe
 * summaries. This is an evidence map, not a vanity score.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/ecosystem-scorecard.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PRIVATE_DIR = join(ROOT, ".nexural", "private");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");

const INTERNAL_REGISTRY = join(PRIVATE_DIR, "ecosystem-registry.internal.json");
const PUBLIC_REGISTRY = join(DATA_DIR, "ecosystem-registry.public.json");

const MATURITY_POINTS = {
  L0: 10,
  L1: 25,
  L2: 45,
  L3: 65,
  L4: 85,
  L5: 100,
};

const STATUS_ADJUSTMENT = {
  active: 10,
  watch: 0,
  stale: -10,
  archived: -25,
  reference: -15,
};

function main() {
  const registry = loadRegistry();
  const now = new Date().toISOString();
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(PRIVATE_DIR, { recursive: true });

  const repositories = registry.repositories ?? registry.public_repositories ?? [];
  const scored = repositories.map(scoreRepo);
  const publicScored = scored.filter((repo) => !repo.is_private);
  const privateScored = scored.filter((repo) => repo.is_private);

  const full = {
    schema_version: SCHEMA_VERSION,
    generated_at: now,
    generated_by: GENERATED_BY,
    source_generated_at: registry.generated_at,
    privacy: "internal-full",
    totals: summarizeScores(scored),
    repositories: scored,
  };

  const publicScorecard = {
    schema_version: SCHEMA_VERSION,
    generated_at: now,
    generated_by: GENERATED_BY,
    source_generated_at: registry.generated_at,
    privacy: "public-safe",
    note: "Private repositories are scored internally and summarized by count only. Full scorecard is generated locally at .nexural/private/ecosystem-scorecard.internal.json.",
    totals: summarizeScores(scored),
    private_summary: {
      total_private: privateScored.length,
      average_score: average(privateScored.map((repo) => repo.score.total)),
      by_band: countBy(privateScored, (repo) => repo.score.band),
      by_layer: summarizeBy(privateScored, (repo) => repo.canonical.layer),
      top_gap_types: topGapTypes(privateScored),
    },
    public_repositories: publicScored,
    public_layer_summary: summarizeBy(publicScored, (repo) => repo.canonical.layer),
    next_actions: deriveNextActions(scored),
  };

  writeJson(join(PRIVATE_DIR, "ecosystem-scorecard.internal.json"), full);
  writeJson(join(DATA_DIR, "ecosystem-scorecard.public.json"), publicScorecard);
  writeFileSync(join(DOCS_DIR, "ECOSYSTEM_SCORECARD.md"), renderMarkdown(publicScorecard), "utf8");

  console.error(
    `[ecosystem-scorecard] average ${publicScorecard.totals.average_score}/100 across ${scored.length} repos; ` +
      `${publicScorecard.totals.load_bearing_count} load-bearing assets`,
  );
}

function loadRegistry() {
  const path = existsSync(INTERNAL_REGISTRY) ? INTERNAL_REGISTRY : PUBLIC_REGISTRY;
  if (!existsSync(path)) {
    throw new Error("No ecosystem registry found. Run `pnpm ecosystem:inventory` first.");
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function scoreRepo(repo) {
  const maturity = repo.canonical?.maturity ?? "L0";
  const status = repo.operational?.status ?? "stale";
  const base = MATURITY_POINTS[maturity] ?? 10;
  const statusAdjustment = STATUS_ADJUSTMENT[status] ?? 0;
  const metadata = metadataPoints(repo);
  const loadBearing = isLoadBearing(repo);
  const total = clamp(base + statusAdjustment + metadata + (loadBearing ? 5 : 0), 0, 100);

  return {
    ...repo,
    score: {
      total,
      band: band(total),
      load_bearing: loadBearing,
      components: {
        maturity: base,
        status: statusAdjustment,
        metadata,
        load_bearing_bonus: loadBearing ? 5 : 0,
      },
      gaps: gaps(repo, total),
    },
  };
}

function metadataPoints(repo) {
  let points = 0;
  if (repo.canonical?.role && !repo.canonical.role.includes("Sage Ideas Engineering OS."))
    points += 5;
  if (repo.homepage_url) points += 5;
  if (repo.topics?.length > 0) points += 5;
  if (repo.license) points += 5;
  if (repo.default_branch) points += 3;
  return points;
}

function gaps(repo, total) {
  const found = [];
  if ((repo.canonical?.maturity ?? "L0") === "L0") found.push("maturity-l0");
  if (repo.operational?.status === "stale") found.push("stale");
  if (repo.operational?.status === "archived") found.push("archived");
  if (repo.operational?.status === "reference") found.push("reference-only");
  if (!repo.homepage_url && repo.canonical?.asset_type === "product-proof")
    found.push("missing-public-proof");
  if (!repo.license && !repo.is_private) found.push("missing-license");
  if (!repo.topics || repo.topics.length === 0) found.push("missing-topics");
  if (repo.operational?.needs_private_review) found.push("needs-private-override-review");
  if (isLoadBearing(repo) && total < 70) found.push("load-bearing-under-70");
  return found;
}

function isLoadBearing(repo) {
  const layer = repo.canonical?.layer;
  const type = repo.canonical?.asset_type;
  const maturity = repo.canonical?.maturity;
  if (layer === "reference-library") return false;
  if (repo.operational?.status === "archived" || repo.operational?.status === "reference")
    return false;
  if (repo.operational?.needs_private_review) return false;
  if (repo.operational?.status === "stale" || maturity === "L0") return false;
  return [
    "control-plane",
    "engine",
    "kit",
    "resource-library",
    "product-proof",
    "playbook",
  ].includes(type);
}

function summarizeScores(repositories) {
  const loadBearing = repositories.filter((repo) => repo.score.load_bearing);
  return {
    total: repositories.length,
    average_score: average(repositories.map((repo) => repo.score.total)),
    load_bearing_count: loadBearing.length,
    load_bearing_average_score: average(loadBearing.map((repo) => repo.score.total)),
    by_band: countBy(repositories, (repo) => repo.score.band),
    by_maturity: countBy(repositories, (repo) => repo.canonical.maturity),
    top_gap_types: topGapTypes(repositories),
  };
}

function summarizeBy(repositories, getKey) {
  const groups = new Map();
  for (const repo of repositories) {
    const key = getKey(repo);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(repo);
  }
  return Object.fromEntries(
    [...groups.entries()]
      .sort(([a], [b]) => String(a).localeCompare(String(b)))
      .map(([key, repos]) => [
        key,
        {
          count: repos.length,
          average_score: average(repos.map((repo) => repo.score.total)),
          load_bearing_count: repos.filter((repo) => repo.score.load_bearing).length,
        },
      ]),
  );
}

function deriveNextActions(repositories) {
  const loadBearingUnder70 = repositories.filter(
    (repo) => repo.score.load_bearing && repo.score.total < 70,
  ).length;
  const privateNeedsReview = repositories.filter((repo) =>
    repo.score.gaps.includes("needs-private-override-review"),
  ).length;
  const referenceCount = repositories.filter(
    (repo) => repo.canonical.layer === "reference-library",
  ).length;

  return [
    {
      action: "Review private overrides",
      reason: `${privateNeedsReview} private repos are still classified by generic inference.`,
      phase: "Phase 2",
    },
    {
      action: "Separate reference library from product proof narrative",
      reason: `${referenceCount} repos are reference/library assets and should not dilute the public engineering story.`,
      phase: "Phase 2",
    },
    {
      action: "Raise load-bearing assets below 70",
      reason: `${loadBearingUnder70} load-bearing assets need docs, evidence, topics, homepage, or maturity upgrades.`,
      phase: "Phase 3-5",
    },
  ];
}

function topGapTypes(repositories) {
  const counts = {};
  for (const repo of repositories) {
    for (const gap of repo.score.gaps) {
      counts[gap] = (counts[gap] ?? 0) + 1;
    }
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1]));
}

function renderMarkdown(scorecard) {
  const lines = [];
  lines.push("# Ecosystem Scorecard");
  lines.push("");
  lines.push("**Status:** Phase 2 generated maturity map");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${scorecard.generated_at}`);
  lines.push("");
  lines.push("## Read This Correctly");
  lines.push("");
  lines.push(
    "This is a maturity and gap map across the GitHub ecosystem. It is not a judgment of engineering ability.",
  );
  lines.push(
    "A large reference library intentionally scores low because reference repos are raw material, not productized infrastructure.",
  );
  lines.push("");
  lines.push("## Executive Scores");
  lines.push("");
  lines.push(`- Average across all repos: **${scorecard.totals.average_score}/100**`);
  lines.push(
    `- Load-bearing asset average: **${scorecard.totals.load_bearing_average_score}/100** across **${scorecard.totals.load_bearing_count}** assets`,
  );
  lines.push(`- Private repo average: **${scorecard.private_summary.average_score}/100**`);
  lines.push("");
  lines.push("## Score Bands");
  lines.push("");
  lines.push("| Band | Count |");
  lines.push("| --- | ---: |");
  for (const [bandName, count] of Object.entries(scorecard.totals.by_band)) {
    lines.push(`| ${bandName} | ${count} |`);
  }
  lines.push("");
  lines.push("## Layer Scores");
  lines.push("");
  lines.push("| Layer | Count | Load-bearing | Average score |");
  lines.push("| --- | ---: | ---: | ---: |");
  for (const [layer, summary] of Object.entries(scorecard.public_layer_summary)) {
    lines.push(
      `| ${layer} | ${summary.count} | ${summary.load_bearing_count} | ${summary.average_score} |`,
    );
  }
  lines.push("");
  lines.push("## Top Gap Types");
  lines.push("");
  lines.push("| Gap | Count |");
  lines.push("| --- | ---: |");
  for (const [gap, count] of Object.entries(scorecard.totals.top_gap_types).slice(0, 12)) {
    lines.push(`| ${gap} | ${count} |`);
  }
  lines.push("");
  lines.push("## Public Load-Bearing Assets Below 70");
  lines.push("");
  lines.push("| Repository | Layer | Score | Gaps |");
  lines.push("| --- | --- | ---: | --- |");
  const lowPublic = scorecard.public_repositories
    .filter((repo) => repo.score.load_bearing && repo.score.total < 70)
    .sort((a, b) => a.score.total - b.score.total);
  if (lowPublic.length === 0) {
    lines.push("| None | - | - | - |");
  } else {
    for (const repo of lowPublic) {
      lines.push(
        `| [${repo.name}](${repo.url}) | ${repo.canonical.layer} | ${repo.score.total} | ${repo.score.gaps.join(", ")} |`,
      );
    }
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const item of scorecard.next_actions) {
    lines.push(`- **${item.action}:** ${item.reason}`);
  }
  lines.push("");
  return `${lines.join("\n").trimEnd()}\n`;
}

function band(score) {
  if (score >= 95) return "95-100 elite";
  if (score >= 85) return "85-94 strong";
  if (score >= 70) return "70-84 usable";
  if (score >= 50) return "50-69 incomplete";
  return "0-49 raw/reference";
}

function countBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item) ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (clean.length === 0) return 0;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main();
