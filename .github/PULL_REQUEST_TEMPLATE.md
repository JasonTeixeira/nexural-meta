# Pull request

## What

<!-- 1-3 sentences -->

## Why

<!-- Reference: ADR-NNNN if applicable; warehouse / recipe if applicable -->

## Checklist (per AI_HANDOFF.md + ARCHITECTURE.md)

- [ ] Changeset added (`pnpm changeset`) if any `packages/*/src/` changed
- [ ] Tests added / updated; `pnpm test` green locally
- [ ] `pnpm typecheck` clean
- [ ] `pnpm format:check` clean
- [ ] No `// TODO: fix later` — issues filed instead with `// see #NN`
- [ ] No raw provider SDK imports — uses `@nexural/sdk.llmClient()` (per ADR-0007)
- [ ] If touching schemas: SCHEMA_AMENDMENTS.md updated and is canonical
- [ ] If touching naming: NAMING.md remains canonical (no inventing names)
- [ ] If breaking change: ADR proposed + soak window stated
- [ ] STATE.md updated at end of session

## Verification command(s) you ran

```
$ pnpm test
$ pnpm typecheck
$ pnpm build
```

## Risk

<!-- low / medium / high — and what could go wrong -->
