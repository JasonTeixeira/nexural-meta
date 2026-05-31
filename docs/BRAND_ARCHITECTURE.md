# Brand Architecture

**Status:** Canonical after ADR-0014 acceptance
**Owner:** Sage Ideas LLC
**Date:** 2026-05-31

## Decision Summary

Sage Ideas is the company and umbrella identity. The engineering ecosystem is
called Sage Ideas Engineering OS. Nexural is a product name for the
trading/investment application line and must not be used as the umbrella brand
for the company, engineering ecosystem, or unrelated tools.

## Brand Stack

| Level                | Name                          | Description                                                               | Public use                 |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------- | -------------------------- |
| Company              | Sage Ideas                    | Studio/company identity.                                                  | Yes                        |
| Internal platform    | Sage Ideas Engineering OS     | Resource factory, service-level registry, engines, recipes, QA, evidence. | Selectively                |
| Public proof surface | sageideas.dev                 | Website and proof dashboard for clients/employers.                        | Yes                        |
| App factory          | Athanor                       | AI app factory runtime.                                                   | Yes                        |
| Quality system       | Sage QA OS                    | QA/evidence/release confidence system.                                    | Yes                        |
| Resource library     | Sage Warehouse / AI Warehouse | Tool, SDK, stack, and playbook intelligence.                              | Partially                  |
| Agent engine         | Sage Agents                   | Agent runtime/templates.                                                  | Partially                  |
| Voice engine         | Sage Voice Engine             | Reusable voice runtime.                                                   | Partially                  |
| Quant platform       | SageQuant                     | Quant and trading research infrastructure.                                | Partially                  |
| Product              | Nexural                       | Trading/investment product proof.                                         | Yes, only for that product |

## Naming Rules

1. Use `Sage Ideas` for company-level claims.
2. Use `Sage Ideas Engineering OS` for the internal factory ecosystem.
3. Use `Athanor` for the app factory runtime.
4. Use `Nexural` only for the trading/investment product line and legacy package
   namespaces that already exist.
5. Do not rename existing repos or packages as a reflex. Registry metadata can
   clarify role without breaking clone URLs, package names, or docs.
6. Any future rename of repos, npm packages, CLI commands, or product surfaces
   requires an ADR.

## Public Positioning

The public story should be:

> Sage Ideas builds software with an internal engineering OS: reusable engines,
> app recipes, QA evidence, AI resource intelligence, and product proofs.

Do not say:

> Nexural is the whole ecosystem.

## Internal Positioning

The internal story should be:

> The engineering OS is a registry-backed factory. Every reusable asset is
> classified, scored, tested, and connected to recipes and product proofs.

## Product Proofs

Product proofs are applications that demonstrate the factory's components in
real use. They are not the umbrella.

| Product proof       | Role                                |
| ------------------- | ----------------------------------- |
| Nexural             | Trading/investment product proof.   |
| Commerce Command OS | Ecommerce operations product proof. |
| Voza                | Language learning product proof.    |
| Jobcopilot          | Job application copilot proof.      |
| Trayd               | Trades/business operations proof.   |
| Giggl               | Consumer/social app proof.          |
| Learning OS         | Education/productivity proof.       |

## Migration Guidance

Phase 0 does not require rewriting every existing document. It establishes the
new authority. Later cleanup should prioritize public-facing and high-traffic
docs first:

1. README files.
2. `sageideas.dev` proof pages.
3. Ecosystem registry metadata.
4. CLI help text.
5. Package descriptions.
6. Archived docs only if they create real confusion.
