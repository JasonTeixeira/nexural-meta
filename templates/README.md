# templates/

Warehouse scaffolding templates per ARCHITECTURE §4.4 + ADR-0009 §1.5.

## 4 templates

| Template              | Tier              | Federation         | When to use                                                     |
| --------------------- | ----------------- | ------------------ | --------------------------------------------------------------- |
| `public-warehouse/`   | public            | factory            | Patterns to share with the community + downstream forged apps   |
| `internal-warehouse/` | internal          | factory or lifeops | Patterns owned by Sage that don't need to be public             |
| `private-warehouse/`  | private-encrypted | lifeops            | Personal/strategic content (age+sops encrypted; ULID filenames) |
| `mcp-only-warehouse/` | varies            | factory            | Domains where the MCP tools matter more than the content corpus |

## Used by

- `nx new <name>` — `@nexural/cli` reads these templates and applies token substitution
- `scripts/new-warehouse.mjs` — automation

## Token substitution

| Token       | Replaced with                       |
| ----------- | ----------------------------------- |
| `{{TOPIC}}` | warehouse topic slug (e.g., `auth`) |
| `{{TODAY}}` | ISO date (`2026-05-22`)             |
| `{{YEAR}}`  | calendar year (`2026`)              |

## Variant overrides

The non-public templates use a `.template-marker` documenting their overrides
relative to `public-warehouse`. `nx new --tier=<tier>` reads the marker and
applies the overrides on top of the public base.

## Authoring

`public-warehouse/` is the canonical full set of files. Other tiers override
only what differs. Keep the canonical synced; let inheritance handle the rest.
