#!/usr/bin/env node
/**
 * Internal proof environment lock.
 *
 * This records whether the repo has the secrets, hosted runtime, and evidence
 * needed to keep the golden-path proof repeatable. It never reads or writes
 * secret values.
 */

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/proof-environment-check.mjs";
const REPO = process.env.GITHUB_REPOSITORY || "JasonTeixeira/nexural-meta";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "proof-environment");

const SECRET_POLICY = [
  {
    name: "VERCEL_TOKEN",
    purpose: "Automated hosted golden-path deployment.",
    required: true,
    max_age_days: 90,
    rotation: "Rotate through Vercel account tokens.",
  },
  {
    name: "VERCEL_TEAM_ID",
    purpose: "Vercel team/project binding.",
    required: true,
    max_age_days: null,
    rotation: "Stable identifier; rotate only if project ownership changes.",
  },
  {
    name: "VERCEL_PROJECT_ID",
    purpose: "Vercel project binding.",
    required: true,
    max_age_days: null,
    rotation: "Stable identifier; rotate only if project ownership changes.",
  },
  {
    name: "VERCEL_PROOF_ALIAS",
    purpose: "Stable hostname used for hosted proof verification.",
    required: true,
    max_age_days: null,
    rotation: "Stable hostname; update when proof hostname changes.",
  },
  {
    name: "VERCEL_AUTOMATION_BYPASS_SECRET",
    purpose: "Optional bypass for protected Vercel proof deployments.",
    required: false,
    max_age_days: 90,
    rotation: "Rotate through Vercel Deployment Protection bypass settings.",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    purpose: "Staging Supabase project URL.",
    required: true,
    max_age_days: null,
    rotation: "Stable project URL; update when staging project changes.",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    purpose: "Browser-safe staging Supabase anon key.",
    required: true,
    max_age_days: 180,
    rotation: "Rotate with Supabase project API keys.",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    purpose: "Server-side CRUD proof and generated app admin operations.",
    required: true,
    max_age_days: 90,
    rotation: "Rotate with Supabase project API keys.",
  },
  {
    name: "DATABASE_URL",
    purpose: "Staging Postgres migration path for generated apps.",
    required: true,
    max_age_days: 90,
    rotation: "Rotate after DB password reset.",
  },
  {
    name: "NPM_TOKEN",
    purpose: "Package publishing, not required for proof.",
    required: false,
    max_age_days: 180,
    rotation: "Rotate before package publishing cycles.",
  },
];

async function main() {
  const generatedAt = new Date().toISOString();
  const secretInventory = inspectGitHubSecrets(generatedAt);
  const goldenPath = readJsonIfPresent("data/golden-path-runs.public.json");
  const latestRun = goldenPath?.runs?.[0] ?? null;
  const hostedUrl =
    process.env.VERCEL_PROOF_ALIAS !== undefined
      ? normalizeUrl(process.env.VERCEL_PROOF_ALIAS)
      : latestRun?.runtime?.deployed_url;
  const hosted = hostedUrl ? await verifyHostedHealth(hostedUrl) : missingHosted();
  const evidence = inspectEvidence(goldenPath);
  const gates = buildGates({ secretInventory, hosted, evidence });
  const status = gates.every((gate) => gate.status === "passed") ? "passed" : "failed";

  const report = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    status,
    repo: REPO,
    summary: {
      gates_passed: gates.filter((gate) => gate.status === "passed").length,
      gates_total: gates.length,
      required_secrets_present: secretInventory.required_present,
      required_secrets_total: secretInventory.required_total,
      hosted_url: hosted.url,
      hosted_health_status: hosted.status,
      latest_run_id: latestRun?.run_id ?? null,
      latest_app_hash: latestRun?.generated_app?.tree_hash ?? null,
      latest_gate_count: latestRun?.gates?.length ?? null,
    },
    gates,
    secrets: secretInventory.secrets,
    hosted_runtime: hosted,
    evidence,
    operating_rules: [
      "No secret values are written to evidence, docs, or generated public-safe JSON.",
      "SUPABASE_ACCESS_TOKEN is an operator-only personal token and must not be persisted as a GitHub secret.",
      "Any personal access token pasted into chat, logs, or screenshots must be revoked and replaced.",
      "Hosted proof is not green unless /api/health verifies DB CRUD against staging Postgres.",
      "Generated app evidence links run ID, app tree hash, deployed URL, and gate results.",
    ],
    next_actions: buildNextActions({ secretInventory, hosted, evidence }),
  };

  writeJson(join(DATA_DIR, "proof-environment.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "PROOF_ENVIRONMENT.md"), renderMarkdown(report), "utf8");

  console.error(
    `[proof-env] ${status}: ${report.summary.gates_passed}/${report.summary.gates_total} gates, ` +
      `${report.summary.required_secrets_present}/${report.summary.required_secrets_total} required secrets present`,
  );

  if (status !== "passed" && !process.argv.includes("--allow-failures")) {
    process.exit(1);
  }
}

function inspectGitHubSecrets(generatedAt) {
  const listed = listGitHubSecrets();
  const byName = new Map(listed.items.map((item) => [item.name, item]));
  const secrets = SECRET_POLICY.map((policy) => {
    const found = byName.get(policy.name);
    const ageDays = found?.updatedAt ? daysBetween(found.updatedAt, generatedAt) : null;
    const stale =
      found && policy.max_age_days !== null && ageDays !== null && ageDays > policy.max_age_days;
    return {
      name: policy.name,
      purpose: policy.purpose,
      required: policy.required,
      present: Boolean(found),
      updated_at: found?.updatedAt ?? null,
      age_days: ageDays === null ? null : Math.round(ageDays * 10) / 10,
      max_age_days: policy.max_age_days,
      status: !found
        ? policy.required
          ? "missing"
          : "optional-missing"
        : stale
          ? "stale"
          : "present",
      rotation: policy.rotation,
    };
  });
  const required = secrets.filter((item) => item.required);
  return {
    source: listed.source,
    available: listed.ok,
    error: listed.error,
    required_total: required.length,
    required_present: required.filter((item) => item.present).length,
    stale_required: required.filter((item) => item.status === "stale").length,
    secrets,
  };
}

function listGitHubSecrets() {
  const result = spawnSync("gh", ["secret", "list", "--repo", REPO, "--json", "name,updatedAt"], {
    cwd: ROOT,
    shell: process.platform === "win32",
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if ((result.status ?? 1) !== 0) {
    const envItems = SECRET_POLICY.filter((secret) => process.env[secret.name]).map((secret) => ({
      name: secret.name,
      updatedAt: null,
    }));
    return {
      ok: envItems.length > 0,
      source: "process.env presence fallback",
      error: tail(result.stderr || result.stdout),
      items: envItems,
    };
  }
  return {
    ok: true,
    source: "gh secret list",
    error: null,
    items: JSON.parse(result.stdout || "[]"),
  };
}

async function verifyHostedHealth(url) {
  const started = Date.now();
  try {
    const res = await fetchProtected(`${url.replace(/\/$/, "")}/api/health`);
    const body = res.body;
    let parsed = null;
    try {
      parsed = JSON.parse(body);
    } catch {
      parsed = null;
    }
    const database = parsed?.database;
    const ok =
      res.status >= 200 &&
      res.status < 300 &&
      parsed?.ok === true &&
      database?.ok === true &&
      database?.mode === "crud_probe" &&
      database?.operation === "insert-read-update-delete";
    return {
      ok,
      url,
      status: res.status,
      duration_ms: Date.now() - started,
      database_mode: database?.mode ?? null,
      database_operation: database?.operation ?? null,
      detail: ok
        ? "Hosted /api/health completed DB CRUD proof."
        : "Hosted /api/health did not return the expected DB CRUD proof.",
    };
  } catch (err) {
    return {
      ok: false,
      url,
      status: null,
      duration_ms: Date.now() - started,
      database_mode: null,
      database_operation: null,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

async function fetchProtected(url) {
  const headers = { accept: "application/json" };
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET && isVercelUrl(url)) {
    headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }
  const res = await fetch(url, { headers });
  const body = await res.text();
  if ((res.status === 401 || res.status === 403) && process.env.VERCEL_TOKEN && isVercelUrl(url)) {
    return vercelCurl(url);
  }
  return { status: res.status, body };
}

function vercelCurl(url) {
  const parsed = new URL(url);
  const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = [
    "--yes",
    "vercel@latest",
    "curl",
    `${parsed.pathname || "/"}${parsed.search}`,
    "--deployment",
    `${parsed.protocol}//${parsed.host}`,
    "-i",
    "-L",
    "-sS",
    "--max-time",
    "30",
  ];
  if (process.env.VERCEL_TOKEN) args.push("--token", process.env.VERCEL_TOKEN);
  const result = spawnSync(npxBin, args, {
    cwd: ROOT,
    shell: process.platform === "win32",
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 150_000,
    env: { ...process.env, CI: "1" },
  });
  if ((result.status ?? 1) !== 0) {
    throw new Error(
      `vercel curl failed with exit ${result.status ?? 1}: ${tail(result.stderr || result.stdout)}`,
    );
  }
  return parseRawHttpResponse(result.stdout);
}

function parseRawHttpResponse(raw) {
  const parts = String(raw ?? "").split(/\r?\n\r?\n/);
  let headerIndex = -1;
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (/^HTTP\/\d(?:\.\d)?\s+\d{3}/i.test(parts[i] ?? "")) {
      headerIndex = i;
      break;
    }
  }
  if (headerIndex < 0) throw new Error("vercel curl output did not include headers");
  const statusMatch = parts[headerIndex].split(/\r?\n/)[0]?.match(/^HTTP\/\d(?:\.\d)?\s+(\d{3})/i);
  return {
    status: statusMatch ? Number(statusMatch[1]) : 0,
    body: parts.slice(headerIndex + 1).join("\n\n"),
  };
}

function isVercelUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "vercel.app" || parsed.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function missingHosted() {
  return {
    ok: false,
    url: null,
    status: null,
    duration_ms: 0,
    database_mode: null,
    database_operation: null,
    detail: "No hosted proof URL is available in latest golden-path evidence.",
  };
}

function inspectEvidence(goldenPath) {
  const latestRun = goldenPath?.runs?.[0] ?? null;
  const gates = latestRun?.gates ?? [];
  return {
    golden_path_present: Boolean(latestRun),
    latest_run_id: latestRun?.run_id ?? null,
    generated_at: goldenPath?.generated_at ?? null,
    app_hash: latestRun?.generated_app?.tree_hash ?? null,
    gate_count: gates.length,
    gates_passed: gates.filter((gate) => gate.status === "passed").length,
    vercel_db_crud_gate:
      gates.find((gate) => gate.id === "vercel_db_crud_health")?.status ?? "missing",
    latest_evidence_hash: latestRun ? hashObject(latestRun) : null,
  };
}

function buildGates({ secretInventory, hosted, evidence }) {
  const requiredMissing = secretInventory.secrets.filter((item) => item.required && !item.present);
  const staleRequired = secretInventory.secrets.filter(
    (item) => item.required && item.status === "stale",
  );
  return [
    {
      id: "secret_inventory_available",
      status: secretInventory.available ? "passed" : "failed",
      detail: secretInventory.available
        ? "GitHub secret inventory is readable without exposing values."
        : `GitHub secret inventory unavailable: ${secretInventory.error}`,
    },
    {
      id: "required_secrets_present",
      status: requiredMissing.length === 0 ? "passed" : "failed",
      detail:
        requiredMissing.length === 0
          ? "All required proof secrets are present."
          : `Missing required proof secrets: ${requiredMissing.map((item) => item.name).join(", ")}.`,
    },
    {
      id: "required_secrets_fresh",
      status: staleRequired.length === 0 ? "passed" : "failed",
      detail:
        staleRequired.length === 0
          ? "Required proof secrets are within rotation policy."
          : `Stale required proof secrets: ${staleRequired.map((item) => item.name).join(", ")}.`,
    },
    {
      id: "hosted_db_crud_health",
      status: hosted.ok ? "passed" : "failed",
      detail: hosted.detail,
    },
    {
      id: "golden_path_evidence_present",
      status: evidence.golden_path_present ? "passed" : "failed",
      detail: evidence.golden_path_present
        ? `Latest run ${evidence.latest_run_id} has ${evidence.gates_passed}/${evidence.gate_count} gates.`
        : "Golden-path evidence is missing.",
    },
    {
      id: "golden_path_has_hosted_db_gate",
      status: evidence.vercel_db_crud_gate === "passed" ? "passed" : "failed",
      detail:
        evidence.vercel_db_crud_gate === "passed"
          ? "Golden-path evidence includes a passed hosted DB CRUD gate."
          : `Hosted DB CRUD gate status is ${evidence.vercel_db_crud_gate}.`,
    },
  ];
}

function buildNextActions({ secretInventory, hosted, evidence }) {
  const actions = [];
  for (const secret of secretInventory.secrets) {
    if (secret.required && !secret.present) {
      actions.push({
        severity: "critical",
        action: `Set GitHub secret ${secret.name}`,
        evidence: secret.purpose,
      });
    }
    if (secret.required && secret.status === "stale") {
      actions.push({
        severity: "warn",
        action: `Rotate GitHub secret ${secret.name}`,
        evidence: `${secret.age_days} days old; policy is ${secret.max_age_days} days.`,
      });
    }
  }
  if (!hosted.ok) {
    actions.push({
      severity: "critical",
      action: "Restore hosted DB-backed proof",
      evidence: hosted.detail,
    });
  }
  if (evidence.vercel_db_crud_gate !== "passed") {
    actions.push({
      severity: "critical",
      action: "Run golden path and attach a hosted DB CRUD deployment",
      evidence: `vercel_db_crud_health=${evidence.vercel_db_crud_gate}`,
    });
  }
  actions.push({
    severity: "security",
    action: "Revoke any Supabase personal access token exposed outside the terminal",
    evidence:
      "Personal access tokens are operator credentials and are never persisted by this repo.",
  });
  return actions;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Proof Environment");
  lines.push("");
  lines.push("**Status:** Internal proof environment lock");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push(`**Overall:** ${report.status}`);
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push(
    "This document defines the internal environment needed to keep the app factory proof repeatable. It records secret names, rotation policy, hosted health, and golden-path evidence without storing secret values.",
  );
  lines.push("");
  lines.push("## Run It");
  lines.push("");
  lines.push("```bash");
  lines.push("pnpm proof:env");
  lines.push("```");
  lines.push("");
  lines.push("## Gates");
  lines.push("");
  lines.push("| Gate | Status | Detail |");
  lines.push("| --- | --- | --- |");
  for (const gate of report.gates) {
    lines.push(`| ${gate.id} | ${gate.status} | ${gate.detail} |`);
  }
  lines.push("");
  lines.push("## Required Secrets");
  lines.push("");
  lines.push("| Name | Status | Age | Rotation | Purpose |");
  lines.push("| --- | --- | ---: | --- | --- |");
  for (const secret of report.secrets.filter((item) => item.required)) {
    lines.push(
      `| \`${secret.name}\` | ${secret.status} | ${secret.age_days ?? "n/a"}d | ${
        secret.max_age_days ?? "stable"
      } | ${secret.purpose} |`,
    );
  }
  lines.push("");
  lines.push("## Hosted Runtime");
  lines.push("");
  lines.push(`- URL: ${report.hosted_runtime.url ?? "missing"}`);
  lines.push(`- HTTP status: ${report.hosted_runtime.status ?? "n/a"}`);
  lines.push(`- Database mode: ${report.hosted_runtime.database_mode ?? "n/a"}`);
  lines.push(`- Database operation: ${report.hosted_runtime.database_operation ?? "n/a"}`);
  lines.push("");
  lines.push("## Evidence");
  lines.push("");
  lines.push(`- Latest run: \`${report.evidence.latest_run_id ?? "missing"}\``);
  lines.push(`- App hash: \`${report.evidence.app_hash ?? "missing"}\``);
  lines.push(`- Gates: ${report.evidence.gates_passed}/${report.evidence.gate_count}`);
  lines.push(`- Evidence hash: \`${report.evidence.latest_evidence_hash ?? "missing"}\``);
  lines.push("");
  lines.push("## Operating Rules");
  lines.push("");
  for (const rule of report.operating_rules) lines.push(`- ${rule}`);
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const action of report.next_actions) {
    lines.push(`- **${action.severity}: ${action.action}.** ${action.evidence}`);
  }
  lines.push("");
  lines.push("## Generated Artifacts");
  lines.push("");
  lines.push("- `data/proof-environment.public.json`");
  lines.push("- `evidence/proof-environment/latest.json`");
  lines.push("- `docs/PROOF_ENVIRONMENT.md`");
  return `${lines.join("\n")}\n`;
}

function normalizeUrl(value) {
  if (!value) return value;
  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

function daysBetween(fromIso, toIso) {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return Math.max(0, (to - from) / 86_400_000);
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

function hashObject(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}

function tail(value, max = 4000) {
  const text = String(value ?? "");
  return text.length > max ? text.slice(-max) : text;
}

main().catch((err) => {
  console.error("[proof-env] fatal:", err instanceof Error ? err.stack : err);
  process.exit(1);
});
