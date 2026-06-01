# Ecosystem Scorecard

**Status:** Phase 2 generated maturity map
**Owner:** Sage Ideas LLC
**Generated:** 2026-06-01T02:23:55.922Z

## Read This Correctly

This is a maturity and gap map across the GitHub ecosystem. It is not a judgment of engineering ability.
A large reference library intentionally scores low because reference repos are raw material, not productized infrastructure.

## Executive Scores

- Average across all repos: **20/100**
- Load-bearing asset average: **73/100** across **11** assets
- Private repo average: **50/100**

## Score Bands

| Band               | Count |
| ------------------ | ----: |
| 0-49 raw/reference |   138 |
| 50-69 incomplete   |    18 |
| 70-84 usable       |     3 |
| 95-100 elite       |     2 |
| 85-94 strong       |     1 |

## Layer Scores

| Layer                | Count | Load-bearing | Average score |
| -------------------- | ----: | -----------: | ------------: |
| agent-engine         |     1 |            0 |            33 |
| control-plane        |     1 |            1 |           100 |
| ops-knowledge        |     4 |            1 |            26 |
| public-proof-surface |     2 |            2 |            83 |
| quant-trading        |     8 |            6 |            56 |
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
| load-bearing-under-70         |     5 |
| missing-public-proof          |     1 |

## Public Load-Bearing Assets Below 70

| Repository                                                                      | Layer            | Score | Gaps                                                   |
| ------------------------------------------------------------------------------- | ---------------- | ----: | ------------------------------------------------------ |
| [QuantumTrader](https://github.com/JasonTeixeira/QuantumTrader)                 | quant-trading    |    38 | missing-license, missing-topics, load-bearing-under-70 |
| [micro-saas-starter](https://github.com/JasonTeixeira/micro-saas-starter)       | resource-library |    58 | missing-license, missing-topics, load-bearing-under-70 |
| [terraform-aws-modules](https://github.com/JasonTeixeira/terraform-aws-modules) | ops-knowledge    |    58 | missing-license, missing-topics, load-bearing-under-70 |
| [NexQuantSite](https://github.com/JasonTeixeira/NexQuantSite)                   | quant-trading    |    63 | missing-license, load-bearing-under-70                 |
| [trade-engine](https://github.com/JasonTeixeira/trade-engine)                   | quant-trading    |    68 | missing-license, missing-topics, load-bearing-under-70 |

## Next Actions

- **Review private overrides:** 26 private repos are still classified by generic inference.
- **Separate reference library from product proof narrative:** 122 repos are reference/library assets and should not dilute the public engineering story.
- **Raise load-bearing assets below 70:** 5 load-bearing assets need docs, evidence, topics, homepage, or maturity upgrades.
