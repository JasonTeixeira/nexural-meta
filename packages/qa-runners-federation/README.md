# @nexural/qa-runners-federation

Federation-specific qa-os runners introduced by ADR-0008.

## Runners

### `runFederationConformance({ cwd })`

Drift detection in forged apps per ADR-0008 §3.

Reads `.nexural/forged.lock.yaml`. Surfaces critical findings when:

- Lockfile is missing
- Recipe signature absent (per ADR-0006)
- SLSA provenance absent (per ADR-0006)
- Required lockfile fields missing

Runs in every forged app's CI.

### `runRecipeValidity({ cwd })`

Recipe shape validation per ADR-0008 §4.

Walks `recipes/` and checks each for:

- recipe.yaml
- THREAT_MODEL.md
- DECISIONS.md
- templates/ directory
- All required RecipeManifest fields
- cost_envelope.hard_caps

Runs nightly in `nexural-meta`.

### `runPromptInjectionResilience({ cwd })`

Content fuzzing per ADR-0008 §2.

Scans `content/<slug>/body.md` for OWASP-style injection patterns. Verifies
`@nexural/mcp-base` envelope wrapping would defang each one.

Runs nightly across all warehouses.

## Usage

```ts
import {
  runFederationConformance,
  runRecipeValidity,
  runPromptInjectionResilience,
} from "@nexural/qa-runners-federation";

const result = await runFederationConformance({ cwd: process.cwd() });
console.log(result.passed, result.score, result.findings);
```
