# Cost Optimization Playbook

How to keep your voice apps cheap as they scale — without sacrificing
quality. Specific levers, in order of impact.

Distilled from ai-warehouse `stacks/cost-optimized-llm-app.md` (CC BY-SA 4.0
© Jason Teixeira), specialized for voice agents.

---

## The five real cost levers (in order of impact)

1. **Provider tier choice** — biggest single lever
2. **Self-host when concurrency ≥ 50**
3. **Prompt size + caching**
4. **Response length cap**
5. **Memory / RAG scoping**

Almost all of your savings come from #1 and #2. The rest are polish.

---

## Lever 1: Provider tier per persona

Don't pay realtime prices for a persona that doesn't need realtime.

| Persona type                         | Tier        |  $/hr | When                             |
| ------------------------------------ | ----------- | ----: | -------------------------------- |
| Coach / tutor / assistant            | balanced    | $0.78 | Default — most everything        |
| Sales / receptionist / phone         | premium     | $1.05 | First impression matters         |
| Therapist / meditation / storyteller | realtime    | $4.80 | Emotional prosody IS the product |
| Internal QA bot / classifier         | bargain     | $0.15 | Cost > quality                   |
| Anything when concurrency > 50       | self-hosted | $0.05 | Scale-down economics             |

**Action:** Audit your 26 personas. Each should be on the lowest tier
its product value supports. Don't default-everything to premium.

---

## Lever 2: Self-host break-even (at ~50 concurrent users)

| Concurrent users | Cloud /hr | Self-host /hr | Self-host saves     |
| ---------------: | --------: | ------------: | ------------------- |
|               10 |     $7.80 |         $0.50 | Yes (~$5K/yr)       |
|               50 |       $39 |         $1.00 | Yes (~$330K/yr)     |
|              500 |      $390 |         $5.00 | Massive (~$3.4M/yr) |

Self-hosted recipe ships in `recipes/self-hosted/`. Run it on Fly.io
GPU (or Modal/RunPod/Lambda). One persona YAML field changes:

```yaml
extends: ../../personas/_base/tier-self-hosted.yaml
```

The MCP servers, the persona prompts, the structured outputs — all
identical. You're just paying yourself for compute instead of OpenAI.

---

## Lever 3: System prompt caching

OpenAI auto-caches the first ~1024 tokens of a system prompt. Anthropic
explicitly caches with `cache_control`. Both save 50-90% on prompt cost
after the first call.

**Action — already free win:**

- Put your system prompt FIRST.
- Don't put dynamic content (timestamps, user IDs) in the system prompt
  — those break the cache.
- Inject dynamic memory recall as a SEPARATE user message at the end.

The engine's `recalled_memory` injection (`agent.py`) appends to the
system prompt — which breaks caching. **Future improvement:** move
recalled memory into a separate message. ~30% cost win on memory-heavy
personas.

---

## Lever 4: Response length cap

The single most underused cost control. Every persona should have:

```yaml
llm:
  max_tokens: 220 # ≈ 50 words ≈ 20 seconds of speech
```

Voice replies should be short. The cap is both UX win (no rambling) and
a cost win (you stop paying per token at the cap).

**Action:** Audit `max_tokens` on every persona. Most are over-permitted.

| Persona type                       | Recommended cap |
| ---------------------------------- | --------------: |
| Coaches, tutors, assistants        |             220 |
| Receptionist, sales (snappy)       |             180 |
| Therapist, journaling (reflective) |             300 |
| Storyteller, audiobook (long-form) |            800+ |
| Code reviewer (technical)          |             500 |

---

## Lever 5: Memory + RAG scoping

mem0 + RAG search both cost embedding calls. Two pitfalls:

1. **Memory recall every turn.** Engine currently recalls at session
   start only — good. Keep it that way.
2. **RAG search every turn.** Tell the persona explicitly:
   ```
   Only call search_knowledge when the user asks about <topic>.
   ```
   Without that instruction, the LLM will tool-call gratuitously.

---

## Cost benchmarks you should be hitting

For a normal cascaded persona at the balanced tier:

| Metric                                                    |                          Target |
| --------------------------------------------------------- | ------------------------------: |
| Per-minute cost                                           |                        < $0.015 |
| Per-conversation (5 min)                                  |                         < $0.08 |
| Per-day for an MVP (50 conversations)                     |                            < $4 |
| Per-month at MVP scale                                    |                          < $120 |
| Per-month at "we have product-market fit" (1000 conv/day) |                         < $2400 |
| Per-month at scale (10K conv/day)                         | should be self-hosted — < $1000 |

If you're above these numbers, audit (in order):

1. Token cap on the persona
2. System prompt size + caching
3. Whether you're on the right tier
4. Whether you should be self-hosting yet

---

## Telemetry tells you the truth

`telemetry.sqlite` already tracks per-turn cost. Query it weekly:

```sql
-- Top 10 most expensive sessions this week:
SELECT persona, session_id, turn_count, ROUND(cost_usd_est, 4) AS cost
FROM sessions
WHERE started_at > strftime('%s', 'now', '-7 days')
ORDER BY cost_usd_est DESC
LIMIT 10;

-- Avg cost per persona:
SELECT persona, COUNT(*) AS sessions,
       ROUND(AVG(cost_usd_est), 4) AS avg_cost,
       ROUND(AVG(turn_count), 1) AS avg_turns
FROM sessions
GROUP BY persona
ORDER BY avg_cost DESC;
```

A persona with avg cost > 2× your expectation is either misconfigured
or being abused. Investigate before scaling its usage.

---

## When NOT to optimize cost

- **Pre-product-market-fit.** Optimize for iteration speed, not cost.
  Spend $50/mo on cloud APIs while you figure out what works.
- **For the "wow" demo.** Use realtime tier when showing investors.
  Switch to balanced after.
- **For low-volume verticals.** A receptionist serving 50 calls/day at
  $0.50 each = $25/day = $750/mo. That's nothing — don't self-host yet.

---

## Self-host risk budget

Self-hosting adds operational risk: nightly downtime, GPU OOM, model
quality drift. Budget ~5 hours/month for ops above 100 concurrent
users. If that's not in your time budget, stay on cloud APIs and just
charge more.

---

## Credit

Cost-optimization framework + benchmarks adapted from
[ai-warehouse](https://github.com/JasonTeixeira/ai-warehouse)
(CC BY-SA 4.0 © Jason Teixeira).
