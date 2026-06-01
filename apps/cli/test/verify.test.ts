import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { runVerify } from "../src/commands/verify.js";
import type { NexuralConfig } from "../src/config.js";

function cfg(): NexuralConfig {
  return {
    nexural_home: "/tmp/.nexural",
    warehouses_root: "/tmp/wh",
    apps_root: "/tmp/apps",
    router_url: "stdio://test",
    telemetry_destination: "none",
    llm_provider: "anthropic",
    llm_model: "anthropic:opus",
    log_level: "info",
    editor: "true",
    federation: "both",
  };
}

describe("runVerify", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let originalExitCode: number | string | undefined;
  let originalBypassSecret: string | undefined;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    fetchSpy = vi.spyOn(globalThis, "fetch");
    originalExitCode = process.exitCode;
    originalBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  });

  afterEach(() => {
    logSpy.mockRestore();
    errSpy.mockRestore();
    warnSpy.mockRestore();
    fetchSpy.mockRestore();
    process.exitCode = originalExitCode;
    if (originalBypassSecret === undefined) delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
    else process.env.VERCEL_AUTOMATION_BYPASS_SECRET = originalBypassSecret;
  });

  function mockResponse(opts: {
    status?: number;
    headers?: Record<string, string>;
    body?: string;
  }): Response {
    const headers = new Headers(opts.headers ?? {});
    return new Response(opts.body ?? "", { status: opts.status ?? 200, headers });
  }

  it("errors on missing URL", async () => {
    await runVerify(cfg(), "");
    expect(process.exitCode).toBe(1);
  });

  it("errors on invalid URL", async () => {
    await runVerify(cfg(), "not a url");
    expect(process.exitCode).toBe(1);
  });

  it("passes when all headers present + health endpoint returns JSON", async () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse({
        status: 200,
        headers: {
          "strict-transport-security": "max-age=63072000; includeSubDomains",
          "x-content-type-options": "nosniff",
          "referrer-policy": "strict-origin-when-cross-origin",
          "x-frame-options": "DENY",
          "permissions-policy": "camera=()",
        },
      }),
    );
    fetchSpy.mockResolvedValueOnce(
      mockResponse({
        status: 200,
        headers: { "content-type": "application/json" },
        body: `{"ok":true}`,
      }),
    );
    await runVerify(cfg(), "https://example.com");
    expect(process.exitCode).not.toBe(1);
  });

  it("fails when HSTS header missing", async () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse({ status: 200, headers: { "x-content-type-options": "nosniff" } }),
    );
    fetchSpy.mockResolvedValueOnce(
      mockResponse({ status: 200, headers: { "content-type": "application/json" } }),
    );
    await runVerify(cfg(), "https://example.com");
    expect(process.exitCode).toBe(1);
  });

  it("flags X-Powered-By when present", async () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse({
        status: 200,
        headers: {
          "strict-transport-security": "max-age=63072000",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
          "x-frame-options": "DENY",
          "permissions-policy": "camera=()",
          "x-powered-by": "Express",
        },
      }),
    );
    fetchSpy.mockResolvedValueOnce(
      mockResponse({ status: 200, headers: { "content-type": "application/json" } }),
    );
    await runVerify(cfg(), "https://example.com");
    expect(process.exitCode).toBe(1);
  });

  it("respects --skip-health", async () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse({
        status: 200,
        headers: {
          "strict-transport-security": "max-age=63072000",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
          "x-frame-options": "DENY",
          "permissions-policy": "camera=()",
        },
      }),
    );
    await runVerify(cfg(), "https://example.com", { skipHealth: true });
    expect(process.exitCode).not.toBe(1);
    // Only one fetch call (no health)
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("sends Vercel automation bypass header for protected deployment URLs", async () => {
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET = "test-bypass-secret";
    fetchSpy.mockResolvedValueOnce(
      mockResponse({
        status: 200,
        headers: {
          "strict-transport-security": "max-age=63072000",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
          "x-frame-options": "DENY",
          "permissions-policy": "camera=()",
        },
      }),
    );

    await runVerify(cfg(), "https://example-project.vercel.app", { skipHealth: true });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example-project.vercel.app",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-vercel-protection-bypass": "test-bypass-secret",
        }),
      }),
    );
    expect(process.exitCode).not.toBe(1);
  });

  it("warns but continues for non-HTTPS local URLs", async () => {
    fetchSpy.mockResolvedValue(
      mockResponse({
        status: 200,
        headers: {
          "strict-transport-security": "max-age=63072000",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
          "x-frame-options": "DENY",
          "permissions-policy": "camera=()",
          "content-type": "application/json",
        },
      }),
    );
    await runVerify(cfg(), "http://localhost:3000");
    // No warning for localhost
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("handles fetch errors gracefully", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    await runVerify(cfg(), "https://example.com", { skipHealth: true });
    expect(process.exitCode).toBe(1);
  });
});
