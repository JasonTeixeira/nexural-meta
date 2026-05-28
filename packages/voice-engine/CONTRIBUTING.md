# Contributing

This is primarily an internal engineering resource for Sage Ideas LLC.
External PRs are welcome but not the primary use case.

## How the codebase is organised

| Path                | What lives there                                                          |
| ------------------- | ------------------------------------------------------------------------- |
| `src/voice_engine/` | Engine code. Touch when adding cross-cutting features.                    |
| `personas/`         | Per-app voice agents (YAML). Add freely.                                  |
| `personas/_base/`   | Tier presets + base bases. Touch only when changing engine-wide defaults. |
| `mcp-servers/`      | Per-app or shared tool servers. Fork the calendar/rag examples.           |
| `recipes/`          | Drop-in templates. Add patterns here for repeated app shapes.             |
| `docs/`             | Reference docs + ADRs. Update when behaviour changes.                     |
| `tests/`            | Engine tests. Add for every new feature.                                  |
| `clients/`          | Mobile/native client SDKs.                                                |

## Local dev

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest tests/                       # 67 engine tests
pytest mcp-servers/calendar/tests/  # 6 calendar
pytest mcp-servers/rag/tests/       # 6 rag
```

## Writing a new persona

Use `nx-voice init <name>` to scaffold, then edit the system prompt + greeting. Pick a tier preset (`extends:`). Always add at least one scenario file (`<name>.scenarios.yaml`) before merging.

## Writing a new MCP server

Fork `mcp-servers/calendar/` (booking domain) or `mcp-servers/rag/` (search domain). Rename the package, swap the backend, expose tools with rich docstrings. Tool design rules: see [docs/MCP_SERVERS.md](./docs/MCP_SERVERS.md).

## Code style

- Python 3.11+. Type hints required.
- `ruff` for linting (`ruff check src/`).
- No comments that just restate what the code does.
- Comments only when _why_ is non-obvious.

## Adding a new provider

1. Add enum entry in `src/voice_engine/config.py`.
2. Add factory branch in `src/voice_engine/providers/<slot>.py`.
3. Add cost rates in `src/voice_engine/telemetry.py` `DEFAULT_COSTS`.
4. Add env var mapping in `src/voice_engine/doctor.py` `ENV_BY_PROVIDER`.
5. Add to pyproject.toml dependencies (pinned).
6. Add a test exercising the factory.
7. Document in README + relevant docs.

## Versioning

- Engine: semver. Bump in `pyproject.toml` + `src/voice_engine/__init__.py`.
- Personas: independent `version:` field in each YAML. Bump on prompt/stack changes.

## Commit message style

```
feat(voice-engine): <one-line summary>

<paragraph or two explaining the why and what>

<bullet list of major changes if multiple>

Co-Authored-By: …
```

## Pre-commit

The repo uses pre-commit hooks (formatting, typecheck). Don't skip with `--no-verify`.
