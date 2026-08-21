# Ecosystem Scorecard

**Status:** Phase 2 generated maturity map
**Owner:** Sage Ideas LLC
**Generated:** 2026-08-21T09:11:53.203Z

## Read This Correctly

This is a maturity and gap map across the GitHub ecosystem. It is not a judgment of engineering ability.
A large reference library intentionally scores low because reference repos are raw material, not productized infrastructure.

## Executive Scores

- Average across all repos: **17/100**
- Load-bearing asset average: **92/100** across **14** assets
- Private repo average: **0/100**

## Score Bands

| Band               | Count |
| ------------------ | ----: |
| 0-49 raw/reference |   128 |
| 95-100 elite       |    10 |
| 70-84 usable       |     3 |
| 50-69 incomplete   |     1 |

## Layer Scores

| Layer                | Count | Load-bearing | Average score |
| -------------------- | ----: | -----------: | ------------: |
| agent-engine         |     2 |            1 |            48 |
| control-plane        |     1 |            1 |           100 |
| ops-knowledge        |     4 |            1 |            36 |
| public-proof-surface |     5 |            5 |            90 |
| quant-trading        |     7 |            5 |            76 |
| reference-library    |   121 |            0 |             8 |
| resource-library     |     2 |            1 |            38 |

## Top Gap Types

| Gap                   | Count |
| --------------------- | ----: |
| maturity-l0           |   128 |
| missing-topics        |   120 |
| reference-only        |    49 |
| archived              |    47 |
| missing-license       |    45 |
| stale                 |    22 |
| missing-public-proof  |     2 |
| load-bearing-under-70 |     1 |
| missing-docs          |     1 |

## Public Load-Bearing Assets Below 70

| Repository                                                                | Layer            | Score | Gaps                                                 |
| ------------------------------------------------------------------------- | ---------------- | ----: | ---------------------------------------------------- |
| [micro-saas-starter](https://github.com/JasonTeixeira/micro-saas-starter) | resource-library |    63 | missing-license, load-bearing-under-70, missing-docs |

## Next Actions

- **Review private overrides:** 0 private repos are still classified by generic inference.
- **Separate reference library from product proof narrative:** 121 repos are reference/library assets and should not dilute the public engineering story.
- **Raise load-bearing assets below 70:** 1 load-bearing assets need docs, evidence, topics, homepage, or maturity upgrades.
