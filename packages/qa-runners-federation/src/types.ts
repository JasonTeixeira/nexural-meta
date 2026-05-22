/**
 * Shared types for federation-specific qa-os runners.
 *
 * Each runner exports a function with this signature so the qa-os engine
 * can invoke them uniformly. Per ADR-0008.
 */

import { z } from "zod";

export const Severity = z.enum(["info", "warn", "error", "critical"]);
export type Severity = z.infer<typeof Severity>;

export const Finding = z
  .object({
    category: z.string(),
    severity: Severity,
    message: z.string(),
    file: z.string().optional(),
    rule: z.string().optional(),
  })
  .strict();
export type Finding = z.infer<typeof Finding>;

export const RunnerResult = z
  .object({
    runner: z.string(),
    passed: z.boolean(),
    score: z.number().int().min(0).max(100),
    findings: z.array(Finding),
    duration_ms: z.number().int().nonnegative(),
  })
  .strict();
export type RunnerResult = z.infer<typeof RunnerResult>;

export interface RunnerContext {
  /** Path to the repo or forged-app being audited. */
  readonly cwd: string;
  /** Optional severity threshold — findings below this are demoted to info. */
  readonly severityThreshold?: Severity;
}
