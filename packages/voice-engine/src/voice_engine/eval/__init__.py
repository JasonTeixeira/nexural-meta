"""Eval harness — text-mode persona regression testing.

Scenarios live next to personas as `<name>.scenarios.yaml`. The runner
simulates a conversation by sending the user lines through the persona's
LLM (no audio), then asks an LLM judge if each assertion passed.

Lightweight by design. For voice-quality eval (latency, prosody),
integrate Hamming or Coval — wire their SDKs to TelemetrySink.
"""

from voice_engine.eval.runner import EvalReport, EvalResult, run_scenario_file
from voice_engine.eval.scenarios import Scenario, ScenarioStep, load_scenarios

__all__ = [
    "EvalReport",
    "EvalResult",
    "Scenario",
    "ScenarioStep",
    "load_scenarios",
    "run_scenario_file",
]
