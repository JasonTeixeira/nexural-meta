#!/usr/bin/env node
/**
 * Phase 5 golden path proof.
 *
 * Proves the local factory loop end-to-end:
 * idea/spec -> resource selection -> nx forge -> install -> typecheck -> build
 * -> local runtime -> nx verify -> evidence hash.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const SCHEMA_VERSION = 1;
const GENERATED_BY = "scripts/golden-path-proof.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DATA_DIR = join(ROOT, "data");
const DOCS_DIR = join(ROOT, "docs");
const PRIVATE_DIR = join(ROOT, ".nexural", "private");
const CACHE_DIR = join(ROOT, ".nexural", "cache", "golden-path");
const EVIDENCE_DIR = join(ROOT, "evidence", "golden-path");
const RESOURCE_MAP_PATH = join(DATA_DIR, "ecosystem-resource-map.public.json");
const SPEC_DIR = join(DATA_DIR, "golden-path-specs");

const isWindows = process.platform === "win32";
const pnpmBin = isWindows ? "pnpm.cmd" : "pnpm";
const npxBin = isWindows ? "npx.cmd" : "npx";

const IGNORED_HASH_DIRS = new Set(["node_modules", ".next", ".git"]);
const IGNORED_HASH_FILES = new Set(["pnpm-lock.yaml", "next-env.d.ts", "tsconfig.tsbuildinfo"]);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const specPaths = resolveSpecPaths(args);
  for (const specPath of specPaths) {
    await runSpec(specPath);
  }
}

async function runSpec(specPath) {
  const started = Date.now();
  const generatedAt = new Date().toISOString();
  const spec = readJson(specPath);
  const resourceMap = readJson(RESOURCE_MAP_PATH);
  const useCase = resourceMap.use_cases.find((item) => item.id === spec.use_case_id);
  if (!useCase) throw new Error(`Resource use case not found: ${spec.use_case_id}`);

  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(PRIVATE_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });
  mkdirSync(EVIDENCE_DIR, { recursive: true });

  const runId = `${spec.id}-${stamp(generatedAt)}`;
  const runRoot = join(CACHE_DIR, runId);
  const appRoot = join(runRoot, spec.app_slug);
  const specInputPath = join(runRoot, "inputs.json");
  log(`starting ${runId}`);
  rmSync(runRoot, { recursive: true, force: true });
  mkdirSync(runRoot, { recursive: true });
  writeFileSync(specInputPath, JSON.stringify(spec.inputs, null, 2), "utf8");

  const gates = [];

  gates.push({
    id: "resource_selection",
    label: "Resource selection",
    status: useCase.recommended_assets.length > 0 ? "passed" : "failed",
    detail: `${useCase.recommended_assets.length} recommended assets selected from ${useCase.layers.length} layers.`,
  });

  log(`forge ${spec.recipe} -> ${appRoot}`);
  const forge = run(
    npxBin,
    [
      "--yes",
      "tsx",
      "apps/cli/src/bin/nx.ts",
      "forge",
      spec.recipe,
      spec.app_slug,
      "--inputs",
      specInputPath,
      "--mock-secrets",
      "--out-dir",
      appRoot,
    ],
    { cwd: ROOT, timeoutMs: 120_000 },
  );
  const emittedFileCount = countFiles(appRoot, {
    ignoreDirs: new Set(["node_modules", ".git", ".next"]),
    ignoreFiles: new Set(),
  });
  gates.push({
    id: "forge_emit",
    label: "Forge emit",
    status:
      forge.status === 0 && emittedFileCount >= spec.proof_targets.forge_min_files
        ? "passed"
        : "failed",
    detail: `${emittedFileCount} files emitted by ${spec.recipe}.`,
    command: forge.command,
    duration_ms: forge.duration_ms,
  });
  assertGate(gates.at(-1));

  const usability = verifyGeneratedUsability(appRoot, spec);
  gates.push({
    id: "generated_app_usability",
    label: "Generated app usability surface",
    status: usability.ok ? "passed" : "failed",
    detail: usability.detail,
  });
  assertGate(gates.at(-1));

  const runtimeEnv = resolveRuntimeEnv(spec);
  log(`write ${runtimeEnv.mode} env`);
  await writeLocalEnv(appRoot, runtimeEnv);

  log("verify Supabase/Auth runtime configuration");
  const supabaseRuntime = await verifySupabaseRuntime(runtimeEnv);
  gates.push({
    id: "supabase_runtime",
    label: "Verify Supabase/Auth runtime",
    status: supabaseRuntime.ok ? "passed" : "failed",
    detail: supabaseRuntime.detail,
    duration_ms: supabaseRuntime.duration_ms,
  });
  assertGate(gates.at(-1));

  log("apply Supabase migrations when database credentials are configured");
  const migrationProof = await applySupabaseMigrations(appRoot, runtimeEnv, spec);
  gates.push({
    id: "supabase_migrations",
    label: "Apply Supabase migrations",
    status: migrationProof.ok ? "passed" : "failed",
    detail: migrationProof.detail,
    command: migrationProof.command,
    duration_ms: migrationProof.duration_ms,
  });
  assertGate(gates.at(-1));

  log("install dependencies");
  const install = run(pnpmBin, ["install", "--ignore-workspace", "--ignore-scripts"], {
    cwd: appRoot,
    timeoutMs: 300_000,
  });
  gates.push(gateFromCommand("install", "Install dependencies", install));
  assertGate(gates.at(-1));

  gates.push({
    id: "standalone_lockfile",
    label: "Standalone lockfile",
    status: existsSync(join(appRoot, "pnpm-lock.yaml")) ? "passed" : "failed",
    detail: existsSync(join(appRoot, "pnpm-lock.yaml"))
      ? "Generated app includes its own pnpm-lock.yaml for isolated Vercel installs."
      : "Generated app is missing pnpm-lock.yaml after install.",
  });
  assertGate(gates.at(-1));

  log("typecheck generated app");
  const typecheck = run(pnpmBin, ["typecheck"], { cwd: appRoot, timeoutMs: 180_000 });
  gates.push(gateFromCommand("typecheck", "Typecheck generated app", typecheck));
  assertGate(gates.at(-1));

  log("build generated app");
  const build = run(pnpmBin, ["build"], { cwd: appRoot, timeoutMs: 300_000 });
  gates.push(gateFromCommand("build", "Build generated app", build));
  assertGate(gates.at(-1));

  log("start local runtime");
  const port = await findFreePort(3040);
  const runtime = await startRuntime(appRoot, port);
  gates.push({
    id: "local_runtime",
    label: "Start local runtime",
    status: runtime.health.ok ? "passed" : "failed",
    detail: runtime.health.ok
      ? `HTTP ${runtime.health.status} from ${spec.proof_targets.local_runtime_health_path}.`
      : runtime.health.error,
    duration_ms: runtime.duration_ms,
  });
  assertGate(gates.at(-1));

  const dbHealth = verifyDbHealthBody(runtime.health.body, runtimeEnv);
  gates.push({
    id: "db_crud_health",
    label: "DB-backed CRUD health proof",
    status: dbHealth.ok ? "passed" : "failed",
    detail: dbHealth.detail,
  });
  assertGate(gates.at(-1));

  const schemaHealth = verifyNestedDbHealth(runtime.health.body, runtimeEnv, "schema");
  gates.push({
    id: "db_schema_drift_health",
    label: "DB schema drift health proof",
    status: schemaHealth.ok ? "passed" : "failed",
    detail: schemaHealth.detail,
  });
  assertGate(gates.at(-1));

  const seedHealth = verifyNestedDbHealth(runtime.health.body, runtimeEnv, "seed");
  gates.push({
    id: "db_seed_data_health",
    label: "DB seed-data health proof",
    status: seedHealth.ok ? "passed" : "failed",
    detail: seedHealth.detail,
  });
  assertGate(gates.at(-1));

  log("run live verifier");
  const localEvidenceSlug = `${spec.id}-local`;
  const verify = run(
    npxBin,
    [
      "--yes",
      "tsx",
      "apps/cli/src/bin/nx.ts",
      "verify",
      runtime.url,
      "--evidence-slug",
      localEvidenceSlug,
      "--timeout",
      "20000",
    ],
    { cwd: ROOT, timeoutMs: 120_000 },
  );
  const verifyReportPath = join(ROOT, "evidence", "gate-5", localEvidenceSlug, "report.json");
  const verifyReport = existsSync(verifyReportPath) ? readJson(verifyReportPath) : undefined;
  gates.push({
    id: "nx_verify",
    label: "Verify live local app",
    status:
      verify.status === 0 &&
      verifyReport?.summary?.failed === 0 &&
      verifyReport?.summary?.total >= spec.proof_targets.verify_min_checks
        ? "passed"
        : "failed",
    detail: verifyReport
      ? `${verifyReport.summary.passed}/${verifyReport.summary.total} checks passed.`
      : "verify report missing",
    command: verify.command,
    duration_ms: verify.duration_ms,
  });
  await stopRuntime(runtime);
  assertGate(gates.at(-1));

  log("hash generated app tree");
  const appTree = await hashTree(appRoot);
  const evidencePayload = {
    schema_version: SCHEMA_VERSION,
    run_id: runId,
    generated_at: generatedAt,
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    spec: {
      id: spec.id,
      title: spec.title,
      path: relative(ROOT, specPath).replaceAll("\\", "/"),
      intent: spec.intent,
      recipe: spec.recipe,
      app_slug: spec.app_slug,
      use_case_id: spec.use_case_id,
    },
    selected_resources: useCase.recommended_assets.slice(0, 5).map((asset) => ({
      name: asset.name,
      url: asset.url,
      layer: asset.layer,
      score: asset.score,
      maturity: asset.maturity,
    })),
    generated_app: {
      local_path: appRoot,
      file_count: emittedFileCount,
      tree_hash: appTree.hash,
      hashed_files: appTree.files.length,
    },
    runtime: {
      mode: "local-next-start",
      credentials_mode: runtimeEnv.mode,
      supabase_project_ref: runtimeEnv.publicProjectRef,
      database_mode: runtimeEnv.databaseProofMode ? "staging-postgres" : "not-configured",
      url: runtime.url,
      health_path: spec.proof_targets.local_runtime_health_path,
      db_health: parseHealthBody(runtime.health.body),
      deploy_status: process.env.VERCEL_TOKEN
        ? "vercel-token-present-not-used"
        : "blocked-no-vercel-token",
      deployed_url: null,
    },
    gates,
    evidence: {
      gate5_report: relative(ROOT, verifyReportPath).replaceAll("\\", "/"),
      latest_report: "evidence/golden-path/latest.json",
      public_index: "data/golden-path-runs.public.json",
    },
    reusable_lessons: [
      {
        lesson: "Run forge with tsx until recipe input schemas ship compiled JS siblings.",
        fed_back: "Captured in golden-path script command path.",
      },
      {
        lesson:
          "Generated Next apps should use top-level typedRoutes and explicit outputFileTracingRoot.",
        fed_back: "Patched architecture warehouse next.config template.",
      },
      {
        lesson:
          "Local runtime proof needs a generated .env.local with safe mock values when using mock secrets.",
        fed_back:
          "Golden-path runner writes staging credentials when configured, otherwise public-safe mock env, and keeps both out of committed artifacts.",
      },
    ],
    remaining_gaps: [
      "No public Vercel preview was created because VERCEL_TOKEN is not set in this shell.",
      ...(runtimeEnv.mode === "staging-supabase"
        ? []
        : [
            "Runtime proof uses mock credentials because staging Supabase/Auth environment variables are not set in this shell.",
          ]),
      ...(runtimeEnv.databaseProofMode
        ? []
        : [
            "Database migrations and DB-backed CRUD proof are skipped because neither DATABASE_URL nor SUPABASE_ACCESS_TOKEN is set in this shell.",
          ]),
      "Production auth/database credentials are intentionally not committed.",
    ],
    wall_clock_ms: Date.now() - started,
  };

  log("write evidence artifacts");
  const publicPayload = maskLocalPaths(evidencePayload);
  writeJson(join(PRIVATE_DIR, "golden-path-latest.internal.json"), evidencePayload);
  writeJson(join(PRIVATE_DIR, "golden-path", `${runId}.internal.json`), evidencePayload);
  writeJson(join(EVIDENCE_DIR, "latest.json"), publicPayload);
  writeJson(join(EVIDENCE_DIR, `${runId}.json`), publicPayload);

  const previousIndex = existsSync(join(DATA_DIR, "golden-path-runs.public.json"))
    ? readJson(join(DATA_DIR, "golden-path-runs.public.json"))
    : { runs: [] };
  const runs = [
    publicPayload,
    ...(previousIndex.runs ?? []).filter((run) => run.run_id !== publicPayload.run_id),
  ];
  const publicIndex = {
    schema_version: SCHEMA_VERSION,
    generated_at: new Date().toISOString(),
    generated_by: GENERATED_BY,
    privacy: "public-safe",
    current_run_id: runId,
    totals: buildTotals(runs, publicPayload),
    runs,
  };
  writeJson(join(DATA_DIR, "golden-path-runs.public.json"), publicIndex);
  writeFileSync(join(DOCS_DIR, "GOLDEN_PATH.md"), renderMarkdown(publicIndex), "utf8");

  console.error(
    `[golden-path] ${runId}: ${gates.length}/${gates.length} gates passed; hash ${appTree.hash}`,
  );
}

function parseArgs(argv) {
  const args = { spec: "", all: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === "--spec" && next) {
      args.spec = next;
      i += 1;
    } else if (arg === "--all") {
      args.all = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/golden-path-proof.mjs [--spec <id-or-path>] [--all]`);
      process.exit(0);
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }
  return args;
}

function resolveSpecPaths(args) {
  if (args.all) {
    return readdirSync(SPEC_DIR)
      .filter((file) => file.endsWith(".json"))
      .map((file) => join(SPEC_DIR, file))
      .sort((a, b) => a.localeCompare(b));
  }
  if (args.spec) {
    const direct = resolve(ROOT, args.spec);
    if (existsSync(direct)) return [direct];
    const byId = join(SPEC_DIR, `${args.spec.replace(/\.json$/, "")}.json`);
    if (existsSync(byId)) return [byId];
    throw new Error(`Golden-path spec not found: ${args.spec}`);
  }
  return [join(SPEC_DIR, "client-intake-portal.json")];
}

function buildTotals(runs, latestRun) {
  const passedRuns = runs.filter((run) => run.gates.every((gate) => gate.status === "passed"));
  const hostedRuns = runs.filter((run) => run.runtime?.deploy_status === "verified-vercel-url");
  return {
    runs: runs.length,
    passed_runs: passedRuns.length,
    hosted_runs: hostedRuns.length,
    proof_backed_recipes: new Set(hostedRuns.map((run) => run.spec?.recipe).filter(Boolean)).size,
    latest_gate_count: latestRun.gates.length,
    latest_wall_clock_ms: latestRun.wall_clock_ms,
  };
}

function gateFromCommand(id, label, result) {
  return {
    id,
    label,
    status: result.status === 0 ? "passed" : "failed",
    detail: result.status === 0 ? "exit 0" : `exit ${result.status}`,
    command: result.command,
    duration_ms: result.duration_ms,
  };
}

function verifyGeneratedUsability(appRoot, spec) {
  const requiredFiles = [
    "package.json",
    "app/page.tsx",
    "app/api/health/route.ts",
    "lib/supabase/admin.ts",
    "supabase/migrations/0001_init.sql",
  ];
  if (spec.recipe === "internal-tool-dashboard") {
    requiredFiles.push(
      "app/dashboard/page.tsx",
      "app/dashboard/layout.tsx",
      "app/dashboard/tenants/page.tsx",
      "app/dashboard/tenants/actions.ts",
      "lib/rbac.ts",
      "supabase/migrations/0003_admin.sql",
    );
  }
  if (spec.recipe === "fintech-ledger-app") {
    requiredFiles.push(
      "lib/ledger/decimal.ts",
      "lib/ledger/post.ts",
      "supabase/migrations/0004_ledger.sql",
    );
  }
  if (spec.recipe === "saas-agent-platform") {
    requiredFiles.push("eval/adversarial.json", "supabase/migrations/0005_agent.sql");
  }
  if (spec.recipe === "saas-rag-chat") {
    requiredFiles.push("app/(app)/chat/page.tsx", "app/api/chat/route.ts", "eval/golden-set.json");
  }
  const missing = requiredFiles.filter((file) => !existsSync(join(appRoot, file)));
  if (missing.length > 0) {
    return {
      ok: false,
      detail: `Missing generated usability files: ${missing.join(", ")}.`,
    };
  }
  return {
    ok: true,
    detail: `Generated app includes ${requiredFiles.length} required runtime, DB, and recipe-specific files.`,
  };
}

function assertGate(gate) {
  if (gate?.status !== "passed") {
    throw new Error(`${gate?.id ?? "unknown gate"} failed: ${gate?.detail ?? "no detail"}`);
  }
}

function run(command, args, options) {
  const started = Date.now();
  const display = options.displayCommand ?? [command, ...args].join(" ");
  log(`run: ${display}`);
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    timeout: options.timeoutMs,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CI: "1" },
    shell: isWindows,
  });
  const status = result.status ?? 1;
  if (status !== 0) {
    process.stderr.write(redact(result.stdout, options.redactValues));
    process.stderr.write(redact(result.stderr, options.redactValues));
  }
  return {
    command: display,
    status,
    duration_ms: Date.now() - started,
    stdout_tail: tail(redact(result.stdout, options.redactValues)),
    stderr_tail: tail(redact(result.stderr, options.redactValues)),
  };
}

function redact(value, secrets = []) {
  let out = String(value ?? "");
  for (const secret of secrets ?? []) {
    if (secret) out = out.split(secret).join("<redacted>");
  }
  return out;
}

function resolveRuntimeEnv(spec) {
  const requiredStaging = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const hasStagingSupabase = requiredStaging.every((name) => Boolean(process.env[name]));
  const databaseProofMode = resolveDatabaseProofMode(hasStagingSupabase);
  const values = {
    NEXT_PUBLIC_SUPABASE_URL: hasStagingSupabase
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: hasStagingSupabase
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : "mock-anon-key",
    SUPABASE_SERVICE_ROLE_KEY: hasStagingSupabase
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : "mock-service-role-key",
    HEALTH_DB_CRUD_PROOF: databaseProofMode ? "1" : "0",
    HEALTH_DB_SCHEMA_PROOF: databaseProofMode ? "1" : "0",
    HEALTH_DB_SEED_PROOF: databaseProofMode ? "1" : "0",
    HEALTH_DB_EXPECTED_TABLES: expectedDbTables(spec),
    HEALTH_DB_SEED_SLUG: `health-seed-${spec.app_slug}`,
    RESEND_API_KEY: process.env.RESEND_API_KEY || "mock-resend-key",
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || "mock-posthog-key",
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    NEXT_PUBLIC_APP_NAME: spec.inputs.displayName,
    NEXT_PUBLIC_ROOT_DOMAIN: spec.inputs.rootDomain,
    NEXT_PUBLIC_TENANT_ROUTING: spec.inputs.tenantRouting,
    NEXT_PUBLIC_DEFAULT_LOCALE: spec.inputs.defaultLocale,
  };
  return {
    mode: hasStagingSupabase ? "staging-supabase" : "public-safe-mock",
    values,
    missing: requiredStaging.filter((name) => !process.env[name]),
    publicProjectRef: parseSupabaseProjectRef(values.NEXT_PUBLIC_SUPABASE_URL),
    databaseUrl:
      hasStagingSupabase && databaseProofMode === "database-url"
        ? process.env.DATABASE_URL || ""
        : "",
    managementToken:
      hasStagingSupabase && databaseProofMode === "management-api"
        ? process.env.SUPABASE_ACCESS_TOKEN || ""
        : "",
    databaseProofMode,
  };
}

function resolveDatabaseProofMode(hasStagingSupabase) {
  if (!hasStagingSupabase) return "";
  if (process.env.DATABASE_URL) return "database-url";
  if (process.env.SUPABASE_ACCESS_TOKEN) return "management-api";
  if (process.env.HEALTH_DB_CRUD_PROOF === "1") return "service-role-crud";
  return "";
}

async function verifySupabaseRuntime(runtimeEnv) {
  const started = Date.now();
  if (runtimeEnv.mode !== "staging-supabase") {
    return {
      ok: true,
      detail: "Skipped real Supabase/Auth probe because staging credentials are not configured.",
      duration_ms: Date.now() - started,
    };
  }

  const baseUrl = runtimeEnv.values.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = runtimeEnv.values.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  try {
    const res = await fetch(`${baseUrl}/auth/v1/settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });
    const reachable = res.status >= 200 && res.status < 500;
    return {
      ok: reachable,
      detail:
        res.status >= 200 && res.status < 300
          ? `HTTP ${res.status} from Supabase Auth settings for project ${runtimeEnv.publicProjectRef}.`
          : `Supabase Auth endpoint is reachable for project ${runtimeEnv.publicProjectRef}; settings returned HTTP ${res.status} under current key policy.`,
      duration_ms: Date.now() - started,
    };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
      duration_ms: Date.now() - started,
    };
  }
}

async function applySupabaseMigrations(appRoot, runtimeEnv, spec) {
  const started = Date.now();
  if (runtimeEnv.mode !== "staging-supabase") {
    return {
      ok: true,
      detail: "Skipped Supabase migrations because staging credentials are not configured.",
      duration_ms: Date.now() - started,
    };
  }
  if (!runtimeEnv.databaseUrl) {
    if (runtimeEnv.managementToken && runtimeEnv.publicProjectRef) {
      return applySupabaseMigrationsViaManagementApi(appRoot, runtimeEnv, spec, started);
    }
    return {
      ok: true,
      detail:
        "Skipped Supabase migrations because neither DATABASE_URL nor SUPABASE_ACCESS_TOKEN is configured.",
      duration_ms: Date.now() - started,
    };
  }

  const selectedMigrations = selectedMigrationNames(appRoot, spec);
  if (selectedMigrations.length === 0) {
    return {
      ok: true,
      detail:
        "No additional recipe-specific migrations are required for this proof; baseline schema is verified by DB health.",
      duration_ms: Date.now() - started,
    };
  }

  const migrationRoot = prepareMigrationRoot(appRoot, spec);
  let result = runSupabaseDbPush(migrationRoot, runtimeEnv);
  let repair = null;
  if (result.status !== 0) {
    repair = repairSupabaseMigrationHistory(result, migrationRoot, runtimeEnv);
    if (repair.ok) {
      result = runSupabaseDbPush(migrationRoot, runtimeEnv);
    }
  }
  let directSql = null;
  if (result.status !== 0) {
    directSql = applyMigrationsWithPsql(migrationRoot, selectedMigrations, runtimeEnv);
  }

  return {
    ok: result.status === 0 || directSql?.ok === true,
    detail:
      result.status === 0
        ? repair?.ok
          ? `Supabase migrations are applied to staging Postgres after repairing remote migration history (${repair.versions.join(", ")}).`
          : "Supabase migrations are applied to staging Postgres."
        : directSql?.ok
          ? `Supabase CLI migration history is out of sync; applied ${directSql.applied} selected SQL migration file(s) directly with psql and will verify schema through /api/health.`
          : repair?.attempted
            ? `exit ${result.status}; migration history repair ${repair.status}`
            : `exit ${result.status}`,
    command: directSql?.ok ? directSql.command : result.command,
    duration_ms: Date.now() - started,
  };
}

function runSupabaseDbPush(migrationRoot, runtimeEnv) {
  return run(
    npxBin,
    ["--yes", "supabase@latest", "db", "push", "--db-url", runtimeEnv.databaseUrl, "--include-all"],
    {
      cwd: migrationRoot,
      timeoutMs: 300_000,
      displayCommand: "npx --yes supabase@latest db push --db-url <DATABASE_URL> --include-all",
      redactValues: [runtimeEnv.databaseUrl],
    },
  );
}

function repairSupabaseMigrationHistory(failedPush, migrationRoot, runtimeEnv) {
  const versions = extractMigrationRepairVersions(failedPush);
  if (versions.length === 0) {
    return { attempted: false, ok: false, status: "not-suggested", versions };
  }
  const result = run(
    npxBin,
    [
      "--yes",
      "supabase@latest",
      "migration",
      "repair",
      "--status",
      "reverted",
      "--db-url",
      runtimeEnv.databaseUrl,
      ...versions,
    ],
    {
      cwd: migrationRoot,
      timeoutMs: 120_000,
      displayCommand: `npx --yes supabase@latest migration repair --status reverted --db-url <DATABASE_URL> ${versions.join(" ")}`,
      redactValues: [runtimeEnv.databaseUrl],
    },
  );
  return {
    attempted: true,
    ok: result.status === 0,
    status: result.status === 0 ? "passed" : `failed-exit-${result.status}`,
    versions,
  };
}

function extractMigrationRepairVersions(result) {
  const text = `${result.stdout_tail ?? ""}\n${result.stderr_tail ?? ""}`;
  const match = text.match(/migration repair --status reverted\s+([0-9\s]+)/);
  if (!match) return [];
  return match[1]
    .trim()
    .split(/\s+/)
    .filter((value) => /^\d{8,}$/.test(value));
}

function applyMigrationsWithPsql(migrationRoot, migrationNames, runtimeEnv) {
  const sourceDir = join(migrationRoot, "supabase", "migrations");
  let applied = 0;
  for (const migrationName of migrationNames) {
    const migrationPath = join(sourceDir, migrationName);
    const result = run(
      "psql",
      [runtimeEnv.databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", migrationPath],
      {
        cwd: migrationRoot,
        timeoutMs: 120_000,
        displayCommand: `psql <DATABASE_URL> -v ON_ERROR_STOP=1 -f ${migrationName}`,
        redactValues: [runtimeEnv.databaseUrl],
      },
    );
    if (result.status !== 0) {
      return {
        ok: false,
        command: result.command,
        applied,
        status: `failed-exit-${result.status}`,
      };
    }
    applied += 1;
  }
  return {
    ok: true,
    command: `psql <DATABASE_URL> -v ON_ERROR_STOP=1 -f <${migrationNames.length} migration(s)>`,
    applied,
  };
}

async function applySupabaseMigrationsViaManagementApi(appRoot, runtimeEnv, spec, started) {
  const migrationsDir = join(appRoot, "supabase", "migrations");
  const migrations = readdirSyncSafe(migrationsDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .filter((name) => shouldApplyMigration(name, spec))
    .sort((a, b) => a.localeCompare(b));
  if (migrations.length === 0) {
    return {
      ok: true,
      detail:
        "No additional recipe-specific migrations are required for this proof; baseline schema is verified by DB health.",
      duration_ms: Date.now() - started,
    };
  }

  const listRes = await fetch(
    `https://api.supabase.com/v1/projects/${runtimeEnv.publicProjectRef}/database/migrations`,
    {
      headers: {
        Authorization: `Bearer ${runtimeEnv.managementToken}`,
      },
    },
  );
  if (!listRes.ok) {
    return {
      ok: false,
      detail: `Supabase migration history returned HTTP ${listRes.status}.`,
      duration_ms: Date.now() - started,
    };
  }
  const applied = await listRes.json();
  const appliedNames = new Set((Array.isArray(applied) ? applied : []).map((item) => item.name));
  let appliedCount = 0;
  let skippedCount = 0;

  for (const filename of migrations) {
    const name = filename.replace(/\.sql$/, "");
    if (appliedNames.has(name)) {
      skippedCount += 1;
      continue;
    }
    const query = readFileSync(join(migrationsDir, filename), "utf8");
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${runtimeEnv.publicProjectRef}/database/migrations`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${runtimeEnv.managementToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, query }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        detail: `Migration ${name} returned HTTP ${res.status}: ${tail(body, 500)}`,
        duration_ms: Date.now() - started,
      };
    }
    appliedCount += 1;
  }

  return {
    ok: true,
    detail: `Supabase migrations applied through Management API (${appliedCount} applied, ${skippedCount} already present).`,
    command: "POST /v1/projects/<ref>/database/migrations",
    duration_ms: Date.now() - started,
  };
}

function prepareMigrationRoot(appRoot, spec) {
  const sourceDir = join(appRoot, "supabase", "migrations");
  const allMigrationCount = readdirSyncSafe(sourceDir).filter(
    (entry) => entry.isFile() && entry.name.endsWith(".sql"),
  ).length;
  const migrationNames = selectedMigrationNames(appRoot, spec);
  if (migrationNames.length === allMigrationCount) {
    return appRoot;
  }
  const subsetRoot = join(tmpdir(), `nexural-migrations-${spec.id}-${Date.now()}`);
  const targetDir = join(subsetRoot, "supabase", "migrations");
  mkdirSync(targetDir, { recursive: true });
  for (const name of migrationNames) {
    writeFileSync(join(targetDir, name), readFileSync(join(sourceDir, name), "utf8"), "utf8");
  }
  return subsetRoot;
}

function selectedMigrationNames(appRoot, spec) {
  const sourceDir = join(appRoot, "supabase", "migrations");
  return readdirSyncSafe(sourceDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .filter((name) => shouldApplyMigration(name, spec))
    .sort((a, b) => a.localeCompare(b));
}

function shouldApplyMigration(name, spec) {
  if (spec.recipe === "internal-tool-dashboard") return false;
  if (spec.recipe === "fintech-ledger-app") return name.includes("ledger");
  if (spec.recipe === "saas-agent-platform") return name.includes("agent");
  if (spec.recipe === "saas-rag-chat") return false;
  return true;
}

function verifyDbHealthBody(body, runtimeEnv) {
  if (runtimeEnv.mode !== "staging-supabase") {
    return {
      ok: true,
      detail: "Skipped DB-backed health proof because staging credentials are not configured.",
    };
  }
  if (!runtimeEnv.databaseProofMode) {
    return {
      ok: true,
      detail:
        "Skipped DB-backed health proof because neither DATABASE_URL nor SUPABASE_ACCESS_TOKEN is configured.",
    };
  }

  try {
    const parsed = JSON.parse(body);
    const database = parsed.database;
    const ok =
      parsed.ok === true &&
      database?.ok === true &&
      database?.mode === "crud_probe" &&
      database?.operation === "insert-read-update-delete";
    return {
      ok,
      detail: ok
        ? "Generated /api/health completed insert-read-update-delete against staging Postgres."
        : `Generated /api/health did not return a CRUD database proof: ${JSON.stringify(database ?? null)}`,
    };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

function verifyNestedDbHealth(body, runtimeEnv, key) {
  if (runtimeEnv.mode !== "staging-supabase" || !runtimeEnv.databaseProofMode) {
    return {
      ok: true,
      detail: `Skipped ${key} proof because staging DB proof credentials are not configured.`,
    };
  }
  try {
    const parsed = JSON.parse(body);
    const proof = parsed.database?.[key];
    return {
      ok: proof?.ok === true,
      detail:
        proof?.ok === true
          ? `${proof.mode ?? key} passed.`
          : `${key} proof did not pass: ${JSON.stringify(proof ?? null)}`,
    };
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

function expectedDbTables(spec) {
  const tables = new Set(["tenants", "tenant_memberships", "audit_events"]);
  if (spec.recipe === "fintech-ledger-app") {
    for (const table of [
      "accounts",
      "ledger_transactions",
      "ledger_entries",
      "reconciliation_runs",
    ]) {
      tables.add(table);
    }
  }
  if (spec.recipe === "saas-agent-platform") {
    for (const table of ["agent_invocations", "agent_observations", "tool_call_audit"]) {
      tables.add(table);
    }
  }
  return [...tables].join(",");
}

function parseHealthBody(body) {
  try {
    const parsed = JSON.parse(body);
    return {
      ok: parsed.ok === true,
      database: parsed.database ?? null,
    };
  } catch {
    return null;
  }
}

function parseSupabaseProjectRef(value) {
  try {
    const url = new URL(value);
    const [ref] = url.hostname.split(".");
    return ref || null;
  } catch {
    return null;
  }
}

async function writeLocalEnv(appRoot, runtimeEnv) {
  const value = [
    ...Object.entries(runtimeEnv.values).map(([key, val]) => `${key}=${val ?? ""}`),
    "",
  ].join("\n");
  await writeFile(join(appRoot, ".env.local"), value, "utf8");
}

async function startRuntime(appRoot, port) {
  const started = Date.now();
  const child = spawn(
    pnpmBin,
    ["exec", "next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: appRoot,
      stdio: ["ignore", "ignore", "ignore"],
      env: { ...process.env, CI: "1" },
      shell: isWindows,
      windowsHide: true,
    },
  );
  const url = `http://127.0.0.1:${port}`;
  const healthUrl = `${url}/api/health`;
  const health = await waitForHttp(healthUrl, 30_000);
  return {
    child,
    url,
    health,
    duration_ms: Date.now() - started,
  };
}

async function stopRuntime(runtime) {
  if (!runtime?.child || runtime.child.killed) return;
  if (isWindows && runtime.child.pid) {
    spawnSync("taskkill", ["/pid", String(runtime.child.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    runtime.child.kill("SIGTERM");
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

async function waitForHttp(url, timeoutMs) {
  const started = Date.now();
  let lastError = "not attempted";
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      const body = await res.text();
      return { ok: res.status >= 200 && res.status < 300, status: res.status, body };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  return { ok: false, error: lastError };
}

async function findFreePort(start) {
  for (let port = start; port < start + 50; port++) {
    if (await canListen(port)) return port;
  }
  throw new Error(`No free local port found from ${start} to ${start + 49}`);
}

function canListen(port) {
  return new Promise((resolvePort) => {
    const server = createServer();
    server.once("error", () => resolvePort(false));
    server.once("listening", () => {
      server.close(() => resolvePort(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

async function hashTree(root) {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_HASH_DIRS.has(entry.name)) await walk(join(dir, entry.name));
        continue;
      }
      if (!entry.isFile()) continue;
      if (IGNORED_HASH_FILES.has(entry.name) || entry.name.endsWith(".log")) continue;
      const full = join(dir, entry.name);
      const rel = relative(root, full).replaceAll("\\", "/");
      if (rel === ".env.local") continue;
      files.push(rel);
    }
  }
  await walk(root);
  files.sort((a, b) => a.localeCompare(b));
  const hash = createHash("sha256");
  for (const rel of files) {
    hash.update(rel);
    hash.update("\0");
    hash.update(await readFile(join(root, rel)));
    hash.update("\0");
  }
  return { hash: `sha256:${hash.digest("hex")}`, files };
}

function countFiles(root, { ignoreDirs, ignoreFiles }) {
  let count = 0;
  function walkSync(dir) {
    for (const entry of readdirSyncSafe(dir)) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) walkSync(full);
      } else if (entry.isFile() && !ignoreFiles.has(entry.name)) {
        count++;
      }
    }
  }
  walkSync(root);
  return count;
}

function readdirSyncSafe(dir) {
  return existsSync(dir) ? readdirSync(dir, { withFileTypes: true }) : [];
}

function renderMarkdown(index) {
  const run = index.runs[0];
  const lines = [];
  lines.push("# Golden Path Proof");
  lines.push("");
  lines.push("**Status:** Phase 5 local golden path passed");
  lines.push("**Owner:** Sage Ideas LLC");
  lines.push(`**Generated:** ${index.generated_at}`);
  lines.push("");
  lines.push("## What This Proves");
  lines.push("");
  lines.push(
    "A public-safe app spec can select resources, forge a real Next.js app, install dependencies, typecheck, build, start locally, pass live verification, and capture evidence.",
  );
  lines.push("");
  lines.push("## Latest Run");
  lines.push("");
  lines.push(`- Run ID: \`${run.run_id}\``);
  lines.push(`- Spec: \`${run.spec.path}\``);
  lines.push(`- Recipe: \`${run.spec.recipe}\``);
  lines.push(`- App: \`${run.spec.app_slug}\``);
  lines.push(`- Local runtime: \`${run.runtime.url}\``);
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
  lines.push("```");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function tail(value, max = 4000) {
  const text = String(value ?? "");
  return text.length > max ? text.slice(-max) : text;
}

function maskLocalPaths(value) {
  if (typeof value === "string") {
    let out = value;
    const replacements = [
      [tmpdir(), "%TEMP%"],
      [process.env.USERPROFILE, "%USERPROFILE%"],
      [ROOT, "<repo>"],
    ];
    for (const [from, to] of replacements) {
      if (from) out = out.split(from).join(to);
    }
    return out;
  }
  if (Array.isArray(value)) return value.map((item) => maskLocalPaths(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, maskLocalPaths(item)]),
    );
  }
  return value;
}

function log(message) {
  console.error(`[golden-path] ${message}`);
}

function stamp(iso) {
  return iso.replaceAll(":", "").replaceAll(".", "").replace("Z", "Z");
}

main().catch((err) => {
  console.error("[golden-path] fatal:", err instanceof Error ? err.stack : err);
  process.exit(1);
});
