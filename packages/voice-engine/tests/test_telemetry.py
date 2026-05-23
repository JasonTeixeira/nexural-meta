"""Telemetry integration tests — SQLite + JSONL writes, cost estimation,
metric-event coalescing into TurnRecord. No LiveKit network calls."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from types import SimpleNamespace

import pytest

from voice_engine.telemetry import (
    SessionTelemetry,
    TelemetrySink,
    TurnRecord,
    estimate_cost_usd,
)


@pytest.fixture
def sink(tmp_path: Path) -> TelemetrySink:
    return TelemetrySink(
        db_path=tmp_path / "telemetry.sqlite",
        jsonl_path=tmp_path / "telemetry.jsonl",
        enabled=True,
    )


def test_session_open_close_writes_sqlite(sink: TelemetrySink) -> None:
    from voice_engine.telemetry import SessionRecord
    sid = "abc123"
    sink.open_session(
        SessionRecord(
            session_id=sid,
            persona="voice_coach",
            room="room-1",
            identity="user-1",
            mode="cascaded",
            stt_model="nova-3",
            llm_model="claude-haiku-4-5",
            tts_model="sonic-3",
        )
    )
    sink.close_session(sid, cost_usd_est=0.123, turn_count=4)

    with sqlite3.connect(sink.db_path) as conn:
        row = conn.execute("SELECT persona, turn_count, cost_usd_est FROM sessions").fetchone()
    assert row == ("voice_coach", 4, 0.123)


def test_turn_record_written_with_metrics(sink: TelemetrySink) -> None:
    rec = TurnRecord(
        session_id="s1",
        turn_idx=1,
        role="agent",
        text="hello",
        ttft_ms=180.0,
        ttfa_ms=210.0,
        prompt_tokens=42,
        completion_tokens=18,
        cost_usd_est=0.00012,
    )
    sink.record_turn(rec)
    with sqlite3.connect(sink.db_path) as conn:
        row = conn.execute(
            "SELECT role, text, ttft_ms, ttfa_ms, prompt_tokens, cost_usd_est FROM turns"
        ).fetchone()
    assert row == ("agent", "hello", 180.0, 210.0, 42, 0.00012)


def test_jsonl_stream_contains_session_and_turn_events(sink: TelemetrySink) -> None:
    from voice_engine.telemetry import SessionRecord
    sid = "j1"
    sink.open_session(SessionRecord(
        session_id=sid, persona="tutor", room="r", identity="u",
        mode="cascaded", stt_model=None, llm_model=None, tts_model=None,
    ))
    sink.record_turn(TurnRecord(session_id=sid, turn_idx=1, role="user", text="hi"))
    sink.close_session(sid)
    lines = [json.loads(l) for l in sink.jsonl_path.read_text().splitlines()]
    events = [l["event"] for l in lines]
    assert events == ["session_open", "turn", "session_close"]


def test_cost_estimate_haiku() -> None:
    cost = estimate_cost_usd(
        provider_model="anthropic:claude-haiku-4-5",
        in_tok=1_000_000,
        out_tok=1_000_000,
    )
    # haiku 4.5 = $1 in + $5 out per 1M
    assert cost == pytest.approx(6.0, rel=1e-3)


def test_cost_estimate_unknown_model_returns_zero() -> None:
    assert estimate_cost_usd(provider_model="foo:bar", in_tok=999) == 0.0


def test_disabled_sink_is_silent(tmp_path: Path) -> None:
    sink = TelemetrySink(
        db_path=tmp_path / "t.sqlite",
        jsonl_path=tmp_path / "t.jsonl",
        enabled=False,
    )
    sink.record_turn(TurnRecord(session_id="x", turn_idx=1, role="user"))
    # When disabled we don't create the DB at all
    assert not (tmp_path / "t.sqlite").exists()


def test_session_telemetry_attach_coalesces_metrics(sink: TelemetrySink) -> None:
    """Simulate LK's metrics_collected events feeding into a turn."""
    st = SessionTelemetry(
        sink=sink,
        session_id="s2",
        persona_name="voice_coach",
        room_name="r",
        identity="u",
        mode="cascaded",
        stt_model="nova-3",
        llm_model="claude-haiku-4-5",
        tts_model="sonic-3",
        cost_model_key="anthropic:claude-haiku-4-5",
    )

    # Build fake metric objects mimicking LK's typed events. Class names
    # must match the strings the telemetry handler dispatches on.
    class LLMMetrics:
        def __init__(self) -> None:
            self.ttft = 175.0
            self.prompt_tokens = 100
            self.completion_tokens = 50

    class TTSMetrics:
        def __init__(self) -> None:
            self.ttfb = 95.0
            self.characters_count = 220

    class STTMetrics:
        def __init__(self) -> None:
            self.audio_duration = 1.2  # seconds

    st._on_metrics(SimpleNamespace(metrics=LLMMetrics()))
    st._on_metrics(SimpleNamespace(metrics=TTSMetrics()))
    st._on_metrics(SimpleNamespace(metrics=STTMetrics()))

    # Now an item is added — should flush as one TurnRecord.
    item = SimpleNamespace(role="assistant", text_content="ok", content="ok")
    st._on_item(SimpleNamespace(item=item))
    st.close()

    with sqlite3.connect(sink.db_path) as conn:
        turns = conn.execute(
            "SELECT role, text, ttft_ms, ttfa_ms, stt_audio_ms, prompt_tokens, completion_tokens, cost_usd_est FROM turns"
        ).fetchall()
    assert len(turns) == 1
    role, text, ttft, ttfa, stt_ms, p_tok, c_tok, cost = turns[0]
    assert role == "agent"
    assert text == "ok"
    assert ttft == 175.0
    assert ttfa == 95.0
    assert stt_ms == 1200.0  # converted s → ms
    assert p_tok == 100
    assert c_tok == 50
    assert cost > 0  # estimated
