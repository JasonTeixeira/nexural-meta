# @nexural/dashboard

Next.js 15 + React 19 App Router dashboard for the Nexural Federation.

## Run locally

```bash
pnpm --filter @nexural/dashboard dev
# → http://localhost:3000
```

Reads from `../../` (the nexural-meta repo root):

- `registry-factory.yaml`
- `registry-lifeops.yaml`
- `registry-external-mcp.yaml`
- `scorecard.json`
- `security/revoked-recipes.yaml`

## Pages

| Path                    | Source                                           |
| ----------------------- | ------------------------------------------------ |
| `/`                     | overview cards across all registries + scorecard |
| `/factory`              | factory federation registry                      |
| `/lifeops`              | lifeops federation registry                      |
| `/scorecard`            | per-warehouse + aggregate scorecard              |
| `/security/revocations` | recipe revocation list (ADR-0009 §1.6)           |

Per ARCHITECTURE §4.2. Additional pages (`/costs`, `/decay`, `/telemetry`, `/recipes`) populate as Phases 5–7 ship.

## Deploy

For Phase 8 (`nexural.dev` public scorecard site): static export via `next export` or deploy to Vercel.
