import { describe, expect, it } from "vitest";
import { ExternalMcpEndpoint, ExternalMcpRegistry } from "../src/external-mcp.js";

describe("ExternalMcpEndpoint", () => {
  const validStdio = {
    schema_version: 1 as const,
    name: "ai-warehouse",
    type: "external" as const,
    transport: "stdio" as const,
    command: ["ai-warehouse", "mcp"],
    tool_prefix: "ai-warehouse",
    schema_compatibility: "external" as const,
    federations: ["factory" as const],
    quality_attestation: {
      source: "nexural-qa-os",
      score: 100,
      verified_at: "2026-05-21",
      next_review: "2026-08-21",
    },
  };

  it("accepts valid stdio endpoint", () =>
    expect(() => ExternalMcpEndpoint.parse(validStdio)).not.toThrow());

  it("accepts valid http endpoint", () =>
    expect(() =>
      ExternalMcpEndpoint.parse({
        ...validStdio,
        transport: "http",
        command: undefined,
        url: "https://mcp.example.com/sse",
      }),
    ).not.toThrow());

  it("rejects stdio without command", () =>
    expect(() => ExternalMcpEndpoint.parse({ ...validStdio, command: undefined })).toThrow());

  it("rejects stdio with empty command array", () =>
    expect(() => ExternalMcpEndpoint.parse({ ...validStdio, command: [] })).toThrow());

  it("rejects http without url", () =>
    expect(() =>
      ExternalMcpEndpoint.parse({
        ...validStdio,
        transport: "http",
        command: undefined,
      }),
    ).toThrow());

  it("rejects empty federations", () =>
    expect(() => ExternalMcpEndpoint.parse({ ...validStdio, federations: [] })).toThrow());

  it("rejects unknown federation value", () =>
    expect(() => ExternalMcpEndpoint.parse({ ...validStdio, federations: ["apps"] })).toThrow());

  it("rejects score > 100", () =>
    expect(() =>
      ExternalMcpEndpoint.parse({
        ...validStdio,
        quality_attestation: {
          ...validStdio.quality_attestation,
          score: 101,
        },
      }),
    ).toThrow());
});

describe("ExternalMcpRegistry", () => {
  it("accepts empty registry", () =>
    expect(() => ExternalMcpRegistry.parse({ schema_version: 1, endpoints: [] })).not.toThrow());

  it("rejects extra keys", () =>
    expect(() =>
      ExternalMcpRegistry.parse({
        schema_version: 1,
        endpoints: [],
        extra: 1,
      }),
    ).toThrow());
});
