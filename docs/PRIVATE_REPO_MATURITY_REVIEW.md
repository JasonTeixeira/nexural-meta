# Private Repository Maturity Review

**Owner:** Sage Ideas LLC  
**Privacy:** Public-safe process only. Private repository names stay in `.nexural/private/`.

## Purpose

The public scorecard can summarize private assets, but it must not publish private repo names or imply maturity that has not been reviewed. Private maturity review is the service-level control that turns raw private repos into reusable OS assets.

## Review Loop

1. Run `pnpm ecosystem:inventory`.
2. Open `.nexural/private/ecosystem-registry.internal.json` locally.
3. For each private repo marked `needs_private_review`, decide whether it is:
   - `reference-library`: useful material, not part of the load-bearing OS.
   - `engine`: reusable runtime, algorithm, service, or automation layer.
   - `kit`: starter, SDK, template, integration package, or reusable scaffold.
   - `product-proof`: app or deployed surface proving an engine or kit.
   - `quality-system`: tests, QA OS, validation, gates, or evidence tools.
   - `ops-knowledge`: runbooks, cloud, deployment, monitoring, or maintenance.
4. Add or update `.nexural/private/ecosystem-overrides.json`.
5. Run `pnpm ecosystem:score`.
6. Commit only the public-safe outputs under `data/` and `docs/`.

## Override Shape

```json
{
  "repositories": {
    "private-repo-name-redacted": {
      "canonical_name": "Internal name shown only locally",
      "layer": "quality-system",
      "asset_type": "engine",
      "maturity": "L4",
      "role": "Local-only role description."
    }
  }
}
```

## L4/L5 Review Questions

An asset can be `L4` only when:

- A second operator can run the documented workflow.
- It has current automated verification.
- It is used by at least one real app, proof, or OS workflow.
- Known gaps are recorded.

An asset can be `L5` only when:

- It has hosted or externally verifiable proof when deployment is relevant.
- Proof refresh is automated.
- Evidence links the run, hash, URL, and commit or source artifact.
- The public-safe version is reviewed for redaction risk.

## Public Claim Boundary

Private assets may increase internal confidence, but public pages can only claim:

- Private repository count.
- Layer distribution.
- Maturity band distribution.
- Aggregated average score.
- Existence of private review workflow.

Do not publish private repo names, private URLs, private descriptions, screenshots, secrets, client context, or internal implementation details from this process.
