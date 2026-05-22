# POST_V1_BACKLOG.md

**Nexural Federation — Post-v1.0 Roadmap (v1.0)**
**Status:** Living document. Updated as items are scheduled or completed.
**Owner:** Sage
**Last reviewed:** 2026-05-21
**Decay rate:** 180 days

---

## 0. Purpose

Tier 3 items from the comprehensive audit. Real but not load-bearing for v1.0. Captured here so they don't get lost; each becomes its own ADR + phase when prioritized.

**Rules:**

- Items here are NOT promises. They're a curated wishlist that survived audit.
- Adding to this doc is free. Adding to BUILD_PLAN requires an ADR.
- Quarterly review (per OPS_CALENDAR §4) considers which items get promoted to ADR.

---

## 1. Additional warehouses (target: v1.1 expansion phase)

Worth considering when first need surfaces:

| Warehouse                | Reason to defer                   | Likely trigger                                |
| ------------------------ | --------------------------------- | --------------------------------------------- |
| `logging-warehouse`      | Overlaps with observability today | First app where log structure pays off        |
| `feature-flag-warehouse` | Implementations vary widely       | First app that needs phased rollout           |
| `embeddings-warehouse`   | Sub-domain of rag for now         | RAG product with non-default embedding choice |
| `finetune-warehouse`     | Out of scope for v1.0             | First app where fine-tune is the right call   |
| `tax-warehouse`          | Stripe Tax covers default cases   | First international fintech app               |
| `reporting-warehouse`    | Custom per product today          | First app with complex export needs           |
| `support-warehouse`      | Not yet pattern-rich              | First app with sustained support volume       |
| `docs-warehouse`         | One-off site builders             | First product with public docs                |

---

## 2. Additional recipes (target: v1.1+)

| Recipe                       | When to build                                       |
| ---------------------------- | --------------------------------------------------- |
| `saas-cron-worker`           | Background jobs via Inngest / BullMQ                |
| `saas-api-only`              | B2B product with no UI                              |
| `marketing-site-plus-app`    | Landing + app combo                                 |
| `cli-tool-emit`              | Sage wants to ship a tool, not a SaaS               |
| `chrome-extension-plus-saas` | Extension + backend                                 |
| `analytics-cron-app`         | Data pipeline + dashboard                           |
| `voice-agent-realtime`       | First voice product (warehouse: voice-warehouse)    |
| `mobile-app-expo`            | First RN/Expo product (warehouse: mobile-warehouse) |
| `fintech-trading-backtester` | First quant product (warehouse: trading-warehouse)  |

---

## 3. Operational hardening

- **Alternate npm registry path** — GitHub Packages as secondary. If npm yanks `@nexural/*`, federation can still publish.
- **Sigstore failure handling** — releases marked `provenance-pending`; auto-retry when service recovers.
- **Multi-region B2 replication** — Backblaze single-region risk; cross-replicate to a second region or AWS S3 Glacier as tertiary.
- **Multi-machine state sync** — optional Turso sync of `state.db` (config + telemetry index, no secrets).
- **Performance budgets formalized** — synthetic load test against MCP router with 30 fan-outs; 5GB local cache ceiling with LRU prune; telemetry SQLite compaction beyond 90 days.
- **Streaming UX** — `nx ask` streams synthesis to terminal in real time (depends on ADR-0010 §2.4 streaming cost wrap).
- **Backup of forged apps inherits from federation** — recipes emit pre-configured GHA workflow to `b2://nexural-apps/<name>/`.

---

## 4. Legal / compliance

- **B2B ToS template** — recipe emits a starter ToS.
- **DPA template** — recipe emits a starter DPA.
- **AI Act (EU) compliance posture** — applicable to forged apps shipping in EU; check Q1 2026 status.
- **CCPA / California privacy specifics** — recipe templates for opt-out flows.
- **State-specific tax obligations** — `tax-warehouse` (above) covers; defer until first paying customer in a complex state.
- **SOC 2 control mapping** — auditor-ready evidence beyond current qa-os bundles.
- **Open-sourcing warehouse content under CC-BY-SA-4.0** — ensure attribution flows work for public-tier warehouses.

---

## 5. Quality of life

- **Editor / IDE one-shot installer** — `nx setup-editor cursor|claude-code|vscode|zed`.
- **`nx upgrade --auto`** — batch-upgrade apps without prompts.
- **Recipe sharing / publishing** — can Sage publish a recipe for someone else to use? Out of scope v1.0.
- **Warehouse coupling metrics** — `nx coupling-report` graph of cross-refs; flag high-fan-out.
- **AI-assisted content drafting in `nx new`** — original BUILD_PLAN backlog item.
- **Cross-warehouse semantic search** (embeddings) in router — augments current keyword routing.

---

## 6. Testing depth

- **Snapshot tests for emitted apps** — expected file tree per recipe.
- **Integration tests across warehouses** — query routing scenarios.
- **Performance regression tests** — latency budgets enforced in CI.
- **Visual regression for dashboard** — Playwright + Percy or Chromatic.

---

## 7. AI / LLM extensions

- **Model output PII filtering** — currently caught by safety runners; could be inline middleware.
- **Bias testing cadence formalized** — current ai-bias runner; thresholds + cadence to be set.
- **Long-context handling per recipe** — compression / map-reduce for >100k token contexts.
- **Cost-aware routing fully realized** — ADR-0010 §2.8 mandates this for v1.0 but advanced policies (e.g., per-tenant tier-down) are post-v1.0.
- **AI session continuity beyond STATE.md** — context-preserving handoffs between sessions.

---

## 8. Federation / governance

- **Migration to `nexural` GitHub org** — currently `JasonTeixeira` personal account.
- **Recurring patterns** — bug-bash week, refactor week, content week scheduled annually.
- **Discipline against own drift** — soak waivers logged + quarterly review; if waivers exceed 2/quarter, ADR for discipline review.
- **Public open-source positioning** — public-tier warehouses on social, blog, etc.

---

## 9. Discipline scorecard expansion (per ADR-0009 §1.10)

v1.0 metrics:

- % merges with CI green
- % releases signed
- % LLM calls through wrapper
- % warehouses past 1× decay
- # force-pushes to main
- # `--no-verify` commits

Post-v1.0 candidates:

- % PRs with at least one human-review comment (when contributors join)
- Time-from-issue-open to first-comment (responsiveness)
- Mean recipe-validity score trend (rolling 30 days)
- Mean warehouse scorecard trend (rolling 30 days)
- Storage growth rate vs. content-growth rate (catches binary bloat)

---

## 10. Process

- Quarterly review (per OPS_CALENDAR §4): consider promoting items here to ADR + scheduled work.
- Items checked off here when shipped (annotate with version where shipped).
- Items removed only by ADR if the need has vanished.

## CHANGELOG

- **2026-05-21** v1.0 — Initial backlog from comprehensive audit Tier 3 findings.
