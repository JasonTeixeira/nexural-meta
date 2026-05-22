# OPS_CALENDAR.md

**Nexural Federation — Operational Rhythm (v1.0)**
**Status:** Canonical. Changes require ADR.
**Owner:** Sage
**Last reviewed:** 2026-05-21
**Decay rate:** 180 days

---

## 0. Purpose

Every recurring federation task — content review, key rotation, drill, audit — lives in exactly one place: this calendar. Single source of truth so Sage doesn't have to reconstruct cadences from scattered docs.

Items in this document are **mandatory** if marked `[required]`. `[recommended]` items can be skipped with a logged reason in `STATE.md`.

---

## 1. Daily (auto)

Nothing manual. All daily work is automated cron via GitHub Actions.

| Task                                     | When      | Where                                   | Cadence health check                |
| ---------------------------------------- | --------- | --------------------------------------- | ----------------------------------- |
| Decay-warning telemetry                  | 02:00 UTC | `scripts/check-decay.mjs`               | Telemetry shows `decay_warn` events |
| Auto-archive stale deprecated warehouses | 02:30 UTC | `scripts/auto-archive-deprecated.mjs`   | Logs an entry per archive           |
| Discovery refresh                        | 03:00 UTC | `.github/workflows/discover.yml`        | Updated `registry-*.yaml`           |
| Verify-all (all warehouses scorecard)    | 04:00 UTC | `.github/workflows/verify-all.yml`      | Updated `scorecard.json`            |
| Cross-refs validation                    | 04:30 UTC | `.github/workflows/cross-refs.yml`      | Updated `cross-refs.json`           |
| Backup to B2                             | 05:00 UTC | `.github/workflows/backup.yml`          | New snapshot in B2                  |
| Recipe-validity re-emit + verify         | 05:30 UTC | `.github/workflows/recipe-validity.yml` | All recipes ≥ 80                    |
| Prompt-injection-resilience fuzz         | 06:00 UTC | qa-os runner via verify-all             | Synthesis ignores all payloads      |
| Discipline-scorecard (per ADR-0009)      | 06:30 UTC | qa-os runner via verify-all             | All discipline metrics green        |

**Sage's daily check (5 min):** glance at `nx health` once per working day. Anything red, open issue.

---

## 2. Weekly

| Day           | Task                                                  | Owner      | Time budget | Logged in                                                |
| ------------- | ----------------------------------------------------- | ---------- | ----------- | -------------------------------------------------------- |
| Mon 13:00 UTC | Weekly digest auto-emails                             | automation | 0 (auto)    | inbox                                                    |
| Mon 13:30 ET  | Review weekly digest                                  | Sage       | 15 min      | mental note; STATE.md if action needed                   |
| Tue           | Triage inbox (new tools spotted to add to warehouses) | Sage       | 15 min      | inbox files in respective warehouses                     |
| Wed           | Renovate PR review pass (deps, models)                | Sage       | 30 min      | merged PRs                                               |
| Thu           | Dogfood drill: forge a throwaway app from one recipe  | Sage       | 30 min      | `drills/weekly-forge-YYYYWNN.md` (template auto-created) |
| Fri           | Quality-trend glance — scorecard week-over-week       | Sage       | 10 min      | mental                                                   |
| Sun           | Stale-branch cleanup cron                             | automation | 0 (auto)    | deleted branches                                         |

**Total weekly Sage time: ~1.7 hours.**

---

## 3. Monthly (last Monday)

| Task                                                                       | Owner | Time   | Logged in                         |
| -------------------------------------------------------------------------- | ----- | ------ | --------------------------------- |
| Backup integrity check — restore one random warehouse from B2; verify hash | Sage  | 30 min | `drills/restore-drill-YYYY-MM.md` |
| Cost audit — actual vs. envelope per app, per recipe                       | Sage  | 30 min | dashboard `/costs` notes          |
| Vendor invoices reconciliation                                             | Sage  | 15 min | finance-personal-warehouse        |
| Top/bottom 5 warehouses by usage — flag deprecation candidates             | Sage  | 20 min | weekly digest action items        |
| Model registry sanity — any deprecations announced?                        | Sage  | 15 min | model-router PR if needed         |

**Total monthly extra Sage time: ~2 hours.**

---

## 4. Quarterly (calendar Q boundaries — Jan/Apr/Jul/Oct, first Sunday)

| Task                                                                                      | Owner | Time   | Logged in                                                  |
| ----------------------------------------------------------------------------------------- | ----- | ------ | ---------------------------------------------------------- |
| Lifecycle drill (per RETIREMENT.md §13)                                                   | Sage  | 30 min | `drills/lifecycle-YYYY-Qn.md`                              |
| YubiKey health check — insert both, test auth                                             | Sage  | 15 min | `drills/yubikey-check-YYYY-Qn.md`                          |
| Cold-start drill — bootstrap on spare machine, time RTO                                   | Sage  | 60 min | `drills/cold-start-YYYY-Qn.md`                             |
| Tabletop exercise — one scenario from THREAT_MODEL §4                                     | Sage  | 30 min | `drills/tabletop-YYYY-Qn.md`                               |
| Quarterly review of public-tier warehouses for content quality                            | Sage  | 60 min | per-warehouse PRs                                          |
| Recovery-email check (still controlled, MFA active)                                       | Sage  | 5 min  | mental                                                     |
| External MCP attestation refresh (e.g., ai-warehouse re-dogfood)                          | Sage  | 30 min | quality_attestation update in `registry-external-mcp.yaml` |
| Vendor SOC 2 / health audit (GitHub, B2, 1Password, Cloudflare, Stripe, Vercel, Supabase) | Sage  | 60 min | `vendor-reviews/YYYY-Qn.md`                                |

**Total quarterly Sage time: ~5 hours per quarter (~25 min/week amortized).**

---

## 5. Annual

| Task                                                              | Owner             | When          | Logged in                       |
| ----------------------------------------------------------------- | ----------------- | ------------- | ------------------------------- |
| Key rotation (YubiKey pair, age identity)                         | Sage              | Birthday      | `drills/key-rotation-YYYY.md`   |
| Shamir share verification (touch each share, confirm readable)    | Sage              | Birthday week | `drills/shamir-verify-YYYY.md`  |
| 1Password Emergency Kit verification                              | Sage              | Birthday week | `drills/1password-kit-YYYY.md`  |
| Full SUCCESSION drill with Technical Executor                     | Sage + TE         | Birthday week | `drills/succession-YYYY.md`     |
| Annual constitution rewrite review (all 6 docs + ADRs)            | Sage              | January 1     | per-doc CHANGELOG entry         |
| Annual cost audit — total federation + per-app COGS rollup        | Sage              | January 1     | `vendor-reviews/annual-YYYY.md` |
| Annual SBOM / vulnerability sweep across federation               | automation + Sage | January 1     | `security/annual-sweep-YYYY.md` |
| Annual recipe-by-recipe roadmap review (deprecate, merge, plan)   | Sage              | January 1     | ADR if changes                  |
| Annual public scorecards refresh                                  | automation        | January 1     | nexural.dev updated             |
| Annual full-tree pen-test (when MCP router goes internet-exposed) | external/Sage     | TBD post-v1.0 | `security/pentest-YYYY.md`      |

**Total annual Sage time: ~12 hours (~14 min/week amortized).**

---

## 6. On-demand (triggered)

Not on a calendar. Triggered by event:

| Trigger                                     | Action                                                                                            | Logged in                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------ |
| P0/P1 incident                              | Stop everything, follow `runbooks/incident-response.md`; file `incidents/YYYY-NN-*.md` within 24h | `incidents/`                   |
| Lost YubiKey                                | Run scenario A from THREAT_MODEL §4 within 1 hour                                                 | `incidents/`                   |
| Model deprecation announcement              | Open model-router PR within 7 days                                                                | `model-router` registry        |
| Stripe / Vercel / Supabase major API change | Open ADR if recipes affected; update warehouses                                                   | ADR + warehouse PRs            |
| Recipe found vulnerable                     | Add to `security/revoked-recipes.yaml`; push to registry                                          | revocation list                |
| New warehouse needed                        | `nx new <name>-warehouse`; PR to `nexural-meta` registry                                          | PR + STATE.md note             |
| Sage takes >2 weeks off                     | Pre-pause: extend decay rates 2×; note in `STATE.md` blockers                                     | STATE.md                       |
| Successor activation (per SUCCESSION.md)    | Follow SUCCESSION.md runbook                                                                      | `incidents/succession-YYYY.md` |

---

## 7. Total Sage time budget

| Cadence                      | Time per cycle | Weekly amortized |
| ---------------------------- | -------------- | ---------------- |
| Weekly tasks                 | ~1.7 hr        | 1.7 hr           |
| Monthly tasks                | ~2.0 hr        | 0.5 hr           |
| Quarterly tasks              | ~5.0 hr        | 0.4 hr           |
| Annual tasks                 | ~12.0 hr       | 0.2 hr           |
| **TOTAL operating overhead** |                | **~2.8 hr/week** |

**Net of `nx ask` usage, app authoring, and recipe iteration.**

ARCHITECTURE.md §1 metric "≤ 2 hours/week manual maintenance" is **aspirational**. Realistic steady-state per this calendar is ~2.8 hours/week. Audit metric updated to "≤ 3 hours/week" via ADR-0009 §1.10 amendment.

---

## 8. Export to actual calendar

A `scripts/ops-calendar-export.mjs` (Phase 2 deliverable) emits an `.ics` file from this doc that Sage subscribes to in macOS Calendar / Google Calendar. Auto-regenerated nightly so doc edits propagate.

---

## 9. Anti-patterns (banned)

- ❌ **Skipping a quarterly drill because "nothing's broken."** That's exactly when you check the drill still works.
- ❌ **Pushing a recurring task to "next week" three weeks in a row.** Three skips of the same task = file an issue and either fix the doc OR fix the task.
- ❌ **Letting `STATE.md` decay** — same discipline as warehouse content. Past 7 days untouched while building = warning.

## CHANGELOG

- **2026-05-21** v1.0 — Initial calendar consolidation.
