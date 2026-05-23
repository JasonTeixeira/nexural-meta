# @nexural/ask-engine

Federation-wide doc collector + FTS5 search engine. Phase 11.2 deliverable per ADR-0012 §5. Powers `nx ask`.

## What it indexes

| Source                                              | DocKind         | Example source label                  |
| --------------------------------------------------- | --------------- | ------------------------------------- |
| `docs/*.md` (constitution)                          | `constitution`  | `constitution:ARCHITECTURE`           |
| `docs/adr/*.md`                                     | `adr`           | `adr:0011-vertical-slice`             |
| `warehouses/<name>/documents/*.md`                  | `warehouse-doc` | `warehouse:auth:supabase-ssr`         |
| `recipes/<name>/{THREAT_MODEL,DECISIONS,README}.md` | `recipe-doc`    | `recipe:fintech-ledger-app:decisions` |
| `recipes/<name>/templates/eval/*.json`              | `eval`          | `eval:saas-rag-chat:golden-set`       |

## API

```ts
import { collectDocs, AskIndex } from "@nexural/ask-engine";

const docs = collectDocs({ root: process.cwd() });
const index = new AskIndex(docs);

const hits = index.search("how do we handle cost discipline?", {
  limit: 5,
  kinds: ["adr", "warehouse-doc"],
});

for (const hit of hits) {
  console.log(`${hit.source}  (score=${hit.score.toFixed(2)})`);
  console.log(`  ${hit.snippet}`);
}

index.close();
```

## Why FTS5

- Zero new deps (already use better-sqlite3 in the CLI for telemetry).
- BM25 ranking is production-grade.
- In-memory mode = sub-millisecond query latency.
- Stable; tested for 20+ years.

Phase 11.x can layer embedding-based retrieval on top — the `kind` + `source` columns will federate cleanly.

## License

MIT.
