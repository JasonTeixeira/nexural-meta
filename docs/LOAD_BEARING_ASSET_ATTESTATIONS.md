# Load-Bearing Asset Attestations

**Status:** active service-level control  
**Owner:** Sage Ideas LLC  
**Source:** `data/ecosystem-public-overrides.json`

## Purpose

The ecosystem scorecard should not rely only on generic GitHub inference. A repo
can be strategically load-bearing even when GitHub metadata is thin, and a repo
can have strong metadata while still not being reusable enough to claim L4/L5.

This document records the public-safe attestation layer used by the Sage Ideas
Engineering OS. The machine-readable source is
`data/ecosystem-public-overrides.json`; generated scorecards consume that file.

## Operating Rule

An asset can be promoted by public override only when the control plane can point
to public-safe evidence of reusable architecture, setup path, proof surface,
tests, deployment posture, or safety controls.

An asset should stay below L4 when the public surface does not explain the real
reuse contract, even if the repo description sounds strong.

## Current Calls

| Asset                      | Layer                | Type          | Maturity | Rationale                                                                                                                                         |
| -------------------------- | -------------------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| QuantumTrader              | quant-trading        | engine        | L4       | README documents event-driven trading architecture, backtesting realism, risk management, infrastructure, and execution flow.                     |
| AlphaStream                | quant-trading        | engine        | L4       | README documents real futures symbols, trained model families, walk-forward validation, no-leakage features, API endpoints, and deployable split. |
| trade-engine               | quant-trading        | engine        | L4       | README documents order state machines, partial fills, rejected orders, position/P&L tracking, event sourcing, tests, and example execution.       |
| terraform-aws-modules      | ops-knowledge        | playbook      | L4       | README documents reusable AWS modules, validation, examples, CI-tested posture, and repeated project reuse.                                       |
| NexQuantSite               | public-proof-surface | product-proof | L4       | README documents a full-stack trading platform surface with auth, admin, database, realtime readiness, tests, Docker, migrations, and seed flow.  |
| nexural-automation-starter | quant-trading        | kit           | L4       | README documents paper-money-safe webhook and paper-order quickstarts, secret validation, logging, Pine payloads, and notional caps.              |
| JasonTeixeira              | public-proof-surface | product-proof | L4       | Profile README connects Sage Ideas, Nexural, trading systems, AI apps, cloud architecture, and public proof surfaces.                             |
| micro-saas-starter         | resource-library     | kit           | L2       | Repo description is strong, but the public README is still the default Next.js scaffold. It must document the real SaaS contract before L4.       |

## Remaining Lift

`micro-saas-starter` is the main public load-bearing asset still below elite
maturity. The next clean improvement is to replace the default README with the
real contract: stack, auth, database, billing, RLS, webhook idempotency, setup,
tests, deployment, and known constraints.
