"""Per-turn telemetry — SQLite + JSONL.

What we record (per turn):
  - turn_idx, role (user|agent), text
  - ttft_ms       — LLM time to first token
  - ttfa_ms       — TTS time to first audio chunk (end of LLM → first audio)
  - eou_delay_ms  — semantic turn detector delay (silence → end-of-turn fire)
  - stt_audio_ms  — duration of user audio in this turn
  - prompt_tokens / completion_tokens / cost_usd_est
  - timestamps (utc)

Listens to AgentSession's `metrics_collected` and conversation events. If
the LiveKit Agents API emits a metric type we don't recognise, we record
it raw in the JSONL stream so nothing is lost.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import sqlite3
import threading
import time
import uuid
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Rough cost table (USD per 1M tokens / chars / audio seconds). 2026-Q2.
# Override via cfg if your contracts differ.
# ─────────────────────────────────────────────────────────────────────────────

DEFAULT_COSTS: dict[str, dict[str, float]] = {
    # LLM ($/1M tokens, input/output)
    "anthropic:claude-haiku-4-5": {"in_tok": 1.00, "out_tok": 5.00},
    "anthropic:claude-sonnet-4-6": {"in_tok": 3.00, "out_tok": 15.00},
    "openai:gpt-4o-mini": {"in_tok": 0.15, "out_tok": 0.60},
    "openai:gpt-realtime": {"in_audio_min": 0.06, "out_audio_min": 0.24},
    # STT ($/min)
    "deepgram:nova-3": {"audio_min": 0.0077},
    "openai:whisper-1": {"audio_min": 0.006},
    # TTS ($/1M chars)
    "cartesia:sonic-3": {"chars": 35.0},
    "elevenlabs:eleven_flash_v2_5": {"chars": 103.0},
    "openai:gpt-4o-mini-tts": {"chars": 12.0},
}


def estimate_cost_usd(
    *,
    provider_model: str,
    in_tok: int = 0,
    out_tok: int = 0,
    chars: int = 0,
    audio_sec: float = 0.0,
) -> float:
    """Best-effort cost estimate. Returns 0.0 if model unknown."""
    rates = DEFAULT_COSTS.get(provider_model)
    if not rates:
        return 0.0
    total = 0.0
    if "in_tok" in rates:
        total += (in_tok / 1_000_000) * rates["in_tok"]
    if "out_tok" in rates:
        total += (out_tok / 1_000_000) * rates["out_tok"]
    if "chars" in rates:
        total += (chars / 1_000_000) * rates["chars"]
    if "audio_min" in rates:
        total += (audio_sec / 60) * rates["audio_min"]
    return round(total, 6)


# ─────────────────────────────────────────────────────────────────────────────
# Data
# ─────────────────────────────────────────────────────────────────────────────


@dataclass
class TurnRecord:
    session_id: str
    turn_idx: int
    role: str  # "user" | "agent" | "system"
    text: str = ""
    ttft_ms: float | None = None
    ttfa_ms: float | None = None
    eou_delay_ms: float | None = None
    stt_audio_ms: float | None = None
    prompt_tokens: int | None = None
    completion_tokens: int | None = None
    cost_usd_est: float | None = None
    extra: dict[str, Any] = field(default_factory=dict)
    ts: float = field(default_factory=lambda: time.time())


@dataclass
class SessionRecord:
    session_id: str
    persona: str
    room: str
    identity: str | None
    mode: str
    stt_model: str | None
    llm_model: str | None
    tts_model: str | None
    started_at: float = field(default_factory=lambda: time.time())
    ended_at: float | None = None
    cost_usd_est: float = 0.0
    turn_count: int = 0


# ─────────────────────────────────────────────────────────────────────────────
# Sink
# ─────────────────────────────────────────────────────────────────────────────

_DB_SCHEMA = """
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    persona TEXT NOT NULL,
    room TEXT,
    identity TEXT,
    mode TEXT,
    stt_model TEXT,
    llm_model TEXT,
    tts_model TEXT,
    started_at REAL,
    ended_at REAL,
    cost_usd_est REAL DEFAULT 0,
    turn_count INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS turns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    turn_idx INTEGER NOT NULL,
    role TEXT NOT NULL,
    text TEXT,
    ttft_ms REAL,
    ttfa_ms REAL,
    eou_delay_ms REAL,
    stt_audio_ms REAL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cost_usd_est REAL,
    extra_json TEXT,
    ts REAL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);
CREATE INDEX IF NOT EXISTS idx_turns_session ON turns(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_persona ON sessions(persona);
"""


class TelemetrySink:
    """Thread-safe SQLite + JSONL sink. One per worker process is enough."""

    def __init__(
        self,
        db_path: str | Path = "telemetry.sqlite",
        jsonl_path: str | Path | None = "telemetry.jsonl",
        enabled: bool = True,
    ) -> None:
        self.enabled = enabled
        self.db_path = Path(db_path).expanduser().resolve()
        self.jsonl_path = (
            Path(jsonl_path).expanduser().resolve() if jsonl_path else None
        )
        self._lock = threading.Lock()
        if not self.enabled:
            return
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as conn:
            conn.executescript(_DB_SCHEMA)

    @contextmanager
    def _connect(self):
        conn = sqlite3.connect(str(self.db_path), timeout=5.0)
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    # ── sessions ────────────────────────────────────────────────────
    def open_session(self, rec: SessionRecord) -> None:
        if not self.enabled:
            return
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT OR REPLACE INTO sessions
                   (session_id, persona, room, identity, mode, stt_model,
                    llm_model, tts_model, started_at, ended_at,
                    cost_usd_est, turn_count)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    rec.session_id,
                    rec.persona,
                    rec.room,
                    rec.identity,
                    rec.mode,
                    rec.stt_model,
                    rec.llm_model,
                    rec.tts_model,
                    rec.started_at,
                    rec.ended_at,
                    rec.cost_usd_est,
                    rec.turn_count,
                ),
            )
        self._jsonl({"event": "session_open", **asdict(rec)})

    def close_session(
        self, session_id: str, *, cost_usd_est: float = 0.0, turn_count: int = 0
    ) -> None:
        if not self.enabled:
            return
        ended = time.time()
        with self._lock, self._connect() as conn:
            conn.execute(
                """UPDATE sessions
                   SET ended_at=?, cost_usd_est=?, turn_count=?
                   WHERE session_id=?""",
                (ended, cost_usd_est, turn_count, session_id),
            )
        self._jsonl(
            {
                "event": "session_close",
                "session_id": session_id,
                "ended_at": ended,
                "cost_usd_est": cost_usd_est,
                "turn_count": turn_count,
            }
        )

    # ── turns ───────────────────────────────────────────────────────
    def record_turn(self, t: TurnRecord) -> None:
        if not self.enabled:
            return
        with self._lock, self._connect() as conn:
            conn.execute(
                """INSERT INTO turns
                   (session_id, turn_idx, role, text, ttft_ms, ttfa_ms,
                    eou_delay_ms, stt_audio_ms, prompt_tokens,
                    completion_tokens, cost_usd_est, extra_json, ts)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    t.session_id,
                    t.turn_idx,
                    t.role,
                    t.text,
                    t.ttft_ms,
                    t.ttfa_ms,
                    t.eou_delay_ms,
                    t.stt_audio_ms,
                    t.prompt_tokens,
                    t.completion_tokens,
                    t.cost_usd_est,
                    json.dumps(t.extra, default=str) if t.extra else None,
                    t.ts,
                ),
            )
        self._jsonl({"event": "turn", **asdict(t)})

    # ── raw events (anything we don't recognise) ────────────────────
    def record_event(self, session_id: str, name: str, payload: dict[str, Any]) -> None:
        if not self.enabled:
            return
        self._jsonl(
            {"event": name, "session_id": session_id, "ts": time.time(), **payload}
        )

    def _jsonl(self, obj: dict[str, Any]) -> None:
        if not self.jsonl_path:
            return
        try:
            with self._lock, self.jsonl_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(obj, default=str) + "\n")
        except OSError as e:
            logger.warning("telemetry jsonl write failed: %s", e)


# ─────────────────────────────────────────────────────────────────────────────
# LiveKit metrics adapter
# ─────────────────────────────────────────────────────────────────────────────


class SessionTelemetry:
    """Per-session collector that subscribes to a LiveKit AgentSession.

    Why an adapter: LiveKit emits typed metrics events (STTMetrics, EOUMetrics,
    LLMMetrics, TTSMetrics, PipelineLatencyMetrics). We coalesce them into a
    single TurnRecord and flush at end-of-turn.
    """

    def __init__(
        self,
        sink: TelemetrySink,
        session_id: str,
        persona_name: str,
        room_name: str,
        identity: str | None,
        mode: str,
        stt_model: str | None,
        llm_model: str | None,
        tts_model: str | None,
        cost_model_key: str | None = None,
    ) -> None:
        self.sink = sink
        self.session_id = session_id
        self.persona_name = persona_name
        self.cost_model_key = cost_model_key
        self._turn_idx = 0
        self._cost_total = 0.0
        self._current: dict[str, Any] = {}
        self.sink.open_session(
            SessionRecord(
                session_id=session_id,
                persona=persona_name,
                room=room_name,
                identity=identity,
                mode=mode,
                stt_model=stt_model,
                llm_model=llm_model,
                tts_model=tts_model,
            )
        )

    # ── wiring ──────────────────────────────────────────────────────
    def attach(self, session: Any) -> None:
        """Attach to a LiveKit AgentSession. Tolerant of API shifts."""
        try:
            session.on("metrics_collected", self._on_metrics)
            session.on("conversation_item_added", self._on_item)
            session.on("user_input_transcribed", self._on_user_text)
        except Exception as e:  # noqa: BLE001
            logger.warning("telemetry attach partial — %s", e)

    # ── handlers ────────────────────────────────────────────────────
    def _on_metrics(self, ev: Any) -> None:
        try:
            metrics = getattr(ev, "metrics", ev)
            type_name = type(metrics).__name__
            payload = self._safe_dump(metrics)
            # Common fields we look for; absent → stays None.
            if type_name in ("LLMMetrics",):
                self._current["ttft_ms"] = payload.get("ttft", payload.get("ttft_ms"))
                self._current["prompt_tokens"] = payload.get("prompt_tokens")
                self._current["completion_tokens"] = payload.get("completion_tokens")
            elif type_name in ("TTSMetrics",):
                self._current["ttfa_ms"] = payload.get("ttfb", payload.get("ttfa_ms"))
                self._current["tts_chars"] = payload.get("characters_count")
            elif type_name in ("STTMetrics",):
                self._current["stt_audio_ms"] = payload.get("audio_duration", 0) * 1000
            elif type_name in ("EOUMetrics", "EndpointMetrics"):
                self._current["eou_delay_ms"] = payload.get(
                    "end_of_utterance_delay", payload.get("eou_delay_ms")
                )
            self.sink.record_event(
                self.session_id, f"metric.{type_name}", payload
            )
        except Exception as e:  # noqa: BLE001
            logger.debug("telemetry metric handler: %s", e)

    def _on_item(self, ev: Any) -> None:
        """Fires when a conversation item (user msg or agent reply) is finalised."""
        try:
            item = getattr(ev, "item", ev)
            role = getattr(item, "role", "unknown")
            text = getattr(item, "text_content", "") or getattr(item, "content", "")
            if role == "assistant":
                role = "agent"
            cost = self._compute_cost()
            self._cost_total += cost
            self._turn_idx += 1
            self.sink.record_turn(
                TurnRecord(
                    session_id=self.session_id,
                    turn_idx=self._turn_idx,
                    role=role,
                    text=str(text)[:8000],
                    ttft_ms=self._current.get("ttft_ms"),
                    ttfa_ms=self._current.get("ttfa_ms"),
                    eou_delay_ms=self._current.get("eou_delay_ms"),
                    stt_audio_ms=self._current.get("stt_audio_ms"),
                    prompt_tokens=self._current.get("prompt_tokens"),
                    completion_tokens=self._current.get("completion_tokens"),
                    cost_usd_est=cost,
                    extra=self._current.copy(),
                )
            )
            self._current.clear()
        except Exception as e:  # noqa: BLE001
            logger.debug("telemetry item handler: %s", e)

    def _on_user_text(self, ev: Any) -> None:
        try:
            self.sink.record_event(
                self.session_id,
                "user_text",
                {"text": getattr(ev, "transcript", str(ev))[:8000]},
            )
        except Exception:  # noqa: BLE001
            pass

    def _compute_cost(self) -> float:
        if not self.cost_model_key:
            return 0.0
        return estimate_cost_usd(
            provider_model=self.cost_model_key,
            in_tok=self._current.get("prompt_tokens") or 0,
            out_tok=self._current.get("completion_tokens") or 0,
            chars=self._current.get("tts_chars") or 0,
            audio_sec=(self._current.get("stt_audio_ms") or 0) / 1000,
        )

    def close(self) -> None:
        self.sink.close_session(
            self.session_id,
            cost_usd_est=round(self._cost_total, 6),
            turn_count=self._turn_idx,
        )

    @staticmethod
    def _safe_dump(o: Any) -> dict[str, Any]:
        if hasattr(o, "model_dump"):
            return o.model_dump()
        if hasattr(o, "__dict__"):
            return {k: v for k, v in o.__dict__.items() if not k.startswith("_")}
        return {"repr": repr(o)}


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────


def default_sink_from_env() -> TelemetrySink:
    """Build a sink using env vars, with sensible defaults.

    Env:
      VOICE_TELEMETRY=1|0     (default: 1)
      VOICE_TELEMETRY_DB      (default: ./telemetry.sqlite)
      VOICE_TELEMETRY_JSONL   (default: ./telemetry.jsonl; empty=disabled)
    """
    enabled = os.getenv("VOICE_TELEMETRY", "1") not in ("0", "false", "no")
    db = os.getenv("VOICE_TELEMETRY_DB", "telemetry.sqlite")
    jsonl_env = os.getenv("VOICE_TELEMETRY_JSONL", "telemetry.jsonl")
    jsonl = jsonl_env if jsonl_env else None
    return TelemetrySink(db_path=db, jsonl_path=jsonl, enabled=enabled)


def new_session_id() -> str:
    return uuid.uuid4().hex[:16]


# Suppress noisy asyncio "unawaited coroutine" when handler is sync.
asyncio.get_event_loop  # keep import for future async-handler upgrade  # noqa: B018
