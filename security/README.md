# security/

Holds security-relevant artifacts referenced by ADRs.

## `revoked-recipes.yaml`

**Append-only.** Per ADR-0009 §1.6. `nx forge` reads this file before
emitting any recipe; a match halts emission with `recipe_revoked` error.

## Adding a revocation

1. Open a PR (NEVER commit directly to `main`)
2. Include reason (≥ 10 chars), recipe name, exact version
3. Sign the entry block via `cosign sign-blob` (or include in commit signature)
4. Link a GitHub issue documenting the discovery

Entries are NEVER removed. Even after a recipe is rewritten,
the revocation of the bad version stands as historical record.
