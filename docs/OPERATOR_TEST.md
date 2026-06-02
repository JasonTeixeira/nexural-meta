# Operator Test Pass

**Status:** passed
**Generated:** 2026-06-02T03:03:43.514Z

## Summary

- Checks: 8/8
- Recipes indexed: 12
- Proof-backed recipes: 3
- Hosted golden paths: 4
- DB proof: passed
- Evidence hash: `sha256:1555db8c03a4ed0fdbc3236d9480f4fc28c652a3b62c04b306f4a768cda1125d`

## Checks

| Check                                                           | Status | Detail                                      |
| --------------------------------------------------------------- | ------ | ------------------------------------------- |
| Operator can answer what should I build with X.                 | passed | 7 resource use cases indexed.               |
| Operator can choose from a serious recipe catalog.              | passed | 12 recipes, 12 forge-ready, 3 proof-backed. |
| Recipe proof count matches hosted golden-path evidence.         | passed | catalog=3, golden=3.                        |
| Dashboard has the expected operator pages.                      | passed | 11/11 routes present.                       |
| Golden path, proof env, DB proof, and public packet are usable. | passed | 4 hosted runs, env=passed, db=passed.       |
| DB proof includes CRUD, schema drift, and seed-data checks.     | passed | crud=passed, schema=passed, seed=passed.    |
| Maintenance loop exposes freshness and next actions.            | passed | maintenance=failed, actions=4.              |
| Operator can see what to fix first.                             | passed | 25 lift items, 4 operator paths.            |
