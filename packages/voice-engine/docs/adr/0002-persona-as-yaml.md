# ADR-0002: Persona is a YAML file, not code

**Status:** Accepted (2026-05-22)
**Owner:** Sage

## Context

The thesis of this package is "one engine, infinite apps." For that to
deliver, the per-app surface must be **declarative and editable without
touching engine code**.

Two natural shapes:

1. Persona as code (subclass `Agent`, set attributes in `__init__`).
2. Persona as data (YAML file the engine loads at boot).

## Decision

**Persona as YAML.** One file per app, in `personas/<name>.yaml`,
validated by a Pydantic schema. Engine code never edits per-app.

## Rationale

- **Diff-friendly.** A prompt change is a 2-line YAML diff in git, not
  a Python rebase.
- **Tooling.** `nx-voice list` / `validate` / `generate-router` /
  `init` all operate on files, not classes.
- **Inheritance is trivial.** `extends: _base/cascaded.yaml` (ADR-0006
  implicit) gives DRY across 26 personas.
- **Non-engineer authoring.** A product person can write a persona.
- **Versioning.** `version: 1.0.0` field per persona, bumped on prompt
  changes. Aligns with our "schema before scale" principle.

## Trade-offs accepted

- YAML can't express arbitrary logic. For dynamic behaviour (tool
  selection, prompt assembly per turn), we use MCP servers — they're
  code, they can do anything, and they live OUT of the engine.
- Some IDE features (autocomplete, type errors) work less well in YAML
  than Python. Mitigation: Pydantic validation is loud and immediate
  via `nx-voice validate`.

## Consequences

- All new "voice apps" start with `nx-voice init <name>`.
- Persona-only changes don't need a Python release.
- Eval scenarios are also YAML (`<name>.scenarios.yaml`) for
  consistency.
