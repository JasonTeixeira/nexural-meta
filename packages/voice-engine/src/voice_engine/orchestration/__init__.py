"""Orchestration layer — multi-persona handoffs, router, supervisor.

The engine alone gives you ONE persona per call. The orchestration layer
gives you:

- PersonaRegistry: auto-discovers all personas/*.yaml so the rest of the
  system can list, search, and load them by name.
- Router: a meta-persona that listens to the caller's intent for 1-2 turns
  and hands off to the right downstream persona.
- Supervisor: Chat-Supervisor pattern — a fast voice persona handles the
  conversation while a heavier reasoning model handles tool calls and
  complex thinking in parallel.
"""

from voice_engine.orchestration.registry import PersonaRegistry
from voice_engine.orchestration.router import build_router_agent
from voice_engine.orchestration.supervisor import SupervisorClient

__all__ = ["PersonaRegistry", "build_router_agent", "SupervisorClient"]
