# RETIREMENT.md

**Nexural Federation — Lifecycle: Archive, Deprecate, Merge (v1.0)**
**Status:** Canonical. Changes require ADR + 7-day soak.
**Owner:** Sage
**Last reviewed:** 2026-05-21
**Decay rate:** 180 days

---

## 0. Purpose

Most knowledge systems die not from being wrong but from being unmaintained, unfindable, or contradictory. By the time you have 30+ warehouses, some will be stale, some will overlap, some will stop mattering.

This document defines four lifecycle transitions every warehouse and content entry can go through:

1. **Deprecate** — "still works but stop using it"
2. **Merge** — "this content is moving"
3. **Archive** — "frozen; read-only forever"
4. **Resurrect** — "alive again" (rare)

---

## 1. The Status Field

Every warehouse and every content entry has a `status` field. Transitions are constrained:

```
seeded ──first content──> active
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         deprecated      merged       archived
              │             │             │
              └──resurrect──┴──resurrect──┘
                            │
                            ▼
                         active
```

| From → To                 | Allowed              | Requires                  |
| ------------------------- | -------------------- | ------------------------- |
| `seeded` → `active`       | yes                  | First content entry added |
| `active` → `deprecated`   | yes                  | Deprecation notice (§3)   |
| `active` → `merged`       | yes                  | Merge plan (§4)           |
| `active` → `archived`     | yes                  | Archive notice (§5)       |
| `deprecated` → `archived` | yes                  | After window expires      |
| `deprecated` → `active`   | yes (rare)           | Resurrection (§6)         |
| `archived` → `active`     | yes (very rare)      | Resurrection (§6)         |
| `merged` → `active`       | yes (extremely rare) | Un-merge (§4.6)           |
| Anything → `seeded`       | NO                   | One-way                   |

The status field is the single switch. All other behavior (quality gates, decay, dashboard color, MCP serving) keys off it.

---

## 2. Status Behavior Matrix

| Status       | MCP serves?                | Decay enforced? | Quality gate?  | Dashboard        | Discoverable?     |
| ------------ | -------------------------- | --------------- | -------------- | ---------------- | ----------------- |
| `seeded`     | empty + notice             | no              | exempt         | grey             | no                |
| `active`     | normal                     | yes             | ≥ 80           | green/yellow/red | yes               |
| `deprecated` | with warning + replacement | yes             | ≥ 70 (relaxed) | orange           | yes, with warning |
| `merged`     | redirects to `merged_into` | n/a             | n/a            | grey + arrow     | router redirects  |
| `archived`   | read-only; snapshot        | no              | exempt         | grey             | opt-in only       |

Enforced in `@nexural/mcp-base` middleware.

---

## 3. Deprecate

### When

- Domain shifted; new warehouse captures it better
- Consolidating two warehouses
- External dependency (model, API) sunset
- Warehouse was a mistake (low usage + low conceptual value)

**Threshold heuristic:** < 5 MCP calls/month for 3 consecutive months AND no human-authored update in 90 days = deprecation candidate (surfaced in monthly digest).

### Process

**Day 0:**

1. File ADR in `nexural-meta/docs/adr/NNNN-deprecate-<warehouse>.md`
2. Update `meta.yaml`: `status: deprecated`, add `deprecation: { reason, replacement, ends_at }`
3. Add `DEPRECATION.md` at repo root
4. Update README banner: ⚠️ **Deprecated**

**Day 0 → +90:**

- MCP serves with `warnings: [{ code: "deprecated", message: "Replacement: <name>" }]`
- Dashboard orange
- `nx ask` includes warning
- Quality gate relaxed to ≥ 70
- Cross-refs to this warehouse trigger linter warnings

**Day +90:**

- Auto-transitions to `archived` via cron unless ADR extends window
- Cross-refs PR-removed

### Deprecation block in `meta.yaml`

```yaml
status: deprecated
deprecation:
  declared_at: 2026-06-01
  ends_at: 2026-09-01
  reason: "Superseded by stronger framework in decision-warehouse v2"
  replacement: decision-warehouse
  replacement_pointers:
    - from: prompt.search
      to: decision.search
```

---

## 4. Merge

When two warehouses should fuse — overlap or one is a niche subset.

### When

- Significant overlap (>30% similar entries)
- Dense cross-warehouse `related` links
- Both individually small but together coherent

**Direction:** merge the smaller / less-active / younger INTO the larger / older / more-active.

### Process

**Phase A — Plan (Week 0):** ADR with mapping table, tag remapping, cross-ref updates, test plan.

**Phase B — Execute (Week 1):**

1. Source warehouse: tag `pre-merge-snapshot`
2. `nx migrate-merge --src <src> --dst <dst>`
3. Copy with provenance:
   ```yaml
   merged_from:
     warehouse: prompt-warehouse
     id: 01H8X...
     merged_at: 2026-06-15
   ```
4. PR on `dst`; verify scorecard ≥ 90; verify ask-queries
5. Merge

**Phase C — Redirect (Week 1):**

1. `src` `meta.yaml`: `status: merged`, `merged_into: <dst>`
2. Router redirects
3. README of `src` → one-pager pointing to `dst`
4. Plaintext content files removed (preserved in `pre-merge-snapshot`)

**Phase D — Cleanup (Week 2):**

1. Cross-refs migrated federation-wide
2. After 365 days no issues: `src` → `archived`

### 4.6 Un-merge

Extremely rare. ADR; restore from `pre-merge-snapshot`; status → `active`. **Lesson:** soak merges 30 days before final `merged` transition.

---

## 5. Archive

Terminal state. Frozen. Read-only. Still queryable but inert.

### When

- Deprecation window ended
- Domain genuinely no longer matters
- Product line shutdown
- Historically valuable but not actionable

### Process

1. Final ADR (if not coming from deprecation): `NNNN-archive-<warehouse>.md`
2. `meta.yaml`: `status: archived`, `archived_at: <date>`
3. Final scorecard → `ARCHIVE_SCORECARD.json`
4. README rewritten to one paragraph
5. GitHub: archive (read-only)
6. Branch protection removed
7. CI workflows disabled
8. Final tag: `v-final-<date>`
9. Registry shows archived
10. Backup continues — archived ≠ deleted
11. MCP server not redeployed

### Archive longevity

Forever unless:

- Legal reason requires deletion
- Data leak risk discovered

---

## 6. Resurrect

### When

- Trend you wrote off comes back
- Career/focus change
- New evidence reverses archive decision

### Process

1. ADR: `NNNN-resurrect-<warehouse>.md` — what changed and why
2. Status → `active`
3. `last_reviewed` → today
4. **Trigger 90-day refresh sprint:** every entry reviewed within 90 days; un-reviewed entries individually archived
5. Scorecard re-run; must reach ≥ 80 within sprint
6. Cross-refs re-validated

**Honest framing:** resurrect only what you'll tend.

---

## 7. Entry-Level Lifecycle

Same status field, smaller scale.

| Entry status | Behavior                                                                   |
| ------------ | -------------------------------------------------------------------------- |
| `draft`      | Not served. Not in `nx ask`. Visible via `nx open` only.                   |
| `active`     | Served. Counted.                                                           |
| `deprecated` | Served with warning + replacement pointer.                                 |
| `archived`   | Not served by default. Still in git. Accessible with `--include-archived`. |

Auto-rules:

- Draft > 30 days → linter warns
- Draft > 90 days → auto-archived
- Active past 2× decay → quarantine warning
- Active past 3× decay → auto-deprecated

Vetoable via `auto_lifecycle: false` (logs warning).

---

## 8. Decay Quarantine

| Days since `last_reviewed` | State           | MCP behavior                       |
| -------------------------- | --------------- | ---------------------------------- |
| ≤ `decay_rate_days`        | Fresh           | Normal                             |
| 1× to 2×                   | Stale           | Warning attached                   |
| 2× to 3×                   | Quarantined     | ⚠️ STALE prepended; error severity |
| ≥ 3×                       | Auto-deprecated | Status flips; PR auto-opened       |

**Cure:** `nx review <entry>` — opens in `$EDITOR`, updates `last_reviewed: today`, commits.

A review is not necessarily an edit — it's an affirmation. If during review changes are needed, fix and commit. The point is the deliberate touch.

Warehouse-level decay = max entry-level decay.

---

## 9. Discovery & Visibility

| Surface            | seeded                | active           | deprecated         | merged                 | archived                    |
| ------------------ | --------------------- | ---------------- | ------------------ | ---------------------- | --------------------------- |
| `nx ask` synthesis | excluded              | included         | included + warning | redirected             | excluded (opt-in)           |
| `nx search`        | with --include-seeded | included         | included           | included with redirect | with --include-archived     |
| `nx health`        | grey                  | colored by score | orange             | grey + arrow           | grey                        |
| Public `/w/`       | hidden                | listed           | listed + banner    | redirect               | listed in /archive          |
| `registry.json`    | excluded              | included         | included           | included + redirect    | included in archive section |
| Scorecard          | skipped               | run              | run (relaxed)      | skipped                | one-shot at archive time    |
| Backup             | yes                   | yes              | yes                | yes                    | yes (forever)               |

---

## 10. Automation

| Script                                | Cadence       | Purpose                                      |
| ------------------------------------- | ------------- | -------------------------------------------- |
| `scripts/check-decay.mjs`             | nightly       | `decay_warn` events; issues for quarantined  |
| `scripts/auto-deprecate-stale.mjs`    | weekly Sunday | PRs to deprecate active past 3× decay        |
| `scripts/auto-archive-deprecated.mjs` | nightly       | Deprecated → archived when window expires    |
| `scripts/auto-archive-drafts.mjs`     | weekly        | Stale drafts → archived                      |
| `scripts/digest-lifecycle.mjs`        | weekly Monday | Digest: deprecation/merge/archive candidates |
| `scripts/merge-helper.mjs`            | manual        | During merge process                         |
| `scripts/resurrect.mjs`               | manual        | During resurrection                          |

All scripts open PRs, never commit directly. Sage approves.

---

## 11. Communication

| Change       | Where announced                                  |
| ------------ | ------------------------------------------------ |
| Deprecation  | DEPRECATION.md + README banner + weekly digest   |
| Merge        | Both READMEs + digest + ADR                      |
| Archive      | README + digest + public changelog (public-tier) |
| Resurrection | Digest + ADR                                     |

Public-tier additionally publishes to `nexural.dev/changelog`.

---

## 12. Anti-Patterns

- ❌ **Silent archive** — flipping status without ADR
- ❌ **Deprecating without replacement** — if domain matters, point to a replacement
- ❌ **Eternal deprecation** — leaving in `deprecated` indefinitely
- ❌ **Hard-deleting content** — git is forever; archive ≠ rm -rf
- ❌ **Merging unsoaked** — no testing window
- ❌ **Skipping ADRs for "small" changes** — no such thing
- ❌ **Half-resurrection** — without the 90-day commitment
- ❌ **Manually editing `index.json`** — use status; index regenerates

---

## 13. Quarterly Lifecycle Drill (per OPS_CALENDAR §4)

30-minute drill:

1. Open weekly digest
2. Review:
   - Top 5 by usage — well-maintained?
   - Bottom 5 by usage — deprecation candidates?
   - Quarantined — schedule reviews or trigger deprecation
   - Drafts > 30 days — finish, archive, or commit to draft-on-purpose
3. Non-obvious decision → ADR proposal
4. Log in `drills/lifecycle-YYYY-Qn.md`

---

## 14. Document Maintenance

- Review every 180 days
- Changes require ADR + 7-day soak

## CHANGELOG

- **2026-05-21** v1.0 — Initial canonical draft (faithful reproduction; no ADR amendments needed).
