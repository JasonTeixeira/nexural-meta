# Resource Library

**Status:** Phase 12/13 generated resource library and maturity lift queue
**Generated:** 2026-06-02T00:44:45.152Z

## Summary

- Assets: 148
- Use cases: 7
- Recipes: 12
- Proof-backed recipes: 3
- Load-bearing average: 72/100

## Operator Paths

- **Build an app:** /resources?useCase=ship-saas-app (golden-path plus hosted health)
- **Pick a stack or SDK:** /resources?useCase=choose-stack-or-sdk (scorecard and gap review)
- **Release with QA evidence:** /resources?useCase=qa-release-proof (verify-all, proof packet, evidence hash)
- **Audit trading infrastructure:** /resources?useCase=build-trading-system (anti-lookahead, walk-forward, overfit checks)

## Maturity Lift Queue

| Asset                        | Layer                | Current | Target | Reason                                                          |
| ---------------------------- | -------------------- | ------: | -----: | --------------------------------------------------------------- |
| saas-multitenant-baseline    | app-factory-runtime  |      80 |     90 | Recipe must be forge-ready and proof-backed before broad reuse. |
| saas-multitenant-baseline-cf | app-factory-runtime  |      80 |     90 | Recipe must be forge-ready and proof-backed before broad reuse. |
| saas-rag-chat-openai-first   | app-factory-runtime  |      80 |     90 | Recipe must be forge-ready and proof-backed before broad reuse. |
| saas-rag-chat-qdrant         | app-factory-runtime  |      80 |     90 | Recipe must be forge-ready and proof-backed before broad reuse. |
| QuantumTrader                | quant-trading        |      38 |     90 | Load-bearing asset under target maturity.                       |
| micro-saas-starter           | resource-library     |      58 |     90 | Load-bearing asset under target maturity.                       |
| terraform-aws-modules        | ops-knowledge        |      58 |     90 | Load-bearing asset under target maturity.                       |
| AlphaStream                  | quant-trading        |      63 |     90 | Load-bearing asset under target maturity.                       |
| NexQuantSite                 | quant-trading        |      63 |     90 | Load-bearing asset under target maturity.                       |
| trade-engine                 | quant-trading        |      68 |     90 | Load-bearing asset under target maturity.                       |
| JasonTeixeira                | public-proof-surface |      73 |     90 | Load-bearing asset under target maturity.                       |
| nexural-automation-starter   | quant-trading        |      78 |     90 | Load-bearing asset under target maturity.                       |
| awesome-cloud-native         | reference-library    |       0 |     70 | Missing metadata makes the ecosystem less legible.              |
| awesome-quant                | reference-library    |       0 |     70 | Missing metadata makes the ecosystem less legible.              |
| awesome-react                | reference-library    |       0 |     70 | Missing metadata makes the ecosystem less legible.              |
