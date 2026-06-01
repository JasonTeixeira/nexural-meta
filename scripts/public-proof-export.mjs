#!/usr/bin/env node
/**
 * Phase 6 public proof layer.
 *
 * Produces a public-safe packet that sageideas.dev can publish without
 * exposing private repository names, local machine paths, secrets, or internal
 * implementation details.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/public-proof-export.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "public-proof");
const EXPORT_DIR = join(ROOT, "exports", "sageideas-dev");

const REGISTRY_PATH = join(DATA_DIR, "ecosystem-registry.public.json");
const SCORECARD_PATH = join(DATA_DIR, "ecosystem-scorecard.public.json");
const RESOURCE_MAP_PATH = join(DATA_DIR, "ecosystem-resource-map.public.json");
const GOLDEN_PATH_PATH = join(DATA_DIR, "golden-path-runs.public.json");

function main() {
  const generatedAt = new Date().toISOString();
  const registry = readRequiredJson(REGISTRY_PATH);
  const scorecard = readRequiredJson(SCORECARD_PATH);
  const resourceMap = readRequiredJson(RESOURCE_MAP_PATH);
  const goldenPath = readRequiredJson(GOLDEN_PATH_PATH);

  const publicProofUseCase = resourceMap.use_cases?.find(
    (item) => item.id === "publish-proof-page",
  );
  if (!publicProofUseCase) {
    throw new Error("Resource map is missing use case: publish-proof-page");
  }

  const publicRepos = registry.public_repositories ?? [];
  const scoredRepos = scorecard.public_repositories ?? [];
  const publicLoadBearing = scoredRepos.filter((repo) => repo.score?.load_bearing);
  const goldenRun = goldenPath.runs?.[0];
  if (!goldenRun) throw new Error("Golden path evidence missing. Run `pnpm golden:path` first.");
  const hasDeployedProof = goldenRun.runtime?.deploy_status === "verified-vercel-url";

  const proof = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    target_surface: {
      repo: "JasonTeixeira/sageideas.dev",
      site: "https://www.sageideas.dev",
      recommended_route: "/engineering-os",
      status: "export-ready",
    },
    positioning: {
      company: "Sage Ideas",
      system_name: "Sage Ideas Engineering OS",
      one_liner:
        "A private engineering resource factory that turns reusable engines, recipes, QA evidence, and product proofs into faster software delivery.",
      audience: ["clients", "employers", "partners"],
      brand_boundary:
        "Nexural is a trading/investment product proof, not the umbrella name for the company or engineering ecosystem.",
    },
    public_claims: buildClaims({ registry, scorecard, resourceMap, goldenRun }),
    architecture: buildArchitecture(),
    proof_metrics: {
      public_repositories_indexed: registry.totals?.public ?? publicRepos.length,
      private_repositories_summarized: registry.private_summary?.total_private ?? 0,
      public_assets_scored: scoredRepos.length,
      average_public_score: average(scoredRepos.map((repo) => repo.score?.total)),
      load_bearing_assets: publicLoadBearing.length,
      load_bearing_average_score: average(publicLoadBearing.map((repo) => repo.score?.total)),
      resource_use_cases: resourceMap.totals?.use_cases ?? 0,
      golden_path_wall_clock_seconds: Math.round(goldenRun.wall_clock_ms / 1000),
      golden_path_gates_passed: goldenRun.gates.filter((gate) => gate.status === "passed").length,
      golden_path_gate_count: goldenRun.gates.length,
      golden_path_verify_checks: parseVerifyChecks(goldenRun),
      golden_path_deploy_status: goldenRun.runtime?.deploy_status ?? "unknown",
      golden_path_deployed_url: goldenRun.runtime?.deployed_url ?? null,
    },
    recommended_assets: publicProofUseCase.recommended_assets.map(projectAsset),
    publishable_sections: buildPublishableSections(goldenRun),
    evidence: {
      source_files: [
        projectPath(REGISTRY_PATH),
        projectPath(SCORECARD_PATH),
        projectPath(RESOURCE_MAP_PATH),
        projectPath(GOLDEN_PATH_PATH),
      ],
      generated_files: [
        "data/public-proof-layer.public.json",
        "docs/PUBLIC_PROOF_LAYER.md",
        "evidence/public-proof/latest.json",
        "exports/sageideas-dev/engineering-os-proof.json",
        "exports/sageideas-dev/engineering-os-proof.md",
      ],
      golden_path_hash: goldenRun.generated_app.tree_hash,
      golden_path_run_id: goldenRun.run_id,
      golden_path_deployed_url: goldenRun.runtime?.deployed_url ?? null,
      golden_path_deploy_status: goldenRun.runtime?.deploy_status ?? "unknown",
    },
    redaction_policy: [
      "Commit public repository metadata only.",
      "Summarize private repositories by count, layer, maturity, and score band only.",
      "Do not publish private repo names, descriptions, URLs, local paths, secrets, customer data, or provider tokens.",
      "Frame product proofs as examples; do not imply Nexural is the umbrella brand.",
      "Publish gaps honestly, including non-production mock credentials or missing hosted proof when applicable.",
    ],
    remaining_gaps: [
      "sageideas.dev has not consumed this export in this commit because that repo currently has a large pre-existing dirty worktree.",
      ...(hasDeployedProof
        ? []
        : [
            "The golden path is local-runtime proof; Vercel deployment remains blocked until VERCEL_TOKEN is available.",
          ]),
      "Private asset maturity still needs local review before public claims can include deeper implementation detail.",
    ],
  };

  const hash = hashObject(proof);
  const proofWithHash = {
    ...proof,
    evidence: {
      ...proof.evidence,
      packet_hash: hash,
    },
  };

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(DOCS_DIR, { recursive: true });
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(EXPORT_DIR, { recursive: true });

  writeJson(join(DATA_DIR, "public-proof-layer.public.json"), proofWithHash);
  writeJson(join(EVIDENCE_DIR, "latest.json"), proofWithHash);
  writeJson(join(EXPORT_DIR, "engineering-os-proof.json"), proofWithHash);

  const markdown = renderMarkdown(proofWithHash);
  writeFileSync(join(DOCS_DIR, "PUBLIC_PROOF_LAYER.md"), markdown, "utf8");
  writeFileSync(join(EXPORT_DIR, "engineering-os-proof.md"), markdown, "utf8");

  console.error(
    `[public-proof] export-ready: ${proofWithHash.proof_metrics.public_repositories_indexed} public repos, ` +
      `${proofWithHash.proof_metrics.golden_path_gates_passed}/${proofWithHash.proof_metrics.golden_path_gate_count} golden-path gates, ` +
      `hash ${hash}`,
  );
}

function buildClaims({ registry, scorecard, resourceMap, goldenRun }) {
  return [
    {
      claim: "The ecosystem has an indexed public registry.",
      evidence: `${registry.totals?.public ?? 0} public repositories indexed; ${registry.private_summary?.total_private ?? 0} private repositories summarized without names.`,
      source: "data/ecosystem-registry.public.json",
    },
    {
      claim: "Assets are scored before they are reused.",
      evidence: `${scorecard.public_repositories?.length ?? 0} public assets scored; public average ${average((scorecard.public_repositories ?? []).map((repo) => repo.score?.total))}/100, public load-bearing average ${average((scorecard.public_repositories ?? []).filter((repo) => repo.score?.load_bearing).map((repo) => repo.score?.total))}/100. This is a gap map, not vanity scoring.`,
      source: "data/ecosystem-scorecard.public.json",
    },
    {
      claim: "Build choices are mapped to reusable resources.",
      evidence: `${resourceMap.totals?.use_cases ?? 0} use cases mapped for daily navigation.`,
      source: "data/ecosystem-resource-map.public.json",
    },
    {
      claim:
        goldenRun.runtime?.deploy_status === "verified-vercel-url"
          ? "The factory path has deployed public proof."
          : "The factory path has a repeatable local proof.",
      evidence:
        goldenRun.runtime?.deploy_status === "verified-vercel-url"
          ? `${goldenRun.gates.filter((gate) => gate.status === "passed").length}/${goldenRun.gates.length} golden-path gates passed; deployed URL verified at ${goldenRun.runtime.deployed_url}.`
          : `${goldenRun.gates.filter((gate) => gate.status === "passed").length}/${goldenRun.gates.length} golden-path gates passed in ${Math.round(goldenRun.wall_clock_ms / 1000)} seconds.`,
      source: "data/golden-path-runs.public.json",
    },
  ];
}

function buildArchitecture() {
  return [
    {
      layer: "Control plane",
      public_label: "Registry, scorecards, proof packets",
      public_detail:
        "Coordinates resource selection, evidence, quality gates, and safe public exports.",
    },
    {
      layer: "Resource factory",
      public_label: "Reusable engines, kits, recipes, playbooks",
      public_detail: "Turns repeated project work into maintained building blocks.",
    },
    {
      layer: "Quality system",
      public_label: "QA OS, evidence hashes, release gates",
      public_detail: "Captures proof before claims are made publicly.",
    },
    {
      layer: "Product proofs",
      public_label: "Apps that demonstrate reusable patterns",
      public_detail: "Examples are shown as proof, not as umbrella branding.",
    },
  ];
}

function buildPublishableSections(goldenRun) {
  return [
    {
      slug: "what-it-is",
      title: "What It Is",
      body: "Sage Ideas Engineering OS is an internal app/resource factory: a governed library of engines, recipes, QA evidence, playbooks, and product proofs.",
    },
    {
      slug: "proof-metrics",
      title: "Proof Metrics",
      body: "Show registry counts, scorecard averages, use-case coverage, and golden-path gates from generated public-safe data.",
    },
    {
      slug: "golden-path",
      title: "Golden Path",
      body:
        goldenRun.runtime?.deploy_status === "verified-vercel-url"
          ? `Latest proof run ${goldenRun.run_id} generated, built, started, verified locally, and verified the deployed app at ${goldenRun.runtime.deployed_url} with hash ${goldenRun.generated_app.tree_hash}.`
          : `Latest proof run ${goldenRun.run_id} generated, built, started, and verified a local app with hash ${goldenRun.generated_app.tree_hash}.`,
    },
    {
      slug: "redaction-boundary",
      title: "Redaction Boundary",
      body: "The public page should show architecture, evidence, and high-level metrics while keeping private repo names, secrets, customer details, and local paths out.",
    },
    {
      slug: "gaps",
      title: "Honest Gaps",
      body:
        goldenRun.runtime?.deploy_status === "verified-vercel-url"
          ? "Publish current limitations directly: deployed proof uses public-safe mock runtime credentials, and private asset details require local review."
          : "Publish current limitations directly: live Vercel deploy proof is blocked without VERCEL_TOKEN, and private asset details require local review.",
    },
  ];
}

function projectAsset(asset) {
  return {
    name: asset.name,
    url: asset.url,
    layer: asset.layer,
    asset_type: asset.asset_type,
    maturity: asset.maturity,
    score: asset.score,
    status: asset.status,
  };
}

function parseVerifyChecks(goldenRun) {
  const verify = goldenRun.gates.find((gate) => gate.id === "nx_verify");
  const match = verify?.detail?.match(/(\d+)\/(\d+)/);
  return match ? { passed: Number(match[1]), total: Number(match[2]) } : { passed: 0, total: 0 };
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (clean.length === 0) return 0;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function renderMarkdown(proof) {
  const lines = [];
  lines.push("# Public Proof Layer");
  lines.push("");
  lines.push("**Status:** Phase 6 export-ready");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${proof.generated_at}`);
  lines.push(`**Packet hash:** \`${proof.evidence.packet_hash}\``);
  lines.push("");
  lines.push("## Positioning");
  lines.push("");
  lines.push(proof.positioning.one_liner);
  lines.push("");
  lines.push(`Brand boundary: ${proof.positioning.brand_boundary}`);
  lines.push("");
  lines.push("## Proof Metrics");
  lines.push("");
  lines.push(`- Public repositories indexed: ${proof.proof_metrics.public_repositories_indexed}`);
  lines.push(
    `- Private repositories summarized: ${proof.proof_metrics.private_repositories_summarized}`,
  );
  lines.push(`- Public assets scored: ${proof.proof_metrics.public_assets_scored}`);
  lines.push(`- Broad public average: ${proof.proof_metrics.average_public_score}/100`);
  lines.push(`- Load-bearing average: ${proof.proof_metrics.load_bearing_average_score}/100`);
  lines.push(`- Resource use cases: ${proof.proof_metrics.resource_use_cases}`);
  lines.push(
    `- Golden path: ${proof.proof_metrics.golden_path_gates_passed}/${proof.proof_metrics.golden_path_gate_count} gates in ${proof.proof_metrics.golden_path_wall_clock_seconds}s`,
  );
  lines.push("");
  lines.push("## Public Claims");
  lines.push("");
  for (const item of proof.public_claims) {
    lines.push(`- **${item.claim}** ${item.evidence} Source: \`${item.source}\`.`);
  }
  lines.push("");
  lines.push("## Architecture");
  lines.push("");
  for (const item of proof.architecture) {
    lines.push(`- **${item.layer}:** ${item.public_label}. ${item.public_detail}`);
  }
  lines.push("");
  lines.push("## Recommended Public Assets");
  lines.push("");
  for (const asset of proof.recommended_assets) {
    lines.push(
      `- [${asset.name}](${asset.url}) - ${asset.layer}, ${asset.score}/100, ${asset.maturity}`,
    );
  }
  lines.push("");
  lines.push("## Publishable Sections");
  lines.push("");
  for (const section of proof.publishable_sections) {
    lines.push(`### ${section.title}`);
    lines.push("");
    lines.push(section.body);
    lines.push("");
  }
  lines.push("## Redaction Policy");
  lines.push("");
  for (const rule of proof.redaction_policy) lines.push(`- ${rule}`);
  lines.push("");
  lines.push("## Remaining Gaps");
  lines.push("");
  for (const gap of proof.remaining_gaps) lines.push(`- ${gap}`);
  lines.push("");
  lines.push("## Export Targets");
  lines.push("");
  lines.push("- `exports/sageideas-dev/engineering-os-proof.json`");
  lines.push("- `exports/sageideas-dev/engineering-os-proof.md`");
  return `${lines.join("\n")}\n`;
}

function readRequiredJson(path) {
  if (!existsSync(path)) throw new Error(`Missing required input: ${projectPath(path)}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function hashObject(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

function projectPath(path) {
  return relative(ROOT, path).replaceAll("\\", "/");
}

main();
