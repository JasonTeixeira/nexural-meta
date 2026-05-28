# Repo-bootstrap templates

Copy-paste these into the corresponding repos so every agent surface (Claude Code, Cursor, Codex, etc.) has the same ecosystem context.

| Template file             | Copy to                   |
| ------------------------- | ------------------------- |
| `ai-warehouse.CLAUDE.md`  | `ai-warehouse/CLAUDE.md`  |
| `ai-warehouse.CLAUDE.md`  | `ai-warehouse/AGENTS.md`  |
| `nexural-qa-os.CLAUDE.md` | `nexural-qa-os/CLAUDE.md` |
| `nexural-qa-os.CLAUDE.md` | `nexural-qa-os/AGENTS.md` |
| `voice-engine.CLAUDE.md`  | `voice-engine/CLAUDE.md`  |
| `voice-engine.CLAUDE.md`  | `voice-engine/AGENTS.md`  |

(The CLAUDE and AGENTS files have the same content — different filenames so different agent surfaces pick them up.)

## Quick install

From within `nexural-meta`:

```bash
# Assuming env vars are set (per ECOSYSTEM.md)
for repo in ai-warehouse nexural-qa-os voice-engine; do
  src="evidence/templates/repo-bootstrap/${repo}.CLAUDE.md"
  case "$repo" in
    ai-warehouse) dst="$AI_WAREHOUSE_ROOT" ;;
    nexural-qa-os) dst="$NEXURAL_QA_OS_ROOT" ;;
    voice-engine) dst="$VOICE_ENGINE_ROOT" ;;
  esac
  if [[ -d "$dst" ]]; then
    cp "$src" "$dst/CLAUDE.md"
    cp "$src" "$dst/AGENTS.md"
    echo "✓ wrote $dst/{CLAUDE,AGENTS}.md"
  else
    echo "✖ $dst not found — skipped"
  fi
done
```

Then in each repo:

```bash
cd $AI_WAREHOUSE_ROOT
git add CLAUDE.md AGENTS.md
git commit -m "chore: add ecosystem-aware CLAUDE.md + AGENTS.md per nexural-meta"
git push

# repeat for nexural-qa-os and voice-engine
```

After this, any agent reading any of the 4 repos sees the same ecosystem map + cross-repo MCP tool surface.
