/**
 * `nx verify <url>` — smoke runner for a deployed app.
 *
 * Closes ADR-0011 gate 5 (qa-os clean against the deployed app) for the
 * vertical slice. Not a replacement for a full security audit — this is
 * the floor that every shipped recipe must clear.
 *
 * Checks:
 *   1. HTTP 200 on `/` (or follow-redirect to a 2xx)
 *   2. Required security headers present + correctly shaped
 *   3. /api/health responds 200 with JSON body
 *   4. `X-Powered-By` header absent (next.config.mjs.poweredByHeader = false)
 *
 * Exit code 0 = pass; 1 = any check failed.
 */

import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { NexuralConfig } from "../config.js";

export interface VerifyOptions {
  /** Override default checks (skip ones that don't apply to your recipe). */
  readonly skip?: ReadonlyArray<CheckId>;
  /** Write a JSON report to evidence/gate-5/<slug>/report.json. */
  readonly evidenceSlug?: string;
  /** Request timeout in ms (default 10s). */
  readonly timeoutMs?: number;
  /** Skip the /api/health check entirely (some recipes don't expose it). */
  readonly skipHealth?: boolean;
}

type CheckId =
  | "root_reachable"
  | "hsts"
  | "x_content_type_options"
  | "referrer_policy"
  | "x_frame_options"
  | "permissions_policy"
  | "no_powered_by"
  | "health_endpoint";

interface CheckResult {
  readonly id: CheckId;
  readonly passed: boolean;
  readonly detail: string;
}

export async function runVerify(
  _config: NexuralConfig,
  url: string,
  opts: VerifyOptions = {},
): Promise<void> {
  if (!url) {
    console.error("Usage: nx verify <url> [--evidence-slug <slug>] [--skip-health]");
    process.exitCode = 1;
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    console.error(`✖ not a valid URL: ${url}`);
    process.exitCode = 1;
    return;
  }
  if (
    parsed.protocol !== "https:" &&
    parsed.hostname !== "localhost" &&
    parsed.hostname !== "127.0.0.1"
  ) {
    console.warn(`⚠ verifying non-HTTPS URL: ${url} — most checks will fail in production`);
  }

  const skip = new Set<CheckId>(opts.skip ?? []);
  if (opts.skipHealth) skip.add("health_endpoint");

  console.log(`🔍 Verifying ${url}`);
  const results: CheckResult[] = [];

  const rootResponse = await tryFetch(url, opts.timeoutMs ?? 10_000);
  if (!rootResponse.ok) {
    results.push({
      id: "root_reachable",
      passed: false,
      detail: `fetch failed: ${rootResponse.error}`,
    });
  } else {
    results.push({
      id: "root_reachable",
      passed: rootResponse.status >= 200 && rootResponse.status < 400,
      detail: `HTTP ${rootResponse.status}`,
    });

    if (!skip.has("hsts")) {
      results.push(checkHeader(rootResponse, "hsts", "strict-transport-security", /max-age=\d+/));
    }
    if (!skip.has("x_content_type_options")) {
      results.push(
        checkHeader(rootResponse, "x_content_type_options", "x-content-type-options", /^nosniff$/i),
      );
    }
    if (!skip.has("referrer_policy")) {
      results.push(checkHeader(rootResponse, "referrer_policy", "referrer-policy", /\S+/));
    }
    if (!skip.has("x_frame_options")) {
      results.push(
        checkHeader(rootResponse, "x_frame_options", "x-frame-options", /^(deny|sameorigin)$/i),
      );
    }
    if (!skip.has("permissions_policy")) {
      results.push(checkHeader(rootResponse, "permissions_policy", "permissions-policy", /\S+/));
    }
    if (!skip.has("no_powered_by")) {
      const xpb = rootResponse.headers["x-powered-by"];
      results.push({
        id: "no_powered_by",
        passed: xpb === undefined,
        detail:
          xpb === undefined ? "absent (correct)" : `present: "${xpb}" — set poweredByHeader: false`,
      });
    }
  }

  if (!skip.has("health_endpoint")) {
    const healthUrl = new URL("/api/health", parsed).toString();
    const healthResponse = await tryFetch(healthUrl, opts.timeoutMs ?? 10_000);
    if (!healthResponse.ok) {
      results.push({
        id: "health_endpoint",
        passed: false,
        detail: `fetch failed: ${healthResponse.error}`,
      });
    } else {
      const passed =
        healthResponse.status === 200 &&
        /application\/json/i.test(healthResponse.headers["content-type"] ?? "");
      results.push({
        id: "health_endpoint",
        passed,
        detail: `HTTP ${healthResponse.status}; content-type=${healthResponse.headers["content-type"] ?? "(missing)"}`,
      });
    }
  }

  // Report
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.log();
  for (const r of results) {
    const icon = r.passed ? "✓" : "✖";
    console.log(`  ${icon} ${r.id}: ${r.detail}`);
  }
  console.log();
  console.log(`${failed === 0 ? "✅" : "✖"} ${passed}/${results.length} checks passed`);

  if (opts.evidenceSlug !== undefined) {
    const dir = resolve(process.cwd(), "evidence/gate-5", opts.evidenceSlug);
    await mkdir(dir, { recursive: true });
    const reportPath = join(dir, "report.json");
    await writeFile(
      reportPath,
      JSON.stringify(
        {
          schema_version: 1,
          ran_at: new Date().toISOString(),
          url,
          results,
          summary: { total: results.length, passed, failed },
        },
        null,
        2,
      ),
    );
    console.log(`   evidence: ${reportPath}`);
  }

  if (failed > 0) process.exitCode = 1;
}

// ── helpers ────────────────────────────────────────────────────────────────

interface FetchOk {
  readonly ok: true;
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string;
}
interface FetchErr {
  readonly ok: false;
  readonly error: string;
}

async function tryFetch(url: string, timeoutMs: number): Promise<FetchOk | FetchErr> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: buildFetchHeaders(url),
    });
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    const body = await res.text();
    if ((res.status === 401 || res.status === 403) && shouldTryVercelCurl(url)) {
      return tryVercelCurl(url, timeoutMs);
    }
    return { ok: true, status: res.status, headers, body };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  } finally {
    clearTimeout(timer);
  }
}

function buildFetchHeaders(url: string): Record<string, string> {
  const headers: Record<string, string> = { "user-agent": "nx-verify/0.1.0" };
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass && isVercelUrl(url)) {
    headers["x-vercel-protection-bypass"] = bypass;
  }
  return headers;
}

function shouldTryVercelCurl(url: string): boolean {
  return Boolean(process.env.VERCEL_TOKEN) && isVercelUrl(url);
}

function isVercelUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "vercel.app" || parsed.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function tryVercelCurl(url: string, timeoutMs: number): FetchOk | FetchErr {
  const parsed = new URL(url);
  const deployment = `${parsed.protocol}//${parsed.host}`;
  const path = `${parsed.pathname || "/"}${parsed.search}`;
  const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = ["--yes", "vercel@latest", "curl", path, "--deployment", deployment];
  args.push(
    "--",
    "-i",
    "-L",
    "-sS",
    "--max-time",
    String(Math.max(5, Math.ceil(timeoutMs / 1000))),
  );

  const result = spawnSync(npxBin, args, {
    shell: process.platform === "win32",
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: timeoutMs + 120_000,
    env: { ...process.env, CI: "1" },
  });
  if ((result.status ?? 1) !== 0) {
    return {
      ok: false,
      error: `vercel curl failed with exit ${result.status ?? 1}: ${tail(result.stderr || result.stdout)}`,
    };
  }
  return parseRawHttpResponse(result.stdout);
}

function parseRawHttpResponse(raw: string): FetchOk | FetchErr {
  const parts = String(raw ?? "").split(/\r?\n\r?\n/);
  let headerIndex = -1;
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (/^HTTP\/\d(?:\.\d)?\s+\d{3}/i.test(parts[i] ?? "")) {
      headerIndex = i;
      break;
    }
  }
  if (headerIndex < 0) return { ok: false, error: "vercel curl output did not include headers" };

  const headerLines = (parts[headerIndex] ?? "").split(/\r?\n/);
  const statusMatch = headerLines[0]?.match(/^HTTP\/\d(?:\.\d)?\s+(\d{3})/i);
  const status = statusMatch ? Number(statusMatch[1]) : NaN;
  if (!Number.isFinite(status)) {
    return { ok: false, error: "vercel curl output did not include a status code" };
  }

  const headers: Record<string, string> = {};
  for (const line of headerLines.slice(1)) {
    const index = line.indexOf(":");
    if (index <= 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    headers[key] = headers[key] ? `${headers[key]}, ${value}` : value;
  }
  return {
    ok: true,
    status,
    headers,
    body: parts.slice(headerIndex + 1).join("\n\n"),
  };
}

function tail(value: string): string {
  return String(value ?? "")
    .trim()
    .split(/\r?\n/)
    .slice(-8)
    .join("\n");
}

function checkHeader(res: FetchOk, id: CheckId, headerName: string, pattern: RegExp): CheckResult {
  const value = res.headers[headerName];
  if (value === undefined) {
    return { id, passed: false, detail: `missing: ${headerName}` };
  }
  if (!pattern.test(value)) {
    return {
      id,
      passed: false,
      detail: `${headerName}="${value}" does not match ${pattern.source}`,
    };
  }
  return { id, passed: true, detail: `${headerName}="${value}"` };
}
