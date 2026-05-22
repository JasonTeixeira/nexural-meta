import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { loadConfig, NexuralConfig, renderDefaultConfig } from "../src/config.js";

describe("loadConfig", () => {
  const origEnv = { ...process.env };

  beforeEach(() => {
    for (const k of Object.keys(process.env)) {
      if (k.startsWith("NEXURAL_")) delete process.env[k];
    }
  });

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it("returns defaults when no env / file present", () => {
    process.env.NEXURAL_HOME = "/nonexistent-config-path-for-test";
    const cfg = loadConfig();
    expect(cfg.telemetry_destination).toBe("local");
    expect(cfg.llm_provider).toBe("anthropic");
    expect(cfg.federation).toBe("both");
  });

  it("env vars override defaults", () => {
    process.env.NEXURAL_HOME = "/nonexistent";
    process.env.NEXURAL_LLM_PROVIDER = "openai";
    process.env.NEXURAL_FEDERATION = "factory";
    const cfg = loadConfig();
    expect(cfg.llm_provider).toBe("openai");
    expect(cfg.federation).toBe("factory");
  });

  it("rejects unknown llm provider", () => {
    process.env.NEXURAL_HOME = "/nonexistent";
    process.env.NEXURAL_LLM_PROVIDER = "bedrock";
    expect(() => loadConfig()).toThrow();
  });

  it("rejects unknown log level", () => {
    process.env.NEXURAL_HOME = "/nonexistent";
    process.env.NEXURAL_LOG_LEVEL = "fatal";
    expect(() => loadConfig()).toThrow();
  });
});

describe("renderDefaultConfig", () => {
  it("renders TOML with comment header", () => {
    const out = renderDefaultConfig();
    expect(out).toMatch(/^#.*config\.toml/);
    expect(out).toContain('llm_provider = "anthropic"');
    expect(out).toContain('federation = "both"');
  });
});

describe("NexuralConfig schema", () => {
  it("rejects extra keys (strict mode)", () => {
    expect(() => NexuralConfig.parse({ unknown_field: 1 })).toThrow();
  });

  it("accepts a minimal valid config", () => {
    expect(() => NexuralConfig.parse({})).not.toThrow();
  });
});
