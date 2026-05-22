# Changesets

Every PR that touches `packages/*/src/` MUST include a changeset.

## Adding a changeset

```bash
pnpm changeset
```

Then describe the change. Choose `patch | minor | major` per SCHEMA_CHARTER §5.

## CI gate

`.github/workflows/ci.yml` runs `pnpm changeset status` on every PR. PRs without a changeset fail.

## Versioning rules

See `docs/SCHEMA_CHARTER.md` §5 + ADR-0006 for canonical bump rules.
