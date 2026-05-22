# @nexural/router

## 0.1.0

Initial release — Phase 4 deliverable per BUILD_PLAN.md v2.1.

- Registry loader for `registry-factory.yaml`, `registry-lifeops.yaml`, `registry-external-mcp.yaml` per ADRs 0003 + 0005
- Synthesis pipeline:
  - **Tier confinement** filter at fan-out (per ADR-0009 §1.9)
  - **Token-budget trimming** to 32k by relevance (per ADR-0010 §2.5)
  - **`<warehouse_content>` envelope wrapping** (per ADR-0008 §1)
  - **Citation validation** post-synthesis — strips hallucinated `[[warehouse:id]]` tokens
- LLM adapter: Anthropic + OpenAI + Ollama implementing `@nexural/sdk`'s `ProviderCaller`
- `nexural-router` binary (stdio MCP server scaffold; child-spawn loop lands Phase 5 when warehouse MCPs exist)
