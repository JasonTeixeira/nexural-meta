# TypeScript strict-mode discipline

Every forged app ships with strict mode + the two opt-in flags that catch the most production bugs.

## Required compiler options

| Flag                         | Why                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `strict: true`               | Baseline.                                                                        |
| `exactOptionalPropertyTypes` | `{ x?: string }` no longer allows `x: undefined` — catches sloppy spread writes. |
| `noUncheckedIndexedAccess`   | `arr[i]` is `T \| undefined` — forces bound checks.                              |
| `noImplicitOverride`         | `override` keyword required on subclass method overrides.                        |
| `noFallthroughCasesInSwitch` | Every `case` ends with `break` / `return` / `throw`.                             |

## Tradeoffs

`exactOptionalPropertyTypes` forces conditional spreads:

```ts
// Wrong (now an error)
return { name, suffix: opts.suffix }; // when suffix is `string | undefined`

// Right
return { name, ...(opts.suffix !== undefined ? { suffix: opts.suffix } : {}) };
```

This is annoying for ~1 day then disappears as muscle memory.

## Why not vanilla strict

Vanilla strict still lets `arr[i]` be `T` (not `T | undefined`), which is the #1 source of "Cannot read property 'foo' of undefined" in production Next.js apps.
