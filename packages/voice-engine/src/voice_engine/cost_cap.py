"""Per-session $ cap watcher.

Subscribes to TelemetrySink turn writes. When estimated session cost
exceeds the cap, calls a graceful-shutdown callback so the engine can
say one closing line before tearing down.
"""

from __future__ import annotations

import logging
from typing import Awaitable, Callable

from voice_engine.config import CostCapConfig

logger = logging.getLogger(__name__)


class CostCapWatcher:
    """Tracks running cost; fires `on_breach` once when exceeded."""

    def __init__(
        self,
        cfg: CostCapConfig,
        *,
        on_breach: Callable[[float], Awaitable[None] | None] | None = None,
    ) -> None:
        self.cfg = cfg
        self.on_breach = on_breach
        self.total_usd = 0.0
        self._warned = False
        self._fired = False

    @property
    def enabled(self) -> bool:
        return self.cfg.max_usd_per_session > 0.0

    def add_cost(self, usd: float) -> None:
        """Call after every turn record."""
        if not self.enabled:
            return
        self.total_usd += max(0.0, usd)
        cap = self.cfg.max_usd_per_session

        if not self._warned and self.total_usd >= cap * self.cfg.warn_at_pct:
            self._warned = True
            logger.warning(
                "cost watcher: session %.2f%% of cap ($%.4f / $%.4f)",
                (self.total_usd / cap) * 100,
                self.total_usd,
                cap,
            )

        if not self._fired and self.total_usd >= cap:
            self._fired = True
            logger.error(
                "cost cap breached: $%.4f >= $%.4f — ending session",
                self.total_usd,
                cap,
            )
            if self.on_breach is not None:
                import asyncio

                cb = self.on_breach(self.total_usd)
                if asyncio.iscoroutine(cb):
                    asyncio.create_task(cb)  # noqa: RUF006
