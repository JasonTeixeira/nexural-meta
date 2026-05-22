# @nexural/qa-runners

## 0.1.0

Initial release.

- `RunnerId` enum — typed identifiers for every runner in `nexural-qa-os`
- `RunnerPhase` enum — `fast | standard | thorough | deep`
- `DEFAULT_PHASE_MAP` — runner → default phase mapping
- `runnersForPhase(phase)` — list runners in a phase
- `isKnownRunner(id)` — type guard
- `RUNNER_COUNT` — sanity-check total
- Includes the 5 Nexural-introduced runners: `federation-conformance`, `recipe-validity`, `prompt-injection-resilience`, `discipline-scorecard`, `golden-set-drift` (per ADRs 0008, 0009, 0010)
