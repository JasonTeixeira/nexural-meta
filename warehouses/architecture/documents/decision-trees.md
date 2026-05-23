# Decision trees — "use X when Y" patterns

ADRs are for _load-bearing_ federation-level decisions. Decision trees are for _recipe-author_ and _project-builder_ decisions — picking between concrete vendors / patterns / tools at the surface where they're chosen.

Pattern vendored from [`ai-warehouse/DECISIONS.md`](https://github.com/JasonTeixeira/ai-warehouse/blob/main/DECISIONS.md) which catalogs 100+ tool-selection trees across the AI stack.

## Why a separate shape from ADRs

| ADR                                 | Decision tree                                |
| ----------------------------------- | -------------------------------------------- |
| Federation-wide commitment          | Project-level choice                         |
| Requires soak + lock                | Lives at the surface; can change per project |
| One-time decision                   | Reused on every new project                  |
| Example: ADR-0007 (cost discipline) | Example: "Which vector store?"               |

ADRs change rarely. Decision trees change as the market evolves.

## Shape of a decision tree

Each tree has 3 parts:

1. **The question** — phrased in plain user terms ("Which vector store do I use?")
2. **The branches** — each branch is a _condition_ + a _recommendation_ + the _constraint that pushes you there_
3. **The escape hatch** — when none of the standard branches fit, what to do

Example skeleton:

```markdown
## Which vector store?

**If** you have <1M chunks and want zero ops + RLS-native tenant isolation
**use** pgvector in Supabase
**because** one platform; tenant safety via Postgres RLS; cheapest path under 1M.

**If** you have >1M chunks OR query latency >50ms on pgvector
**use** Qdrant (cloud or self-host)
**because** purpose-built dense vector index; sub-50ms at billion scale; collection-per-tenant for hard isolation.

**If** you need filter-heavy structured queries alongside vectors
**use** Weaviate or Vespa
**because** richer query languages than pgvector; weaker than dedicated SQL.

**Escape hatch:** team has Pinecone / pre-existing Mongo Atlas / regulatory lock — use what's already approved + budget for the migration when the constraint lifts.
```

## Which trees does the federation maintain?

The federation's recipes already encode many of these trees implicitly via their DECISIONS.md files. The cross-cutting trees we publish here are the **vendor-selection** ones that apply across recipes:

- `vector-store-selection.md` — pgvector vs Qdrant vs Pinecone vs Weaviate
- `model-routing.md` — Anthropic vs OpenAI vs Ollama (covered by ADR-0007 chain)
- `auth-provider.md` — Supabase Auth vs Clerk vs Auth0
- `payment-provider.md` — Stripe vs Paddle (covered by recipe escapes)
- `observability.md` — Sentry + PostHog vs Datadog vs Honeycomb
- `ai-orchestrator.md` — Vercel AI SDK vs LangGraph vs Mastra vs custom

Each above is a STUB; flesh out when the first recipe needs it.

## When to add a new decision tree

When you find yourself writing the same "we picked X because Y, the alternative was Z" reasoning in 2+ recipes' DECISIONS.md files, extract it here.

## Why we vendor the pattern, not the catalog

`ai-warehouse` has 861 individual tool entries with verdicts. That's the _catalog_. The federation doesn't replicate the catalog — it references it via the external MCP server (see [`external-ai-warehouse-protocol.md`](external-ai-warehouse-protocol.md)).

What we vendor here is the _shape_ of "use X when Y" so federation recipe authors can write their own trees in a consistent voice.
