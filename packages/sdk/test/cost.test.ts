import { describe, expect, it, vi } from "vitest";
import type { CostEnvelope } from "@nexural/schema";
import {
  llmClient,
  type ProviderCaller,
  type UsageTracker,
  type TelemetryEmitter,
  type LlmClientConfig,
} from "../src/cost.js";

const envelope: CostEnvelope = {
  per_request_p50_usd: 0.001,
  per_request_p99_usd: 0.05,
  monthly_baseline_usd: 10,
  hard_caps: {
    per_request_usd: 0.05,
    per_user_per_day_usd: 5,
    per_app_per_day_usd: 100,
  },
};

function makeTracker(overrides: Partial<UsageTracker> = {}): UsageTracker {
  return {
    perUserUsdToday: async () => 0,
    perAppUsdToday: async () => 0,
    recordSpend: async () => {},
    ...overrides,
  };
}

function makeTelemetry(): TelemetryEmitter & {
  events: Array<Parameters<TelemetryEmitter["emitCostEvent"]>[0]>;
} {
  const events: Array<Parameters<TelemetryEmitter["emitCostEvent"]>[0]> = [];
  return {
    events,
    async emitCostEvent(e) {
      events.push(e);
    },
  };
}

function makeProvider(
  opts: {
    inputTokens?: number;
    outputTokens?: number;
  } = {},
): ProviderCaller {
  return {
    invoke: vi.fn(async () => ({
      outputText: "hello world",
      inputTokens: opts.inputTokens ?? 100,
      outputTokens: opts.outputTokens ?? 50,
    })),
    invokeStreaming: vi.fn(async ({ onToken }) => {
      // simulate emitting 250 tokens; onToken can return false to abort
      let count = 0;
      let aborted = false;
      while (count < 250) {
        count++;
        const result = onToken(`tok${count}`);
        if (result === false) {
          aborted = true;
          break;
        }
      }
      return {
        outputText: aborted ? "partial" : "full",
        inputTokens: opts.inputTokens ?? 100,
        outputTokens: count,
      };
    }),
  };
}

const baseConfig = (overrides: Partial<LlmClientConfig> = {}): LlmClientConfig => ({
  appName: "test-app",
  recipeName: "saas-rag-chat",
  costEnvelope: envelope,
  modelChain: ["anthropic:opus"],
  usageTracker: makeTracker(),
  telemetry: makeTelemetry(),
  providers: new Map<string, ProviderCaller>([["anthropic", makeProvider()]]),
  ...overrides,
});

describe("llmClient — happy path", () => {
  it("invokes provider and returns result", async () => {
    const client = llmClient(baseConfig());
    const r = await client.invoke({
      messages: [],
      inputTokenEstimate: 100,
      maxOutputTokens: 50,
    });
    expect(r.outputText).toBe("hello world");
    expect(r.resolution.id).toBe("claude-opus-4-7");
    expect(r.actualCostUsd).toBeGreaterThan(0);
    expect(r.truncatedByCost).toBe(false);
  });
});

describe("llmClient — cost caps", () => {
  it("rejects request projected over per_request cap", async () => {
    const telemetry = makeTelemetry();
    const client = llmClient(
      baseConfig({
        telemetry,
        // 1M input tokens at opus pricing ($15/M) = $15, way over $0.05 cap
        modelChain: ["anthropic:opus"],
      }),
    );
    await expect(
      client.invoke({
        messages: [],
        inputTokenEstimate: 1_000_000,
        maxOutputTokens: 0,
      }),
    ).rejects.toThrow(/cost_cap_exceeded/);
    expect(telemetry.events).toHaveLength(1);
    expect(telemetry.events[0]!.severity).toBe("exceeded");
    expect(telemetry.events[0]!.scope).toBe("per_request");
  });

  it("circuit-breaks app when daily total would exceed cap", async () => {
    const telemetry = makeTelemetry();
    const client = llmClient(
      baseConfig({
        telemetry,
        usageTracker: makeTracker({
          // app already at $99.99 today; one more request would exceed $100 cap
          perAppUsdToday: async () => 99.99,
        }),
      }),
    );
    await expect(
      client.invoke({
        messages: [],
        inputTokenEstimate: 1000,
        maxOutputTokens: 100,
      }),
    ).rejects.toThrow(/cost_circuit_break/);
    expect(telemetry.events.some((e) => e.severity === "circuit_break")).toBe(true);
  });

  it("rejects per-user cap exceedance", async () => {
    const telemetry = makeTelemetry();
    // Use generous per_request + per_app caps so per_user is what trips.
    const generousEnvelope: CostEnvelope = {
      ...envelope,
      hard_caps: {
        per_request_usd: 10, // generous
        per_user_per_day_usd: 5,
        per_app_per_day_usd: 1000, // generous
      },
    };
    const client = llmClient(
      baseConfig({
        telemetry,
        costEnvelope: generousEnvelope,
        usageTracker: makeTracker({
          perUserUsdToday: async () => 4.99,
        }),
      }),
    );
    await expect(
      client.invoke({
        userId: "user-123",
        messages: [],
        // ~$0.0825 projected → user at $4.99 → would put over $5 daily cap
        inputTokenEstimate: 5_000,
        maxOutputTokens: 100,
      }),
    ).rejects.toThrow(/cost_cap_exceeded/);
    expect(telemetry.events.some((e) => e.scope === "per_user_day")).toBe(true);
    const userEvent = telemetry.events.find((e) => e.scope === "per_user_day");
    expect(userEvent?.userHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("emits warn at 80% of per_request cap", async () => {
    const telemetry = makeTelemetry();
    const client = llmClient(
      baseConfig({
        telemetry,
        // Use a cheaper model so warning fires below hard cap
        modelChain: ["anthropic:opus"],
      }),
    );
    // $0.05 cap, 80% threshold = $0.04. Estimate ~$0.042 (under cap, over warn threshold).
    await client.invoke({
      messages: [],
      // 2.5k input + 100 output @ opus = ~$0.0375 + $0.0075 ≈ $0.045
      inputTokenEstimate: 2500,
      maxOutputTokens: 100,
    });
    expect(telemetry.events.some((e) => e.severity === "warn")).toBe(true);
  });
});

describe("llmClient — streaming abort", () => {
  it("aborts stream when projected cost exceeds cap mid-stream", async () => {
    const telemetry = makeTelemetry();
    // Opus: $15/M in, $75/M out.
    // Pre-flight: 100 input + 200 maxOutputTokens = $0.0015 + $0.015 = $0.0165 — must pass cap.
    // Mid-stream (mock emits 250 tokens): $0.0015 + $0.01875 = $0.02025 — must exceed cap.
    // So cap must be in (0.0165, 0.02025). Use $0.018.
    const tightEnvelope: CostEnvelope = {
      ...envelope,
      hard_caps: { ...envelope.hard_caps, per_request_usd: 0.018 },
    };
    const client = llmClient(
      baseConfig({
        telemetry,
        costEnvelope: tightEnvelope,
      }),
    );

    const r = await client.invoke({
      messages: [],
      inputTokenEstimate: 100,
      maxOutputTokens: 200,
      streaming: true,
      streamCheckIntervalTokens: 50,
    });

    expect(r.truncatedByCost).toBe(true);
    expect(telemetry.events.some((e) => e.severity === "exceeded")).toBe(true);
  });
});

describe("llmClient — provider resolution failures", () => {
  it("throws when no model in chain resolves", async () => {
    const client = llmClient(
      baseConfig({
        modelChain: ["unknown:family" as `${string}:${string}`],
      }),
    );
    await expect(
      client.invoke({
        messages: [],
        inputTokenEstimate: 100,
        maxOutputTokens: 50,
      }),
    ).rejects.toThrow(/No model resolved/);
  });

  it("throws when provider not configured for resolved family", async () => {
    const client = llmClient(
      baseConfig({
        providers: new Map(), // no providers
      }),
    );
    await expect(
      client.invoke({
        messages: [],
        inputTokenEstimate: 100,
        maxOutputTokens: 50,
      }),
    ).rejects.toThrow(/No provider configured/);
  });
});
