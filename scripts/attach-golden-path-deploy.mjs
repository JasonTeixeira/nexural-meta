#!/usr/bin/env node
/**
 * Attach public deployment evidence to the latest golden-path run.
 *
 * The forge/build/local verification loop creates the app and hashes the source
 * tree. Deployment can happen after that from the same generated tree. This
 * script verifies the public URL and records it without rerunning forge, so the
 * deployed proof can point back to the exact generated app hash.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GENERATED_BY = "scripts/attach-golden-path-deploy.mjs";
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "golden-path");
const GATE5_DIR = join(ROOT, "evidence", "gate-5");

const isWindows = process.platform === "win32";
const npxBin = isWindows ? "npx.cmd" : "npx";

function main() {
  const args = parseArgs(process.argv.slice(2));
  const verifiedAt = new Date().toISOString();
  const evidenceSlug = args.evidenceSlug ?? "client-intake-portal-vercel";

  const verify = runVerify(args.url, evidenceSlug, args.timeout);
  const reportPath = join(GATE5_DIR, evidenceSlug, "report.json");
  const report = readJson(reportPath);
  if (verify.status !== 0 || report.summary?.failed !== 0) {
    throw new Error(
      `Deployed verification failed for ${args.url}: ${report.summary?.passed ?? 0}/${report.summary?.total ?? 0} checks passed.`,
    );
  }

  const latestPath = join(EVIDENCE_DIR, "latest.json");
  const latest = readJson(latestPath);
  const runPath = join(EVIDENCE_DIR, `${latest.run_id}.json`);
  const indexPath = join(DATA_DIR, "golden-path-runs.public.json");
  const index = readJson(indexPath);

  const updatedRun = attachDeployEvidence(latest, {
    url: args.url,
    verifiedAt,
    evidenceSlug,
    reportPath,
    report,
    deploymentId: args.deploymentId,
    inspectorUrl: args.inspectorUrl,
  });

  const updatedIndex = {
    ...index,
    generated_at: verifiedAt,
    generated_by: GENERATED_BY,
    runs: [updatedRun, ...(index.runs ?? []).filter((run) => run.run_id !== updatedRun.run_id)],
    totals: {
      ...index.totals,
      passed_runs: updatedRun.gates.every((gate) => gate.status === "passed") ? 1 : 0,
      latest_gate_count: updatedRun.gates.length,
      latest_wall_clock_ms: updatedRun.wall_clock_ms,
    },
  };

  writeJson(latestPath, updatedRun);
  writeJson(runPath, updatedRun);
  writeJson(indexPath, updatedIndex);
  writeFileSync(join(DOCS_DIR, "GOLDEN_PATH.md"), renderMarkdown(updatedIndex), "utf8");

  console.error(
    `[golden-path-deploy] verified ${args.url}: ${report.summary.passed}/${report.summary.total} checks passed`,
  );
}

function parseArgs(argv) {
  const args = {
    url: "",
    evidenceSlug: "client-intake-portal-vercel",
    timeout: "30000",
    deploymentId: "",
    inspectorUrl: "",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--url" && next) {
      args.url = next;
      i += 1;
    } else if (arg === "--evidence-slug" && next) {
      args.evidenceSlug = next;
      i += 1;
    } else if (arg === "--timeout" && next) {
      args.timeout = next;
      i += 1;
    } else if (arg === "--deployment-id" && next) {
      args.deploymentId = next;
      i += 1;
    } else if (arg === "--inspector-url" && next) {
      args.inspectorUrl = next;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }
  if (!args.url || !args.url.startsWith("https://")) {
    throw new Error("Missing required HTTPS deployment URL. Use --url https://...");
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/attach-golden-path-deploy.mjs --url <https-url> [options]

Options:
  --evidence-slug <slug>  Gate-5 evidence slug. Default: client-intake-portal-vercel.
  --timeout <ms>          Verifier timeout. Default: 30000.
  --deployment-id <id>    Optional Vercel deployment id.
  --inspector-url <url>   Optional Vercel inspector URL.
`);
}

function runVerify(url, evidenceSlug, timeout) {
  const result = spawnSync(
    npxBin,
    [
      "--yes",
      "tsx",
      "apps/cli/src/bin/nx.ts",
      "verify",
      url,
      "--evidence-slug",
      evidenceSlug,
      "--timeout",
      timeout,
    ],
    {
      cwd: ROOT,
      shell: isWindows,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  if (result.stdout) process.stderr.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return { status: result.status ?? 1 };
}

function attachDeployEvidence(run, deploy) {
  const deployedGate = {
    id: "vercel_runtime",
    label: "Verify public Vercel deployment",
    status: "passed",
    detail: `${deploy.report.summary.passed}/${deploy.report.summary.total} checks passed at ${deploy.url}.`,
    command: `nx verify ${deploy.url} --evidence-slug ${deploy.evidenceSlug}`,
    duration_ms: null,
  };

  const gates = [...run.gates.filter((gate) => gate.id !== deployedGate.id), deployedGate];

  const remainingGaps = (run.remaining_gaps ?? []).filter(
    (gap) => !gap.toLowerCase().includes("no public vercel preview"),
  );

  return {
    ...run,
    deployment_attached_at: deploy.verifiedAt,
    deployment_attached_by: GENERATED_BY,
    runtime: {
      ...run.runtime,
      mode: "local-next-start+vercel",
      deploy_status: "verified-vercel-url",
      deployed_url: deploy.url,
      deployed_verified_at: deploy.verifiedAt,
      deployment_id: deploy.deploymentId || null,
      inspector_url: deploy.inspectorUrl || null,
    },
    gates,
    evidence: {
      ...run.evidence,
      gate5_vercel_report: projectPath(deploy.reportPath),
    },
    remaining_gaps: remainingGaps,
  };
}

function renderMarkdown(index) {
  const run = index.runs[0];
  const lines = [];
  lines.push("# Golden Path Proof");
  lines.push("");
  lines.push("**Status:** Phase 5 golden path passed with public deployment evidence");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${index.generated_at}`);
  lines.push("");
  lines.push("## What This Proves");
  lines.push("");
  lines.push(
    "A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, deploy publicly, and capture evidence.",
  );
  lines.push("");
  lines.push("## Latest Run");
  lines.push("");
  lines.push(`- Run ID: \`${run.run_id}\``);
  lines.push(`- Spec: \`${run.spec.path}\``);
  lines.push(`- Recipe: \`${run.spec.recipe}\``);
  lines.push(`- App: \`${run.spec.app_slug}\``);
  lines.push(`- Local runtime: \`${run.runtime.url}\``);
  lines.push(`- Deployed URL: \`${run.runtime.deployed_url}\``);
  lines.push(`- Deploy status: \`${run.runtime.deploy_status}\``);
  lines.push(`- Generated app hash: \`${run.generated_app.tree_hash}\``);
  lines.push(`- Wall clock: ${Math.round(run.wall_clock_ms / 1000)}s`);
  lines.push("");
  lines.push("## Gates");
  lines.push("");
  lines.push("| Gate | Status | Detail |");
  lines.push("| --- | --- | --- |");
  for (const gate of run.gates) {
    lines.push(`| ${gate.label} | ${gate.status} | ${gate.detail} |`);
  }
  lines.push("");
  lines.push("## Selected Resources");
  lines.push("");
  for (const asset of run.selected_resources) {
    lines.push(`- [${asset.name}](${asset.url}) - ${asset.layer}, ${asset.score}/100`);
  }
  lines.push("");
  lines.push("## Remaining Gaps");
  lines.push("");
  for (const gap of run.remaining_gaps) {
    lines.push(`- ${gap}`);
  }
  lines.push("");
  lines.push("## Run It");
  lines.push("");
  lines.push("```bash");
  lines.push("pnpm golden:path");
  lines.push("pnpm golden:path:attach-deploy -- --url https://your-app.vercel.app");
  lines.push("```");
  return `${lines.join("\n")}\n`;
}

function readJson(path) {
  if (!existsSync(path)) throw new Error(`Missing required input: ${projectPath(path)}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function projectPath(path) {
  return relative(ROOT, path).replaceAll("\\", "/");
}

main();
