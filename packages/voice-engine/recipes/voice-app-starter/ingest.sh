#!/usr/bin/env bash
# ingest.sh — pump a folder of .md/.txt/.html into the RAG knowledge base.
# Run the RAG server first:  rag-mcp serve --http --port 7800
#
# Usage: ./ingest.sh ./path/to/docs
set -euo pipefail

DIR="${1:-}"
if [[ -z "$DIR" || ! -d "$DIR" ]]; then
  echo "usage: $0 <docs-dir>"
  exit 1
fi

# Per-app database — kept next to the app directory so it never collides.
export RAG_DB="${RAG_DB:-./rag.sqlite}"

if ! command -v rag-mcp >/dev/null 2>&1; then
  echo "rag-mcp not installed. Run:"
  echo "  pip install -e ../../packages/voice-engine/mcp-servers/rag"
  exit 1
fi

rag-mcp --db "$RAG_DB" ingest-dir "$DIR"
echo "✓ ingested into $RAG_DB"
echo ""
echo "Start the RAG server so the persona can query it:"
echo "  RAG_DB=$RAG_DB rag-mcp serve --http --port 7800"
