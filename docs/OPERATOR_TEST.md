# Operator Test Pass

**Status:** failed
**Generated:** 2026-11-02T10:08:59.517Z

## Summary

- Checks: 6/8
- Recipes indexed: 12
- Proof-backed recipes: 3
- Hosted golden paths: 78
- DB proof: degraded
- Evidence hash: `sha256:5c9405b886f8f2b1e5fd101d26269c331c63b4dac4ecba6feb07a10e1fe6f944`

## Checks

| Check                                                           | Status | Detail                                      |
| --------------------------------------------------------------- | ------ | ------------------------------------------- |
| Operator can answer what should I build with X.                 | passed | 7 resource use cases indexed.               |
| Operator can choose from a serious recipe catalog.              | passed | 12 recipes, 12 forge-ready, 3 proof-backed. |
| Recipe proof count matches hosted golden-path evidence.         | passed | catalog=3, golden=3.                        |
| Dashboard has the expected operator pages.                      | passed | 11/11 routes present.                       |
| Golden path, proof env, DB proof, and public packet are usable. | failed | 78 hosted runs, env=failed, db=degraded.    |
| DB proof includes CRUD, schema drift, and seed-data checks.     | failed | crud=failed, schema=passed, seed=passed.    |
| Maintenance loop exposes freshness and next actions.            | passed | maintenance=failed, actions=8.              |
| Operator can see what to fix first.                             | passed | 25 lift items, 4 operator paths.            |
