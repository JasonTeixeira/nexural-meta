import { describe, expect, it, vi } from "vitest";
import { buildHandler } from "../src/middleware.js";

const VALID_ULID = "01H8XK7Q3F9V7M5N0E3B4P2J6T";

function validRequest(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: 1,
    request_id: VALID_ULID,
    caller: { kind: "nx-cli" },
    tool: "search",
    args: { query: "x" },
    timeout_ms: 5000,
    ...overrides,
  };
}

describe("buildHandler", () => {
  it("returns ok response on happy path", async () => {
    const emit = vi.fn();
    const handler = buildHandler(
      "auth",
      90,
      new Date().toISOString().slice(0, 10), // today
      async () => ({ data: { results: [] } }),
      emit,
    );
    const res = await handler(validRequest());
    expect(res.ok).toBe(true);
    expect(res.warehouse).toBe("auth");
    expect(res.tool).toBe("search");
    expect(res.warnings).toEqual([]);
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ tool: "search", ok: true }));
  });

  it("attaches stale warning when warehouse past 1× decay", async () => {
    const emit = vi.fn();
    const handler = buildHandler(
      "auth",
      30,
      // 45 days ago = 1.5× of 30-day decay → "stale"
      new Date(Date.now() - 45 * 86_400_000).toISOString().slice(0, 10),
      async () => ({ data: {} }),
      emit,
    );
    const res = await handler(validRequest());
    expect(res.ok).toBe(true);
    expect(res.warnings.length).toBe(1);
    expect(res.warnings[0]!.code).toBe("stale");
  });

  it("attaches stronger stale warning when quarantined (>2× decay)", async () => {
    const emit = vi.fn();
    const handler = buildHandler(
      "auth",
      30,
      // 70 days ago = 2.33× of 30-day decay → "quarantined"
      new Date(Date.now() - 70 * 86_400_000).toISOString().slice(0, 10),
      async () => ({ data: {} }),
      emit,
    );
    const res = await handler(validRequest());
    expect(res.warnings[0]!.message).toMatch(/STALE/);
  });

  it("attaches deprecated warning when past 3× decay", async () => {
    const emit = vi.fn();
    const handler = buildHandler(
      "auth",
      30,
      // 100 days ago = 3.33× of 30-day decay → "auto-deprecate"
      new Date(Date.now() - 100 * 86_400_000).toISOString().slice(0, 10),
      async () => ({ data: {} }),
      emit,
    );
    const res = await handler(validRequest());
    expect(res.warnings[0]!.code).toBe("deprecated");
  });

  it("returns error response on schema validation failure", async () => {
    const emit = vi.fn();
    const handler = buildHandler("auth", 90, "2026-06-01", async () => ({ data: {} }), emit);
    const res = await handler({ totally: "invalid" });
    expect(res.ok).toBe(false);
    expect(res.error?.code).toBe("schema_validation_failed");
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
  });

  it("returns error response when handler throws", async () => {
    const emit = vi.fn();
    const handler = buildHandler(
      "auth",
      90,
      "2026-06-01",
      async () => {
        throw new Error("DB down");
      },
      emit,
    );
    const res = await handler(validRequest());
    expect(res.ok).toBe(false);
    expect(res.error?.message).toContain("DB down");
    expect(res.error?.retryable).toBe(true);
  });

  it("emits telemetry on success and error", async () => {
    const emit = vi.fn();
    const handler = buildHandler("auth", 90, "2026-06-01", async () => ({ data: {} }), emit);
    await handler(validRequest());
    await handler({ invalid: true });
    expect(emit).toHaveBeenCalledTimes(2);
    expect(emit.mock.calls[0]![0]!.ok).toBe(true);
    expect(emit.mock.calls[1]![0]!.ok).toBe(false);
  });

  it("includes citations from handler in response", async () => {
    const emit = vi.fn();
    const handler = buildHandler(
      "auth",
      90,
      "2026-06-01",
      async () => ({
        data: {},
        citations: [{ warehouse: "auth", id: "oauth-pkce" }],
      }),
      emit,
    );
    const res = await handler(validRequest());
    expect(res.citations).toHaveLength(1);
    expect(res.citations[0]!.warehouse).toBe("auth");
  });
});
