#!/usr/bin/env node
/**
 * Phase 7 self-maintenance loop for Sage Ideas Engineering OS.
 *
 * This is the operator-grade wrapper around the existing generated artifacts:
 * inventory -> scorecard -> resource map -> golden path -> public proof.
 *
 * It writes a public-safe report that answers:
 * - what was regenerated,
 * - what proof hashes changed,
 * - which artifacts are stale or missing,
 * - what the operator should fix next.
 */

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/ecosystem-maintenance.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "maintenance");

const isWindows = process.platform === "win32";
const pnpmBin = isWindows ? "pnpm.cmd" : "pnpm";

const ARTIFACTS = [
  {
    id: "registry",
    path: "data/ecosystem-registry.public.json",
    max_age_hours: 48,
    required: true,
  },
  {
    id: "scorecard",
    path: "data/ecosystem-scorecard.public.json",
    max_age_hours: 48,
    required: true,
  },
  {
    id: "resource_map",
    path: "data/ecosystem-resource-map.public.json",
    max_age_hours: 48,
    required: true,
  },
  {
    id: "golden_path",
    path: "data/golden-path-runs.public.json",
    max_age_hours: 168,
    required: true,
  },
  {
    id: "public_proof",
    path: "data/public-proof-layer.public.json",
    max_age_hours: 48,
    required: true,
  },
  {
    id: "proof_export_json",
    path: "exports/sageideas-dev/engineering-os-proof.json",
    max_age_hours: 48,
    required: true,
  },
  {
    id: "proof_export_markdown",
    path: "exports/sageideas-dev/engineering-os-proof.md",
    max_age_hours: 48,
    required: true,
  },
];

function main() {
  const args = parseArgs(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const commandResults = [];

  if (!args.check) {
    if (!args.skipRefresh) {
      commandResults.push(runStep("ecosystem_refresh", pnpmBin, ["ecosystem:refresh"]));
    }
    if (!args.skipGolden) {
      commandResults.push(runStep("golden_path", pnpmBin, ["golden:path"]));
    }
    commandResults.push(runStep("public_proof_export", pnpmBin, ["proof:export"]));
  }

  const generatedAt = new Date().toISOString();
  const artifacts = ARTIFACTS.map((artifact) => inspectArtifact(artifact, generatedAt));
  const registry = readJsonIfPresent("data/ecosystem-registry.public.json");
  const scorecard = readJsonIfPresent("data/ecosystem-scorecard.public.json");
  const resourceMap = readJsonIfPresent("data/ecosystem-resource-map.public.json");
  const goldenPath = readJsonIfPresent("data/golden-path-runs.public.json");
  const proof = readJsonIfPresent("data/public-proof-layer.public.json");
  const git = inspectGit();

  const report = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    phase: "Phase 7",
    mode: args.check ? "check-only" : "regenerate",
    summary: buildSummary({
      commandResults,
      artifacts,
      registry,
      scorecard,
      resourceMap,
      goldenPath,
      proof,
      git,
    }),
    commands: commandResults,
    artifacts,
    source_metrics: buildSourceMetrics({ registry, scorecard, resourceMap, goldenPath, proof }),
    git,
    next_actions: buildNextActions({
      commandResults,
      artifacts,
      scorecard,
      goldenPath,
      proof,
      git,
    }),
    started_at: startedAt,
    finished_at: generatedAt,
  };

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(DOCS_DIR, { recursive: true });
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeJson(join(DATA_DIR, "ecosystem-maintenance.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "ECOSYSTEM_MAINTENANCE.md"), renderMarkdown(report), "utf8");

  console.error(
    `[ecosystem-maintenance] ${report.summary.status}: ` +
      `${report.summary.commands_passed}/${report.summary.commands_total} commands, ` +
      `${report.summary.fresh_artifacts}/${report.summary.artifacts_total} fresh artifacts`,
  );

  if (!args.allowFailures && report.summary.status === "failed") process.exit(1);
}

function parseArgs(argv) {
  const args = {
    check: false,
    skipRefresh: false,
    skipGolden: false,
    allowFailures: false,
  };
  for (const arg of argv) {
    if (arg === "--check") args.check = true;
    else if (arg === "--skip-refresh") args.skipRefresh = true;
    else if (arg === "--skip-golden") args.skipGolden = true;
    else if (arg === "--allow-failures") args.allowFailures = true;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/ecosystem-maintenance.mjs [options]

Options:
  --check           Read current artifacts and write a report without regenerating.
  --skip-refresh    Skip inventory/scorecard/resource-map regeneration.
  --skip-golden     Skip the expensive local golden-path proof.
  --allow-failures  Write the report even if commands or freshness checks fail.
`);
}

function runStep(id, command, args) {
  const startedAt = new Date().toISOString();
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CI: process.env.CI ?? "1" },
  });
  const status = result.status ?? 1;
  const finishedAt = new Date().toISOString();
  if (status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
  } else {
    const stderr = String(result.stderr ?? "").trim();
    if (stderr) process.stderr.write(`${stderr}\n`);
  }
  return {
    id,
    command: [command, ...args].join(" "),
    status: status === 0 ? "passed" : "failed",
    exit_code: status,
    duration_ms: Date.now() - started,
    started_at: startedAt,
    finished_at: finishedAt,
    stdout_tail: tail(result.stdout),
    stderr_tail: tail(result.stderr),
  };
}

function inspectArtifact(artifact, generatedAt) {
  const absolute = join(ROOT, artifact.path);
  if (!existsSync(absolute)) {
    return {
      ...artifact,
      present: false,
      status: artifact.required ? "missing" : "optional-missing",
      hash: null,
      generated_at: null,
      age_hours: null,
      size_bytes: null,
    };
  }

  const raw = readFileSync(absolute, "utf8");
  const parsed = artifact.path.endsWith(".json") ? safeJson(raw) : null;
  const generated = parsed?.generated_at ?? parsed?.finished_at ?? null;
  const ageHours = generated ? hoursBetween(generated, generatedAt) : fileAgeHours(absolute);
  return {
    ...artifact,
    present: true,
    status: ageHours <= artifact.max_age_hours ? "fresh" : "stale",
    hash: `sha256:${createHash("sha256").update(raw).digest("hex")}`,
    generated_at: generated,
    age_hours: Math.round(ageHours * 10) / 10,
    size_bytes: Buffer.byteLength(raw),
  };
}

function inspectGit() {
  const changed = runGit(["status", "--porcelain"]);
  const head = runGit(["rev-parse", "HEAD"]).stdout.trim();
  const branch = runGit(["branch", "--show-current"]).stdout.trim();
  const changedPaths = changed.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    branch,
    head_sha: head,
    changed_paths: changedPaths,
    changed_count: changedPaths.length,
  };
}

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: ROOT,
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function buildSummary({
  commandResults,
  artifacts,
  registry,
  scorecard,
  resourceMap,
  goldenPath,
  proof,
}) {
  const failedCommands = commandResults.filter((command) => command.status !== "passed");
  const badArtifacts = artifacts.filter((artifact) =>
    ["missing", "stale"].includes(artifact.status),
  );
  const latestRun = goldenPath?.runs?.[0];
  const proofHash = proof?.evidence?.packet_hash ?? null;
  const status = failedCommands.length === 0 && badArtifacts.length === 0 ? "passed" : "failed";
  return {
    status,
    commands_total: commandResults.length,
    commands_passed: commandResults.filter((command) => command.status === "passed").length,
    artifacts_total: artifacts.length,
    fresh_artifacts: artifacts.filter((artifact) => artifact.status === "fresh").length,
    stale_or_missing_artifacts: badArtifacts.length,
    public_repositories_indexed: registry?.totals?.public ?? null,
    private_repositories_summarized: registry?.private_summary?.total_private ?? null,
    public_assets_scored: scorecard?.public_repositories?.length ?? null,
    load_bearing_average_score: average(
      (scorecard?.public_repositories ?? [])
        .filter((repo) => repo.score?.load_bearing)
        .map((repo) => repo.score?.total),
    ),
    resource_use_cases: resourceMap?.totals?.use_cases ?? null,
    latest_golden_path_run_id: latestRun?.run_id ?? null,
    latest_golden_path_gates_passed:
      latestRun?.gates?.filter((gate) => gate.status === "passed").length ?? null,
    latest_golden_path_gate_count: latestRun?.gates?.length ?? null,
    public_proof_packet_hash: proofHash,
  };
}

function buildSourceMetrics({ registry, scorecard, resourceMap, goldenPath, proof }) {
  const latestRun = goldenPath?.runs?.[0];
  return {
    registry: {
      generated_at: registry?.generated_at ?? null,
      public: registry?.totals?.public ?? null,
      private_summary: registry?.private_summary?.total_private ?? null,
    },
    scorecard: {
      generated_at: scorecard?.generated_at ?? null,
      public_assets: scorecard?.public_repositories?.length ?? null,
      public_average_score: average(
        (scorecard?.public_repositories ?? []).map((repo) => repo.score?.total),
      ),
      public_load_bearing_average_score: average(
        (scorecard?.public_repositories ?? [])
          .filter((repo) => repo.score?.load_bearing)
          .map((repo) => repo.score?.total),
      ),
      all_assets_summarized: scorecard?.totals?.total ?? null,
      top_gap_types: scorecard?.totals?.top_gap_types ?? {},
    },
    resource_map: {
      generated_at: resourceMap?.generated_at ?? null,
      use_cases: resourceMap?.totals?.use_cases ?? null,
      recommended_assets: resourceMap?.totals?.recommended_assets ?? null,
    },
    golden_path: {
      generated_at: goldenPath?.generated_at ?? null,
      run_id: latestRun?.run_id ?? null,
      gates_passed: latestRun?.gates?.filter((gate) => gate.status === "passed").length ?? null,
      gate_count: latestRun?.gates?.length ?? null,
      wall_clock_seconds: latestRun ? Math.round(latestRun.wall_clock_ms / 1000) : null,
      deploy_status: latestRun?.runtime?.deploy_status ?? null,
    },
    public_proof: {
      generated_at: proof?.generated_at ?? null,
      packet_hash: proof?.evidence?.packet_hash ?? null,
      target_route: proof?.target_surface?.recommended_route ?? null,
      remaining_gaps: proof?.remaining_gaps ?? [],
    },
  };
}

function buildNextActions({ commandResults, artifacts, scorecard, goldenPath, proof, git }) {
  const actions = [];

  for (const command of commandResults.filter((item) => item.status !== "passed")) {
    actions.push({
      severity: "critical",
      owner: "automation",
      action: `Fix failed maintenance command: ${command.id}`,
      evidence: `${command.command} exited ${command.exit_code}.`,
    });
  }

  for (const artifact of artifacts.filter((item) => item.status === "missing")) {
    actions.push({
      severity: "critical",
      owner: "automation",
      action: `Regenerate missing artifact: ${artifact.path}`,
      evidence: `${artifact.id} is required for the Phase 7 loop.`,
    });
  }

  for (const artifact of artifacts.filter((item) => item.status === "stale")) {
    actions.push({
      severity: "warn",
      owner: "automation",
      action: `Refresh stale artifact: ${artifact.path}`,
      evidence: `${artifact.id} age ${artifact.age_hours}h exceeds ${artifact.max_age_hours}h.`,
    });
  }

  const loadBearingAverage = scorecard?.totals?.load_bearing_average_score ?? 0;
  if (loadBearingAverage < 70) {
    actions.push({
      severity: "warn",
      owner: "Sage",
      action: "Raise load-bearing ecosystem average above 70",
      evidence: `Current load-bearing average is ${loadBearingAverage}/100.`,
    });
  }

  const latestRun = goldenPath?.runs?.[0];
  if (latestRun?.runtime?.deploy_status?.includes("blocked")) {
    actions.push({
      severity: "warn",
      owner: "Sage",
      action: "Provide live deploy credentials when Phase 8 requires hosted proof",
      evidence: latestRun.runtime.deploy_status,
    });
  }

  if (proof?.remaining_gaps?.length > 0) {
    actions.push({
      severity: "info",
      owner: "Sage",
      action: "Review public proof remaining gaps before publishing claims",
      evidence: `${proof.remaining_gaps.length} remaining gaps in public proof packet.`,
    });
  }

  if (git.changed_count > 0) {
    actions.push({
      severity: "info",
      owner: "operator",
      action: "Review and commit generated maintenance artifacts",
      evidence: `${git.changed_count} changed path(s) after maintenance run.`,
    });
  }

  return actions;
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (clean.length === 0) return 0;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Ecosystem Maintenance");
  lines.push("");
  lines.push("**Status:** Phase 7 self-maintenance loop");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push(`**Overall:** ${report.summary.status}`);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(
    "Phase 7 turns the Sage Ideas Engineering OS from static proof artifacts into a repeatable maintenance loop. The loop regenerates the registry, maturity scorecard, resource map, golden-path proof, public proof export, and this machine-readable maintenance report.",
  );
  lines.push("");
  lines.push("## Run It");
  lines.push("");
  lines.push("```bash");
  lines.push("pnpm ecosystem:maintain");
  lines.push("# fast check only:");
  lines.push("pnpm ecosystem:maintain -- --check");
  lines.push("# skip the expensive local app proof:");
  lines.push("pnpm ecosystem:maintain -- --skip-golden");
  lines.push("```");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(
    `- Commands passed: ${report.summary.commands_passed}/${report.summary.commands_total}`,
  );
  lines.push(
    `- Fresh artifacts: ${report.summary.fresh_artifacts}/${report.summary.artifacts_total}`,
  );
  lines.push(`- Public repositories indexed: ${report.summary.public_repositories_indexed}`);
  lines.push(`- Public assets scored: ${report.summary.public_assets_scored}`);
  lines.push(`- Resource use cases: ${report.summary.resource_use_cases}`);
  lines.push(
    `- Golden path: ${report.summary.latest_golden_path_gates_passed}/${report.summary.latest_golden_path_gate_count} gates`,
  );
  lines.push(`- Public proof hash: \`${report.summary.public_proof_packet_hash}\``);
  lines.push("");
  lines.push("## Commands");
  lines.push("");
  lines.push("| Step | Status | Duration |");
  lines.push("| --- | --- | ---: |");
  if (report.commands.length === 0) {
    lines.push("| check-only | passed | 0ms |");
  } else {
    for (const command of report.commands) {
      lines.push(`| ${command.id} | ${command.status} | ${command.duration_ms}ms |`);
    }
  }
  lines.push("");
  lines.push("## Artifact Freshness");
  lines.push("");
  lines.push("| Artifact | Status | Age | Hash |");
  lines.push("| --- | --- | ---: | --- |");
  for (const artifact of report.artifacts) {
    lines.push(
      `| \`${artifact.path}\` | ${artifact.status} | ${artifact.age_hours ?? "n/a"}h | \`${artifact.hash ?? "missing"}\` |`,
    );
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  if (report.next_actions.length === 0) {
    lines.push("- None. Maintenance loop is green.");
  } else {
    for (const item of report.next_actions) {
      lines.push(`- **${item.severity}: ${item.action}** ${item.evidence}`);
    }
  }
  lines.push("");
  lines.push("## Generated Artifacts");
  lines.push("");
  lines.push("- `data/ecosystem-maintenance.public.json`");
  lines.push("- `evidence/maintenance/latest.json`");
  lines.push("- `docs/ECOSYSTEM_MAINTENANCE.md`");
  return `${lines.join("\n")}\n`;
}

function readJsonIfPresent(path) {
  const absolute = join(ROOT, path);
  if (!existsSync(absolute)) return null;
  return JSON.parse(readFileSync(absolute, "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function safeJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hoursBetween(fromIso, toIso) {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return Number.POSITIVE_INFINITY;
  return Math.max(0, (to - from) / 3_600_000);
}

function fileAgeHours(path) {
  return Math.max(0, (Date.now() - statSync(path).mtimeMs) / 3_600_000);
}

function tail(value, max = 4000) {
  const text = String(value ?? "");
  return text.length > max ? text.slice(-max) : text;
}

main();
