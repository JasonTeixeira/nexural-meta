#!/usr/bin/env node
/**
 * Phase 22 public/portfolio packaging.
 *
 * Generates a public-safe proof packet scaffold. It intentionally does not
 * publish anything; publishing comes after more internal dogfood.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EXPORT_DIR = join(ROOT, "exports", "proof-packet");
const EVIDENCE_DIR = join(ROOT, "evidence", "portfolio-packaging");

function main() {
  const generatedAt = new Date().toISOString();
  const proof = readJson("data/public-proof-layer.public.json", {
    evidence: {},
    remaining_gaps: [],
  });
  const golden = readJson("data/golden-path-runs.public.json", { runs: [], totals: {} });
  const operator = readJson("data/operator-test.public.json", { status: "missing" });
  const recipes = readJson("data/recipe-catalog.public.json", { totals: {} });

  const featuredRuns = (golden.runs ?? [])
    .filter((run) => run.runtime?.deploy_status === "verified-vercel-url")
    .slice(0, 3)
    .map((run) => ({
      title: run.spec.title,
      recipe: run.spec.recipe,
      deployed_url: run.runtime.deployed_url,
      tree_hash: run.generated_app.tree_hash,
      gates: `${run.gates.filter((gate) => gate.status === "passed").length}/${run.gates.length}`,
    }));
  const report = {
    schema_version: 1,
    generated_at: generatedAt,
    generated_by: "scripts/public-portfolio-packaging.mjs",
    privacy: "public-safe",
    phase: "Phase 22",
    status: operator.status === "passed" && featuredRuns.length >= 3 ? "ready-to-review" : "draft",
    summary: {
      featured_runs: featuredRuns.length,
      proof_backed_recipes: recipes.totals?.proof_backed ?? 0,
      public_proof_hash: proof.evidence?.packet_hash ?? null,
      operator_test_status: operator.status,
    },
    public_safe_claims: [
      "Sage Ideas Engineering OS maintains a searchable resource library.",
      "Factory recipes are scored for forge readiness and proof backing.",
      "Hosted golden-path app proofs include build, runtime, DB, and health checks.",
      "Maturity and maintenance queues make gaps explicit instead of hiding them.",
    ],
    featured_runs: featuredRuns,
    publish_blockers: [
      "Review all screenshots/copy manually before public posting.",
      "Keep private repository names/details summarized, not exposed.",
      "Rotate any tokens pasted into chat before using proof in public.",
    ],
  };
  report.evidence_hash = hash(report);
  const markdown = renderMarkdown(report);

  writeJson(join(DATA_DIR, "portfolio-packaging.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "PUBLIC_PORTFOLIO_PACKAGING.md"), markdown, "utf8");
  writeFileSync(join(EXPORT_DIR, "portfolio-proof.md"), markdown, "utf8");
  console.error(`[portfolio-package] ${report.status}: ${featuredRuns.length} featured runs`);
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Public Portfolio Packaging");
  lines.push("");
  lines.push(`**Status:** ${report.status}`);
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push(`**Proof hash:** \`${report.summary.public_proof_hash}\``);
  lines.push("");
  lines.push("## Claims");
  lines.push("");
  for (const claim of report.public_safe_claims) lines.push(`- ${claim}`);
  lines.push("");
  lines.push("## Featured Proofs");
  lines.push("");
  lines.push("| App | Recipe | Gates | URL | Hash |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const run of report.featured_runs) {
    lines.push(
      `| ${run.title} | ${run.recipe} | ${run.gates} | ${run.deployed_url} | \`${run.tree_hash}\` |`,
    );
  }
  lines.push("");
  lines.push("## Publish Blockers");
  lines.push("");
  for (const blocker of report.publish_blockers) lines.push(`- ${blocker}`);
  return `${lines.join("\n")}\n`;
}

function readJson(path, fallback) {
  const absolute = join(ROOT, path);
  if (!existsSync(absolute)) return fallback;
  try {
    return JSON.parse(readFileSync(absolute, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function hash(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

main();
