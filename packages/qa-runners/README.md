# @nexural/qa-runners

Typed registry of runner identifiers exposed by `nexural-qa-os` (the Layer 4 verifier).

Lets warehouses + recipes import a single `@nexural/*` namespace and reference runners by stable string ID instead of crossing repos.

## Usage

```ts
import { RunnerId, runnersForPhase, isKnownRunner } from "@nexural/qa-runners";

// Type-safe runner reference
const runner: RunnerId = "federation-conformance";

// Enumerate by phase
const fastRunners = runnersForPhase("fast");

// Guard input
if (isKnownRunner(userInput)) {
  // userInput narrows to RunnerId
}
```

## Drift discipline

This package's runner list MUST stay in sync with `nexural-qa-os/runners/`.
Drift is detected by the `federation-conformance` runner (per ADR-0008 §3).
