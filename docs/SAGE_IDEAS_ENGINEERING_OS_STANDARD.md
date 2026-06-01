# Sage Ideas Engineering OS Operating Standard

**Owner:** Sage Ideas LLC  
**Status:** Active operating standard  
**Scope:** Internal resource factory, reusable engines, kits, recipes, proof packets, and public-safe demonstrations.

## Purpose

The Sage Ideas Engineering OS exists to turn repeated software work into reusable, governed assets. An asset is not considered real infrastructure because it exists in a repository. It becomes part of the OS only when it is discoverable, scored, documented, tested, deployable when relevant, and safe to reuse in future projects.

## Maturity Levels

| Level | Meaning              | Minimum Standard                                                                                                                                       |
| ----- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| L0    | Raw/reference        | Useful material exists, but it is not governed or reusable yet.                                                                                        |
| L1    | Cataloged            | Metadata, owner, layer, type, and intended use are clear.                                                                                              |
| L2    | Runnable             | A second operator can install, run, or inspect it from documented commands.                                                                            |
| L3    | Reusable             | It has clear boundaries, examples, tests or checks, and known limitations.                                                                             |
| L4    | Load-bearing         | It is used by at least one real workflow, has automated verification, and has evidence artifacts.                                                      |
| L5    | Public-proof quality | It has hosted or otherwise independently verifiable proof, redaction-safe documentation, repeatable refresh automation, and a clear maintenance owner. |

## Green

An OS asset is green when:

- The latest check, test, or proof command passes from a clean checkout.
- The evidence artifact is current for its class: 48 hours for registry/proof exports, 7 days for golden-path deploy proof, 30 days for lower-change playbooks.
- The scorecard has no critical gap for the asset's role.
- The public-safe representation does not expose private names, secrets, local paths, customer data, or unreviewed claims.

## Deployable

A deployable asset must have:

- A documented deploy target and command.
- Environment variable names listed without secret values.
- A clean install path from committed files, including a lockfile where the platform expects one.
- Health verification after deploy.
- Evidence linking the deploy URL to the generated source hash, commit SHA, or run ID.

## Reusable

A reusable asset must have:

- A plain-language purpose.
- Fit-for-use boundaries: what it handles and what it does not handle.
- Inputs, outputs, and required secrets documented.
- At least one working example, recipe, or runbook.
- A maintenance note describing how it should evolve or be retired.

## Public-Safe

A public-safe asset may show:

- Public repository names and links.
- Aggregated private repo counts, layers, maturity bands, and score ranges.
- Redacted proof hashes, gate counts, and URLs intended for public verification.
- Honest gaps and limitations.

A public-safe asset must not show:

- Secret values, local machine paths, private repo names, customer data, unpublished client context, or credentials.
- Claims that imply mock/staging proof is production proof.
- Nexural as the umbrella company or ecosystem name. Nexural is a trading/investment product proof only.

## Score Targets

| Score  | Meaning       | Action                                                                     |
| ------ | ------------- | -------------------------------------------------------------------------- |
| 0-49   | Raw/reference | Keep as library material or upgrade metadata first.                        |
| 50-69  | Incomplete    | Add docs, owner, tests, proof, and classification overrides.               |
| 70-84  | Usable        | Safe for internal reuse with known limits.                                 |
| 85-94  | Strong        | Load-bearing and credible for client/employer discussion.                  |
| 95-100 | Elite         | Public-proof quality with automated refresh and low operational ambiguity. |

## Release Rule

Do not publish a capability claim until the matching evidence exists. If the proof uses mock credentials, local-only runtime, or staging-only infrastructure, say that directly. Public proof earns trust by showing the boundary, not by hiding it.
