import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runForge } from "../src/commands/forge.js";
import type { NexuralConfig } from "../src/config.js";

function makeConfig(): NexuralConfig {
  return {
    nexural_home: "/tmp/.nexural",
    warehouses_root: "/tmp/warehouses",
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

/**
 * forge.test runs inside the monorepo, where the real recipe + its templates
 * already exist on disk. We exercise the command surface for: bad slug,
 * missing recipe, and dry-run-against-real-baseline success path.
 *
 * The actual emit/render correctness lives in @nexural/forge-emit's tests.
 * Full disk write + git init + secret resolution are exercised by the
 * Phase 6.5 vertical slice (task #49), not unit tests.
 */
describe("runForge", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;
  let originalExitCode: number | string | undefined;
  let originalCwd: string;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    originalExitCode = process.exitCode;
    originalCwd = process.cwd();
  });

  afterEach(() => {
    logSpy.mockRestore();
    errSpy.mockRestore();
    process.exitCode = originalExitCode;
    process.chdir(originalCwd);
  });

  it("rejects malformed slugs", async () => {
    await runForge(makeConfig(), "saas-multitenant-baseline", "Bad_Slug!");
    expect(process.exitCode).toBe(1);
    expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/slug/i));
  });

  it("errors when recipe is missing", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "forge-cwd-"));
    process.chdir(tmp);
    try {
      await runForge(makeConfig(), "ghost-recipe", "some-app", { dryRun: true });
      expect(process.exitCode).toBe(1);
      expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/recipe not found/));
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("prints usage on missing arguments", async () => {
    await runForge(makeConfig(), "", "");
    expect(process.exitCode).toBe(1);
    expect(errSpy).toHaveBeenCalledWith(expect.stringMatching(/Usage:/));
  });
});
