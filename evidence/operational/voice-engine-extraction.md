# voice-engine extraction — operational checklist

Per ADR-0013 §7, `voice-engine` is the fourth repo in the Sage Ideas ecosystem. It accidentally landed in `nexural-meta/packages/voice-engine/` via an earlier `git add -A` and has now been extracted.

## What I did automatically

1. **Copied** `packages/voice-engine/` (1 GB with node_modules) to `~/code/sage-ideas/voice-engine/` (1 MB clean) — excluded `node_modules`, `.venv`, `__pycache__`, `.pytest_cache`, `.next`, `telemetry.sqlite`.
2. **`git rm -r packages/voice-engine`** from `nexural-meta`. The directory is gone from this repo; its history remains accessible via `git log -- packages/voice-engine` if you ever need it.

## What you need to do (3 commands)

```bash
# 1. Initialize git in the extracted location
cd ~/code/sage-ideas/voice-engine
git init
git add -A
git commit -m "feat: initial commit — extracted from nexural-meta per ADR-0013 §7"

# 2. Create the GitHub repo + push
gh repo create JasonTeixeira/voice-engine --private --source=. --remote=origin --push

# 3. Verify
cd ~/code/nexural/nexural-meta
nx ecosystem health
# voice-engine should now show whether its binary is installable
```

## After push: copy CLAUDE.md + AGENTS.md

The bootstrap template is already in `nexural-meta/evidence/templates/repo-bootstrap/voice-engine.CLAUDE.md`:

```bash
cd ~/code/sage-ideas/voice-engine
cp ~/code/nexural/nexural-meta/evidence/templates/repo-bootstrap/voice-engine.CLAUDE.md CLAUDE.md
cp CLAUDE.md AGENTS.md
git add CLAUDE.md AGENTS.md
git commit -m "chore: add ecosystem-aware CLAUDE.md + AGENTS.md per nexural-meta"
git push
```

## Set the env var

Add to `~/.bash_profile` (or `~/.zshrc`):

```bash
export VOICE_ENGINE_ROOT=/Users/Sage/code/sage-ideas/voice-engine
```

Then `source ~/.bash_profile`.

`nx ecosystem env` should now show ✓ for `VOICE_ENGINE_ROOT`.

## What about the original `voice-engine` tab you mentioned?

If you have voice-engine in active development in another location (e.g., `~/projects/voice-engine/`), you have two paths:

1. **Use the extracted version as the canonical one** (recommended). Delete the other working copy; clone the new GitHub repo to wherever you want.
2. **Merge the two.** `cd` to your other working copy, `git remote add nexural-extracted ~/code/sage-ideas/voice-engine/.git`, fetch, merge, resolve any conflicts. Then `gh repo create` from that merged location.

Path 1 is cleaner. Path 2 only matters if your other working copy has unique commits worth preserving.

## Status

- ✓ Extracted from nexural-meta
- ✓ Available at `~/code/sage-ideas/voice-engine/`
- ⏳ Awaiting `gh repo create` (your action)
- ⏳ Awaiting CLAUDE.md + AGENTS.md addition (your action)
- ⏳ Awaiting `VOICE_ENGINE_ROOT` env var (your action)

Once those 3 manual steps are done, ADR-0013 §7 is satisfied and the ecosystem is at its real 4-repo shape.
