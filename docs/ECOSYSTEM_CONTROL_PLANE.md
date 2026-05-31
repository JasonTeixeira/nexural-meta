# Ecosystem Control Plane

**Status:** Phase 3 operator layer
**Owner:** Sage Ideas LLC
**Date:** 2026-05-31

## Purpose

The ecosystem control plane turns the Sage Ideas Engineering OS from a list of
repositories into an operator surface. It answers:

- What assets exist?
- Which assets are load-bearing?
- Which layer should I use for a new build?
- What is mature enough to reuse?
- What gaps should be fixed first?
- Which private repos still need canonical metadata?

## Operator Loop

Run the refresh before using the dashboard for planning:

```bash
pnpm ecosystem:refresh
```

This runs:

1. `pnpm ecosystem:inventory`
2. `pnpm ecosystem:score`
3. `pnpm ecosystem:map`

Then start the dashboard:

```bash
pnpm --filter @nexural/dashboard dev
```

Open:

```text
http://localhost:3000/ecosystem
```

## Dashboard Surface

The Phase 3 dashboard page is:

```text
apps/dashboard/src/app/ecosystem/page.tsx
```

It provides:

- Top-level repo and score metrics.
- Public/private count summary.
- Load-bearing asset average.
- Filterable registry explorer.
- Layer, maturity, score-band, gap, and load-bearing filters.
- Gap queue for public load-bearing assets below 70.
- Private override workflow.
- Resource navigator for "what should I use to build X?" decisions.

## Privacy Boundary

`nexural-meta` is public. Private repository names and descriptions must not be
committed to public artifacts.

Committed public-safe artifacts:

```text
data/ecosystem-registry.public.json
data/ecosystem-scorecard.public.json
docs/ECOSYSTEM_INVENTORY.md
docs/ECOSYSTEM_SCORECARD.md
```

Local-only private artifacts:

```text
.nexural/private/ecosystem-registry.internal.json
.nexural/private/ecosystem-scorecard.internal.json
.nexural/private/ecosystem-overrides.json
```

## Private Override Workflow

Create `.nexural/private/ecosystem-overrides.json` with this shape:

```json
{
  "repositories": {
    "private-repo-name": {
      "canonical_name": "Human-readable name",
      "layer": "product-proof",
      "asset_type": "product-proof",
      "maturity": "L3",
      "role": "Private product proof; public details redacted."
    }
  }
}
```

Then run:

```bash
pnpm ecosystem:refresh
```

The internal registry uses the override. The committed public registry still
summarizes private repos only by count, layer, type, maturity, score band, and
gap type.

## Promotion Rules

Use the control plane before starting a build:

1. Search for an existing engine, kit, recipe, or playbook.
2. Prefer L3+ assets.
3. If the best matching asset is below 70, fix its gap before building on top.
4. If no reusable asset exists, build the new asset with an owner, docs, tests,
   evidence, and a future graduation path.
5. If an app proves a reusable pattern, move the pattern into a kit, recipe, or
   playbook and rerun the scorecard.

## Current Phase 3 Limits

- Filters are server-rendered query-param filters, not client-side live state.
- Private overrides are file-based, not a UI write flow.
- Scores are heuristic until project-local evidence manifests are connected.
- The public proof layer on `sageideas.dev` is not wired yet.

Those limits are intentional. Phase 3 establishes the control plane. Later
phases can add API routes, local write actions, and public proof exports.
