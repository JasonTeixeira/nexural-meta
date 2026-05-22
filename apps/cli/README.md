# @nexural/cli — `nx`

The single human-facing CLI for the Nexural Federation.

## Install

```bash
npm i -g @nexural/cli
nx --version  # 0.1.0
```

(Homebrew tap + Scoop bucket land in v0.2.0 once the Phase 4 verification gate signs off.)

## Commands at a glance

| Command                        | What it does                                                | Status                       |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------- |
| `nx ask "<q>"`                 | Synthesize answer from federation warehouses with citations | stub (Phase 4 wires router)  |
| `nx sync`                      | Pull all warehouses; auto-stash on conflicts                | ✅                           |
| `nx health`                    | Terminal dashboard                                          | ✅                           |
| `nx open <wh>`                 | `cd` + `$EDITOR`                                            | ✅                           |
| `nx forge <r> <n>`             | Emit a new app from a signed recipe                         | stub (Phase 5 wires recipes) |
| `nx play <pb>`                 | Execute a playbook with confirmations                       | preview-only                 |
| `nx new <name>`                | Scaffold a new warehouse                                    | ✅                           |
| `nx session save --note "..."` | Append entry to STATE.md                                    | ✅                           |

## Config

`~/.nexural/config.toml`:

```toml
nexural_home          = "~/.nexural"
warehouses_root       = "~/code/nexural/warehouses"
apps_root             = "~/code/apps"
router_url            = "stdio://nexural-meta-router"
telemetry_destination = "local"        # local | turso | none
llm_provider          = "anthropic"    # anthropic | openai | ollama
llm_model             = "anthropic:opus"
log_level             = "info"
editor                = "code -w"
federation            = "both"         # factory | lifeops | both
```

Every key has a `NEXURAL_<UPPER_SNAKE>` env var override (per NAMING.md §7).

## Telemetry

- Local SQLite at `~/.nexural/telemetry.db`
- `nx_command` event per invocation with `args_hash = sha256(joined-args)`
- **Raw args are NEVER stored** (SCHEMA_CHARTER §4.5 privacy rule)
- Disable entirely: `NEXURAL_NO_TELEMETRY=1`

## License

MIT.
