# Operator Test Pass

**Status:** failed
**Generated:** 2026-07-15T09:39:46.632Z

## Summary

- Checks: 6/8
- Recipes indexed: 12
- Proof-backed recipes: 3
- Hosted golden paths: 78
- DB proof: degraded
- Evidence hash: `sha256:a7b46fb81099a9fa0ee1b1ed4fb6b8774a2a25a9d867d913cddeea7013931268`

## Checks

| Check                                                           | Status | Detail                                      |
| --------------------------------------------------------------- | ------ | ------------------------------------------- |
| Operator can answer what should I build with X.                 | passed | 7 resource use cases indexed.               |
| Operator can choose from a serious recipe catalog.              | passed | 12 recipes, 12 forge-ready, 3 proof-backed. |
| Recipe proof count matches hosted golden-path evidence.         | passed | catalog=3, golden=3.                        |
| Dashboard has the expected operator pages.                      | passed | 11/11 routes present.                       |
| Golden path, proof env, DB proof, and public packet are usable. | failed | 78 hosted runs, env=failed, db=degraded.    |
| DB proof includes CRUD, schema drift, and seed-data checks.     | failed | crud=failed, schema=passed, seed=passed.    |
| Maintenance loop exposes freshness and next actions.            | passed | maintenance=failed, actions=7.              |
| Operator can see what to fix first.                             | passed | 25 lift items, 4 operator paths.            |
