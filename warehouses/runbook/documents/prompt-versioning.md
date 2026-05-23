# Playbook: Prompt Versioning

> **Trigger:** You're editing prompts in git or directly in code, you made a change last
> week, and you genuinely don't know if it made things better or worse. You're also
> the only person who can change prompts because they live in your Python files.
> This playbook fixes both problems.

---

## Why "Prompts in Git" Fails at Scale

Storing prompts as Python string constants or template files in git is fine for a solo
developer at prototype stage. It breaks down along three axes:

**1. No iteration velocity for non-engineers**
Product managers, domain experts, and technical writers can't iterate on prompts without
a PR. The feedback loop for "try this phrasing" is: write code → open PR → wait for review
→ deploy → check results. This is 2-4 hours minimum. The right feedback loop is seconds.

**2. No eval-on-change**
When a prompt changes in a git commit, nothing automatically checks whether quality improved
or degraded. You find out when users complain, not when you push. By then you've already
deployed 3 more things and bisecting is painful.

**3. No safe rollback**
If a prompt change degrades quality, reverting means a git revert, re-deploy, and hope
your CI/CD is fast enough. In a production system, you want a 30-second rollback without
a code deploy.

---

## The Three Patterns

### Pattern 1: Prompts-as-Code (Good for: solo dev, <5 prompts, early stage)

```python
# prompts/classifier.py
# Version tracked in git; no external dependency

CLASSIFY_SYSTEM_V2 = """
You are a customer support classifier. Classify each message as exactly one of:
billing, technical, general, cancellation.

Rules:
- Return only the category, lowercase, no punctuation
- If ambiguous, prefer the more specific category
"""

# Usage
messages = [
    {"role": "system", "content": CLASSIFY_SYSTEM_V2},
    {"role": "user", "content": user_message},
]
```

**When this breaks:** >5 prompts, any non-engineer needs to edit, or you ship more than
once a day and need rollback faster than CI/CD.

### Pattern 2: Prompts-in-DB (Good for: team iteration, no external vendor)

```python
# Store prompts in your Postgres DB with version tracking
# migrations/create_prompts.sql:
#
# CREATE TABLE prompts (
#   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
#   name TEXT NOT NULL,
#   version INTEGER NOT NULL,
#   content TEXT NOT NULL,
#   is_active BOOLEAN DEFAULT false,
#   eval_score FLOAT,
#   created_at TIMESTAMPTZ DEFAULT NOW(),
#   UNIQUE(name, version)
# );
# CREATE INDEX ON prompts(name, is_active);

import psycopg2

def get_active_prompt(name: str, db_conn) -> str:
    row = db_conn.execute(
        "SELECT content FROM prompts WHERE name = %s AND is_active = true",
        [name]
    ).fetchone()
    if not row:
        raise ValueError(f"No active prompt found for: {name}")
    return row[0]

# Use in application:
system_prompt = get_active_prompt("support-classifier", db_conn)

# Rollback: UPDATE prompts SET is_active = false WHERE name = 'support-classifier' AND version = 3;
#           UPDATE prompts SET is_active = true WHERE name = 'support-classifier' AND version = 2;
```

**Benefits:** Non-engineers can update prompts via a simple admin UI. Rollback is an
SQL update. No code deploy needed for prompt changes.

**Drawbacks:** No built-in eval integration. No A/B testing. You're building the
tooling yourself. Works until you need eval-on-change or A/B testing.

### Pattern 3: Hosted Prompt Management (Good for: teams, eval-on-change, A/B testing)

Hosted tools add: version history, playground for testing, eval integration, A/B experiment
support, and access control. The cost is another vendor dependency.

---

## When to Graduate to a Hosted Tool

```
IF   team size > 3 AND non-engineers need to iterate on prompts
     → Any hosted tool is better than nothing

IF   you want eval-on-change (block deploy if quality drops)
     AND you're already using Langfuse
     → Langfuse Prompts (zero additional cost, already integrated)

IF   you want A/B testing prompts in production with proper stats
     AND you have high traffic (>10k req/day per prompt)
     → Langfuse Prompts + Statsig OR PromptLayer

IF   you want a dedicated "prompt ops" workflow with playground,
     eval datasets, and deployment controls
     AND you can justify another vendor
     → Latitude.so (best DX for this specific workflow in 2026)

IF   you want the simplest possible addition to an existing
     LangSmith setup
     → LangSmith Hub (prompts native to LangSmith)
```

---

## Langfuse Prompts: The Default Choice

If you're already using Langfuse for tracing, Langfuse Prompts is the path of least
resistance — no new vendor, same SDK, automatic link between prompt versions and traces.

```python
# pip install langfuse
from langfuse import Langfuse

langfuse = Langfuse()

# Fetch the production prompt (labeled "production" in UI)
prompt = langfuse.get_prompt("support-classifier", label="production")

# The prompt.compile() method handles template variable substitution
messages = [
    {"role": "system", "content": prompt.compile()},
    {"role": "user", "content": user_message},
]

# Log a generation linked to this prompt version
with langfuse.start_as_current_span("classify") as span:
    span.update(prompt=prompt)  # Links trace to exact prompt version
    response = openai.chat.completions.create(model="gpt-4o-mini", messages=messages)
```

**What you get:**

- Every trace in Langfuse shows exactly which prompt version was used
- Roll back: label a previous version as "production" in the Langfuse UI
- Eval your prompt versions: create a dataset, run evals against both versions, compare

---

## Eval-on-Change CI Pattern

The goal: when a prompt file changes in a PR, automatically run evals and post the results.
Block the PR if quality drops below baseline.

```yaml
# .github/workflows/prompt-evals.yml
name: Prompt Evals
on:
  pull_request:
    paths:
      - "prompts/**"
      - "src/llm/**"

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt

      - name: Detect changed prompts
        id: changed
        run: |
          CHANGED=$(git diff --name-only origin/main...HEAD -- prompts/ src/llm/)
          echo "files=$CHANGED" >> $GITHUB_OUTPUT

      - name: Run evals for changed prompts
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          LANGFUSE_PUBLIC_KEY: ${{ secrets.LANGFUSE_PUBLIC_KEY }}
          LANGFUSE_SECRET_KEY: ${{ secrets.LANGFUSE_SECRET_KEY }}
          BRAINTRUST_API_KEY: ${{ secrets.BRAINTRUST_API_KEY }}
        run: |
          python evals/run_changed.py --changed-files "${{ steps.changed.outputs.files }}"

      - name: Check eval threshold
        run: |
          python evals/check_threshold.py --min-score 0.85 --results evals/results.json
```

```python
# evals/check_threshold.py
import json, sys, argparse

parser = argparse.ArgumentParser()
parser.add_argument("--min-score", type=float, default=0.85)
parser.add_argument("--results", type=str, default="evals/results.json")
args = parser.parse_args()

with open(args.results) as f:
    results = json.load(f)

for prompt_name, scores in results.items():
    avg = sum(scores) / len(scores)
    if avg < args.min_score:
        print(f"FAIL: {prompt_name} scored {avg:.2%} (threshold: {args.min_score:.2%})")
        sys.exit(1)
    else:
        print(f"PASS: {prompt_name} scored {avg:.2%}")
```

### Braintrust CI integration (richer diff reporting)

```python
# evals/run_eval.py
# Braintrust posts a PR comment with the score diff vs main baseline
import braintrust
from autoevals import LLMClassifier

def run_classifier_eval(prompt_content: str):
    def task(input_dict):
        import openai
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt_content},
                {"role": "user", "content": input_dict["message"]},
            ],
            temperature=0,
        )
        return response.choices[0].message.content.strip().lower()

    braintrust.Eval(
        name="support-classifier",  # project name in Braintrust
        data=load_golden_set("tests/golden_set_v1.jsonl"),
        task=task,
        scores=[LLMClassifier(name="category_match", ...)],
        metadata={"prompt_hash": hash(prompt_content)},
    )
```

When Braintrust compares results, it posts something like:

```
Eval: support-classifier
Baseline (main): 92.3% avg score
This PR:         87.1% avg score
Delta:           -5.2% ⚠️ Below 5% threshold
```

---

## A/B Testing Prompts in Production

Testing prompts in CI tells you if quality held. A/B testing in production tells you if
real users respond better. Both are needed.

### Statsig + Langfuse pattern

```python
import statsig  # pip install statsig
from langfuse import Langfuse

langfuse = Langfuse()
statsig.initialize("STATSIG_SERVER_SECRET")

def get_prompt_for_user(user_id: str) -> tuple[str, str]:
    """Returns (prompt_content, variant_name)"""

    # Statsig assigns this user to a variant deterministically
    experiment = statsig.get_experiment(
        user=statsig.StatsigUser(user_id=user_id),
        experiment_name="support-classifier-prompt-ab",
    )

    variant = experiment.get("variant", "control")  # "control" or "treatment"

    # Fetch the corresponding prompt version from Langfuse
    label = "production" if variant == "control" else "challenger"
    prompt = langfuse.get_prompt("support-classifier", label=label)

    return prompt.compile(), variant

# Usage:
prompt_content, variant = get_prompt_for_user(current_user.id)

# After getting the response, log the outcome:
statsig.log_event(
    user=statsig.StatsigUser(user_id=current_user.id),
    event_name="support_classified",
    metadata={
        "variant": variant,
        "category": response_category,
        "user_escalated": did_user_escalate,  # downstream outcome metric
    }
)
```

**What to measure:** Don't just measure model quality scores — measure user outcomes.
Does the "treatment" prompt reduce escalation rate? Increase CSAT? Lower time-to-resolution?
These are the metrics that justify shipping a prompt change, not just eval scores.

**Minimum sample size:** Run A/B tests for at least 1,000 samples per variant before
concluding. Prompt A/B tests need the same statistical rigor as UI A/B tests.

---

## Rollback Strategy

### Fast rollback (production emergency)

If you're using Langfuse Prompts or Promptlayer:

1. Go to the prompt management UI
2. Find the previously working version
3. Click "Promote to production"
4. Done — no code deploy, <30 seconds

If you're using Prompts-in-DB:

```sql
BEGIN;
UPDATE prompts SET is_active = false WHERE name = 'support-classifier' AND version = 4;
UPDATE prompts SET is_active = true WHERE name = 'support-classifier' AND version = 3;
COMMIT;
-- No code deploy needed; app reads from DB on each request
```

If you're using Prompts-as-Code:

```bash
git revert <commit-with-bad-prompt>
git push origin main  # triggers CI/CD
# ~5-15 minute rollback depending on your pipeline
```

**Rule:** If your rollback is slower than 5 minutes, your prompts-as-code approach
is a deployment liability. Graduate to DB or hosted management.

---

## Concrete Code: Pydantic AI Prompt Versioning Example

```python
# Full example: versioned prompts with Pydantic AI + Langfuse
# pip install pydantic-ai langfuse

from pydantic import BaseModel
from pydantic_ai import Agent
from langfuse import Langfuse

langfuse = Langfuse()

class SupportClassification(BaseModel):
    category: str  # "billing" | "technical" | "general" | "cancellation"
    confidence: float  # 0.0 - 1.0
    reasoning: str

def get_classifier_agent() -> Agent:
    """Builds the agent with the current production prompt."""

    # Fetch active prompt from Langfuse (cached client-side for 60s)
    prompt = langfuse.get_prompt("support-classifier-system", label="production")
    system_content = prompt.compile()

    agent = Agent(
        model="openai:gpt-4o-mini",
        result_type=SupportClassification,
        system_prompt=system_content,
    )

    # Tag the agent with the prompt version for tracing
    agent._prompt_version = prompt.version
    return agent

# Re-instantiate the agent per-request if you want live prompt updates
# Or cache it for N seconds and refresh periodically
import functools, time

@functools.lru_cache(maxsize=1)
def get_cached_classifier(cache_buster: int) -> Agent:
    return get_classifier_agent()

def get_classifier() -> Agent:
    # Refresh every 60 seconds — picks up prompt changes without restart
    cache_buster = int(time.time() / 60)
    return get_cached_classifier(cache_buster)

# Usage:
async def classify_message(message: str) -> SupportClassification:
    agent = get_classifier()
    result = await agent.run(message)
    return result.data
```

---

## Related Warehouse Entries

- [`langfuse`] — prod tracing + built-in prompt management; self-hostable
- [`promptlayer`] — dedicated prompt ops platform
- [`braintrust`] — offline eval platform with CI PR commenting
- [`statsig`] — A/B testing platform for prompt experiments
- [`pydantic-ai`] — agent framework with excellent testing/eval story

---

## Quick Reference Checklist

```
Prompts-as-Code (current state):
  [ ] All prompts extracted to one location (prompts/ folder)
  [ ] eval run on each prompt file (even just Promptfoo)

Graduation to Prompts-in-DB:
  [ ] prompts table created with version + is_active columns
  [ ] get_active_prompt() wrapper used everywhere
  [ ] Admin UI or SQL script for updating prompts without deploy

Graduation to Hosted Tool:
  [ ] Langfuse Prompts SDK integration in place
  [ ] Every LLM trace linked to prompt version via span.update(prompt=...)
  [ ] Eval dataset created for top-3 highest-volume prompts
  [ ] Eval-on-change CI action blocking PRs on score drop

Production A/B:
  [ ] Statsig or equivalent A/B framework wired to prompt variants
  [ ] Business outcome metric logged (not just eval scores)
  [ ] Min 1,000 samples per variant before concluding test
```
