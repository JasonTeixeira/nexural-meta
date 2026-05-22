import { describe, expect, it } from "vitest";
import { McpToolRequest, McpToolResponse } from "../src/mcp.js";

describe("McpToolRequest", () => {
  const valid = {
    schema_version: 1 as const,
    request_id: "01H8XK7Q3F9V7M5N0E3B4P2J6T",
    caller: { kind: "nx-cli" as const },
    tool: "search",
    args: { query: "rag chunking" },
    timeout_ms: 5000,
  };

  it("accepts a valid request", () => expect(() => McpToolRequest.parse(valid)).not.toThrow());

  it("applies default timeout_ms when omitted", () => {
    const { timeout_ms: _, ...rest } = valid;
    expect(McpToolRequest.parse(rest).timeout_ms).toBe(5000);
  });

  it("rejects unknown caller kind", () =>
    expect(() => McpToolRequest.parse({ ...valid, caller: { kind: "robot" } })).toThrow());

  it("rejects timeout > 30s", () =>
    expect(() => McpToolRequest.parse({ ...valid, timeout_ms: 30001 })).toThrow());

  it("rejects timeout = 0", () =>
    expect(() => McpToolRequest.parse({ ...valid, timeout_ms: 0 })).toThrow());

  it("rejects non-ULID request_id", () =>
    expect(() => McpToolRequest.parse({ ...valid, request_id: "not-a-ulid" })).toThrow());

  it("rejects non-kebab tool name", () =>
    expect(() => McpToolRequest.parse({ ...valid, tool: "SearchTool" })).toThrow());

  it("rejects extra keys", () =>
    expect(() => McpToolRequest.parse({ ...valid, secret_flag: true })).toThrow());
});

describe("McpToolResponse", () => {
  const validOk = {
    schema_version: 1 as const,
    request_id: "01H8XK7Q3F9V7M5N0E3B4P2J6T",
    warehouse: "auth",
    tool: "search",
    ok: true,
    latency_ms: 142,
    data: { results: [] },
    warnings: [],
    citations: [],
  };

  it("accepts a valid ok response", () =>
    expect(() => McpToolResponse.parse(validOk)).not.toThrow());

  it("rejects non-ok response without error (cross-field refinement)", () =>
    expect(() => McpToolResponse.parse({ ...validOk, ok: false })).toThrow());

  it("accepts non-ok response WITH error", () =>
    expect(() =>
      McpToolResponse.parse({
        ...validOk,
        ok: false,
        error: { code: "mcp_timeout", message: "timeout", retryable: true },
      }),
    ).not.toThrow());

  it("rejects unknown warning code", () =>
    expect(() =>
      McpToolResponse.parse({
        ...validOk,
        warnings: [{ code: "unknown", message: "x" }],
      }),
    ).toThrow());

  it("accepts known warning code (citation_stripped per ADR-0008)", () =>
    expect(() =>
      McpToolResponse.parse({
        ...validOk,
        warnings: [{ code: "citation_stripped", message: "Hallucinated" }],
      }),
    ).not.toThrow());

  it("rejects negative latency", () =>
    expect(() => McpToolResponse.parse({ ...validOk, latency_ms: -1 })).toThrow());

  it("accepts citations array", () =>
    expect(() =>
      McpToolResponse.parse({
        ...validOk,
        citations: [{ warehouse: "auth", id: "oauth-pkce-pattern" }],
      }),
    ).not.toThrow());

  it("rejects extra keys on citation", () =>
    expect(() =>
      McpToolResponse.parse({
        ...validOk,
        citations: [{ warehouse: "auth", id: "x", extra: "field" }],
      }),
    ).toThrow());
});
