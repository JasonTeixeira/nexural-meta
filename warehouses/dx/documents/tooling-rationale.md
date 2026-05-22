# Why ESLint + Prettier (and which configs)

The dx warehouse pins a small, opinionated toolchain that's the same across every forged app.

## ESLint

Base config: `eslint-config-next` (which includes `@typescript-eslint`, `react`, `react-hooks`, `next/core-web-vitals`).

Add-on rules:

| Rule                                           | Why                                                                   |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| `@typescript-eslint/consistent-type-imports`   | Type-only imports stay separate → faster builds, smaller bundles      |
| `no-unused-vars: { argsIgnorePattern: "^_" }`  | Force-unused params get `_` prefix; everything else is a real warning |
| `no-console: [warn, { allow: [warn, error] }]` | `console.log` is a smell; `console.warn/error` is signal              |

## Prettier

Locked: 2-space, double quotes, semi, trailingComma:all, printWidth:100. Lower bus factor on style debates.

## .editorconfig

Forces LF endings on Windows clones — prevents the CRLF/LF lint storm.

## What we deliberately don't ship

- **Husky** — recipe-emitted apps don't get a pre-commit hook by default. Forge consumers can add their own; opinion belongs to the team, not the recipe.
- **lint-staged** — same reason.
- **A test framework** — each recipe picks one (the SaaS recipes use Playwright + Vitest; fintech adds property-based testing). Recipe-level choice, not dx-level.
