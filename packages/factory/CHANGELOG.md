# @nexural/factory

## 0.1.0

Initial release — Phase 1 scope.

- `loadRecipe(rawManifest, revocationList, options?)` — parse + revocation check (ADRs 0002, 0009)
- `checkRevocation(name, version, list)` — direct revocation check
- `buildLockfile(input)` — validated `ForgedLockfile` constructor (ADR-0006)
- `runLicenseGate(sbom, commercialRestrictedOk?)` — fail forge on GPL/AGPL/BUSL/unknown (ADR-0006 §4)
  - `ALLOWED_BY_DEFAULT`, `STRONG_COPYLEFT`, `COMMERCIAL_RESTRICTED` sets
- `detectTyposquats(candidates, options?)` — Levenshtein-based typosquat detection (ADR-0009 §1.7)
  - `HIGH_PRIORITY_PACKAGES` curated target list
  - `levenshtein(a, b)` exported for direct use

Deferred to Phase 5 (when recipes ship): cosign signature shell-out, template emission engine, op:// secret resolution, pre/post-emit hooks.
