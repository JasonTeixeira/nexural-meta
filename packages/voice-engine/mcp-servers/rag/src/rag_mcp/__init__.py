"""Drop-in RAG MCP server for Nexural voice personas.

Fork this directory per app. The store is SQLite + sqlite-vec — zero-ops,
runs anywhere, scales to ~1M chunks before you need a real vector DB.
Swap `store.py` for Qdrant/pgvector when you cross that mark.
"""

__version__ = "0.1.0"
