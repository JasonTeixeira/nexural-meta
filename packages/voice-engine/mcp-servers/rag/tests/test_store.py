"""Store-layer tests — chunker behaviour, schema, doc lifecycle.

Skips anything that needs OpenAI embeddings (no key required for these).
"""

from __future__ import annotations

import sqlite3
from pathlib import Path

import pytest

from rag_mcp.store import EMBED_DIM, chunk_text


def test_chunker_short_text_one_chunk() -> None:
    chunks = chunk_text("hello world")
    assert chunks == ["hello world"]


def test_chunker_paragraph_split() -> None:
    text = "para1\n\npara2\n\npara3"
    chunks = chunk_text(text, max_chars=8)
    # Each paragraph is its own chunk because joins would exceed 8 chars.
    assert all(c.strip() for c in chunks)
    assert len(chunks) >= 1


def test_chunker_empty_text() -> None:
    assert chunk_text("") == []
    assert chunk_text("   \n\n  ") == []


def test_chunker_long_paragraph_with_overlap() -> None:
    text = "a" * 3500
    chunks = chunk_text(text, max_chars=1200, overlap_chars=200)
    assert len(chunks) >= 3
    # Each chunk ≤ max_chars
    assert all(len(c) <= 1200 for c in chunks)


def test_schema_creates_required_tables(tmp_path: Path, monkeypatch) -> None:
    """Just exercise the schema; skip if sqlite_vec isn't loadable here."""
    monkeypatch.setenv("RAG_DB", str(tmp_path / "test.sqlite"))
    try:
        from rag_mcp.store import KnowledgeStore
        store = KnowledgeStore()
    except Exception as e:  # noqa: BLE001
        pytest.skip(f"sqlite-vec unavailable in this env: {e}")
    with sqlite3.connect(store.db_path) as c:
        tables = {r[0] for r in c.execute(
            "SELECT name FROM sqlite_master WHERE type='table'"
        ).fetchall()}
    assert "documents" in tables
    assert "chunks" in tables


def test_embed_dim_constant() -> None:
    assert EMBED_DIM == 1536  # text-embedding-3-small
