# Playbook: Add Evals to an Existing LLM App

> **Trigger:** You have a working LLM feature in production. It feels like it works.
> You changed a prompt last week and aren't sure if it got better or worse.
> You need evals.

---

## The Three Things You Need

Before picking any tool, understand what you're actually building:

```
1. Test cases    — (input, expected_behavior) pairs you can run repeatedly
2. Scorers       — functions that return a number (0–1 or pass/fail) given (output, expected)
3. Runner        — the harness that executes cases, collects scores, stores results, reports trends
```

Everything else is tooling on top of these three primitives. You can implement all three
in pure Python in an afternoon. The argument for eval platforms is: they give you the
runner, a UI for trend analysis, CI hooks, and team collaboration — not magic.

---

## Day 1: Quickstart with Promptfoo

**Promptfoo** is the fastest path to running evals because it's YAML-first, requires zero
infra, and integrates into any CI pipeline in under an hour. Use it to validate that
your prompts don't regress before you invest in a heavier platform.

### Install

```bash
npm install -g promptfoo
# or: npx promptfoo@latest
```

### Minimal config (`promptfooconfig.yaml`)

```yaml
# promptfooconfig.yaml
description: "Customer support classifier evals"

providers:
  - id: openai:gpt-4o-mini
    config:
      temperature: 0.0 # deterministic for evals

prompts:
  - "Classify the following customer message as one of: billing, technical, general. Message: {{message}}"

tests:
  - vars:
      message: "My card was charged twice"
    assert:
      - type: contains
        value: "billing"

  - vars:
      message: "The app crashes on login"
    assert:
      - type: contains
        value: "technical"

  - vars:
      message: "What are your hours?"
    assert:
      - type: contains
        value: "general"
      - type: llm-rubric
        value: "The response should be a single lowercase word, no punctuation"
```

### Run it

```bash
promptfoo eval                    # run all test cases
promptfoo eval --watch            # re-run on config changes (dev loop)
promptfoo view                    # open local web UI with results
```

### What you get on Day 1

- Pass/fail per test case
- Score trends if you run it multiple times
- A YAML-based golden test set you can commit to git
- `--ci` flag exits non-zero on failure (CI-ready from day 1)

---

## Week 1: Graduate to Langfuse OR Braintrust

Once you have 20+ test cases and want trend analysis, team sharing, and deeper CI
integration, graduate to a hosted platform.

### Decision rule (from [DECISIONS.md])

```
IF   you need LLM observability (traces, costs, latency) AND eval in one tool
     AND want self-host option (GDPR / data-residency)
→    Langfuse [langfuse]

IF   you need a full eval platform: dataset management, prompt playground,
     scoring functions, CI integration, and a hosted dashboard
→    Braintrust [braintrust]

Best practice: run BOTH.
  Langfuse owns runtime traces (prod).
  Braintrust owns offline eval datasets (quality gate in CI).
```

### Langfuse quickstart

```python
# pip install langfuse openai
from langfuse import Langfuse
from langfuse.openai import openai  # drop-in wrapper

langfuse = Langfuse()  # reads LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY from env

# Your existing code — just swap `import openai` for the wrapper
response = openai.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": user_message}],
)

# Score a trace manually
langfuse.score(
    trace_id=response.id,
    name="correctness",
    value=1.0,  # human label: 1 = correct, 0 = wrong
)
```

Once traces flow in, create a dataset in the Langfuse UI from real production traces,
then run offline evals against that dataset.

### Braintrust quickstart

```python
# pip install braintrust autoevals
import braintrust
from autoevals import Levenshtein, LLMClassifier

# Define your task
def classify_support_ticket(input):
    import openai
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Classify as: billing | technical | general"},
            {"role": "user", "content": input["message"]},
        ],
        temperature=0,
    )
    return resp.choices[0].message.content.strip().lower()

# Run the eval
braintrust.Eval(
    name="support-classifier",
    data=[
        {"input": {"message": "charged twice"}, "expected": "billing"},
        {"input": {"message": "app crashes"}, "expected": "technical"},
        {"input": {"message": "what are your hours"}, "expected": "general"},
    ],
    task=classify_support_ticket,
    scores=[Levenshtein],  # exact string match here; use LLMClassifier for open-ended
)
```

Run: `python evals/run.py` → results appear in Braintrust dashboard with score trends.

---

## How to Write Your First 20 Test Cases

### The golden-set strategy

Don't manufacture test cases from your imagination. **Mine your real usage.**

**Step 1: Sample production outputs (first 2-3 days)**

```python
# In Langfuse: export 50-100 recent traces, filter by user feedback if you have it
# Or: log all LLM calls to JSONL for 48 hours

# simple prod logger
import json, pathlib, datetime

def log_call(input: dict, output: str):
    with open("prod_log.jsonl", "a") as f:
        f.write(json.dumps({
            "ts": datetime.datetime.utcnow().isoformat(),
            "input": input,
            "output": output,
        }) + "\n")
```

**Step 2: Hand-label 20 examples**

Open the log file. For each entry:

- Is the output correct? (binary: 1 / 0)
- Is there anything obviously wrong?
- Is this example "interesting" (edge case, failure, surprising success)?

These 20 hand-labeled examples become your golden set. Every eval run is measured
against these 20 cases first. Anything below your baseline = regression.

**Step 3: Categorize your golden set**

A balanced golden set covers:
| Category | % of set | Example |
|---|---|---|
| Happy path | 50% | Normal, expected input |
| Edge cases | 25% | Empty input, very long input, unusual phrasing |
| Failure modes | 15% | Inputs your system has historically gotten wrong |
| Adversarial | 10% | Attempts to break the expected format, inject instructions |

**Step 4: Version your test cases**

```bash
# Store as JSONL in git
tests/
  golden_set_v1.jsonl    # 20 hand-labeled
  golden_set_v2.jsonl    # 50 after first production week
  adversarial.jsonl      # red-team cases
```

A test case format that works with any runner:

```jsonl
{"input": {"message": "cancel my subscription"}, "expected": "billing", "tags": ["happy-path"]}
{"input": {"message": ""}, "expected": "general", "tags": ["edge-case", "empty-input"]}
{"input": {"message": "URGENT!!! REFUND"}, "expected": "billing", "tags": ["adversarial"]}
```

---

## LLM-as-Judge Gotchas

LLM-as-judge (using GPT-4o or Claude to score outputs) is powerful for open-ended
evaluation where string matching fails. But it has real failure modes.

### 1. Calibration bias

LLM judges have systematic preferences:

- Prefer longer, more detailed answers (verbosity bias)
- Prefer outputs that agree with the judge's priors
- Rate outputs from the same model family higher (self-favoritism)

**Fix:** Use a separate model family for judging. If your app uses GPT-4o, judge with
Claude. If both, compare their scores; large divergence = unreliable.

```python
# autoevals built-in: structured rubric reduces bias
from autoevals import LLMClassifier

judge = LLMClassifier(
    name="relevance",
    prompt_template="""
You are evaluating whether an AI response is relevant to the user's question.

User question: {{input}}
AI response: {{output}}

Score on a scale of 1-5:
5 = Directly and completely answers the question
4 = Answers the question with minor irrelevant content
3 = Partially answers the question
2 = Tangentially related but doesn't answer
1 = Completely irrelevant or wrong

Return only the number, nothing else.
""",
    choice_scores={"1": 0.0, "2": 0.25, "3": 0.5, "4": 0.75, "5": 1.0},
)
```

### 2. Score drift over time

The same judge prompt + same model can give different scores as the underlying model
is updated. OpenAI updates models silently; a "gpt-4o" in March ≠ "gpt-4o" in August.

**Fix:** Pin judge model versions explicitly. Log judge model version alongside scores.

```python
judge_model = "gpt-4o-2024-08-06"  # pinned, not "gpt-4o"
```

### 3. Cost at scale

100 test cases × GPT-4o judge = ~$0.05–0.20 per run depending on prompt length.
At 10 CI runs/day, that's $15-60/month just for evals.

**Fix:** Use a tiered scoring strategy:

1. Cheap deterministic checks first (regex, string contains, exact match) — ~free
2. Small model judge (gpt-4o-mini) for medium-confidence — ~$0.001/case
3. Full GPT-4o judge only for cases where smaller model is uncertain — ~$0.02/case

```python
def score_with_tiers(input, output, expected):
    # Tier 1: fast exact match
    if output.strip().lower() == expected.lower():
        return 1.0, "exact-match"

    # Tier 2: cheap mini judge
    mini_score = run_llm_judge(input, output, expected, model="gpt-4o-mini")
    if mini_score < 0.3 or mini_score > 0.7:
        return mini_score, "mini-judge"

    # Tier 3: full judge for uncertain cases
    full_score = run_llm_judge(input, output, expected, model="gpt-4o-2024-08-06")
    return full_score, "full-judge"
```

### 4. The judge doesn't know your domain

Generic judge prompts miss domain-specific quality signals. Be explicit about what
"correct" means in your context.

```
BAD:  "Is this a good response? Score 1-5."
GOOD: "You are evaluating a customer support reply for a B2B SaaS company.
       A correct reply must: (1) address the specific question asked,
       (2) not promise anything not in our product, (3) use a professional tone.
       Score 0–1 where 1 = meets all three criteria."
```

---

## Running Evals in CI on Every PR

The goal: every PR that changes a prompt, system message, or model triggers an eval
run. The PR is blocked if scores drop below baseline.

### Option A: Promptfoo in GitHub Actions

```yaml
# .github/workflows/evals.yml
name: LLM Evals
on:
  pull_request:
    paths:
      - "prompts/**"
      - "src/llm/**"
      - "evals/**"

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install -g promptfoo
      - name: Run evals
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          promptfoo eval --ci --output results.json
          promptfoo generate dataset  # optional: auto-generate new cases
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: results.json
```

### Option B: Braintrust GitHub Action

```yaml
# .github/workflows/evals.yml
name: Braintrust Evals
on: [pull_request]

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install braintrust autoevals openai
      - name: Run evals
        env:
          BRAINTRUST_API_KEY: ${{ secrets.BRAINTRUST_API_KEY }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: python evals/run.py
```

Braintrust automatically posts a comment to the PR with score deltas versus the
`main` branch baseline. PRs that drop the eval score by >5% can be configured
to block merge.

### Cost control in CI

```yaml
# Only run expensive evals on main, fast evals on every PR
- name: Fast evals (PR)
  if: github.event_name == 'pull_request'
  run: promptfoo eval --filter-pattern "happy-path" --ci

- name: Full eval suite (main merge)
  if: github.ref == 'refs/heads/main'
  run: promptfoo eval --ci
```

---

## When to Graduate to Inspect AI or Ragas

### Inspect AI (`inspect_ai`) — UK AISI's eval framework

Reach for Inspect AI when:

- You need structured **safety evals** (not just quality): refusal testing, jailbreak
  resistance, harmful output classification
- Your evals need multiple **solver steps** (agents, tool-using evals)
- You want standardized eval formats that can be shared externally (research-adjacent work)
- You're evaluating **model capabilities** rather than app behavior

```python
# pip install inspect-ai
from inspect_ai import Task, eval
from inspect_ai.dataset import json_dataset
from inspect_ai.scorer import model_graded_fact
from inspect_ai.solver import generate

task = Task(
    dataset=json_dataset("tests/safety_cases.jsonl"),
    plan=[generate()],
    scorer=model_graded_fact(model="openai/gpt-4o"),
)

eval(task, model="openai/gpt-4o-mini")
```

### Ragas — for RAG pipelines specifically

Reach for Ragas when:

- You have a RAG pipeline and need to measure **retrieval quality** separately from
  generation quality
- You want standard RAG metrics: faithfulness, answer relevancy, context precision,
  context recall
- You're debugging _why_ your RAG answers are wrong (retrieval problem vs generation problem)

```python
# pip install ragas
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

data = Dataset.from_list([{
    "question": "What is the return policy?",
    "answer": "You can return items within 30 days.",
    "contexts": ["Our return policy allows returns within 30 days of purchase."],
    "ground_truth": "Items can be returned within 30 days.",
}])

result = evaluate(data, metrics=[
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
])
print(result)
# {'faithfulness': 0.95, 'answer_relevancy': 0.88, ...}
```

**Decision summary:**

| Situation                             | Reach for                                     |
| ------------------------------------- | --------------------------------------------- |
| Starting from zero, need fast setup   | Promptfoo [promptfoo]                         |
| Want prod traces + offline evals      | Langfuse [langfuse] + Braintrust [braintrust] |
| RAG pipeline, measure retrieval       | Ragas                                         |
| Safety / capability evals, multi-step | Inspect AI                                    |

---

## Concrete Code: Full Eval Runner (Pydantic AI / OpenAI SDK)

```python
# evals/runner.py
# Minimal eval runner that works with any LLM call.
# No external eval platform needed for basic use.

from __future__ import annotations
import json
import statistics
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable
import openai

client = openai.OpenAI()


@dataclass
class TestCase:
    id: str
    input: dict
    expected: str
    tags: list[str] = field(default_factory=list)


@dataclass
class EvalResult:
    case_id: str
    input: dict
    expected: str
    actual: str
    score: float
    scorer_name: str
    passed: bool


def load_cases(path: str) -> list[TestCase]:
    cases = []
    for line in Path(path).read_text().splitlines():
        if line.strip():
            d = json.loads(line)
            cases.append(TestCase(**d))
    return cases


def exact_match(actual: str, expected: str) -> float:
    return 1.0 if actual.strip().lower() == expected.strip().lower() else 0.0


def contains_scorer(actual: str, expected: str) -> float:
    return 1.0 if expected.lower() in actual.lower() else 0.0


def llm_judge(actual: str, expected: str, question: str = "") -> float:
    """Uses gpt-4o-mini as a cheap judge. Returns 0.0–1.0."""
    prompt = f"""Score whether the AI response matches the expected answer.
Expected: {expected}
Actual: {actual}
Return only a number from 0 to 1. 1 = matches, 0 = does not match."""

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    try:
        return float(resp.choices[0].message.content.strip())
    except ValueError:
        return 0.0


def run_eval(
    task_fn: Callable[[dict], str],
    cases: list[TestCase],
    scorer: Callable[[str, str], float] = exact_match,
    scorer_name: str = "exact_match",
    threshold: float = 0.8,
) -> tuple[list[EvalResult], float]:
    results = []
    for case in cases:
        actual = task_fn(case.input)
        score = scorer(actual, case.expected)
        results.append(EvalResult(
            case_id=case.id,
            input=case.input,
            expected=case.expected,
            actual=actual,
            score=score,
            scorer_name=scorer_name,
            passed=score >= threshold,
        ))

    avg_score = statistics.mean(r.score for r in results)
    return results, avg_score


def print_report(results: list[EvalResult], avg_score: float):
    print(f"\n{'='*60}")
    print(f"Eval Results: {len(results)} cases | Avg score: {avg_score:.2%}")
    print(f"{'='*60}")
    failed = [r for r in results if not r.passed]
    if failed:
        print(f"\nFAILED ({len(failed)}):")
        for r in failed:
            print(f"  [{r.case_id}] expected={r.expected!r} got={r.actual!r} score={r.score:.2f}")
    else:
        print("All cases passed.")
    print()


# ─── Usage ────────────────────────────────────────────────────────────────────

def my_classifier(input: dict) -> str:
    """Your actual LLM call goes here."""
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Classify as: billing | technical | general"},
            {"role": "user", "content": input["message"]},
        ],
        temperature=0,
    )
    return resp.choices[0].message.content.strip().lower()


if __name__ == "__main__":
    cases = load_cases("tests/golden_set_v1.jsonl")
    results, avg = run_eval(my_classifier, cases, scorer=exact_match)
    print_report(results, avg)

    # Exit non-zero for CI if below threshold
    import sys
    if avg < 0.85:
        print(f"FAIL: avg score {avg:.2%} below threshold 85%")
        sys.exit(1)
```

### Pydantic AI version

```python
# If your app uses Pydantic AI agents, eval the agent directly
from pydantic_ai import Agent
from pydantic import BaseModel

class ClassificationOutput(BaseModel):
    category: str  # "billing" | "technical" | "general"
    confidence: float

agent = Agent(
    model="openai:gpt-4o-mini",
    result_type=ClassificationOutput,
    system_prompt="Classify customer support messages.",
)

async def run_agent(input: dict) -> str:
    result = await agent.run(input["message"])
    return result.data.category

# Use with run_eval() above; async wrapper needed
import asyncio
def sync_run_agent(input: dict) -> str:
    return asyncio.run(run_agent(input))
```

---

## Related Warehouse Entries

- [braintrust] — eval platform, CI hooks, dataset management
- [langfuse] — prod tracing + eval datasets; self-hostable
- [phoenix-arize] — OTel-native tracing, framework-agnostic
- [langsmith] — if you're in the LangChain ecosystem
- [pydantic-ai] — agent framework with excellent testing story

---

## Quick Reference Checklist

```
Day 1:
  [ ] 20 hand-labeled test cases in JSONL
  [ ] Promptfoo config + passing run
  [ ] promptfoo eval --ci in CI pipeline

Week 1:
  [ ] Langfuse SDK wrapping prod LLM calls
  [ ] Braintrust project + dataset from golden set
  [ ] Braintrust GitHub Action on PR
  [ ] LLM judge with pinned model version

Month 1:
  [ ] 100+ test cases covering edge cases
  [ ] Score trend dashboard (any platform)
  [ ] Eval result storage + baseline comparison
  [ ] Eval triggered on prompt file changes (not all PRs)
```
