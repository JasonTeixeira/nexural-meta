#!/usr/bin/env node
/**
 * Deploy the latest golden-path app to Vercel and attach verified proof.
 *
 * Required env:
 * - VERCEL_TOKEN
 * - VERCEL_TEAM_ID
 * - VERCEL_PROJECT_ID
 * - VERCEL_PROOF_ALIAS (optional public hostname to verify instead of protected deployment URL)
 *
 * Optional staging runtime env is forwarded when present:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY
 * - RESEND_API_KEY
 * - NEXT_PUBLIC_SENTRY_DSN
 * - NEXT_PUBLIC_POSTHOG_KEY
 * - NEXT_PUBLIC_POSTHOG_HOST
 * - HEALTH_DB_CRUD_PROOF
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PRIVATE_LATEST = join(ROOT, ".nexural", "private", "golden-path-latest.internal.json");

const isWindows = process.platform === "win32";
const pnpmBin = isWindows ? "pnpm.cmd" : "pnpm";
const npxBin = isWindows ? "npx.cmd" : "npx";

const APP_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_SENTRY_DSN",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
  "HEALTH_DB_CRUD_PROOF",
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_ROOT_DOMAIN",
  "NEXT_PUBLIC_TENANT_ROUTING",
  "NEXT_PUBLIC_DEFAULT_LOCALE",
];

function main() {
  const args = parseArgs(process.argv.slice(2));
  const missingProject = ["VERCEL_TEAM_ID", "VERCEL_PROJECT_ID"].filter((key) => !process.env[key]);
  const missingToken = !process.env.VERCEL_TOKEN && process.env.CI === "true";
  const missing = [...missingProject, ...(missingToken ? ["VERCEL_TOKEN"] : [])];
  if (missing.length > 0) {
    const message = `missing required Vercel env: ${missing.join(", ")}`;
    if (args.allowMissing) {
      console.error(`[golden-path-vercel] skipped: ${message}`);
      return;
    }
    throw new Error(message);
  }

  const latest = readJson(PRIVATE_LATEST);
  const appRoot = latest.generated_app?.local_path;
  if (!appRoot || !existsSync(appRoot)) {
    throw new Error(
      `Latest generated app path is unavailable. Run \`pnpm golden:path\` first. Path: ${appRoot ?? "missing"}`,
    );
  }

  ensureVercelProject(appRoot);
  ensureStandaloneLockfile(appRoot);

  const deploy = deployToVercel(appRoot, latest);
  const attachArgs = [join("scripts", "attach-golden-path-deploy.mjs"), "--url", deploy.url];
  if (deploy.id) attachArgs.push("--deployment-id", deploy.id);
  if (deploy.inspectorUrl) attachArgs.push("--inspector-url", deploy.inspectorUrl);

  const attach = spawnSync(process.execPath, attachArgs, {
    cwd: ROOT,
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CI: "1" },
  });
  if (attach.stdout) process.stderr.write(attach.stdout);
  if (attach.stderr) process.stderr.write(attach.stderr);
  if ((attach.status ?? 1) !== 0) {
    throw new Error(`attach deploy evidence failed with exit ${attach.status ?? 1}`);
  }

  console.error(`[golden-path-vercel] deployed and verified ${deploy.url}`);
}

function parseArgs(argv) {
  const args = { allowMissing: false };
  for (const arg of argv) {
    if (arg === "--allow-missing") args.allowMissing = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node scripts/deploy-golden-path-vercel.mjs [--allow-missing]`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function ensureVercelProject(appRoot) {
  const projectDir = join(appRoot, ".vercel");
  mkdirSync(projectDir, { recursive: true });
  writeJson(join(projectDir, "project.json"), {
    orgId: process.env.VERCEL_TEAM_ID,
    projectId: process.env.VERCEL_PROJECT_ID,
  });
}

function ensureStandaloneLockfile(appRoot) {
  if (existsSync(join(appRoot, "pnpm-lock.yaml"))) return;
  const result = spawnSync(
    pnpmBin,
    ["install", "--ignore-workspace", "--ignore-scripts", "--lockfile-only"],
    {
      cwd: appRoot,
      shell: isWindows,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, CI: "1" },
    },
  );
  if ((result.status ?? 1) !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error("failed to generate standalone pnpm-lock.yaml");
  }
}

function deployToVercel(appRoot, latest) {
  const runtimeEnv = buildRuntimeEnv(latest, appRoot);
  const args = [
    "--yes",
    "vercel@latest",
    "deploy",
    appRoot,
    "--yes",
    "--force",
    "--target",
    "production",
    "--format",
    "json",
    "--meta",
    `golden_path_run_id=${latest.run_id}`,
    "--meta",
    `golden_path_hash=${latest.generated_app.tree_hash}`,
  ];
  if (process.env.VERCEL_TOKEN) {
    args.push("--token", process.env.VERCEL_TOKEN);
  }
  for (const [key, value] of Object.entries(runtimeEnv)) {
    args.push("--env", shellArgValue(`${key}=${value}`));
    args.push("--build-env", shellArgValue(`${key}=${value}`));
  }

  const result = spawnSync(npxBin, args, {
    cwd: ROOT,
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, VERCEL_ORG_ID: process.env.VERCEL_TEAM_ID, CI: "1" },
    timeout: 600_000,
  });
  if ((result.status ?? 1) !== 0) {
    process.stderr.write(redact(result.stdout ?? ""));
    process.stderr.write(redact(result.stderr ?? ""));
    throw new Error(`vercel deploy failed with exit ${result.status ?? 1}`);
  }

  const parsed = parseVercelJson(result.stdout);
  const deploymentUrl = normalizeUrl(parsed.url ?? parsed.deployment?.url);
  if (!deploymentUrl) {
    process.stderr.write(redact(result.stdout ?? ""));
    throw new Error("vercel deploy output did not include a deployment URL");
  }
  const aliasUrl = process.env.VERCEL_PROOF_ALIAS
    ? setAlias(deploymentUrl, process.env.VERCEL_PROOF_ALIAS)
    : normalizeUrl(parsed.alias?.[0]);
  return {
    url: aliasUrl || deploymentUrl,
    id: parsed.id ?? parsed.deployment?.id ?? parsed.uid ?? "",
    inspectorUrl: parsed.inspectorUrl ?? parsed.inspector_url ?? "",
  };
}

function setAlias(deploymentUrl, alias) {
  const target = normalizeHostname(alias);
  const args = ["--yes", "vercel@latest", "alias", "set", deploymentUrl, target];
  if (process.env.VERCEL_TOKEN) args.push("--token", process.env.VERCEL_TOKEN);
  const result = spawnSync(npxBin, args, {
    cwd: ROOT,
    shell: isWindows,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, VERCEL_ORG_ID: process.env.VERCEL_TEAM_ID, CI: "1" },
    timeout: 120_000,
  });
  if ((result.status ?? 1) !== 0) {
    process.stderr.write(redact(result.stdout ?? ""));
    process.stderr.write(redact(result.stderr ?? ""));
    throw new Error(`vercel alias failed with exit ${result.status ?? 1}`);
  }
  return normalizeUrl(target);
}

function buildRuntimeEnv(latest, appRoot) {
  const fileEnv = parseEnvFile(join(appRoot, ".env.local"));
  const env = {};
  for (const key of APP_ENV_KEYS) {
    if (process.env[key]) env[key] = process.env[key];
    else if (fileEnv[key]) env[key] = fileEnv[key];
  }
  env.NEXT_PUBLIC_APP_NAME ??= latest.spec?.title ?? "Client Intake Portal";
  env.NEXT_PUBLIC_ROOT_DOMAIN ??= "sageideas.dev";
  env.NEXT_PUBLIC_TENANT_ROUTING ??= "path";
  env.NEXT_PUBLIC_DEFAULT_LOCALE ??= "en";
  env.HEALTH_DB_CRUD_PROOF ??= process.env.DATABASE_URL ? "1" : "0";
  return env;
}

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const entries = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index <= 0) continue;
    entries[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return entries;
}

function parseVercelJson(stdout) {
  const trimmed = String(stdout ?? "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(trimmed.slice(first, last + 1));
    throw new Error("Unable to parse Vercel JSON output");
  }
}

function normalizeUrl(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (!text) return "";
  return text.startsWith("https://") ? text : `https://${text}`;
}

function normalizeHostname(value) {
  return String(value ?? "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function shellArgValue(value) {
  const text = String(value);
  if (!isWindows || !/\s/.test(text)) return text;
  return `"${text.replaceAll('"', '\\"')}"`;
}

function redact(value) {
  let out = String(value ?? "");
  for (const key of [
    "VERCEL_TOKEN",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ]) {
    const secret = process.env[key];
    if (secret) out = out.split(secret).join(`<${key}>`);
  }
  return out;
}

function readJson(path) {
  if (!existsSync(path)) throw new Error(`Missing required input: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

main();
