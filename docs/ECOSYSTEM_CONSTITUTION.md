# Ecosystem Constitution

**Status:** Phase 0 canonical doctrine
**Owner:** Sage Ideas LLC
**Date:** 2026-05-31

## Mission

Sage Ideas Engineering OS exists to make Sage faster, more consistent, and more
credible by turning repeated engineering work into reusable, evidence-backed
assets.

The system should compound. Every app should leave behind better recipes,
better playbooks, better engines, better tests, or better evidence.

## Constitutional Principles

1. **Sage Ideas is the umbrella.** Product names do not become ecosystem names.
2. **Registry before refactor.** Do not move or rename projects until the
   service-level registry proves why.
3. **Contracts before claims.** A reusable engine must declare install, API,
   env vars, tests, evidence, maturity, and consumers.
4. **Proof beats description.** Prefer test counts, deploy URLs, evidence
   hashes, runbooks, and diagrams over broad claims.
5. **Internal and public surfaces differ.** Public pages show redacted proof;
   internal dashboards show operational details.
6. **Apps are product proofs.** They demonstrate the system, but they do not
   define the system.
7. **QA is load-bearing.** No asset graduates without QA evidence or a documented
   reason it is not yet eligible.
8. **ADRs guard irreversible decisions.** Naming, repo boundaries, package
   contracts, service boundaries, and public claims require decision records.
9. **Local-first, provider-ready.** The factory must work locally, then expose
   clear paths to Vercel, Supabase, Stripe, model providers, and other runtime
   adapters.
10. **Maintenance is part of architecture.** Staleness, drift, missing docs, and
    broken evidence are architecture defects.

## Asset Types

| Asset type       | Definition                                                                         |
| ---------------- | ---------------------------------------------------------------------------------- |
| Control plane    | Service-level registry, orchestration, ADRs, CLI, dashboard.                       |
| Engine           | Reusable runtime capability consumed by multiple apps.                             |
| Kit              | Smaller reusable implementation block or adapter.                                  |
| Recipe           | Prescriptive app assembly path.                                                    |
| Playbook         | Human/agent procedure for a repeated operation.                                    |
| Resource library | Tool/SDK/provider catalog with verdicts and usage guidance.                        |
| Product proof    | Real app that demonstrates engine/recipe reuse.                                    |
| Reference        | Forked or archived source kept for learning, comparison, or implementation mining. |

## Maturity Levels

| Level | Name                       | Meaning                                                                   |
| ----: | -------------------------- | ------------------------------------------------------------------------- |
|    L0 | Reference                  | Useful as source material only.                                           |
|    L1 | Prototype                  | Works in a narrow local path; not yet reusable.                           |
|    L2 | Internal tool              | Has setup, tests, env docs, and owner/status.                             |
|    L3 | Reusable engine            | Has contract, examples, QA manifest, and at least one consumer.           |
|    L4 | Platform component         | Versioned, CI verified, evidence-backed, used across projects.            |
|    L5 | Productized infrastructure | Registry-listed, documented, deployable, monitored, and public-proofable. |

## Graduation Rules

An asset may move up only when evidence exists.

| Graduation | Minimum evidence                                                                              |
| ---------- | --------------------------------------------------------------------------------------------- |
| L0 to L1   | Local run proof or reproducible example.                                                      |
| L1 to L2   | README, setup command, test command, env example, owner/status.                               |
| L2 to L3   | Engine contract, QA manifest, consumer list, example app or integration.                      |
| L3 to L4   | Versioning, CI, evidence bundle, maturity score, multiple consumers or strong reusable proof. |
| L4 to L5   | Public/redacted proof, dashboard visibility, maintenance loop, documented adoption path.      |

## Service-Level Overlay

The service-level overlay may read, classify, score, and display project data. It
must not rewrite project internals during Phases 0-2. Project edits happen later
only when the registry identifies a high-value gap.

## Public Proof Standard

A public proof page must include at least four of:

- Architecture diagram.
- Test or QA evidence summary.
- Deployment or runtime proof.
- Before/after or case-study narrative.
- Redacted evidence bundle.
- Metrics such as route counts, tests, latency, cost, or build time.
- Clear statement of what remains incomplete.

## Operating Cadence

| Cadence   | Action                                                         |
| --------- | -------------------------------------------------------------- |
| Daily     | Use the registry to pick resources before building.            |
| Weekly    | Review stale repos, missing contracts, and QA failures.        |
| Monthly   | Publish or refresh one public proof artifact.                  |
| Quarterly | Re-score all L3+ assets and update ADRs if boundaries changed. |

## Phase 0 Boundary

Phase 0 locks names and doctrine only. It does not:

- Rename repos.
- Rename npm packages.
- Rewrite product code.
- Publish public claims.
- Change private app internals.
