/**
 * Middleware pipeline for warehouse MCP servers.
 *
 * Composed in this order on every request:
 *   1. Schema validation (Zod parse of request envelope)
 *   2. Decay check (prepend ⚠️ STALE warning when needed)
 *   3. Telemetry emission (tool_call event)
 *   4. Response wrapping in <warehouse_content> envelope
 *
 * Per ADRs 0008 §1, 0007 §5, ARCHITECTURE §5.1.
 */

import type { McpToolRequest, McpToolResponse } from "@nexural/schema";
import {
  McpToolRequest as McpToolRequestSchema,
  McpToolResponse as McpToolResponseSchema,
} from "@nexural/schema";
import { checkDecay } from "@nexural/sdk";

export interface RequestContext {
  readonly request: McpToolRequest;
  readonly warehouse: string;
  /** ISO date string of when the warehouse / entry was last reviewed. */
  readonly lastReviewed: string;
  /** Decay rate in days. */
  readonly decayRateDays: number;
  /** Optional clock for testing. */
  readonly nowMs?: number;
}

export type ToolHandler = (request: McpToolRequest) => Promise<{
  data: unknown;
  citations?: McpToolResponse["citations"];
}>;

/**
 * Build a full middleware-wrapped handler for an MCP tool.
 *
 * Returns the parsed response with telemetry emitted.
 */
export function buildHandler(
  warehouse: string,
  decayRateDays: number,
  lastReviewed: string,
  handler: ToolHandler,
  emit: (event: { tool: string; latencyMs: number; ok: boolean; errorCode?: string }) => void,
): (rawRequest: unknown) => Promise<McpToolResponse> {
  return async (rawRequest: unknown): Promise<McpToolResponse> => {
    const start = Date.now();
    let request: McpToolRequest;
    try {
      request = McpToolRequestSchema.parse(rawRequest);
    } catch (e) {
      const latencyMs = Date.now() - start;
      emit({ tool: "unknown", latencyMs, ok: false, errorCode: "schema_validation_failed" });
      const errorMessage = e instanceof Error ? e.message : "schema validation failed";
      return McpToolResponseSchema.parse({
        schema_version: 1,
        request_id: "00000000000000000000000000",
        warehouse,
        tool: "unknown",
        ok: false,
        latency_ms: latencyMs,
        error: {
          code: "schema_validation_failed",
          message: errorMessage,
          retryable: false,
        },
        warnings: [],
        citations: [],
      });
    }

    // ── Decay check (per ADR-0008 §3 + RETIREMENT §8) ────────────────────
    const decay = checkDecay(lastReviewed, decayRateDays);
    const warnings: McpToolResponse["warnings"] = [];
    if (decay.status === "stale") {
      warnings.push({
        code: "stale",
        message: `Not reviewed for ${decay.daysSinceReview} days (decay rate ${decayRateDays} days).`,
      });
    } else if (decay.status === "quarantined") {
      warnings.push({
        code: "stale",
        message: `⚠️ STALE — last reviewed ${decay.daysSinceReview} days ago, > 2× decay rate.`,
      });
    } else if (decay.status === "auto-deprecate") {
      warnings.push({
        code: "deprecated",
        message: `Past 3× decay rate; auto-deprecation pending.`,
      });
    }

    // ── Execute tool ──────────────────────────────────────────────────────
    try {
      const result = await handler(request);
      const latencyMs = Date.now() - start;
      emit({ tool: request.tool, latencyMs, ok: true });
      return McpToolResponseSchema.parse({
        schema_version: 1,
        request_id: request.request_id,
        warehouse,
        tool: request.tool,
        ok: true,
        latency_ms: latencyMs,
        data: result.data,
        warnings,
        citations: result.citations ?? [],
      });
    } catch (e) {
      const latencyMs = Date.now() - start;
      const message = e instanceof Error ? e.message : "unknown error";
      emit({
        tool: request.tool,
        latencyMs,
        ok: false,
        errorCode: "internal_error",
      });
      return McpToolResponseSchema.parse({
        schema_version: 1,
        request_id: request.request_id,
        warehouse,
        tool: request.tool,
        ok: false,
        latency_ms: latencyMs,
        error: { code: "internal_error", message, retryable: true },
        warnings,
        citations: [],
      });
    }
  };
}
