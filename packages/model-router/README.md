# @nexural/model-router

Stable model family references → concrete model IDs.

Recipes pin **families** (e.g. `anthropic:opus`), not IDs. The router resolves families at runtime, allowing the federation to absorb model deprecations and new releases via single-file updates (the registry).

## Usage

```ts
import { resolveFamily, resolveChain, estimateCostUsd } from "@nexural/model-router";

const opus = resolveFamily("anthropic:opus");
// → { id: "claude-opus-4-7", tier: "flagship", context_window: 1_000_000, ... }

const fallback = resolveChain(["anthropic:opus", "openai:flagship", "ollama:llama-large"]);
// → first available family + chain index used

const cost = estimateCostUsd(opus, 50_000, 1_500);
// → projected USD cost (input + output)
```

See `src/registry.ts` for the current registry. Renovate-style PRs update this file weekly.

Per ADR-0007 (cost guardrails + model deprecation) and ADR-0010 §2.8 (price-ceiling routing).
