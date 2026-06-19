# Operator Test Pass

**Status:** passed
**Generated:** 2026-06-19T10:37:19.304Z

## Summary

- Checks: 8/8
- Recipes indexed: 12
- Proof-backed recipes: 3
- Hosted golden paths: 63
- DB proof: passed
- Evidence hash: `sha256:969b1092b6a8b6b9a138c9d048c2efa4696c01573d3bccaf1b60aec90f6bbdd5`

## Checks

| Check                                                           | Status | Detail                                      |
| --------------------------------------------------------------- | ------ | ------------------------------------------- |
| Operator can answer what should I build with X.                 | passed | 7 resource use cases indexed.               |
| Operator can choose from a serious recipe catalog.              | passed | 12 recipes, 12 forge-ready, 3 proof-backed. |
| Recipe proof count matches hosted golden-path evidence.         | passed | catalog=3, golden=3.                        |
| Dashboard has the expected operator pages.                      | passed | 11/11 routes present.                       |
| Golden path, proof env, DB proof, and public packet are usable. | passed | 63 hosted runs, env=passed, db=passed.      |
| DB proof includes CRUD, schema drift, and seed-data checks.     | passed | crud=passed, schema=passed, seed=passed.    |
| Maintenance loop exposes freshness and next actions.            | passed | maintenance=passed, actions=2.              |
| Operator can see what to fix first.                             | passed | 25 lift items, 4 operator paths.            |
