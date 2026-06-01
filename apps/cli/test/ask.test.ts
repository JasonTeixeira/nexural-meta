import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runAsk } from "../src/commands/ask.js";
import type { NexuralConfig } from "../src/config.js";

function cfg(metaRoot = "/tmp/meta-root-that-does-not-exist"): NexuralConfig {
  return {
    nexural_home: "/tmp/.nexural",
    meta_root: metaRoot,
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

let logSpy: ReturnType<typeof vi.spyOn>;
let errSpy: ReturnType<typeof vi.spyOn>;
let originalCwd: string;
let originalExitCode: number | string | undefined;

beforeEach(() => {
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  originalCwd = process.cwd();
  originalExitCode = process.exitCode;
});

afterEach(() => {
  logSpy.mockRestore();
  errSpy.mockRestore();
  process.chdir(originalCwd);
  process.exitCode = originalExitCode;
});

function makeFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "nx-ask-"));
  mkdirSync(join(root, "docs/adr"), { recursive: true });
  mkdirSync(join(root, "warehouses/auth/documents"), { recursive: true });
  mkdirSync(join(root, "recipes/saas-multitenant-baseline"), { recursive: true });

  writeFileSync(
    join(root, "docs/adr/0007-cost.md"),
    "# Cost guardrails\n\nLLM cost discipline. Streaming abort mandatory.",
  );
  writeFileSync(
    join(root, "warehouses/auth/documents/supabase-ssr.md"),
    "# Supabase SSR\n\nCookie-based session management.",
  );
  writeFileSync(
    join(root, "recipes/saas-multitenant-baseline/THREAT_MODEL.md"),
    "# Threat model\n\nTenant isolation via RLS.",
  );
  return root;
}

describe("runAsk", () => {
  it("errors on empty query", async () => {
    await runAsk(cfg(), "");
    expect(process.exitCode).toBe(1);
  });

  it("errors when neither cwd nor meta_root is a federation root", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "nx-ask-empty-"));
    process.chdir(tmp);
    try {
      await runAsk(cfg(), "anything");
      expect(process.exitCode).toBe(1);
      expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/cannot find a federation root/));
    } finally {
      process.chdir(originalCwd);
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("returns hits over a real fixture corpus", async () => {
    const root = makeFixture();
    process.chdir(root);
    try {
      await runAsk(cfg(), "cost streaming");
      // Should have logged at least one result + the source line
      const output = logSpy.mock.calls.map((c) => String(c[0])).join("\n");
      expect(output).toMatch(/Cost guardrails/);
      expect(output).toMatch(/adr:/);
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("--json emits machine-readable output", async () => {
    const root = makeFixture();
    process.chdir(root);
    try {
      await runAsk(cfg(), "RLS tenant", { json: true });
      const output = logSpy.mock.calls.map((c) => String(c[0])).join("\n");
      const parsed = JSON.parse(output);
      expect(parsed.query).toBe("RLS tenant");
      expect(parsed.indexed).toBeGreaterThan(0);
      expect(Array.isArray(parsed.hits)).toBe(true);
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("--kinds filters by source kind", async () => {
    const root = makeFixture();
    process.chdir(root);
    try {
      await runAsk(cfg(), "cookie tenant cost", { json: true, kinds: "adr" });
      const output = logSpy.mock.calls.map((c) => String(c[0])).join("\n");
      const parsed = JSON.parse(output);
      expect(parsed.hits.every((h: { kind: string }) => h.kind === "adr")).toBe(true);
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("--kinds with unknown value errors", async () => {
    const root = makeFixture();
    process.chdir(root);
    try {
      await runAsk(cfg(), "test", { kinds: "not-a-real-kind" });
      expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/unknown kind/));
    } finally {
      process.chdir(originalCwd);
      rmSync(root, { recursive: true, force: true });
    }
  });
});
