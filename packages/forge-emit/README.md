# @nexural/forge-emit

Template render + filesystem emit engine for `nx forge`. Per ADR-0002, ADR-0011.

## What it does

Takes:

- a list of `TemplateFile`s contributed by warehouses
- an `EmitContext` (validated recipe inputs + resolved secrets + recipe identity + forge metadata)

Produces an in-memory `EmitResult` (filesystem tree, warnings, skipped files). The caller (`nx forge`) is responsible for writing that result to disk and running `git init`.

## Template syntax

Deliberately small Handlebars subset:

| Form                             | Meaning                                                         |
| -------------------------------- | --------------------------------------------------------------- |
| `{{ var }}`                      | substitute; errors on unknown var in strict mode                |
| `{{ var \| default:"foo" }}`     | substitute with fallback; warning emitted when default kicks in |
| `{{# if expr }}…{{/if}}`         | conditional block; truthy = keep                                |
| `{{# unless expr }}…{{/unless}}` | negated conditional                                             |

Resolution namespaces: `inputs.*`, `recipe.*`, `secrets.*`, `forge.*`. Bare names (`{{ slug }}`) default to `inputs.slug`.

## Why a custom renderer

Zero runtime dependencies in the render path. Federation tooling shouldn't carry an upstream-CVE surface for what is effectively a 200-line text-substitution problem.

## Safety floors

| Floor                  | Behavior                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Unresolved variable    | Hard error in strict mode (default).                                                           |
| Path traversal         | `..` segments or absolute paths in rendered `targetPath` = hard error.                         |
| Duplicate target paths | Two templates emitting to the same path = hard error.                                          |
| Secret leak            | Any rendered file containing the literal value of a known secret (≥ 8 chars) = hard error.     |
| Binary integrity       | A template flagged `binary: true` cannot contain `{{…}}` markers (probable misclassification). |

## Status

v0.1.0 — Phase 6.5 deliverable per ADR-0011.

## License

MIT.
