/**
 * FTS5 index + ranked search over collected federation docs.
 *
 * Uses sqlite FTS5 because it's:
 *   - Zero new deps (already use better-sqlite3 in @nexural/cli telemetry)
 *   - Production-grade BM25 ranking
 *   - In-memory or on-disk
 *   - Stable + tested for 20 years
 *
 * Phase 11.2 deliverable. Future Phase 11.x can layer embedding-based
 * retrieval on top (the `kind` + `source` columns let us federate the
 * two search paths cleanly).
 */

import Database from "better-sqlite3";
import type { CollectedDoc, DocKind } from "./collector.js";

export interface SearchOptions {
  /** Max results returned. Default 5. */
  readonly limit?: number;
  /** Filter by kind. */
  readonly kinds?: ReadonlyArray<DocKind>;
  /** Number of characters of context around each match. Default 200. */
  readonly snippetChars?: number;
}

export interface SearchHit {
  readonly path: string;
  readonly kind: DocKind;
  readonly title: string;
  readonly source: string;
  /** FTS5 BM25 score. Lower = better in FTS5; we negate so higher = better. */
  readonly score: number;
  /** Excerpt with the matched terms surrounded by [[…]]. */
  readonly snippet: string;
}

export class AskIndex {
  private readonly db: Database.Database;
  private readonly docCount: number;

  constructor(docs: ReadonlyArray<CollectedDoc>, opts: { dbPath?: string } = {}) {
    this.db = new Database(opts.dbPath ?? ":memory:");
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      create virtual table if not exists docs using fts5(
        path UNINDEXED,
        kind UNINDEXED,
        title,
        source UNINDEXED,
        body,
        tokenize = 'unicode61 remove_diacritics 2'
      );
    `);
    const insert = this.db.prepare(
      "insert into docs (path, kind, title, source, body) values (?, ?, ?, ?, ?)",
    );
    const txn = this.db.transaction((rows: ReadonlyArray<CollectedDoc>) => {
      for (const d of rows) {
        insert.run(d.path, d.kind, d.title, d.source, d.body);
      }
    });
    txn(docs);
    this.docCount = docs.length;
  }

  get size(): number {
    return this.docCount;
  }

  search(query: string, opts: SearchOptions = {}): SearchHit[] {
    const limit = opts.limit ?? 5;
    const snippetChars = opts.snippetChars ?? 200;
    const safe = escapeFtsQuery(query);
    if (safe.length === 0) return [];

    const kindFilter =
      opts.kinds && opts.kinds.length > 0
        ? ` and kind in (${opts.kinds.map(() => "?").join(",")})`
        : "";

    // FTS5 bm25() returns lower = better. We sort ascending + reverse the
    // sign at the boundary for caller convenience.
    const stmt = this.db.prepare(
      `select path, kind, title, source, bm25(docs) as rank,
              snippet(docs, 4, '[[', ']]', ' … ', ${Math.max(8, Math.floor(snippetChars / 8))}) as snip
         from docs
        where docs match ?${kindFilter}
        order by rank
        limit ?`,
    );

    const args: Array<string | number> = [safe];
    if (opts.kinds && opts.kinds.length > 0) {
      for (const k of opts.kinds) args.push(k);
    }
    args.push(limit);

    const rows = stmt.all(...args) as Array<{
      path: string;
      kind: DocKind;
      title: string;
      source: string;
      rank: number;
      snip: string;
    }>;
    return rows.map((r) => ({
      path: r.path,
      kind: r.kind,
      title: r.title,
      source: r.source,
      score: -r.rank, // higher = better for caller sanity
      snippet: r.snip,
    }));
  }

  close(): void {
    this.db.close();
  }
}

/**
 * Make a user query safe for FTS5 by quoting each term. Avoids weird
 * syntax errors from raw FTS5 operators that users might type.
 */
function escapeFtsQuery(query: string): string {
  const terms = query
    .split(/\s+/)
    .map((t) => t.replace(/["\\]/g, ""))
    .filter((t) => t.length > 0);
  if (terms.length === 0) return "";
  return terms.map((t) => `"${t}"`).join(" OR ");
}
