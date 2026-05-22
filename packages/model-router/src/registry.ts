/**
 * Initial model family registry.
 *
 * Renovate-style PRs append + update this file when:
 *   - A provider announces deprecation (weekly scrape).
 *   - A provider releases a new model in a family.
 *   - Pricing changes (weekly check).
 *
 * Per ADR-0007 §4 + ADR-0010 §2.8.
 */

import type { ModelFamilyResolution } from "@nexural/schema";

/**
 * Initial registry at @nexural/model-router@0.1.0. Subject to ongoing updates.
 *
 * Naming convention: `provider:tier` where tier is one of
 * flagship, premium, balanced, fast, small.
 */
export const REGISTRY: ReadonlyArray<ModelFamilyResolution> = [
  // ── Anthropic ────────────────────────────────────────────────────────────
  {
    family: "anthropic:opus",
    id: "claude-opus-4-7",
    tier: "flagship",
    context_window: 1_000_000,
    pricing: {
      input_per_million_tokens_usd: 15,
      output_per_million_tokens_usd: 75,
    },
    deprecates_at: null,
    status: "current",
  },
  {
    family: "anthropic:sonnet",
    id: "claude-sonnet-4-6",
    tier: "premium",
    context_window: 200_000,
    pricing: {
      input_per_million_tokens_usd: 3,
      output_per_million_tokens_usd: 15,
    },
    deprecates_at: null,
    status: "current",
  },
  {
    family: "anthropic:haiku",
    id: "claude-haiku-4-5-20251001",
    tier: "fast",
    context_window: 200_000,
    pricing: {
      input_per_million_tokens_usd: 1,
      output_per_million_tokens_usd: 5,
    },
    deprecates_at: null,
    status: "current",
  },

  // ── OpenAI ───────────────────────────────────────────────────────────────
  {
    family: "openai:flagship",
    id: "gpt-4o",
    tier: "flagship",
    context_window: 128_000,
    pricing: {
      input_per_million_tokens_usd: 5,
      output_per_million_tokens_usd: 15,
    },
    deprecates_at: null,
    status: "current",
  },
  {
    family: "openai:fast",
    id: "gpt-4o-mini",
    tier: "fast",
    context_window: 128_000,
    pricing: {
      input_per_million_tokens_usd: 0.15,
      output_per_million_tokens_usd: 0.6,
    },
    deprecates_at: null,
    status: "current",
  },

  // ── Ollama (local emergency, no API cost) ────────────────────────────────
  {
    family: "ollama:llama-large",
    id: "llama-3.3-70b",
    tier: "premium",
    context_window: 128_000,
    pricing: {
      input_per_million_tokens_usd: 0,
      output_per_million_tokens_usd: 0,
    },
    deprecates_at: null,
    status: "current",
  },
  {
    family: "ollama:llama-small",
    id: "llama-3.2-3b",
    tier: "small",
    context_window: 128_000,
    pricing: {
      input_per_million_tokens_usd: 0,
      output_per_million_tokens_usd: 0,
    },
    deprecates_at: null,
    status: "current",
  },
];
