"""PersonaConfig — the swap layer.

A single YAML file fully defines a voice app. The engine code never changes;
only the persona changes. Drop in a new YAML, get a new product.
"""

from __future__ import annotations

from enum import Enum
from pathlib import Path
from typing import Any, Literal

import yaml
from pydantic import BaseModel, Field, model_validator


# ─────────────────────────────────────────────────────────────────────────────
# Enums for swappable provider choices
# ─────────────────────────────────────────────────────────────────────────────

class Mode(str, Enum):
    CASCADED = "cascaded"   # STT → LLM → TTS  (debuggable, swappable, cheap)
    REALTIME = "realtime"   # End-to-end S2S  (most natural, vendor-locked)


class STTProvider(str, Enum):
    DEEPGRAM = "deepgram"
    OPENAI = "openai"
    GOOGLE = "google"


class LLMProvider(str, Enum):
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    GOOGLE = "google"


class TTSProvider(str, Enum):
    CARTESIA = "cartesia"
    ELEVENLABS = "elevenlabs"
    OPENAI = "openai"


class RealtimeProvider(str, Enum):
    OPENAI = "openai"   # gpt-realtime
    GOOGLE = "google"   # Gemini Live


# ─────────────────────────────────────────────────────────────────────────────
# Sub-configs
# ─────────────────────────────────────────────────────────────────────────────

class STTConfig(BaseModel):
    provider: STTProvider = STTProvider.DEEPGRAM
    model: str = "nova-3"
    language: str = "en"
    keyterms: list[str] = Field(default_factory=list)


class LLMConfig(BaseModel):
    provider: LLMProvider = LLMProvider.ANTHROPIC
    model: str = "claude-haiku-4-5"
    temperature: float = 0.6
    max_tokens: int = 1024


class TTSConfig(BaseModel):
    provider: TTSProvider = TTSProvider.CARTESIA
    model: str = "sonic-3"
    voice: str = "248be419-c632-4f23-adf1-5324ed7dbf1d"  # Cartesia default
    speed: float = 1.0
    # OpenAI gpt-4o-mini-tts only: prompt-steerable personality
    instructions: str | None = None


class RealtimeConfig(BaseModel):
    provider: RealtimeProvider = RealtimeProvider.OPENAI
    model: str = "gpt-realtime"
    voice: str = "marin"
    temperature: float = 0.7


class TurnDetectionConfig(BaseModel):
    """Three layers stacked: noise cancellation → VAD → semantic turn detection."""

    use_noise_cancellation: bool = True
    use_semantic_turn_detector: bool = True
    # min wait after VAD says "silent" before firing end-of-turn
    min_endpointing_delay: float = 0.5
    # max wait if model is uncertain
    max_endpointing_delay: float = 6.0


class MemoryConfig(BaseModel):
    enabled: bool = False
    provider: Literal["mem0"] = "mem0"
    user_id_strategy: Literal["participant_identity", "room_name"] = "participant_identity"


class SupervisorConfig(BaseModel):
    """Chat-Supervisor pattern. A heavier LLM the voice persona can consult
    mid-conversation for hard reasoning, without blocking speech."""

    enabled: bool = False
    model: str = "claude-sonnet-4-6"
    max_tokens: int = 1024
    temperature: float = 0.4


class RecordingConfig(BaseModel):
    """What to capture for QA/eval. Per-persona.

    Default: transcript on, audio off, telemetry on. Personas that handle
    sensitive data (medical, finance) should disable transcript or route
    it to a compliant sink instead of local JSONL.
    """

    transcript: bool = True
    """Persist conversation transcript to telemetry SQLite + JSONL."""
    audio: bool = False
    """Persist room audio (uses LiveKit Egress — Cloud feature, costs apply)."""
    telemetry: bool = True
    """Per-turn latency/cost metrics into SQLite."""


class OrchestrationConfig(BaseModel):
    """Multi-persona orchestration.

    `handoff_targets`: persona names this agent can transfer the call to.
    Empty list = no handoff capability (default).
    """

    handoff_targets: list[str] = Field(default_factory=list)
    supervisor: SupervisorConfig = Field(default_factory=SupervisorConfig)


class MCPServerConfig(BaseModel):
    """Per-app tool/content surface. THE swap layer.

    Each MCP server exposes app-specific tools (get_lesson_plan, log_session,
    fetch_user_progress, etc). Different app = different MCP servers, same engine.
    """

    name: str
    # Either remote URL (preferred) or local stdio command
    url: str | None = None
    command: str | None = None
    args: list[str] = Field(default_factory=list)
    env: dict[str, str] = Field(default_factory=dict)

    @model_validator(mode="after")
    def _exactly_one_transport(self) -> "MCPServerConfig":
        if bool(self.url) == bool(self.command):
            raise ValueError(f"MCP server '{self.name}' needs exactly one of url or command")
        return self


# ─────────────────────────────────────────────────────────────────────────────
# Top-level persona
# ─────────────────────────────────────────────────────────────────────────────

class PersonaConfig(BaseModel):
    """A complete voice app, in one file."""

    # Identity
    name: str
    description: str = ""
    version: str = "1.0.0"

    # The brain & voice
    mode: Mode = Mode.CASCADED
    system_prompt: str
    greeting: str | None = None
    """Optional first thing the agent says when a participant joins."""

    # Provider stack (cascaded mode)
    stt: STTConfig = Field(default_factory=STTConfig)
    llm: LLMConfig = Field(default_factory=LLMConfig)
    tts: TTSConfig = Field(default_factory=TTSConfig)

    # Realtime mode (only used if mode = realtime)
    realtime: RealtimeConfig = Field(default_factory=RealtimeConfig)

    # Conversational dynamics
    turn_detection: TurnDetectionConfig = Field(default_factory=TurnDetectionConfig)

    # Memory across sessions
    memory: MemoryConfig = Field(default_factory=MemoryConfig)

    # MCP servers = tools = per-app content surface
    mcp_servers: list[MCPServerConfig] = Field(default_factory=list)

    # Multi-persona orchestration (handoffs + supervisor)
    orchestration: OrchestrationConfig = Field(default_factory=OrchestrationConfig)

    # What to capture for QA / eval / debugging
    recording: RecordingConfig = Field(default_factory=RecordingConfig)

    # Free-form metadata (telemetry tags, app id, tenant, etc.)
    metadata: dict[str, Any] = Field(default_factory=dict)


# ─────────────────────────────────────────────────────────────────────────────
# Loader
# ─────────────────────────────────────────────────────────────────────────────

def load_persona(path: str | Path) -> PersonaConfig:
    """Load and validate a persona YAML.

    Raises pydantic.ValidationError if the file is malformed.
    """
    path = Path(path).expanduser().resolve()
    if not path.exists():
        raise FileNotFoundError(f"Persona file not found: {path}")
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f) or {}
    return PersonaConfig.model_validate(data)
