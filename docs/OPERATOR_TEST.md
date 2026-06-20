# Operator Test Pass

**Status:** passed
**Generated:** 2026-06-20T10:08:13.986Z

## Summary

- Checks: 8/8
- Recipes indexed: 12
- Proof-backed recipes: 3
- Hosted golden paths: 66
- DB proof: passed
- Evidence hash: `sha256:975c5a530c61ecced689e92785d359e2277a2af3e2bfd98199b4fb4d0d5802bf`

## Checks

| Check                                                           | Status | Detail                                      |
| --------------------------------------------------------------- | ------ | ------------------------------------------- |
| Operator can answer what should I build with X.                 | passed | 7 resource use cases indexed.               |
| Operator can choose from a serious recipe catalog.              | passed | 12 recipes, 12 forge-ready, 3 proof-backed. |
| Recipe proof count matches hosted golden-path evidence.         | passed | catalog=3, golden=3.                        |
| Dashboard has the expected operator pages.                      | passed | 11/11 routes present.                       |
| Golden path, proof env, DB proof, and public packet are usable. | passed | 66 hosted runs, env=passed, db=passed.      |
| DB proof includes CRUD, schema drift, and seed-data checks.     | passed | crud=passed, schema=passed, seed=passed.    |
| Maintenance loop exposes freshness and next actions.            | passed | maintenance=passed, actions=2.              |
| Operator can see what to fix first.                             | passed | 25 lift items, 4 operator paths.            |
