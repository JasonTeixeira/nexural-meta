# Daily Ops — how to actually use the federation

V1.0 is the framework. This doc is the habit loop that makes it living.

The federation has zero value if it's a tool you remember exists once a month. It has compounding value if it's the **first place you check** whenever a design question comes up on any project — and the place you push patterns back to whenever you discover something that should outlive a single project.

This is the rhythm.

---

## The four moves

Every interaction with the federation is one of four moves. Memorize these.

### 1. **Ask first** — before you write a line of code on a design question

You hit a question on a project: "How do we structure auth?" "What's our pattern for X?" "Have we already decided about Y?"

```bash
cd ~/code/nexural/nexural-meta
nx ask "your question here"
```

Returns ranked excerpts from the constitution, ADRs, warehouse docs, recipe THREAT_MODEL/DECISIONS — pointing you at exactly where the federation has already thought about this. Less than a second. No LLM cost.

Filter when you know what kind of answer you want:

```bash
nx ask "cost discipline" --kinds=adr           # decisions only
nx ask "supabase ssr"   --kinds=warehouse-doc  # patterns only
nx ask "tenant isolation" --limit=10           # broader scan
nx ask "RLS" --json | jq .hits[0].path         # pipe into editor
```

**Habit cue:** "before I touch architecture in any project, I ask the federation first."

### 2. **Forge second** — when you're starting a new project

The federation produces apps. Don't hand-roll the same Next.js + Supabase + Stripe + Sentry boilerplate every time.

```bash
cd ~/code/nexural/nexural-meta
nx forge saas-multitenant-baseline my-new-client \
  --inputs ./client-config/inputs.json
```

Recipe roster reminder (V1.0):

- `saas-multitenant-baseline` — tenant SaaS with auth, payments, RLS, observability
- `saas-rag-chat` — RAG-over-docs chat
- `fintech-ledger-app` — double-entry ledger
- `internal-tool-dashboard` — admin tools (no marketing, RBAC, MFA)

**Habit cue:** "if it's a new app, the first command I run is `nx forge`, not `npx create-next-app`."

### 3. **Patch warehouses back** — when you discover something that should outlive this project

You're working on a client project. You discover a new pattern, hit an edge case, find a better way to do something. **Do not let that knowledge die in this one project.**

- Open the federation: `cd ~/code/nexural/nexural-meta`
- Find the relevant warehouse: `nx ask "<topic>" --kinds=warehouse-doc`
- Edit the warehouse's doc OR template
- Add an ADR if it's a load-bearing decision
- Commit + push

The next forge inherits the lesson. The next ask returns the answer.

**Habit cue:** "every project's lessons-learned belongs in the federation, not in a Notion doc that goes stale."

### 4. **Verify after deploy** — when you ship something forged from the federation

```bash
nx verify https://your-app.vercel.app \
  --evidence-slug my-app-prod
```

Checks security headers, `/api/health`, `X-Powered-By` absence, etc. Closes ADR-0011 gate 5. Evidence written to `evidence/gate-5/<slug>/report.json`.

**Habit cue:** "between deploy and `done`, `nx verify` is the gate."

---

## Daily-ops cadence

| When                                     | What                                                   |
| ---------------------------------------- | ------------------------------------------------------ |
| **Start of a new project**               | `nx forge <recipe>`                                    |
| **Hit a design question on any project** | `nx ask "..."`                                         |
| **Discover a pattern worth keeping**     | Patch a warehouse doc + commit                         |
| **Deploy something**                     | `nx verify <url>`                                      |
| **End of week (Friday)**                 | Glance at federation health — see "weekly check" below |
| **Quarterly (next: 2026-08-22)**         | Federation review per ADR-0009 §1.10                   |

## Weekly check (Friday, ~5 min)

```bash
cd ~/code/nexural/nexural-meta

# Pull anything that landed remotely
git pull --rebase

# Run the federation health check
node scripts/health-check.mjs

# Eyeball evidence/health/<latest>.json
ls -lt evidence/health/ | head -3
cat evidence/health/$(ls -t evidence/health/ | head -1) | jq .summary
```

The 5 federation runners catch decay before it becomes drift.

---

## What to do when

### "I need to know what we've decided about X"

```bash
nx ask "X" --kinds=adr,recipe-doc
```

ADRs hold load-bearing decisions. Recipe `DECISIONS.md` files hold per-recipe locked opinions (chunk sizes, model chains, cost caps, etc.).

### "I want to read the constitution"

```bash
nx ask "naming\|verification\|architecture" --kinds=constitution
# or just open docs/ in your editor
```

### "I want to see what changed recently"

```bash
git log --oneline -20
# Or, more useful:
gh release list --limit 5
```

### "I want to add a new recipe"

1. Read ADR-0008 §7 (per-recipe THREAT_MODEL + DECISIONS required)
2. Read ADR-0011 (vertical slice doctrine — 6 gates before `shipped`)
3. `cp -r recipes/saas-multitenant-baseline recipes/your-new-recipe`
4. Edit `recipe.yaml`, `inputs.zod.ts`, `THREAT_MODEL.md`, `DECISIONS.md`, `README.md`
5. Add a fixture: `test/fixtures/your-new-recipe.inputs.json`
6. Test forge: `npx tsx apps/cli/src/bin/nx.ts forge your-new-recipe test --dry-run`
7. Commit. The conformance runner will check it on the next push.

### "I want to add a new warehouse"

1. `mkdir -p warehouses/<name>/{documents,templates}`
2. Write `warehouses/<name>/manifest.yaml` (validated by `WarehouseManifest` schema)
3. Add documents (`*.md`) and/or templates (`*.template`)
4. Declare each template's `consumers` array — which recipes can use it
5. Test forge against a consuming recipe with `--dry-run`
6. Commit. nx ask picks it up immediately.

### "I want to use a warehouse from outside the meta-repo"

The MCP server lets any client query a warehouse over stdio:

```json
{
  "mcpServers": {
    "nexural-auth": {
      "command": "npx",
      "args": ["nexural-warehouse-server", "--root", "/abs/path/to/warehouses/auth"]
    }
  }
}
```

Wire into your editor's MCP config; `warehouse_read_document`, `warehouse_list_documents`, etc. become callable tools.

### "I want to publish a new package"

1. Create the package under `packages/<name>/`
2. Bump version per semver (1.x.0 for additive, 1.0.x for fixes)
3. Tag the federation: `git tag v1.0.X && git push origin v1.0.X`
4. **Verify it landed:** `npm view @nexural/<name>@<version> version`
5. If it 404s — the token doesn't have scope-create for new packages. See `evidence/operational/sage-blockers.md` §1.

---

## Anti-patterns — don't do these

- **Re-implementing patterns in client code instead of patching warehouses.** That knowledge dies with the project. Push back.
- **Skipping `nx ask` because "I'll just remember."** You won't. Asking is cheaper than remembering.
- **Tagging the federation without verifying npm publish.** Use `npm view` after every tag.
- **Cutting the slice doctrine on a new recipe.** ADR-0011 isn't optional; it's why V1.0 is honest.
- **Adding warehouses with no consumer declared.** Templates with empty `consumers: []` are unreachable.

---

## When something breaks

| Symptom                                              | First check                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `nx ask` returns no results                          | You're not in nexural-meta repo, or run `git pull`                                                |
| `nx forge` errors `secret_leak`                      | A template has a literal secret value. Fix the template, not the leak.                            |
| `nx forge` errors `duplicate_path_across_warehouses` | Two warehouses claim the same target path. One must rename or move to recipe-local.               |
| `nx forge` skips warehouses                          | The warehouse directory doesn't exist. Either build it or remove from `recipe.yaml.warehouses[]`. |
| `nx verify` HSTS fails                               | Vercel deploys HSTS by default; check you're calling `https://`, not `http://`                    |
| npm publish "successful" but `npm view` 404s         | Token lacks scope-create permission. Rotate the token.                                            |

---

## Reading order

If you've stepped away for a while and forgotten where things are:

1. `STATE.md` — current state, recipe slice statuses
2. `README.md` — at-a-glance
3. `docs/V1_ANNOUNCEMENT.md` — what V1.0 means
4. `docs/ARCHITECTURE.md` — system shape
5. `docs/adr/0001-*.md` through `docs/adr/0012-*.md` — locked decisions

For agents / editor MCP clients, the MCP server (`@nexural/warehouse-server`) provides programmatic access to all of the above.

---

## The contract with yourself

The federation works to the degree you use it. The four moves above aren't a roadmap — they're a habit. Treat them as the rhythm of any project that touches:

- A new app (forge)
- A design question (ask)
- A discovered pattern (patch)
- A deployment (verify)

That's the V1.0 contract. Everything else (Phase 11.x improvements, V1.1, V2) is incremental.
