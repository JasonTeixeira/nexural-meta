import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runNew } from "../src/commands/new.js";
import type { NexuralConfig } from "../src/config.js";

function makeConfig(root: string): NexuralConfig {
  return {
    nexural_home: "/tmp/.nexural",
    warehouses_root: root,
    apps_root: "/tmp/apps",
    router_url: "stdio://test",
    telemetry_destination: "none",
    llm_provider: "anthropic",
    llm_model: "anthropic:opus",
    log_level: "info",
    editor: "true", // command that does nothing
    federation: "both",
  };
}

describe("runNew", () => {
  let root: string;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "nx-new-"));
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    consoleErrorSpy.mockRestore();
    process.exitCode = 0;
  });

  it("scaffolds a valid public warehouse", async () => {
    await runNew(makeConfig(root), "test-domain", { federation: "factory", tier: "public" });
    const target = join(root, "test-domain-warehouse");
    expect(existsSync(target)).toBe(true);
    expect(existsSync(join(target, "meta.yaml"))).toBe(true);
    expect(existsSync(join(target, "README.md"))).toBe(true);
    expect(existsSync(join(target, "LICENSE"))).toBe(true);
    expect(existsSync(join(target, "content"))).toBe(true);
    expect(existsSync(join(target, ".github/workflows"))).toBe(true);
    const meta = readFileSync(join(target, "meta.yaml"), "utf8");
    expect(meta).toContain("name: test-domain");
    expect(meta).toContain("federation: factory");
    expect(meta).toContain("tier: public");
  });

  it("strips trailing -warehouse from input", async () => {
    await runNew(makeConfig(root), "auth-warehouse", { federation: "factory", tier: "public" });
    expect(existsSync(join(root, "auth-warehouse"))).toBe(true);
    expect(existsSync(join(root, "auth-warehouse-warehouse"))).toBe(false);
  });

  it("rejects non-kebab name", async () => {
    await runNew(makeConfig(root), "BadName", { federation: "factory", tier: "public" });
    expect(process.exitCode).toBe(1);
  });

  it("rejects reserved name", async () => {
    await runNew(makeConfig(root), "meta", { federation: "factory", tier: "public" });
    expect(process.exitCode).toBe(1);
  });

  it("rejects public-tier in lifeops federation", async () => {
    await runNew(makeConfig(root), "ok", { federation: "lifeops", tier: "public" });
    expect(process.exitCode).toBe(1);
  });

  it("refuses to overwrite existing directory", async () => {
    const opts = { federation: "factory" as const, tier: "public" as const };
    await runNew(makeConfig(root), "test", opts);
    await runNew(makeConfig(root), "test", opts);
    expect(process.exitCode).toBe(1);
  });

  it("emits private-encrypted tier config when requested", async () => {
    await runNew(makeConfig(root), "secret-stuff", {
      federation: "lifeops",
      tier: "private-encrypted",
    });
    const meta = readFileSync(join(root, "secret-stuff-warehouse", "meta.yaml"), "utf8");
    expect(meta).toContain("encryption: age+sops");
    expect(meta).toContain("filename_strategy: ulid");
  });

  it("dry-run does not create files", async () => {
    await runNew(makeConfig(root), "dryrun-test", {
      federation: "factory",
      tier: "public",
      dryRun: true,
    });
    expect(existsSync(join(root, "dryrun-test-warehouse"))).toBe(false);
  });
});
