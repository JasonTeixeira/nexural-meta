"""Provider factories — map persona config to LiveKit plugin instances.

Every provider type (STT, LLM, TTS, realtime) is swappable by changing
one YAML field. Adding a new provider means adding one elif branch here —
nothing else in the engine changes.
"""

from voice_engine.providers.llm import build_llm
from voice_engine.providers.realtime import build_realtime
from voice_engine.providers.stt import build_stt
from voice_engine.providers.tts import build_tts

__all__ = ["build_stt", "build_llm", "build_tts", "build_realtime"]
