"""Persona registry — discover and load all personas from a directory."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable

from voice_engine.config import PersonaConfig, load_persona


class PersonaRegistry:
    """Lazy directory-backed persona registry.

    Scans `<dir>/*.yaml` on demand. Tolerant of mixed-mode (cascaded +
    realtime) personas. Validates on load — bad YAML surfaces clearly.
    """

    def __init__(self, persona_dir: str | Path) -> None:
        self.persona_dir = Path(persona_dir).expanduser().resolve()
        if not self.persona_dir.is_dir():
            raise NotADirectoryError(f"persona dir not found: {self.persona_dir}")

    # ── discovery ────────────────────────────────────────────────────
    def files(self) -> list[Path]:
        # Skip scenario files (`<name>.scenarios.yaml`) and hidden/base
        # files (anything starting with `_`).
        return sorted(
            f for f in self.persona_dir.glob("*.yaml")
            if not f.name.endswith(".scenarios.yaml")
            and not f.name.startswith("_")
        )

    def names(self) -> list[str]:
        return [f.stem for f in self.files()]

    # ── load ─────────────────────────────────────────────────────────
    def get(self, name: str) -> PersonaConfig:
        path = self.persona_dir / f"{name}.yaml"
        if not path.exists():
            raise KeyError(f"no persona named '{name}' in {self.persona_dir}")
        return load_persona(path)

    def all(self) -> list[PersonaConfig]:
        return [load_persona(f) for f in self.files()]

    # ── browsing ─────────────────────────────────────────────────────
    def describe(self) -> Iterable[dict]:
        """One-line dicts suitable for a router prompt or a CLI list."""
        for f in self.files():
            try:
                p = load_persona(f)
                yield {
                    "name": p.name,
                    "description": p.description.strip().split("\n")[0],
                    "mode": p.mode.value,
                    "voice": (
                        p.tts.voice if p.mode.value == "cascaded" else p.realtime.voice
                    ),
                }
            except Exception as e:  # noqa: BLE001
                yield {"name": f.stem, "error": str(e)}
