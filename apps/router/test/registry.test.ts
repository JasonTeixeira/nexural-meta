import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRegistries } from "../src/registry.js";

describe("loadRegistries", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "nx-router-reg-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns empty when no registry files exist", () => {
    const r = loadRegistries(dir);
    expect(r.endpoints).toHaveLength(0);
    expect(r.federations).toEqual({ factory: 0, lifeops: 0 });
    expect(r.externals).toBe(0);
  });

  it("parses a factory registry", () => {
    writeFileSync(
      join(dir, "registry-factory.yaml"),
      `schema_version: 1
federation: factory
generated_at: 2026-05-22T00:00:00Z
warehouses:
  - name: auth
    tier: internal
    status: active
    repo: https://github.com/JasonTeixeira/auth-warehouse
    last_reviewed: 2026-05-01
    decay_rate_days: 90
    discovered_via: github-topic
  - name: payments
    tier: internal
    status: seeded
    repo: https://github.com/JasonTeixeira/payments-warehouse
    last_reviewed: 2026-05-01
    decay_rate_days: 90
    discovered_via: github-topic
`,
      "utf8",
    );
    const r = loadRegistries(dir);
    expect(r.federations.factory).toBe(2);
    expect(r.endpoints).toHaveLength(2);
    expect(r.endpoints[0]!.federation).toBe("factory");
    expect(r.endpoints[0]!.kind).toBe("warehouse");
  });

  it("parses external MCP registry", () => {
    writeFileSync(
      join(dir, "registry-external-mcp.yaml"),
      `schema_version: 1
endpoints:
  - schema_version: 1
    name: ai-warehouse
    type: external
    transport: stdio
    command:
      - ai-warehouse
      - mcp
    tool_prefix: ai-warehouse
    schema_compatibility: external
    federations:
      - factory
    quality_attestation:
      source: nexural-qa-os
      score: 100
      verified_at: 2026-05-21
      next_review: 2026-08-21
`,
      "utf8",
    );
    const r = loadRegistries(dir);
    expect(r.externals).toBe(1);
    expect(r.endpoints[0]!.kind).toBe("external");
    if (r.endpoints[0]!.kind === "external") {
      expect(r.endpoints[0]!.command).toEqual(["ai-warehouse", "mcp"]);
    }
  });

  it("loads all three registries together", () => {
    writeFileSync(
      join(dir, "registry-factory.yaml"),
      `warehouses:
  - name: auth
    tier: internal
    status: active
    repo: https://github.com/x/auth-warehouse
    last_reviewed: 2026-05-01
    decay_rate_days: 90
    discovered_via: github-topic
`,
      "utf8",
    );
    writeFileSync(
      join(dir, "registry-lifeops.yaml"),
      `warehouses:
  - name: decision
    tier: private-encrypted
    status: active
    repo: https://github.com/x/decision-warehouse
    last_reviewed: 2026-05-01
    decay_rate_days: 365
    discovered_via: github-topic
`,
      "utf8",
    );
    writeFileSync(
      join(dir, "registry-external-mcp.yaml"),
      `schema_version: 1
endpoints:
  - schema_version: 1
    name: ai-warehouse
    type: external
    transport: stdio
    command:
      - ai-warehouse
      - mcp
    tool_prefix: ai-warehouse
    schema_compatibility: external
    federations:
      - factory
    quality_attestation:
      source: nexural-qa-os
      score: 100
      verified_at: 2026-05-21
      next_review: 2026-08-21
`,
      "utf8",
    );
    const r = loadRegistries(dir);
    expect(r.endpoints).toHaveLength(3);
    expect(r.federations).toEqual({ factory: 1, lifeops: 1 });
    expect(r.externals).toBe(1);
  });
});
