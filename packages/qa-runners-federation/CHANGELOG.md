# @nexural/qa-runners-federation

## 0.1.0

Initial release — Phase 5 per BUILD_PLAN.md v2.1 + ADR-0008.

- `runFederationConformance(ctx)` — drift detection in forged apps (ADR-0008 §3)
  - Validates `.nexural/forged.lock.yaml` presence + structure
  - Critical findings on missing signature / provenance per ADR-0006
- `runRecipeValidity(ctx)` — recipe shape validation (ADR-0008 §4)
  - Required artifacts: recipe.yaml, THREAT_MODEL.md, DECISIONS.md, templates/
  - Required fields per `RecipeManifest` schema
  - cost_envelope must include hard_caps
- `runPromptInjectionResilience(ctx)` — content fuzzing against OWASP LLM payloads (ADR-0008 §2)
  - 8+ canonical injection patterns (ignore-previous, role-reset, tag-injection, exfiltration, etc.)
  - Verifies `@nexural/mcp-base` envelope wrapping defangs each
