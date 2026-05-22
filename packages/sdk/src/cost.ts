/**
 * Cost-wrapped llmClient() per ADR-0007 + ADR-0010 §2.4.
 *
 * Every emitted app MUST use this wrapper instead of provider SDKs directly.
 * Recipes that import `anthropic` / `openai` directly fail `federation-conformance`.
 *
 * Hard caps enforced:
 *   - per_request_usd: rejects request projected over this
 *   - per_user_per_day_usd: blocks user
 *   - per_app_per_day_usd: circuit-breaks app
 *
 * Streaming-aware (ADR-0010 §2.4):
 *   - Pre-flight estimate based on inputTokens + maxOutputTokens
 *   - During stream, re-check every `streamCheckIntervalTokens` (default 100)
 *   - On overage mid-stream: cancel, return partial + `cost_cap_streaming_exceeded`
 */

import type { CostEnvelope, ModelFamilyResolution } from "@nexural/schema";
import { estimateCostUsd, resolveChain, type Family } from "@nexural/model-router";
import { sha256Hex } from "./hash.js";

export interface UsageTracker {
  /** Returns the user's USD spend so far today (UTC). */
  readonly perUserUsdToday: (userId: string) => Promise<number>;
  /** Returns the app's USD spend so far today (UTC). */
  readonly perAppUsdToday: () => Promise<number>;
  /** Records a successful spend event. */
  readonly recordSpend: (params: { userId?: string; usd: number }) => Promise<void>;
}

export interface TelemetryEmitter {
  /** Emit a `cost_event` per ADR-0007 §7. */
  readonly emitCostEvent: (params: {
    severity: "warn" | "exceeded" | "circuit_break";
    scope: "per_request" | "per_user_day" | "per_app_day";
    projectedUsd: number;
    capUsd: number;
    userHash?: string;
  }) => Promise<void>;
}

export interface LlmClientConfig {
  /** App identifier (forged app name). Required for telemetry. */
  readonly appName: string;
  /** Recipe identifier the app was forged from. Required for telemetry. */
  readonly recipeName: string;
  /** Cost envelope from the recipe. */
  readonly costEnvelope: CostEnvelope;
  /** Family fallback chain. Resolved at call time. */
  readonly modelChain: ReadonlyArray<Family>;
  /** Usage tracker (Postgres / SQLite-backed in real apps). */
  readonly usageTracker: UsageTracker;
  /** Telemetry emitter (forwards to telemetry SQLite + Turso). */
  readonly telemetry: TelemetryEmitter;
  /** Provider HTTP callers, keyed by family prefix (e.g. "anthropic", "openai"). */
  readonly providers: ReadonlyMap<string, ProviderCaller>;
}

export interface ProviderCaller {
  readonly invoke: (params: {
    readonly modelId: string;
    readonly messages: ReadonlyArray<unknown>;
    readonly maxOutputTokens: number;
  }) => Promise<{ outputText: string; inputTokens: number; outputTokens: number }>;
  readonly invokeStreaming: (params: {
    readonly modelId: string;
    readonly messages: ReadonlyArray<unknown>;
    readonly maxOutputTokens: number;
    readonly onToken: (token: string) => boolean | void;
  }) => Promise<{ outputText: string; inputTokens: number; outputTokens: number }>;
}

export interface LlmInvocation {
  readonly userId?: string;
  readonly messages: ReadonlyArray<unknown>;
  readonly inputTokenEstimate: number;
  readonly maxOutputTokens: number;
  readonly streaming?: boolean;
  /** Default: 100. Used only when streaming=true. */
  readonly streamCheckIntervalTokens?: number;
}

export interface LlmResult {
  readonly outputText: string;
  readonly resolution: ModelFamilyResolution;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly actualCostUsd: number;
  /** True iff cost cap aborted mid-stream. */
  readonly truncatedByCost: boolean;
}

export interface CostCapExceededError extends Error {
  readonly code: "cost_cap_exceeded" | "cost_cap_streaming_exceeded" | "cost_circuit_break";
  readonly scope: "per_request" | "per_user_day" | "per_app_day";
  readonly projectedUsd: number;
  readonly capUsd: number;
}

function makeCostError(
  code: CostCapExceededError["code"],
  scope: CostCapExceededError["scope"],
  projectedUsd: number,
  capUsd: number,
): CostCapExceededError {
  const e = new Error(
    `${code}: projected ${projectedUsd.toFixed(4)} USD exceeds cap ${capUsd.toFixed(
      4,
    )} USD (scope: ${scope})`,
  ) as CostCapExceededError;
  (e as { code: CostCapExceededError["code"] }).code = code;
  (e as { scope: CostCapExceededError["scope"] }).scope = scope;
  (e as { projectedUsd: number }).projectedUsd = projectedUsd;
  (e as { capUsd: number }).capUsd = capUsd;
  return e;
}

function providerOf(family: Family): string {
  return family.split(":")[0]!;
}

/**
 * Create a cost-wrapped LLM client. Returns an `invoke` function.
 */
export function llmClient(config: LlmClientConfig): {
  invoke: (call: LlmInvocation) => Promise<LlmResult>;
} {
  return {
    async invoke(call: LlmInvocation): Promise<LlmResult> {
      // 1. Resolve model
      const resolved = resolveChain(config.modelChain);
      if (!resolved) {
        throw new Error(`No model resolved from chain: ${config.modelChain.join(", ")}`);
      }
      const { resolution } = resolved;

      // 2. Pre-flight cost estimate
      const projectedUsd = estimateCostUsd(
        resolution,
        call.inputTokenEstimate,
        call.maxOutputTokens,
      );

      const caps = config.costEnvelope.hard_caps;

      // 3a. Per-request cap
      if (projectedUsd > caps.per_request_usd) {
        await config.telemetry.emitCostEvent({
          severity: "exceeded",
          scope: "per_request",
          projectedUsd,
          capUsd: caps.per_request_usd,
          ...(call.userId ? { userHash: sha256Hex(call.userId) } : {}),
        });
        throw makeCostError("cost_cap_exceeded", "per_request", projectedUsd, caps.per_request_usd);
      }

      // 3b. Per-app circuit
      const appUsdToday = await config.usageTracker.perAppUsdToday();
      if (appUsdToday + projectedUsd > caps.per_app_per_day_usd) {
        await config.telemetry.emitCostEvent({
          severity: "circuit_break",
          scope: "per_app_day",
          projectedUsd: appUsdToday + projectedUsd,
          capUsd: caps.per_app_per_day_usd,
        });
        throw makeCostError(
          "cost_circuit_break",
          "per_app_day",
          appUsdToday + projectedUsd,
          caps.per_app_per_day_usd,
        );
      }

      // 3c. Per-user cap
      if (call.userId) {
        const userUsdToday = await config.usageTracker.perUserUsdToday(call.userId);
        if (userUsdToday + projectedUsd > caps.per_user_per_day_usd) {
          await config.telemetry.emitCostEvent({
            severity: "exceeded",
            scope: "per_user_day",
            projectedUsd: userUsdToday + projectedUsd,
            capUsd: caps.per_user_per_day_usd,
            userHash: sha256Hex(call.userId),
          });
          throw makeCostError(
            "cost_cap_exceeded",
            "per_user_day",
            userUsdToday + projectedUsd,
            caps.per_user_per_day_usd,
          );
        }
      }

      // 4. 80%-of-cap warning
      if (projectedUsd > caps.per_request_usd * 0.8) {
        await config.telemetry.emitCostEvent({
          severity: "warn",
          scope: "per_request",
          projectedUsd,
          capUsd: caps.per_request_usd,
          ...(call.userId ? { userHash: sha256Hex(call.userId) } : {}),
        });
      }

      // 5. Resolve provider
      const provider = config.providers.get(providerOf(resolution.family as Family));
      if (!provider) {
        throw new Error(`No provider configured for ${resolution.family}`);
      }

      // 6. Invoke
      let result: { outputText: string; inputTokens: number; outputTokens: number };
      let truncatedByCost = false;

      if (call.streaming) {
        const checkInterval = call.streamCheckIntervalTokens ?? 100;
        let outputSoFar = 0;
        result = await provider.invokeStreaming({
          modelId: resolution.id,
          messages: call.messages,
          maxOutputTokens: call.maxOutputTokens,
          onToken: () => {
            outputSoFar++;
            if (outputSoFar % checkInterval !== 0) return;
            const projectedNow = estimateCostUsd(resolution, call.inputTokenEstimate, outputSoFar);
            if (projectedNow > caps.per_request_usd) {
              truncatedByCost = true;
              return false; // signal abort
            }
            return true;
          },
        });
        if (truncatedByCost) {
          await config.telemetry.emitCostEvent({
            severity: "exceeded",
            scope: "per_request",
            projectedUsd: estimateCostUsd(resolution, result.inputTokens, result.outputTokens),
            capUsd: caps.per_request_usd,
            ...(call.userId ? { userHash: sha256Hex(call.userId) } : {}),
          });
        }
      } else {
        result = await provider.invoke({
          modelId: resolution.id,
          messages: call.messages,
          maxOutputTokens: call.maxOutputTokens,
        });
      }

      // 7. Compute actual cost + record
      const actualCostUsd = estimateCostUsd(resolution, result.inputTokens, result.outputTokens);
      await config.usageTracker.recordSpend({
        ...(call.userId ? { userId: call.userId } : {}),
        usd: actualCostUsd,
      });

      return {
        outputText: result.outputText,
        resolution,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        actualCostUsd,
        truncatedByCost,
      };
    },
  };
}
