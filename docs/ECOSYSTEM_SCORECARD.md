# Ecosystem Scorecard

**Status:** Phase 2 generated maturity map
**Owner:** Sage Ideas LLC
**Generated:** 2026-05-31T21:25:40.966Z

## Read This Correctly

This is a maturity and gap map across the GitHub ecosystem. It is not a judgment of engineering ability.
A large reference library intentionally scores low because reference repos are raw material, not productized infrastructure.

## Executive Scores

- Average across all repos: **20/100**
- Load-bearing asset average: **60/100** across **32** assets
- Private repo average: **52/100**

## Score Bands

| Band               | Count |
| ------------------ | ----: |
| 0-49 raw/reference |   138 |
| 70-84 usable       |     9 |
| 50-69 incomplete   |    10 |
| 95-100 elite       |     2 |
| 85-94 strong       |     1 |

## Layer Scores

| Layer                | Count | Load-bearing | Average score |
| -------------------- | ----: | -----------: | ------------: |
| agent-engine         |     1 |            0 |            33 |
| control-plane        |     1 |            1 |           100 |
| ops-knowledge        |     4 |            4 |            29 |
| public-proof-surface |     2 |            2 |            83 |
| quant-trading        |     8 |            8 |            58 |
| reference-library    |   118 |            0 |             8 |
| resource-library     |     2 |            2 |            38 |

## Top Gap Types

| Gap                           | Count |
| ----------------------------- | ----: |
| missing-topics                |   145 |
| maturity-l0                   |   134 |
| reference-only                |    48 |
| archived                      |    47 |
| missing-license               |    44 |
| needs-private-override-review |    24 |
| stale                         |    22 |
| load-bearing-under-70         |    20 |
| missing-public-proof          |     1 |

## Public Load-Bearing Assets Below 70

| Repository                                                                                              | Layer            | Score | Gaps                                                       |
| ------------------------------------------------------------------------------------------------------- | ---------------- | ----: | ---------------------------------------------------------- |
| [CloudEngLibrary](https://github.com/JasonTeixeira/CloudEngLibrary)                                     | ops-knowledge    |    18 | maturity-l0, stale, missing-license, load-bearing-under-70 |
| [CloudResumeChallangeAWS](https://github.com/JasonTeixeira/CloudResumeChallangeAWS)                     | ops-knowledge    |    18 | maturity-l0, stale, missing-license, load-bearing-under-70 |
| [jason-teixeira-portfolio](https://github.com/JasonTeixeira/jason-teixeira-portfolio)                   | quant-trading    |    18 | maturity-l0, stale, missing-topics, load-bearing-under-70  |
| [TOGAF-Master-Documenting-Template](https://github.com/JasonTeixeira/TOGAF-Master-Documenting-Template) | resource-library |    18 | maturity-l0, stale, missing-license, load-bearing-under-70 |
| [Cloudmind](https://github.com/JasonTeixeira/Cloudmind)                                                 | ops-knowledge    |    23 | maturity-l0, stale, load-bearing-under-70                  |
| [NexusEncryption](https://github.com/JasonTeixeira/NexusEncryption)                                     | quant-trading    |    23 | maturity-l0, stale, load-bearing-under-70                  |
| [QuantumTrader](https://github.com/JasonTeixeira/QuantumTrader)                                         | quant-trading    |    38 | missing-license, missing-topics, load-bearing-under-70     |
| [micro-saas-starter](https://github.com/JasonTeixeira/micro-saas-starter)                               | resource-library |    58 | missing-license, missing-topics, load-bearing-under-70     |
| [terraform-aws-modules](https://github.com/JasonTeixeira/terraform-aws-modules)                         | ops-knowledge    |    58 | missing-license, missing-topics, load-bearing-under-70     |
| [NexQuantSite](https://github.com/JasonTeixeira/NexQuantSite)                                           | quant-trading    |    63 | missing-license, load-bearing-under-70                     |
| [trade-engine](https://github.com/JasonTeixeira/trade-engine)                                           | quant-trading    |    68 | missing-license, missing-topics, load-bearing-under-70     |

## Next Actions

- **Review private overrides:** 24 private repos are still classified by generic inference.
- **Separate reference library from product proof narrative:** 122 repos are reference/library assets and should not dilute the public engineering story.
- **Raise load-bearing assets below 70:** 20 load-bearing assets need docs, evidence, topics, homepage, or maturity upgrades.
