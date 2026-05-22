# @nexural/model-router

## 0.1.0

Initial release.

- `resolveFamily(family, options)` — resolve one family → ID
- `resolveChain([family1, family2, ...], options)` — fallback chain
- `estimateCostUsd(resolution, in, out, { cached })` — pre-flight cost estimate
- `listFamilies(options)` — enumerate registry
- Initial registry: anthropic (opus/sonnet/haiku), openai (flagship/fast), ollama (llama-large/llama-small)
- Price ceiling enforcement per ADR-0010 §2.8
