# @nexural/dashboard

Next.js App Router dashboard for the Sage Ideas Engineering OS control plane.

## Run locally

```bash
pnpm --filter @nexural/dashboard dev
# http://localhost:3000
```

Reads from `../../` (the repository root):

- `data/ecosystem-registry.public.json`
- `data/ecosystem-scorecard.public.json`
- `data/ecosystem-resource-map.public.json`
- `data/recipe-catalog.public.json`
- `data/resource-library.public.json`
- `data/golden-path-runs.public.json`
- `data/proof-environment.public.json`
- `data/db-proof.public.json`
- `data/public-proof-layer.public.json`

## Pages

| Path                    | Source                                                |
| ----------------------- | ----------------------------------------------------- |
| `/`                     | operator cockpit across proof, recipes, DB, and gaps  |
| `/ecosystem`            | registry explorer, filters, private override workflow |
| `/resources`            | resource navigator for "what should I build with?"    |
| `/recipes`              | recipe readiness catalog                              |
| `/golden-path`          | generated app proof evidence                          |
| `/proof-environment`    | hosted proof environment lock                         |
| `/db-proof`             | DB CRUD and migration-readiness proof                 |
| `/factory`              | factory federation registry                           |
| `/lifeops`              | lifeops federation registry                           |
| `/scorecard`            | per-warehouse + aggregate scorecard                   |
| `/security/revocations` | recipe revocation list                                |

The dashboard is internal-first. Public proof publishing is handled by the proof packet, not by
this app.
