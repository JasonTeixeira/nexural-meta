# ADR-0001: Existing `master` Branches Grandfathered

**Status:** Accepted
**Date:** 2026-05-20
**Deciders:** Sage
**Soak ended:** 2026-05-20 (legacy decision documented retroactively)

## Context

`nexural-qa-os` was built before the `main`-default convention was adopted by the federation. Its default branch is `master`. Renaming would require:

- Updating every CI workflow reference (`master` → `main`)
- Updating every external integration's webhook
- Updating every existing PR target branch
- Risk of breaking historical commit references

The benefit of renaming is purely conventional alignment. The risk is breakage of working infrastructure.

## Decision

**Existing repositories with `master` as default branch are grandfathered.** They MAY remain on `master` indefinitely.

**Future repositories MUST use `main`** as the default branch. This is enforced by the Terraform `repo-config` module (per BUILD_PLAN.md Phase 2), which sets `default_branch = "main"` on every new warehouse and federation repo.

### Currently grandfathered

| Repo            | Default branch | Reason grandfathered                                |
| --------------- | -------------- | --------------------------------------------------- |
| `nexural-qa-os` | `master`       | Pre-existing; v1.0.0 already shipped under `master` |

### Required for new repos

- `nexural-meta` — `main` (created Phase 2)
- All warehouse repos (`nexural-factory`, `nexural-lifeops`) — `main`
- All forged app repos — `main`

## Consequences

**Positive:**

- No breakage of working infrastructure.
- Clear policy: legacy stays, new is consistent.

**Negative:**

- Minor cognitive overhead remembering one repo is on a different branch.
- Workflow files in `nexural-qa-os` reference `master`; cross-repo workflows must accommodate.

**Neutral:**

- If `nexural-qa-os` is ever rebuilt or significantly refactored, renaming is acceptable but not required.

## Alternatives Considered

1. **Rename `nexural-qa-os` master → main now.** Rejected — working infrastructure should not be broken for cosmetic alignment.
2. **Allow either main or master for new repos.** Rejected — inconsistency creates ongoing decision cost.

## Soak Period

Documented retroactively. Decision has been operative since `nexural-qa-os` was created.
