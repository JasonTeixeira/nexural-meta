#!/usr/bin/env bash
# make-app.sh — rename the starter from `myapp` to your app's slug.
# Run from inside the copied directory.
#
# Usage:
#   ./make-app.sh <new-app-slug>
#   ./make-app.sh chess-coach
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <new-app-slug>"
  exit 1
fi

SLUG="$1"
# python-friendly variant
PY_SLUG="${SLUG//-/_}"

echo "▸ renaming starter to: $SLUG (python: $PY_SLUG)"

# 1) Rename the python package directory
if [[ -d "mcp-server/src/myapp_mcp" ]]; then
  mv "mcp-server/src/myapp_mcp" "mcp-server/src/${PY_SLUG}_mcp"
fi

# 2) Replace identifiers in files
files=(
  "persona/agent.yaml"
  "mcp-server/pyproject.toml"
  "mcp-server/src/${PY_SLUG}_mcp/server.py"
  "web/app/page.tsx"
  "web/app/api/voice/token/route.ts"
)

for f in "${files[@]}"; do
  if [[ -f "$f" ]]; then
    # macOS sed needs '' after -i
    sed -i '' \
      -e "s/myapp_agent/${PY_SLUG}_agent/g" \
      -e "s/myapp_mcp/${PY_SLUG}_mcp/g" \
      -e "s/myapp-mcp/${SLUG}-mcp/g" \
      -e "s/myapp/${PY_SLUG}/g" \
      "$f"
    echo "  + patched $f"
  fi
done

echo "✓ done. next:"
echo "  1. edit persona/agent.yaml (prompt + greeting)"
echo "  2. (optional) edit mcp-server/src/${PY_SLUG}_mcp/server.py for tools"
echo "  3. nx-voice validate persona/agent.yaml"
