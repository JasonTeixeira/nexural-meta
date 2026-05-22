import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { closeTelemetry, logNxCommand, openTelemetry, withTelemetry } from "../src/telemetry.js";
import type { NexuralConfig } from "../src/config.js";

function makeConfig(home: string): NexuralConfig {
  return {
    nexural_home: home,
    warehouses_root: "/tmp/wh",
    apps_root: "/tmp/apps",
    router_url: "stdio://test",
    telemetry_destination: "local",
    llm_provider: "anthropic",
    llm_model: "anthropic:opus",
    log_level: "info",
    editor: "code -w",
    federation: "both",
  };
}

describe("telemetry", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "nx-telemetry-"));
    delete process.env.NEXURAL_NO_TELEMETRY;
  });

  afterEach(() => {
    closeTelemetry();
    rmSync(dir, { recursive: true, force: true });
  });

  it("opens a SQLite db at $NEXURAL_HOME/telemetry.db", () => {
    const db = openTelemetry(makeConfig(dir));
    expect(db).not.toBeNull();
  });

  it("returns null when NEXURAL_NO_TELEMETRY=1", () => {
    process.env.NEXURAL_NO_TELEMETRY = "1";
    expect(openTelemetry(makeConfig(dir))).toBeNull();
  });

  it("returns null when telemetry_destination=none", () => {
    expect(openTelemetry({ ...makeConfig(dir), telemetry_destination: "none" })).toBeNull();
  });

  it("logs nx_command with hashed args", () => {
    openTelemetry(makeConfig(dir));
    logNxCommand({
      command: "ask",
      args: ["what is rag chunking"],
      latencyMs: 142,
      exitCode: 0,
    });
    const verify = new Database(join(dir, "telemetry.db"));
    const row = verify.prepare("SELECT * FROM events LIMIT 1").get() as Record<string, unknown>;
    verify.close();
    expect(row.kind).toBe("nx_command");
    expect(row.command).toBe("ask");
    // Privacy invariant: args_hash is sha256 hex, raw text not stored
    expect(row.args_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(row)).not.toContain("rag chunking");
  });

  it("withTelemetry logs successful runs", async () => {
    const cfg = makeConfig(dir);
    await withTelemetry(cfg, "health", [], async () => "ok");
    const verify = new Database(join(dir, "telemetry.db"));
    const count = verify.prepare("SELECT count(*) c FROM events").get() as { c: number };
    verify.close();
    expect(count.c).toBe(1);
  });

  it("withTelemetry logs failed runs with exit_code=1", async () => {
    const cfg = makeConfig(dir);
    await expect(
      withTelemetry(cfg, "ask", ["x"], async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    const verify = new Database(join(dir, "telemetry.db"));
    const row = verify.prepare("SELECT exit_code FROM events").get() as { exit_code: number };
    verify.close();
    expect(row.exit_code).toBe(1);
  });
});
