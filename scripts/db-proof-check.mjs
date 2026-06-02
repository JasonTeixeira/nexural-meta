#!/usr/bin/env node
/**
 * Phase 15 DB proof and migration-readiness check.
 *
 * This does not print or read secret values. It verifies the latest public-safe
 * evidence says hosted DB CRUD passed, checks whether DATABASE_URL is available
 * locally or by GitHub secret inventory, and records whether migrations were
 * actually applied or remain CI/secret-dependent.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/db-proof-check.mjs";
const REPO = process.env.GITHUB_REPOSITORY || "JasonTeixeira/nexural-meta";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const EVIDENCE_DIR = join(ROOT, "evidence", "db-proof");

async function main() {
  const generatedAt = new Date().toISOString();
  const latest = readJson("evidence/golden-path/latest.json", null);
  const proofEnv = readJson("data/proof-environment.public.json", null);
  const secretInventory = readSecretInventory();
  const hostedHealth = await readHostedHealth(latest);
  const gates = [];

  const migrationGate = migrationGateFromLatest(latest, secretInventory);
  const localCrudGate = crudGateFromLatest(latest, "db_crud_health", "Local generated app DB CRUD");
  const hostedCrudGate = crudGateFromLatest(
    latest,
    "vercel_db_crud_health",
    "Hosted generated app DB CRUD",
  );
  const proofEnvGate = {
    id: "proof_environment_db",
    status:
      proofEnv?.status === "passed" &&
      (proofEnv?.summary?.hosted_health_status ?? 0) === 200 &&
      (proofEnv?.summary?.required_secrets_present ?? 0) ===
        (proofEnv?.summary?.required_secrets_total ?? -1)
        ? "passed"
        : "failed",
    detail: proofEnv
      ? `Proof environment ${proofEnv.status}; hosted health ${proofEnv.summary?.hosted_health_status ?? "unknown"}.`
      : "Missing proof-environment artifact.",
  };

  const schemaDriftGate = schemaDriftGateFromHealth(latest, hostedHealth);
  const seedDataGate = seedDataGateFromHealth(latest, hostedHealth);

  gates.push(
    localCrudGate,
    hostedCrudGate,
    migrationGate,
    schemaDriftGate,
    seedDataGate,
    proofEnvGate,
  );
  const passed = gates.filter((gate) => gate.status === "passed").length;
  const status = passed === gates.length ? "passed" : "degraded";
  const report = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    status,
    summary: {
      gates_passed: passed,
      gates_total: gates.length,
      latest_run_id: latest?.run_id ?? null,
      deployed_url: latest?.runtime?.deployed_url ?? null,
      database_mode: latest?.runtime?.database_mode ?? null,
      migration_status: migrationGate.status,
      hosted_crud_status: hostedCrudGate.status,
      schema_drift_status: schemaDriftGate.status,
      seed_data_status: seedDataGate.status,
      database_url_available_by_inventory: secretInventory.has_database_url,
    },
    gates,
    secret_inventory: {
      repo: REPO,
      readable: secretInventory.readable,
      required_names_checked: ["DATABASE_URL"],
      database_url_present: secretInventory.has_database_url,
      values_exposed: false,
      detail: secretInventory.detail,
    },
    evidence: {
      golden_path_latest: "evidence/golden-path/latest.json",
      proof_environment: "data/proof-environment.public.json",
      hosted_health_checked: hostedHealth.checked,
      report_hash: null,
    },
    next_actions: buildNextActions(gates, secretInventory),
  };
  report.evidence.report_hash = hashObject({
    ...report,
    evidence: { ...report.evidence, report_hash: null },
  });

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(DOCS_DIR, { recursive: true });
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  writeJson(join(DATA_DIR, "db-proof.public.json"), report);
  writeJson(join(EVIDENCE_DIR, "latest.json"), report);
  writeFileSync(join(DOCS_DIR, "DB_PROOF.md"), renderMarkdown(report), "utf8");

  console.error(`[db-proof] ${status}: ${passed}/${gates.length} gates`);
  if (status === "degraded" && process.argv.includes("--strict")) process.exit(1);
}

function migrationGateFromLatest(latest, secretInventory) {
  const gate = latest?.gates?.find((item) => item.id === "supabase_migrations");
  if (!gate) {
    return {
      id: "migration_readiness",
      status: "failed",
      detail: "Latest golden-path evidence has no supabase_migrations gate.",
    };
  }
  const detail = gate.detail ?? "";
  const applied =
    gate.status === "passed" &&
    (detail.includes("applied to staging Postgres") ||
      detail.includes("applied through Management API") ||
      detail.includes("already present"));
  if (applied) {
    return {
      id: "migration_readiness",
      status: "passed",
      detail,
      command: gate.command ?? null,
    };
  }
  if (gate.status === "passed" && secretInventory.has_database_url) {
    return {
      id: "migration_readiness",
      status: "passed",
      detail:
        "Latest local run skipped migration push, but DATABASE_URL is present in GitHub secret inventory for scheduled proof refresh.",
      command: "pnpm golden:path in CI with DATABASE_URL",
    };
  }
  return {
    id: "migration_readiness",
    status: "failed",
    detail,
    command: gate.command ?? null,
  };
}

function crudGateFromLatest(latest, id, label) {
  const gate = latest?.gates?.find((item) => item.id === id);
  return {
    id,
    label,
    status: gate?.status === "passed" ? "passed" : "failed",
    detail: gate?.detail ?? `Latest golden-path evidence has no ${id} gate.`,
  };
}

async function readHostedHealth(latest) {
  const url = latest?.runtime?.deployed_url;
  if (!url) {
    return {
      checked: false,
      ok: false,
      detail: "Latest golden-path run has no deployed URL.",
      body: null,
    };
  }
  try {
    const response = await fetchProtected(new URL("/api/health", url).toString(), 30_000);
    return {
      checked: true,
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      detail: `HTTP ${response.status} from hosted /api/health.`,
      body: JSON.parse(response.body),
    };
  } catch (err) {
    return {
      checked: true,
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
      body: null,
    };
  }
}

async function fetchProtected(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = { accept: "application/json" };
    if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET && isVercelUrl(url)) {
      headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    }
    const response = await fetch(url, { headers, signal: controller.signal });
    const body = await response.text();
    if ((response.status === 401 || response.status === 403) && isVercelUrl(url)) {
      return vercelCurl(url, timeoutMs);
    }
    return { status: response.status, body };
  } finally {
    clearTimeout(timer);
  }
}

function vercelCurl(url, timeoutMs) {
  const parsed = new URL(url);
  const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = [
    "--yes",
    "vercel@latest",
    "curl",
    `${parsed.pathname || "/"}${parsed.search}`,
    "--deployment",
    `${parsed.protocol}//${parsed.host}`,
    "--yes",
    "--",
    "-i",
    "-L",
    "-sS",
    "--max-time",
    String(Math.max(5, Math.ceil(timeoutMs / 1000))),
  ];
  const result = spawnSync(npxBin, args, {
    cwd: vercelProjectCwd(),
    shell: process.platform === "win32",
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: timeoutMs + 120_000,
    env: { ...process.env, CI: "1" },
  });
  if ((result.status ?? 1) !== 0) {
    throw new Error(
      `vercel curl failed with exit ${result.status ?? 1}: ${tail(result.stderr || result.stdout)}`,
    );
  }
  return parseRawHttpResponse(result.stdout);
}

function vercelProjectCwd() {
  const cacheDir = join(ROOT, ".nexural", "cache");
  const linkedProject = join(cacheDir, ".vercel", "project.json");
  if (existsSync(linkedProject)) return cacheDir;

  const projectId = process.env.VERCEL_PROJECT_ID;
  const orgId = process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID;
  if (projectId && orgId) {
    const projectDir = join(cacheDir, "vercel-proof-project");
    const vercelDir = join(projectDir, ".vercel");
    mkdirSync(vercelDir, { recursive: true });
    writeFileSync(
      join(vercelDir, "project.json"),
      `${JSON.stringify({ projectId, orgId }, null, 2)}\n`,
      "utf8",
    );
    return projectDir;
  }

  return ROOT;
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
  const headerLines = (parts[headerIndex] ?? "").split(/\r?\n/);
  const statusMatch = headerLines[0]?.match(/^HTTP\/\d(?:\.\d)?\s+(\d{3})/i);
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

function schemaDriftGateFromHealth(latest, hostedHealth) {
  const local = latest?.runtime?.db_health?.database?.schema;
  const hosted = hostedHealth.body?.database?.schema;
  const proof = hosted ?? local;
  const ok = proof?.ok === true && proof?.mode === "schema_drift_probe";
  return {
    id: "db_schema_drift_health",
    label: "Hosted schema drift proof",
    status: ok ? "passed" : "failed",
    detail: ok
      ? `Expected tables verified: ${(proof.checked_tables ?? []).join(", ")}.`
      : `Schema drift proof missing or failed. Hosted health: ${hostedHealth.detail}`,
  };
}

function seedDataGateFromHealth(latest, hostedHealth) {
  const local = latest?.runtime?.db_health?.database?.seed;
  const hosted = hostedHealth.body?.database?.seed;
  const proof = hosted ?? local;
  const ok = proof?.ok === true && proof?.mode === "seed_data_probe";
  return {
    id: "db_seed_data_health",
    label: "Hosted seed-data proof",
    status: ok ? "passed" : "failed",
    detail: ok
      ? `Seed row ${proof.slug ?? "unknown"} completed ${proof.operation ?? "upsert-read"}.`
      : `Seed-data proof missing or failed. Hosted health: ${hostedHealth.detail}`,
  };
}

function readSecretInventory() {
  if (process.env.DATABASE_URL) {
    return {
      readable: true,
      has_database_url: true,
      detail: "DATABASE_URL is present in local environment.",
    };
  }
  const gh = spawnSync("gh", ["secret", "list", "--repo", REPO, "--json", "name"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
  if ((gh.status ?? 1) !== 0) {
    return {
      readable: false,
      has_database_url: false,
      detail: "GitHub secret inventory is not readable in this environment.",
    };
  }
  try {
    const names = new Set(JSON.parse(gh.stdout).map((item) => item.name));
    return {
      readable: true,
      has_database_url: names.has("DATABASE_URL"),
      detail: names.has("DATABASE_URL")
        ? "DATABASE_URL is present in GitHub secret inventory."
        : "DATABASE_URL is missing from GitHub secret inventory.",
    };
  } catch {
    return {
      readable: false,
      has_database_url: false,
      detail: "GitHub secret inventory response could not be parsed.",
    };
  }
}

function buildNextActions(gates, secretInventory) {
  const actions = [];
  if (!secretInventory.has_database_url) {
    actions.push({
      action: "Add DATABASE_URL as a GitHub secret.",
      reason: "Migration push cannot be automated without DB access.",
      phase: "Phase 15",
    });
  }
  if (gates.some((gate) => gate.status !== "passed")) {
    actions.push({
      action: "Run pnpm golden:path in an environment with staging Supabase DB credentials.",
      reason:
        "The DB proof should include migration readiness and CRUD proof in the same evidence chain.",
      phase: "Phase 15",
    });
  }
  if (actions.length === 0) {
    actions.push({
      action: "Expand schema drift proof to recipe-specific invariants and RLS policy checks.",
      reason: "CRUD, migration readiness, schema drift, and seed-data proof are green.",
      phase: "Phase 15",
    });
  }
  return actions;
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# DB Proof");
  lines.push("");
  lines.push("**Status:** Phase 15 generated DB proof and migration-readiness check");
  lines.push(`**Generated:** ${report.generated_at}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Gates: ${report.summary.gates_passed}/${report.summary.gates_total}`);
  lines.push(`- Latest run: ${report.summary.latest_run_id ?? "missing"}`);
  lines.push(`- Hosted URL: ${report.summary.deployed_url ?? "missing"}`);
  lines.push(`- Database mode: ${report.summary.database_mode ?? "unknown"}`);
  lines.push(`- Schema drift: ${report.summary.schema_drift_status}`);
  lines.push(`- Seed data: ${report.summary.seed_data_status}`);
  lines.push(
    `- DATABASE_URL inventory: ${report.summary.database_url_available_by_inventory ? "present" : "missing"}`,
  );
  lines.push("");
  lines.push("## Gates");
  lines.push("");
  lines.push("| Gate | Status | Detail |");
  lines.push("| --- | --- | --- |");
  for (const gate of report.gates) {
    lines.push(`| ${gate.id} | ${gate.status} | ${String(gate.detail).replaceAll("|", "\\|")} |`);
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const action of report.next_actions) {
    lines.push(`- **${action.phase}:** ${action.action} ${action.reason}`);
  }
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

function hashObject(value) {
  return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`;
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function tail(value) {
  return String(value ?? "")
    .trim()
    .split(/\r?\n/)
    .slice(-8)
    .join("\n");
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main().catch((err) => {
  console.error("[db-proof] fatal:", err instanceof Error ? err.stack : err);
  process.exit(1);
});
