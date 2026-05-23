/**
 * `nx ask "<query>"` — federation-wide search.
 *
 * Phase 11.2 per ADR-0012 §5. Collects docs from the federation root
 * (constitution, ADRs, warehouse documents, recipe THREAT_MODEL/DECISIONS/
 * README, eval sets) into an in-memory FTS5 index + returns ranked excerpts.
 *
 * --json mode emits machine-readable output.
 * --kinds limits the search to a subset (e.g. `--kinds=adr,warehouse-doc`).
 *
 * LLM synthesis (taking the excerpts + answering with citations) is
 * deliberately a v1.2 enhancement — the retrieval layer is the load-
 * bearing part and works offline.
 */

import { collectDocs, AskIndex, type DocKind, type SearchHit } from "@nexural/ask-engine";
import type { NexuralConfig } from "../config.js";

export interface AskOptions {
  /** Comma-separated kinds to include. */
  readonly kinds?: string;
  /** Max results. Default 5. */
  readonly limit?: number;
  /** Machine-readable JSON output. */
  readonly json?: boolean;
}

const KNOWN_KINDS: ReadonlyArray<DocKind> = [
  "constitution",
  "adr",
  "warehouse-doc",
  "recipe-doc",
  "eval",
];

export async function runAsk(
  _config: NexuralConfig,
  query: string,
  opts: AskOptions = {},
): Promise<void> {
  if (!query || query.trim().length === 0) {
    console.error('Usage: nx ask "how do we handle cost discipline?"');
    process.exitCode = 1;
    return;
  }

  const kinds = parseKinds(opts.kinds);
  const limit = opts.limit ?? 5;

  const docs = collectDocs({ root: process.cwd() });
  if (docs.length === 0) {
    if (opts.json) {
      console.log(JSON.stringify({ query, hits: [], indexed: 0 }, null, 2));
    } else {
      console.error("✖ no docs found — are you in a nexural-meta repo?");
      process.exitCode = 1;
    }
    return;
  }

  const index = new AskIndex(docs);
  let hits: SearchHit[];
  try {
    hits = index.search(query, {
      limit,
      ...(kinds !== undefined ? { kinds } : {}),
    });
  } finally {
    index.close();
  }

  if (opts.json) {
    console.log(JSON.stringify({ query, indexed: docs.length, hits }, null, 2));
    return;
  }

  console.log(`🔍 ${query}`);
  console.log(
    `   indexed ${docs.length} docs; ${hits.length} ${hits.length === 1 ? "match" : "matches"}`,
  );
  console.log();
  if (hits.length === 0) {
    console.log("  (no results — try broader terms)");
    return;
  }
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i]!;
    console.log(`${i + 1}. ${hit.title}`);
    console.log(`   ${hit.source}  (score ${hit.score.toFixed(2)})`);
    console.log(`   ${hit.path}`);
    const snippet = hit.snippet.replace(/\s+/g, " ").trim();
    console.log(`   "${snippet}"`);
    console.log();
  }
}

function parseKinds(raw: string | undefined): DocKind[] | undefined {
  if (!raw) return undefined;
  const out: DocKind[] = [];
  for (const k of raw.split(",").map((s) => s.trim())) {
    if (k.length === 0) continue;
    if (!KNOWN_KINDS.includes(k as DocKind)) {
      console.error(`✖ unknown kind: "${k}" (allowed: ${KNOWN_KINDS.join(", ")})`);
      process.exitCode = 1;
      continue;
    }
    out.push(k as DocKind);
  }
  return out.length > 0 ? out : undefined;
}
