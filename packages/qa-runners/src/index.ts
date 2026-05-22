/**
 * @nexural/qa-runners
 *
 * Thin typed registry of runner identifiers exposed by `nexural-qa-os`.
 * Lets warehouses + recipes import a single @nexural/ namespace + reference
 * runners by stable string identifier instead of cross-repo direct import.
 *
 * The actual runner implementations live in `nexural-qa-os/runners/`.
 * @nexural/qa-runners is a manifest + typed lookup — not a runtime loader.
 *
 * For runtime execution, recipes use `qa run --runner <id>` which shells out
 * to the qa-os CLI (per BUILD_PLAN Phase 2 §verify-all).
 */

import { z } from "zod";

/**
 * Runner phase grouping per qa-os manifest.
 */
export const RunnerPhase = z.enum(["fast", "standard", "thorough", "deep"]);
export type RunnerPhase = z.infer<typeof RunnerPhase>;

/**
 * Stable runner identifier — kebab-case, matches `nexural-qa-os/runners/<id>/`.
 *
 * This list MUST stay in sync with the qa-os repo. Drift = federation-conformance
 * failure (per ADR-0008).
 */
export const RunnerId = z.enum([
  // ── Unit / coverage ──────────────────────────────────────────────────────
  "vitest",

  // ── Secrets / supply chain ───────────────────────────────────────────────
  "gitleaks",
  "dependency-audit",
  "sbom",
  "sca",
  "trivy",

  // ── Static + IaC ─────────────────────────────────────────────────────────
  "semgrep",
  "iac",

  // ── API / contracts ──────────────────────────────────────────────────────
  "api",
  "openapi",
  "schemathesis",
  "pact",

  // ── Auth / DB / headers ──────────────────────────────────────────────────
  "auth",
  "db",
  "security-headers",

  // ── DAST ─────────────────────────────────────────────────────────────────
  "zap",
  "nuclei",

  // ── A11y / perf / visual / e2e ───────────────────────────────────────────
  "axe",
  "lighthouse",
  "k6",
  "load",
  "visual-diff",
  "playwright",
  "synthetic",

  // ── AI safety + evals ────────────────────────────────────────────────────
  "ai-evals",
  "ai-redteam",
  "ai-hallucination",
  "ai-prompt-injection",
  "ai-bias",
  "ai-cost-tracker",
  "ai-latency-budget",
  "ai-consistency",
  "ai-refusal",
  "ai-toxicity",
  "ai-pii-leak",
  "ai-jailbreak",

  // ── Mobile / iOS / Android ───────────────────────────────────────────────
  "appium",
  "maestro",
  "device-farm",
  "xcodebuild",
  "xcresult",
  "ios-signing",
  "ios-device-matrix",
  "apple-privacy",
  "appstore-readiness",
  "appstore-connect",
  "gradle-build",
  "android-lint",
  "detekt",
  "ktlint",
  "robolectric",
  "espresso",
  "baseline-profile",
  "macrobenchmark",
  "monkey",
  "masvs",

  // ── Desktop / cloud / post-deploy ────────────────────────────────────────
  "desktop",
  "cloud-isolation",
  "post-deploy",
  "sentry",

  // ── Chaos / fuzz ─────────────────────────────────────────────────────────
  "chaos-network-latency",
  "chaos-network-loss",
  "chaos-cpu-stress",
  "chaos-memory-pressure",
  "chaos-disk-fill",
  "chaos-process-kill",
  "chaos-clock-skew",
  "fuzz-http-api",
  "fuzz-graphql",
  "fuzz-grpc",
  "fuzz-protobuf",
  "fuzz-json-schema",
  "fuzz-cli-args",

  // ── Release control ──────────────────────────────────────────────────────
  "feature-flag-audit",
  "feature-flag-rollout-guard",
  "canary-watch",

  // ── NEW per Nexural ADRs 0008, 0009, 0010 ────────────────────────────────
  // ADR-0008 §2/3/4 — three runners introduced for Layer 4 verification
  "federation-conformance",
  "recipe-validity",
  "prompt-injection-resilience",
  // ADR-0009 §1.10 — meta-discipline check
  "discipline-scorecard",
  // ADR-0010 §2.9 — eval drift over time
  "golden-set-drift",
]);
export type RunnerId = z.infer<typeof RunnerId>;

/**
 * Default phase mapping. Used by `nx forge` post-emit `qa run --standard`.
 */
export const DEFAULT_PHASE_MAP: Readonly<Record<RunnerId, RunnerPhase>> = {
  vitest: "fast",
  gitleaks: "fast",
  semgrep: "standard",
  "dependency-audit": "standard",
  sbom: "standard",
  sca: "standard",
  trivy: "standard",
  iac: "standard",
  api: "standard",
  openapi: "standard",
  schemathesis: "thorough",
  pact: "thorough",
  auth: "standard",
  db: "standard",
  "security-headers": "standard",
  zap: "deep",
  nuclei: "deep",
  axe: "standard",
  lighthouse: "standard",
  k6: "thorough",
  load: "thorough",
  "visual-diff": "thorough",
  playwright: "standard",
  synthetic: "thorough",
  "ai-evals": "deep",
  "ai-redteam": "deep",
  "ai-hallucination": "deep",
  "ai-prompt-injection": "deep",
  "ai-bias": "deep",
  "ai-cost-tracker": "standard",
  "ai-latency-budget": "standard",
  "ai-consistency": "deep",
  "ai-refusal": "deep",
  "ai-toxicity": "deep",
  "ai-pii-leak": "deep",
  "ai-jailbreak": "deep",
  appium: "thorough",
  maestro: "thorough",
  "device-farm": "deep",
  xcodebuild: "deep",
  xcresult: "deep",
  "ios-signing": "deep",
  "ios-device-matrix": "deep",
  "apple-privacy": "deep",
  "appstore-readiness": "deep",
  "appstore-connect": "deep",
  "gradle-build": "deep",
  "android-lint": "standard",
  detekt: "standard",
  ktlint: "fast",
  robolectric: "standard",
  espresso: "thorough",
  "baseline-profile": "thorough",
  macrobenchmark: "thorough",
  monkey: "thorough",
  masvs: "deep",
  desktop: "deep",
  "cloud-isolation": "deep",
  "post-deploy": "deep",
  sentry: "deep",
  "chaos-network-latency": "deep",
  "chaos-network-loss": "deep",
  "chaos-cpu-stress": "deep",
  "chaos-memory-pressure": "deep",
  "chaos-disk-fill": "deep",
  "chaos-process-kill": "deep",
  "chaos-clock-skew": "deep",
  "fuzz-http-api": "deep",
  "fuzz-graphql": "deep",
  "fuzz-grpc": "deep",
  "fuzz-protobuf": "deep",
  "fuzz-json-schema": "deep",
  "fuzz-cli-args": "deep",
  "feature-flag-audit": "standard",
  "feature-flag-rollout-guard": "standard",
  "canary-watch": "deep",
  "federation-conformance": "standard",
  "recipe-validity": "standard",
  "prompt-injection-resilience": "deep",
  "discipline-scorecard": "standard",
  "golden-set-drift": "deep",
};

/** Total count of runners — useful for sanity checks in qa-os dogfood. */
export const RUNNER_COUNT = RunnerId.options.length;

/** List runner ids belonging to a given phase. */
export function runnersForPhase(phase: RunnerPhase): ReadonlyArray<RunnerId> {
  return RunnerId.options.filter((id) => DEFAULT_PHASE_MAP[id] === phase);
}

/** True iff `id` is in the canonical runner registry. */
export function isKnownRunner(id: string): id is RunnerId {
  return (RunnerId.options as ReadonlyArray<string>).includes(id);
}
