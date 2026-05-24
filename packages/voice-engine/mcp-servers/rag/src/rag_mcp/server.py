"""RAG MCP server — expose `search_knowledge` to any voice persona.

Run:
  rag-mcp                       # stdio (claude / mcp clients)
  rag-mcp --http --port 7800    # HTTP+SSE for voice-engine personas

Ingest content via the CLI:
  rag-mcp ingest --title "About Us" --file ./about.md
  rag-mcp ingest-dir ./docs

Then in any persona YAML:
  mcp_servers:
    - name: knowledge
      url: http://localhost:7800/sse
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from mcp.server.fastmcp import FastMCP

from rag_mcp.store import KnowledgeStore

mcp = FastMCP("nexural-rag")

_store: KnowledgeStore | None = None


def _get_store() -> KnowledgeStore:
    global _store
    if _store is None:
        _store = KnowledgeStore()
    return _store


# ─────────────────────────────────────────────────────────────────────────────
# Tools the voice agent sees
# ─────────────────────────────────────────────────────────────────────────────


@mcp.tool()
def search_knowledge(query: str, k: int = 5) -> list[dict]:
    """Search the app's knowledge base for content relevant to a question.

    Args:
        query: Natural-language question or topic.
        k: How many chunks to return (default 5; keep small for voice context).

    Returns:
        A list of relevant text chunks, each with title + similarity score.
        Use only the most relevant. Quote sparingly — this is voice, not text.
    """
    hits = _get_store().search(query=query, k=k)
    return [
        {
            "title": h.title,
            "text": h.text,
            "score": round(h.score, 4),
        }
        for h in hits
    ]


@mcp.tool()
def list_topics() -> list[str]:
    """List the document titles currently in the knowledge base.
    Useful when the user asks 'what do you know about?'."""
    return [d["title"] for d in _get_store().list_documents()]


# ─────────────────────────────────────────────────────────────────────────────
# CLI: ingest / stats / serve
# ─────────────────────────────────────────────────────────────────────────────


def _cmd_ingest(args: argparse.Namespace) -> None:
    text = Path(args.file).read_text(encoding="utf-8")
    doc_id = _get_store().add_document(
        title=args.title or Path(args.file).stem,
        text=text,
        source=str(Path(args.file).resolve()),
        metadata=json.loads(args.metadata) if args.metadata else None,
    )
    print(f"✓ ingested doc id={doc_id}")


def _cmd_ingest_dir(args: argparse.Namespace) -> None:
    d = Path(args.path)
    if not d.is_dir():
        sys.exit(f"not a directory: {d}")
    count = 0
    for fp in sorted(d.rglob("*")):
        if fp.suffix.lower() not in {".md", ".txt", ".html"}:
            continue
        try:
            text = fp.read_text(encoding="utf-8")
            doc_id = _get_store().add_document(
                title=fp.stem,
                text=text,
                source=str(fp.resolve()),
            )
            print(f"  + {fp.name}  → id={doc_id}")
            count += 1
        except Exception as e:  # noqa: BLE001
            print(f"  ⚠ {fp.name} failed: {e}")
    print(f"✓ ingested {count} documents")


def _cmd_stats(_: argparse.Namespace) -> None:
    s = _get_store().stats()
    print(json.dumps(s, indent=2))


def _cmd_serve(args: argparse.Namespace) -> None:
    if args.http:
        mcp.settings.host = args.host
        mcp.settings.port = args.port
        mcp.run(transport="sse")
    else:
        mcp.run(transport="stdio")


def main() -> None:
    p = argparse.ArgumentParser(prog="rag-mcp")
    p.add_argument("--db", default=os.getenv("RAG_DB", "rag.sqlite"),
                   help="SQLite path (also via $RAG_DB).")
    sub = p.add_subparsers(dest="cmd")

    s = sub.add_parser("serve", help="Run the MCP server.")
    s.add_argument("--http", action="store_true")
    s.add_argument("--host", default="0.0.0.0")
    s.add_argument("--port", type=int, default=7800)
    s.set_defaults(func=_cmd_serve)

    i = sub.add_parser("ingest", help="Add one document.")
    i.add_argument("--file", required=True)
    i.add_argument("--title", default=None)
    i.add_argument("--metadata", default=None, help="JSON dict.")
    i.set_defaults(func=_cmd_ingest)

    d = sub.add_parser("ingest-dir", help="Ingest every .md/.txt/.html under a dir.")
    d.add_argument("path")
    d.set_defaults(func=_cmd_ingest_dir)

    st = sub.add_parser("stats")
    st.set_defaults(func=_cmd_stats)

    args = p.parse_args()
    os.environ["RAG_DB"] = str(Path(args.db).expanduser().resolve())

    if args.cmd is None:
        # Default to serve over stdio when invoked without a subcommand —
        # convenient for Claude Desktop / mcp clients.
        _cmd_serve(argparse.Namespace(http=False, host="0.0.0.0", port=7800))
        return

    args.func(args)


if __name__ == "__main__":
    main()
