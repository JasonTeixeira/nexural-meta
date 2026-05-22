import { describe, expect, it } from "vitest";
import {
  AuditEvent,
  CostEvent,
  DecayWarnEvent,
  NxCommandEvent,
  TelemetryEvent,
  ToolCallEvent,
} from "../src/telemetry.js";

const base = {
  schema_version: 1 as const,
  event_id: "01H8XK7Q3F9V7M5N0E3B4P2J6T",
  ts: "2026-05-22T03:49:21Z",
  host: "laptop-sage",
  process: "nx" as const,
};

describe("ToolCallEvent", () => {
  const valid = {
    ...base,
    kind: "tool_call" as const,
    warehouse: "auth",
    tool: "search",
    latency_ms: 100,
    ok: true,
  };
  it("accepts valid", () => expect(() => ToolCallEvent.parse(valid)).not.toThrow());
  it("rejects negative latency", () =>
    expect(() => ToolCallEvent.parse({ ...valid, latency_ms: -1 })).toThrow());
  it("rejects extra keys", () => expect(() => ToolCallEvent.parse({ ...valid, foo: 1 })).toThrow());
  it("rejects wrong kind", () =>
    expect(() => ToolCallEvent.parse({ ...valid, kind: "other" as never })).toThrow());
  it("rejects non-kebab warehouse", () =>
    expect(() => ToolCallEvent.parse({ ...valid, warehouse: "AUTH" })).toThrow());
  it("rejects non-bool ok", () =>
    expect(() => ToolCallEvent.parse({ ...valid, ok: 1 as unknown as boolean })).toThrow());
});

describe("NxCommandEvent", () => {
  const sha = "a".repeat(64);
  const valid = {
    ...base,
    kind: "nx_command" as const,
    command: "ask",
    args_hash: sha,
    latency_ms: 150,
    exit_code: 0,
  };
  it("accepts valid", () => expect(() => NxCommandEvent.parse(valid)).not.toThrow());
  it("rejects non-sha256 args_hash (privacy guard)", () =>
    expect(() => NxCommandEvent.parse({ ...valid, args_hash: "what is rag chunking" })).toThrow());
  it("rejects too-short args_hash", () =>
    expect(() => NxCommandEvent.parse({ ...valid, args_hash: "abc" })).toThrow());
  it("rejects uppercase args_hash", () =>
    expect(() => NxCommandEvent.parse({ ...valid, args_hash: "A".repeat(64) })).toThrow());
  it("rejects non-int exit_code", () =>
    expect(() => NxCommandEvent.parse({ ...valid, exit_code: 0.5 })).toThrow());
  it("rejects extra keys", () =>
    expect(() => NxCommandEvent.parse({ ...valid, extra: 1 })).toThrow());
});

describe("DecayWarnEvent", () => {
  const valid = {
    ...base,
    kind: "decay_warn" as const,
    warehouse: "agent",
    days_since_review: 120,
    decay_rate_days: 90,
    severity: "warn" as const,
  };
  it("accepts valid", () => expect(() => DecayWarnEvent.parse(valid)).not.toThrow());
  it("rejects unknown severity", () =>
    expect(() => DecayWarnEvent.parse({ ...valid, severity: "critical" as never })).toThrow());
  it("rejects decay_rate too high", () =>
    expect(() => DecayWarnEvent.parse({ ...valid, decay_rate_days: 4000 })).toThrow());
  it("rejects negative days_since_review", () =>
    expect(() => DecayWarnEvent.parse({ ...valid, days_since_review: -1 })).toThrow());
  it("rejects wrong kind", () =>
    expect(() => DecayWarnEvent.parse({ ...valid, kind: "other" as never })).toThrow());
  it("rejects extra keys", () =>
    expect(() => DecayWarnEvent.parse({ ...valid, extra: 1 })).toThrow());
});

describe("AuditEvent", () => {
  const valid = {
    ...base,
    kind: "audit" as const,
    op: "decrypt" as const,
    warehouse: "decision",
    key_id: "yubikey-primary-fingerprint",
    exit: 0,
  };
  it("accepts valid", () => expect(() => AuditEvent.parse(valid)).not.toThrow());
  it("rejects unknown op", () =>
    expect(() => AuditEvent.parse({ ...valid, op: "delete" as never })).toThrow());
  it("rejects empty key_id", () =>
    expect(() => AuditEvent.parse({ ...valid, key_id: 1 as never })).toThrow());
  it("rejects extra keys", () => expect(() => AuditEvent.parse({ ...valid, foo: 1 })).toThrow());
  it("rejects non-int exit", () =>
    expect(() => AuditEvent.parse({ ...valid, exit: 0.5 })).toThrow());
  it("accepts encrypt op", () =>
    expect(() => AuditEvent.parse({ ...valid, op: "encrypt" as const })).not.toThrow());
});

describe("CostEvent (ADR-0007)", () => {
  const valid = {
    ...base,
    kind: "cost_event" as const,
    app: "my-rag-app",
    recipe: "saas-rag-chat",
    severity: "warn" as const,
    scope: "per_request" as const,
    projected_usd: 0.04,
    cap_usd: 0.05,
  };
  it("accepts valid", () => expect(() => CostEvent.parse(valid)).not.toThrow());
  it("rejects negative projected_usd", () =>
    expect(() => CostEvent.parse({ ...valid, projected_usd: -1 })).toThrow());
  it("rejects 0 cap_usd", () => expect(() => CostEvent.parse({ ...valid, cap_usd: 0 })).toThrow());
  it("rejects unknown severity", () =>
    expect(() => CostEvent.parse({ ...valid, severity: "ok" as never })).toThrow());
  it("rejects unknown scope", () =>
    expect(() => CostEvent.parse({ ...valid, scope: "per_month" as never })).toThrow());
  it("rejects raw user id (must be sha256 hex)", () =>
    expect(() => CostEvent.parse({ ...valid, user_hash: "sage@nexural" })).toThrow());
  it("accepts sha256 user_hash", () =>
    expect(() => CostEvent.parse({ ...valid, user_hash: "f".repeat(64) })).not.toThrow());
});

describe("TelemetryEvent discriminated union", () => {
  it("discriminates on kind", () => {
    const tc = {
      ...base,
      kind: "tool_call" as const,
      warehouse: "auth",
      tool: "search",
      latency_ms: 10,
      ok: true,
    };
    expect(() => TelemetryEvent.parse(tc)).not.toThrow();
  });
  it("rejects unknown kind", () =>
    expect(() => TelemetryEvent.parse({ ...base, kind: "unknown" as never })).toThrow());
});
