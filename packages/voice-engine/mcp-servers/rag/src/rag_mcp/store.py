"""SQLite + sqlite-vec backed knowledge store.

Implements the minimum useful RAG interface:
  - add_document(title, text, metadata) → chunks, embeds, stores
  - search(query, k=5) → top-k chunks by cosine similarity

Embeddings via OpenAI text-embedding-3-small ($0.02/1M tok = ~$0.001 per
1000 chunks). Swap the embedder by implementing the Embedder protocol.

Zero-ops by design. When you outgrow sqlite-vec (~1M chunks / GB-scale),
swap `_VecBackend` for a Qdrant/pgvector client; the MCP tool surface
stays identical.
"""

from __future__ import annotations

import json
import os
import sqlite3
import struct
import threading
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import sqlite_vec


# ─────────────────────────────────────────────────────────────────────────────
# Embeddings
# ─────────────────────────────────────────────────────────────────────────────

EMBED_DIM = 1536  # text-embedding-3-small


def _embed(texts: list[str]) -> list[list[float]]:
    """Call OpenAI embeddings. Batches OK up to ~2k texts per call."""
    from openai import OpenAI

    client = OpenAI()
    resp = client.embeddings.create(
        model="text-embedding-3-small", input=texts
    )
    return [d.embedding for d in resp.data]


def _pack_f32(vec: list[float]) -> bytes:
    return struct.pack(f"{len(vec)}f", *vec)


# ─────────────────────────────────────────────────────────────────────────────
# Chunker
# ─────────────────────────────────────────────────────────────────────────────


def chunk_text(text: str, *, max_chars: int = 1200, overlap_chars: int = 200) -> list[str]:
    """Naive paragraph-aware chunker. Good default for prose/docs."""
    text = text.strip()
    if not text:
        return []
    if len(text) <= max_chars:
        return [text]
    # split on double-newline first
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks: list[str] = []
    buf = ""
    for p in paragraphs:
        candidate = (buf + "\n\n" + p) if buf else p
        if len(candidate) <= max_chars:
            buf = candidate
            continue
        if buf:
            chunks.append(buf)
        if len(p) <= max_chars:
            buf = p
        else:
            # hard split long paragraphs with overlap
            i = 0
            while i < len(p):
                chunks.append(p[i : i + max_chars])
                i += max_chars - overlap_chars
            buf = ""
    if buf:
        chunks.append(buf)
    return chunks


# ─────────────────────────────────────────────────────────────────────────────
# Store
# ─────────────────────────────────────────────────────────────────────────────


_SCHEMA = """
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    source TEXT,
    metadata_json TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_idx INTEGER NOT NULL,
    text TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(document_id);
"""


@dataclass
class SearchHit:
    chunk_id: int
    document_id: int
    title: str
    text: str
    score: float
    metadata: dict[str, Any]


class KnowledgeStore:
    """SQLite + sqlite-vec knowledge store.

    `db_path` defaults to ./rag.sqlite. Set RAG_DB env var to override.
    """

    def __init__(self, db_path: str | Path | None = None) -> None:
        self.db_path = Path(db_path or os.getenv("RAG_DB", "rag.sqlite")).expanduser().resolve()
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        with self._conn() as c:
            c.executescript(_SCHEMA)
            c.execute(
                f"CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks "
                f"USING vec0(embedding float[{EMBED_DIM}])"
            )

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(str(self.db_path), timeout=10.0)
        conn.enable_load_extension(True)
        sqlite_vec.load(conn)
        conn.enable_load_extension(False)
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    # ── ingest ────────────────────────────────────────────────────────
    def add_document(
        self,
        *,
        title: str,
        text: str,
        source: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> int:
        chunks = chunk_text(text)
        if not chunks:
            raise ValueError("no chunks produced from text")
        embeddings = _embed(chunks)
        with self._lock, self._conn() as c:
            cur = c.execute(
                "INSERT INTO documents (title, source, metadata_json) VALUES (?, ?, ?)",
                (title, source, json.dumps(metadata or {})),
            )
            doc_id = cur.lastrowid
            for idx, (chunk, emb) in enumerate(zip(chunks, embeddings)):
                cur = c.execute(
                    "INSERT INTO chunks (document_id, chunk_idx, text) VALUES (?, ?, ?)",
                    (doc_id, idx, chunk),
                )
                chunk_id = cur.lastrowid
                c.execute(
                    "INSERT INTO vec_chunks (rowid, embedding) VALUES (?, ?)",
                    (chunk_id, _pack_f32(emb)),
                )
        return doc_id

    def add_documents(self, docs: Iterable[dict]) -> list[int]:
        """Batch helper. Each dict: {title, text, source?, metadata?}."""
        return [self.add_document(**d) for d in docs]

    # ── search ────────────────────────────────────────────────────────
    def search(self, query: str, k: int = 5) -> list[SearchHit]:
        qvec = _embed([query])[0]
        with self._lock, self._conn() as c:
            rows = c.execute(
                """
                SELECT chunks.id, chunks.document_id, documents.title,
                       chunks.text, vec.distance, documents.metadata_json
                FROM vec_chunks AS vec
                JOIN chunks ON chunks.id = vec.rowid
                JOIN documents ON documents.id = chunks.document_id
                WHERE vec.embedding MATCH ? AND k = ?
                ORDER BY vec.distance
                """,
                (_pack_f32(qvec), k),
            ).fetchall()
        return [
            SearchHit(
                chunk_id=r[0],
                document_id=r[1],
                title=r[2],
                text=r[3],
                score=1.0 - r[4],  # convert distance → similarity
                metadata=json.loads(r[5] or "{}"),
            )
            for r in rows
        ]

    # ── housekeeping ──────────────────────────────────────────────────
    def delete_document(self, doc_id: int) -> bool:
        with self._lock, self._conn() as c:
            cur = c.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
            return cur.rowcount > 0

    def list_documents(self) -> list[dict]:
        with self._lock, self._conn() as c:
            rows = c.execute(
                "SELECT id, title, source, created_at FROM documents ORDER BY id"
            ).fetchall()
        return [
            {"id": r[0], "title": r[1], "source": r[2], "created_at": r[3]}
            for r in rows
        ]

    def stats(self) -> dict[str, int]:
        with self._lock, self._conn() as c:
            doc_count = c.execute("SELECT COUNT(*) FROM documents").fetchone()[0]
            chunk_count = c.execute("SELECT COUNT(*) FROM chunks").fetchone()[0]
        return {"documents": doc_count, "chunks": chunk_count}
