# @nexural/factory

Codegen engine for `nx forge`. Phase-1 scope: validation primitives + lockfile + safety gates.

## What ships at v0.1.0

- **`loadRecipe(raw, revocationList, options?)`** — parse a `recipe.yaml` against `RecipeManifest`, fail on revoked.
- **`buildLockfile(input)`** — produces a schema-valid `.nexural/forged.lock.yaml` for emitted apps (ADR-0006 §1).
- **`runLicenseGate(sbom, commercialRestrictedOk?)`** — fail forge on GPL/AGPL/BUSL/unknown license. Allowed by default: MIT, Apache-2.0, ISC, BSD, MPL-2.0, CC0, Unlicense, 0BSD.
- **`detectTyposquats(candidates, options?)`** — Levenshtein distance check against `HIGH_PRIORITY_PACKAGES` (per ADR-0009 §1.7).
- **`checkRevocation(name, version, list)`** — direct lookup against the revocation list (per ADR-0009 §1.6).

## Deferred to Phase 5

Template emission, cosign shell-out, op:// secret resolution, pre/post-emit hooks land when recipes themselves ship.

## Usage outline (Phase 5 — illustrative)

```ts
import { loadRecipe, runLicenseGate, detectTyposquats, buildLockfile } from "@nexural/factory";

// 1. Load + revocation check
const { recipe } = loadRecipe(parsedYaml, revocationList);

// 2. (cosign verify-attestation — outside this lib)
// 3. (Generate SBOM via cyclonedx-npm — outside this lib)

// 4. License gate
const gate = runLicenseGate(sbom, recipe.commercial_restricted_ok);
if (!gate.passed) throw new Error(`License gate failed: ${JSON.stringify(gate.failures)}`);

// 5. Typosquat check
const squats = detectTyposquats(sbom.map((s) => s.name));
if (squats.length) throw new Error(`Typosquat suspects: ${JSON.stringify(squats)}`);

// 6. Emit lockfile
const lockfile = buildLockfile({
  /* ... */
});
await writeFile(".nexural/forged.lock.yaml", yaml.dump(lockfile), "utf8");
```
