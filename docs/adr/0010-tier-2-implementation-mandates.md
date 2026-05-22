# ADR-0010: Tier 2 Implementation Mandates from Comprehensive Audit

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak:** Sage waived; treat as locked at merge
**Depends on:** ADR-0009

## Context

The comprehensive audit identified 10 Tier 2 gaps that close _during_ implementation phases rather than before them. They are real institutional weaknesses but bound to specific code surfaces. This ADR locks them as **mandates** — each implementation phase must honor its assigned items.

This is the bridge between Phase 0 design and Phase 1 build.

## Decision

### 2.1 NAMING and SCHEMA_CHARTER amendments merged into canonical docs

**Mandate:** Canonical NAMING.md and SCHEMA_CHARTER.md include all ADR-0003 / 0006 / 0007 / 0008 amendments inline.

**Phase:** Closed in Phase 0 closeout (this session).

### 2.2 OPS_CALENDAR.md as single source for recurring tasks

**Mandate:** `docs/OPS_CALENDAR.md` is canonical. Other docs may reference cadences only by linking to it.

**Phase:** Closed in Phase 0 closeout (this session).

### 2.3 `nx sync` conflict resolution + MCP hot reload

**Mandate (Phase 3):**

- `nx sync` checks each warehouse clone for local changes before pulling.
- If local changes exist: auto-stash with named stash (`nexural-sync-<ts>`); pull; alert user to stash.
- If conflict on stash pop: leave conflict in tree; warn user.
- `nx sync --force` available for "I know what I'm doing" cases; logged as discipline-scorecard event.

**Mandate (Phase 4):**

- `apps/router` watches `registry-*.yaml` for SHA changes via file watcher.
- On change: graceful restart of affected warehouse MCP child process (drain inflight calls; reconnect new process).
- Stale connections held by Claude Desktop / Cursor re-establish automatically.

### 2.4 Streaming-response cost wrap

**Mandate (Phase 1 — `@nexural/sdk.llmClient()`):**

- Wrapper supports both buffered and streaming responses.
- For streams: re-check projected total cost every 100 emitted tokens against `per_request_usd` cap.
- If projected total > cap: cancel stream; return partial response + `cost_cap_streaming_exceeded` warning.
- Streamed tokens already paid for are NOT refunded (provider charges; we just stop).
- Telemetry: `cost_event` with `severity: warn` at 80% of cap during stream; `severity: exceeded` at 100%.

### 2.5 Property-based + mutation testing

**Mandate (Phase 1 — `@nexural/schema`):**

- Every Zod schema has a property-based test using `fast-check`. Property: "round-trip parse → stringify → parse equals input."
- Coverage: 100% of schemas (target unchanged from Phase 1 verification).

**Mandate (Phase 8 hardening):**

- Mutation testing via `stryker-mutator` nightly across `@nexural/*` packages.
- Threshold: mutation score ≥ 70%. Failures = PR auto-opens with surviving mutants.

### 2.6 Recipe migration codemods

**Mandate (Phase 5 — recipe authoring discipline):**

- Each recipe ships a `migrations/` directory.
- Format: `migrations/v<from>-to-v<to>.codemod.ts`. Each codemod is a deterministic transformation of an emitted app from one recipe version to the next.
- `nx upgrade <app>` runs codemods automatically; produces a PR.
- Codemods are tested: a v1 forged app + chained codemods must equal a freshly forged v<latest> app (modulo timestamps).

### 2.7 Federation-level CHANGELOG aggregator

**Mandate (Phase 2):**

- `scripts/aggregate-changelogs.mjs` exists.
- Runs weekly (Monday 12:30 UTC, ahead of digest).
- Pulls CHANGELOG.md from every federation repo (factory + lifeops + recipes + `@nexural/*`).
- Emits `nexural-meta/CHANGELOG-FEDERATION.md`.
- Linked from dashboard `/changelog`.

### 2.8 Cost-aware LLM routing

**Mandate (Phase 1 — `@nexural/model-router`):**

- `ModelFamilyResolution` schema includes `price_ceiling_usd_per_million_tokens` (already in SCHEMA_AMENDMENTS.md §8).
- Router checks current pricing against ceiling on every resolution.
- If primary family's current pricing > ceiling: substitute next family in the chain.
- Substitution logged as discipline-scorecard event.

### 2.9 Eval golden set drift handling

**Mandate (Phase 6 — `saas-rag-chat` recipe + eval-warehouse):**

- Recipe ships golden set (≥50 Q&A pairs).
- New runner: `golden-set-drift`. Monthly run re-evaluates golden set against current resolved models.
- If >5% answer drift detected: PR auto-opens with diff for human review.
- Drift threshold tunable per recipe.

### 2.10 Agent platform tool-call validation

**Mandate (Phase 6 — `saas-agent-platform` recipe):**

- Recipe template includes a tool registry with explicit Zod schemas per tool.
- Tool-call validation:
  1. Zod-parse the args. Failure → reject.
  2. Compare tool name against session whitelist. If tool not pre-approved for this session, reject.
  3. Log every tool-call (raw + approved/rejected) as a `tool_call_audit` event.
- Out-of-band tool-calls (i.e., tools requested by LLM but not in registry) hard-reject and trigger security event.
- Recipe ships ≥10 known prompt-injection-via-tool-call test cases; all must be rejected by validation.

## Consequences

**Positive:**

- Tier 2 gaps closed at the right time (during the phase that creates the surface).
- Each phase has a clear "what's mandated here" list.
- Federation hits ~99/100 once these land.

**Negative:**

- Phase 1 grows: streaming wrap + property-based testing + cost-aware routing.
- Phase 6 grows: golden-set drift runner + agent tool validation.
- Some mandates require new runners (golden-set-drift) on top of existing qa-os work.

**Neutral:**

- Each mandate is small in isolation; cumulative work is real but bounded.

## Alternatives Considered

1. **Skip Tier 2 entirely for v1.0.** Rejected — ships at ~98/100 with known weaknesses.
2. **Treat Tier 2 as v1.1 backlog (already-shippable v1.0).** Rejected — these gaps surface during normal operation; better to close them while building the surface than retrofit.
3. **Cluster all Tier 2 into a single Phase 8 hardening pass.** Rejected — many items must be in place when the surface is first built (e.g., property-based testing on schemas), not bolted on later.

## Verification

Phase verification gates in VERIFICATION.md amended:

- Phase 1 §1: add streaming cost wrap test, property-based test coverage, cost-aware routing test
- Phase 2 §2: add federation CHANGELOG aggregator test
- Phase 3 §3: add `nx sync` conflict test
- Phase 4 §4: add MCP hot-reload test
- Phase 5 §5: add migration codemod presence
- Phase 6 §6: add golden-set drift runner + agent tool-call validation tests
- Phase 8 §8: add mutation testing threshold

## Soak

Sage waived. Documented in STATE.md.
