# Public Proof Layer

**Status:** Phase 6 export-ready
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T00:02:06.443Z
**Packet hash:** `sha256:657307e634c055a6b49c1a1e003cd0044d55ed3241603ec151240e7d27ea77ea`

## Positioning

A private engineering resource factory that turns reusable engines, recipes, QA evidence, and product proofs into faster software delivery.

Brand boundary: Nexural is a trading/investment product proof, not the umbrella name for the company or engineering ecosystem.

## Proof Metrics

- Public repositories indexed: 136
- Private repositories summarized: 24
- Public assets scored: 160
- Broad public average: 20/100
- Load-bearing average: 60/100
- Resource use cases: 7
- Golden path: 7/7 gates in 69s

## Public Claims

- **The ecosystem has an indexed public registry.** 136 public repositories indexed; 24 private repositories summarized without names. Source: `data/ecosystem-registry.public.json`.
- **Assets are scored before they are reused.** 160 public assets scored; broad average 20/100, load-bearing average 60/100. This is a gap map, not vanity scoring. Source: `data/ecosystem-scorecard.public.json`.
- **Build choices are mapped to reusable resources.** 7 use cases mapped for daily navigation. Source: `data/ecosystem-resource-map.public.json`.
- **The factory path has a repeatable local proof.** 7/7 golden-path gates passed in 69 seconds. Source: `data/golden-path-runs.public.json`.

## Architecture

- **Control plane:** Registry, scorecards, proof packets. Coordinates resource selection, evidence, quality gates, and safe public exports.
- **Resource factory:** Reusable engines, kits, recipes, playbooks. Turns repeated project work into maintained building blocks.
- **Quality system:** QA OS, evidence hashes, release gates. Captures proof before claims are made publicly.
- **Product proofs:** Apps that demonstrate reusable patterns. Examples are shown as proof, not as umbrella branding.

## Recommended Public Assets

- [nexural-meta](https://github.com/JasonTeixeira/nexural-meta) - control-plane, 100/100, L4
- [sageideas.dev](https://github.com/JasonTeixeira/sageideas.dev) - public-proof-surface, 93/100, L3
- [JasonTeixeira](https://github.com/JasonTeixeira/JasonTeixeira) - public-proof-surface, 73/100, L2

## Publishable Sections

### What It Is

Sage Ideas Engineering OS is an internal app/resource factory: a governed library of engines, recipes, QA evidence, playbooks, and product proofs.

### Proof Metrics

Show registry counts, scorecard averages, use-case coverage, and golden-path gates from generated public-safe data.

### Golden Path

Latest proof run client-intake-portal-2026-05-31T234646217Z generated, built, started, and verified a local app with hash sha256:97ed607944ffc87872ba5d06f5223c364f75000171179a33a3ea6b90555d5977.

### Redaction Boundary

The public page should show architecture, evidence, and high-level metrics while keeping private repo names, secrets, customer details, and local paths out.

### Honest Gaps

Publish current limitations directly: live Vercel deploy proof is blocked without VERCEL_TOKEN, and private asset details require local review.

## Redaction Policy

- Commit public repository metadata only.
- Summarize private repositories by count, layer, maturity, and score band only.
- Do not publish private repo names, descriptions, URLs, local paths, secrets, customer data, or provider tokens.
- Frame product proofs as examples; do not imply Nexural is the umbrella brand.
- Publish gaps honestly, including missing live deploy credentials or non-production mock credentials.

## Remaining Gaps

- sageideas.dev has not consumed this export in this commit because that repo currently has a large pre-existing dirty worktree.
- The golden path is local-runtime proof; Vercel deployment remains blocked until VERCEL_TOKEN is available.
- Private asset maturity still needs local review before public claims can include deeper implementation detail.

## Export Targets

- `exports/sageideas-dev/engineering-os-proof.json`
- `exports/sageideas-dev/engineering-os-proof.md`
