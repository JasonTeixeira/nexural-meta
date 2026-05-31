#!/usr/bin/env node
/**
 * Phase 4 resource factory map for Sage Ideas Engineering OS.
 *
 * Turns the public-safe scorecard into reusable "what should I use for X?"
 * guidance. This intentionally publishes only public repository metadata.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/ecosystem-resource-map.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const SCORECARD = join(DATA_DIR, "ecosystem-scorecard.public.json");

const USE_CASES = [
  {
    id: "ship-saas-app",
    title: "Ship a SaaS or internal app",
    question: "I need to build and deploy an application quickly.",
    layers: ["app-factory-runtime", "control-plane", "quality-system", "resource-library"],
    minimum_maturity: "L2",
    minimum_score: 60,
    guidance: [
      "Start from the control plane and factory runtime.",
      "Prefer assets with a reusable contract, setup docs, and QA evidence.",
      "Fix any load-bearing-under-70 gap before building a new dependency on it.",
    ],
    commands: ["pnpm ecosystem:refresh", "pnpm --filter @nexural/dashboard dev"],
  },
  {
    id: "choose-stack-or-sdk",
    title: "Choose a stack, SDK, or provider",
    question: "I need to know what tool or SDK to use for a build.",
    layers: ["resource-library", "control-plane", "reference-library"],
    minimum_maturity: "L1",
    minimum_score: 45,
    guidance: [
      "Use resource-library assets for verdicts and repeatable choices.",
      "Treat reference-library assets as comparison material, not production dependencies.",
      "Promote repeated wins into recipes or playbooks.",
    ],
    commands: ["pnpm ecosystem:refresh"],
  },
  {
    id: "qa-release-proof",
    title: "Create QA and release proof",
    question: "I need confidence gates, evidence, scorecards, or proof bundles.",
    layers: ["quality-system", "control-plane"],
    minimum_maturity: "L2",
    minimum_score: 60,
    guidance: [
      "Use the QA layer before public proof or client-facing claims.",
      "Capture commands, outputs, screenshots, hashes, and remaining gaps.",
      "Do not promote an asset without repeatable verification evidence.",
    ],
    commands: ["pnpm verify-all", "pnpm typecheck"],
  },
  {
    id: "build-agent-workflow",
    title: "Build an agent workflow",
    question: "I need agents, RAG, evals, memory, or background workers.",
    layers: ["agent-engine", "resource-library", "quality-system", "control-plane"],
    minimum_maturity: "L2",
    minimum_score: 60,
    guidance: [
      "Start with agent-engine assets, then pull resource-library references.",
      "Require evals, logs, and observability before the workflow becomes reusable.",
      "Keep private prompts and credentials out of public proof artifacts.",
    ],
    commands: ["pnpm ecosystem:refresh"],
  },
  {
    id: "build-trading-system",
    title: "Build or audit trading infrastructure",
    question: "I need quant research, validation, execution, or trading automation.",
    layers: ["quant-trading", "quality-system", "resource-library", "control-plane"],
    minimum_maturity: "L2",
    minimum_score: 60,
    guidance: [
      "Separate research references from execution-capable engines.",
      "Demand anti-lookahead, walk-forward, and overfit checks before trusting output.",
      "Public proof should show architecture and validation, not private edge details.",
    ],
    commands: ["pnpm ecosystem:refresh"],
  },
  {
    id: "publish-proof-page",
    title: "Publish a public proof page",
    question: "I need to show the system safely on sageideas.dev.",
    layers: ["public-proof-surface", "product-proof", "quality-system", "control-plane"],
    minimum_maturity: "L2",
    minimum_score: 60,
    guidance: [
      "Use public-proof-surface assets for the publishing target.",
      "Use product-proof assets only as examples, not as umbrella branding.",
      "Include at least four proof elements: architecture, QA, runtime, narrative, metrics, or gaps.",
    ],
    commands: ["pnpm ecosystem:refresh"],
  },
  {
    id: "reuse-product-pattern",
    title: "Reuse a product pattern",
    question: "I need to retrofit an existing product idea into a new project.",
    layers: ["product-proof", "app-factory-runtime", "quality-system", "resource-library"],
    minimum_maturity: "L2",
    minimum_score: 60,
    guidance: [
      "Mine product proofs for repeatable patterns, not copy-paste product identity.",
      "Move reusable parts into engines, kits, recipes, or playbooks.",
      "Capture the extracted pattern in the registry before reusing it broadly.",
    ],
    commands: ["pnpm ecosystem:refresh"],
  },
];

function main() {
  if (!existsSync(SCORECARD)) {
    throw new Error("No public ecosystem scorecard found. Run `pnpm ecosystem:score` first.");
  }

  const scorecard = JSON.parse(readFileSync(SCORECARD, "utf8"));
  const repositories = scorecard.public_repositories ?? [];
  const generatedAt = new Date().toISOString();

  const useCases = USE_CASES.map((useCase) => buildUseCase(useCase, repositories));
  const resourceMap = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    source_generated_at: scorecard.generated_at,
    privacy: "public-safe",
    note: "Resource recommendations use public repository metadata only. Private assets remain summarized in scorecards and require local review.",
    totals: {
      use_cases: useCases.length,
      public_assets_considered: repositories.length,
      recommended_assets: uniqueAssets(useCases.flatMap((item) => item.recommended_assets)).length,
      improve_first_assets: uniqueAssets(useCases.flatMap((item) => item.improve_first)).length,
    },
    use_cases: useCases,
  };

  mkdirSync(DATA_DIR, { recursive: true });
  writeJson(join(DATA_DIR, "ecosystem-resource-map.public.json"), resourceMap);
  writeFileSync(
    join(DOCS_DIR, "ECOSYSTEM_RESOURCE_FACTORY.md"),
    renderMarkdown(resourceMap),
    "utf8",
  );

  console.error(
    `[ecosystem-resource-map] ${resourceMap.totals.use_cases} use cases, ` +
      `${resourceMap.totals.recommended_assets} recommended assets`,
  );
}

function buildUseCase(useCase, repositories) {
  const candidates = repositories.filter((repo) => useCase.layers.includes(repo.canonical?.layer));
  const recommended = candidates
    .filter((repo) => repo.score?.total >= useCase.minimum_score)
    .filter(
      (repo) => maturityRank(repo.canonical?.maturity) >= maturityRank(useCase.minimum_maturity),
    )
    .sort(byUsefulness)
    .slice(0, 8)
    .map(projectAsset);

  const improveFirst = candidates
    .filter((repo) => repo.score?.load_bearing && repo.score?.total < 70)
    .sort((a, b) => a.score.total - b.score.total || a.name.localeCompare(b.name))
    .slice(0, 8)
    .map(projectAsset);

  const referenceOnly = candidates
    .filter(
      (repo) =>
        repo.canonical?.layer === "reference-library" ||
        repo.score?.gaps?.includes("reference-only"),
    )
    .sort(byUsefulness)
    .slice(0, 6)
    .map(projectAsset);

  return {
    ...useCase,
    asset_counts: {
      candidates: candidates.length,
      recommended: recommended.length,
      improve_first: improveFirst.length,
      reference_only: referenceOnly.length,
    },
    recommended_assets: recommended,
    improve_first: improveFirst,
    reference_assets: referenceOnly,
  };
}

function projectAsset(repo) {
  return {
    name: repo.name,
    url: repo.url,
    layer: repo.canonical?.layer ?? "unknown",
    asset_type: repo.canonical?.asset_type ?? "unknown",
    maturity: repo.canonical?.maturity ?? "L0",
    role: repo.canonical?.role ?? "",
    score: repo.score?.total ?? 0,
    band: repo.score?.band ?? "unknown",
    status: repo.operational?.status ?? "unknown",
    language: repo.primary_language ?? null,
    gaps: repo.score?.gaps ?? [],
  };
}

function byUsefulness(a, b) {
  if (a.score?.load_bearing !== b.score?.load_bearing) return a.score?.load_bearing ? -1 : 1;
  return (
    (b.score?.total ?? 0) - (a.score?.total ?? 0) ||
    maturityRank(b.canonical?.maturity) - maturityRank(a.canonical?.maturity) ||
    a.name.localeCompare(b.name)
  );
}

function maturityRank(value) {
  return { L0: 0, L1: 1, L2: 2, L3: 3, L4: 4, L5: 5 }[value] ?? 0;
}

function uniqueAssets(assets) {
  return [...new Map(assets.map((asset) => [asset.name, asset])).values()];
}

function renderMarkdown(resourceMap) {
  const lines = [];
  lines.push("# Ecosystem Resource Factory");
  lines.push("");
  lines.push("**Status:** Phase 4 generated resource map");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${resourceMap.generated_at}`);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(
    "This artifact turns the ecosystem scorecard into daily build guidance: what to use, what to fix first, and what to treat as reference material.",
  );
  lines.push("");
  lines.push("## Operator Loop");
  lines.push("");
  lines.push("Regenerate the map:");
  lines.push("");
  lines.push("```bash");
  lines.push("pnpm ecosystem:refresh");
  lines.push("```");
  lines.push("");
  lines.push("Open the dashboard:");
  lines.push("");
  lines.push("```text");
  lines.push("http://localhost:3000/resources");
  lines.push("```");
  lines.push("");
  lines.push("## Use Cases");
  lines.push("");
  for (const useCase of resourceMap.use_cases) {
    lines.push(`### ${useCase.title}`);
    lines.push("");
    lines.push(`_${useCase.question}_`);
    lines.push("");
    lines.push(`Layers: ${useCase.layers.map((layer) => `\`${layer}\``).join(", ")}`);
    lines.push("");
    lines.push("Recommended assets:");
    if (useCase.recommended_assets.length === 0) {
      lines.push("- None yet. Use the improve-first queue before depending on this path.");
    } else {
      for (const asset of useCase.recommended_assets.slice(0, 5)) {
        lines.push(`- [${asset.name}](${asset.url}) - ${asset.score}/100, ${asset.maturity}`);
      }
    }
    lines.push("");
    lines.push("Fix first:");
    if (useCase.improve_first.length === 0) {
      lines.push("- No load-bearing asset under 70 in this use case.");
    } else {
      for (const asset of useCase.improve_first.slice(0, 5)) {
        lines.push(
          `- [${asset.name}](${asset.url}) - ${asset.score}/100, ${asset.gaps.join(", ")}`,
        );
      }
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main();
