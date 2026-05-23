# Eval — keep persona changes from regressing

The built-in eval harness runs **text-mode scenarios** against a
persona's LLM and grades them with an LLM judge. It's not a substitute
for voice-quality eval (latency, prosody, interruption handling — use
Hamming or Coval for those), but it catches the most common regression:
**a prompt edit makes the persona stop following its own procedure.**

## Scenario format

`personas/<name>.scenarios.yaml`:

```yaml
- name: gives_one_drill_at_a_time
  persona: voice_coach
  description: |
    On a first turn, the coach should give exactly ONE improvement
    and demonstrate it aloud.
  steps:
    - user: "Hey, here's my pitch — 'We help small businesses grow.'"
      assert:
        response_under_words: 80
        must_not_contain: ["multiple drills"]
        must_ask_clarifying_question: true
        custom_check: |
          The coach should give exactly ONE improvement, not a list.
```

Assertions:

| Field                          | Type                                                      |
| ------------------------------ | --------------------------------------------------------- |
| `must_contain`                 | list of strings the reply must include (case-insensitive) |
| `must_not_contain`             | list of strings the reply must NOT include                |
| `response_under_words`         | int — fail if reply has more words                        |
| `must_ask_clarifying_question` | bool — LLM judges                                         |
| `custom_check`                 | plain-English instruction handed to the LLM judge         |

`must_contain` / `must_not_contain` / `response_under_words` are
programmatic (zero API cost). The rest invoke the LLM judge (Claude
Haiku 4.5 by default).

## Run

```bash
nx-voice eval personas/voice_coach.scenarios.yaml
```

Output:

```
Eval: 1/2 scenarios passed
  ✓ voice_coach/gives_one_drill_at_a_time
  ✗ voice_coach/respects_silence
      USER: I think I'm bad at this.
      AGENT: You're definitely going to get better!
        × must_not_contain present: 'you're definitely'
```

Exits non-zero on any failure — wire into CI.

## In CI

```yaml
# .github/workflows/voice-eval.yml
- name: Voice persona eval
  run: |
    cd packages/voice-engine
    .venv/bin/nx-voice eval personas/voice_coach.scenarios.yaml
    .venv/bin/nx-voice eval personas/tutor.scenarios.yaml
```

## When to write scenarios

- **Every new persona** — at least 2 scenarios covering the "happy path"
  and one "tricky path."
- **Every persona prompt edit** — add a scenario codifying what the edit
  was supposed to fix.
- **Every reported regression** — a scenario that would have caught it.

## Limits

- **Realtime personas can't be evaluated** in text mode (no separate
  LLM step). Use Hamming/Coval voice eval for those.
- **No tool-call verification** yet — LLM-as-judge sees only text. The
  `must_call_tool` assertion is a planned upgrade.
- **Cost:** each LLM-judged step is ~$0.001. 20 scenarios × 5 steps × 2
  per CI run = ~$0.20. Acceptable.

## Heavy-duty voice eval (when you need it)

For latency, prosody, interruption handling, and real-user-style
adversarial testing, swap to:

- **Hamming** — https://hamming.ai. Simulation + LLM judge + human review.
- **Coval** — simulation-first methodology from self-driving.
- **Langfuse** — wire into telemetry for trace-level inspection.

The built-in harness is the daily-driver; those are the deep-dive tools.
