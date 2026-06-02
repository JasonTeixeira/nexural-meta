# Ecosystem Scorecard

**Status:** Phase 2 generated maturity map
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-02T02:13:13.215Z

## Read This Correctly

This is a maturity and gap map across the GitHub ecosystem. It is not a judgment of engineering ability.
A large reference library intentionally scores low because reference repos are raw material, not productized infrastructure.

## Executive Scores

- Average across all repos: **21/100**
- Load-bearing asset average: **95/100** across **11** assets
- Private repo average: **50/100**

## Score Bands

| Band               | Count |
| ------------------ | ----: |
| 0-49 raw/reference |   137 |
| 50-69 incomplete   |    15 |
| 95-100 elite       |     9 |
| 85-94 strong       |     1 |

## Layer Scores

| Layer                | Count | Load-bearing | Average score |
| -------------------- | ----: | -----------: | ------------: |
| agent-engine         |     1 |            0 |            33 |
| control-plane        |     1 |            1 |           100 |
| ops-knowledge        |     4 |            1 |            36 |
| public-proof-surface |     3 |            3 |            98 |
| quant-trading        |     7 |            5 |            76 |
| reference-library    |   118 |            0 |             8 |
| resource-library     |     2 |            1 |            36 |

## Top Gap Types

| Gap                           | Count |
| ----------------------------- | ----: |
| missing-topics                |   147 |
| maturity-l0                   |   134 |
| reference-only                |    48 |
| archived                      |    47 |
| missing-license               |    44 |
| needs-private-override-review |    26 |
| stale                         |    22 |
| missing-public-proof          |     2 |
| load-bearing-under-70         |     1 |
| missing-docs                  |     1 |

## Public Load-Bearing Assets Below 70

| Repository                                                                | Layer            | Score | Gaps                                                                 |
| ------------------------------------------------------------------------- | ---------------- | ----: | -------------------------------------------------------------------- |
| [micro-saas-starter](https://github.com/JasonTeixeira/micro-saas-starter) | resource-library |    58 | missing-license, missing-topics, load-bearing-under-70, missing-docs |

## Next Actions

- **Review private overrides:** 26 private repos are still classified by generic inference.
- **Separate reference library from product proof narrative:** 122 repos are reference/library assets and should not dilute the public engineering story.
- **Raise load-bearing assets below 70:** 1 load-bearing assets need docs, evidence, topics, homepage, or maturity upgrades.
