"""Persona inheritance — `extends: base.yaml`.

Allows a child YAML to inherit and override fields from a base. The merge
is *deep* for nested dicts but *replaces* for lists (so e.g. `keyterms`
fully replaces, not appends — easier to reason about).

Cycles are rejected; missing parents raise FileNotFoundError.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


class CircularExtensionError(RuntimeError):
    pass


def _deep_merge(base: dict[str, Any], child: dict[str, Any]) -> dict[str, Any]:
    """Right-wins deep merge for dicts; child fully replaces base for lists/scalars."""
    out = dict(base)
    for k, v in child.items():
        if (
            k in out
            and isinstance(out[k], dict)
            and isinstance(v, dict)
        ):
            out[k] = _deep_merge(out[k], v)
        else:
            out[k] = v
    return out


def _load_yaml_raw(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def resolve_extends(path: str | Path, *, _seen: set[Path] | None = None) -> dict[str, Any]:
    """Load a persona YAML and apply `extends:` chain.

    `extends:` is a string (relative path) or a list of strings.  Multiple
    parents are merged left-to-right; the child overrides everything.
    """
    path = Path(path).expanduser().resolve()
    _seen = _seen or set()
    if path in _seen:
        chain = " → ".join(str(p) for p in _seen) + f" → {path}"
        raise CircularExtensionError(f"circular extends: {chain}")
    _seen = _seen | {path}

    data = _load_yaml_raw(path)
    parents = data.pop("extends", None)
    if not parents:
        return data

    if isinstance(parents, str):
        parents = [parents]

    merged: dict[str, Any] = {}
    for parent in parents:
        parent_path = (path.parent / parent).resolve()
        if not parent_path.exists():
            raise FileNotFoundError(f"{path}: extends '{parent}' not found at {parent_path}")
        merged = _deep_merge(merged, resolve_extends(parent_path, _seen=_seen))

    return _deep_merge(merged, data)
