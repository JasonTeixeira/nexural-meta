# Sage Ideas Engineering OS

**Status:** Phase 0 foundation
**Owner:** Sage Ideas LLC
**Date:** 2026-05-31

## Purpose

Sage Ideas Engineering OS is the internal resource factory Sage uses to build
software products repeatedly without restarting from zero. It is not one app and
not one repo. It is the service-level overlay across reusable engines, app
recipes, QA evidence, tool catalogs, playbooks, and product proofs.

The operating principle is simple:

> Build the hard infrastructure once, register it, verify it, and reuse it in
> every future app.

## The Two Audiences

Sage Ideas Engineering OS has two surfaces with different jobs.

| Surface            | Audience                     | Job                                                                                  |
| ------------------ | ---------------------------- | ------------------------------------------------------------------------------------ |
| Internal factory   | Sage and coding agents       | Build apps faster with reusable engines, recipes, kits, QA, playbooks, and evidence. |
| Public proof layer | Employers, clients, partners | Show credible engineering depth without exposing private implementation or secrets.  |

The internal surface optimizes speed and leverage. The public surface optimizes
clarity, proof, and trust.

## Canonical Layers

| Layer                   | Canonical asset                                                             | Role                                                                                  |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Company/public surface  | `sageideas.dev`                                                             | Agency/company website, proof pages, case studies, recruiter/client packets.          |
| Ecosystem control plane | `nexural-meta`                                                              | Registry, recipes, warehouses, ADRs, CLI, service-level governance.                   |
| App factory runtime     | `nexural-platform-kits` / Athanor                                           | Generate, verify, deploy, and learn from applications.                                |
| Quality system          | `nexural-qa-os`                                                             | QA runners, release scorecards, signed evidence, proof bundles.                       |
| Resource library        | `ai-warehouse`                                                              | Tool catalog, SDK decisions, stacks, playbooks, MCP-searchable resource intelligence. |
| Agent engine            | `sage-agents`                                                               | Agent templates, RAG, evals, observability, workflow workers.                         |
| Voice engine            | `nexural-voice-engine`                                                      | Reusable voice runtime, personas, tier presets, MCP/RAG integration.                  |
| Quant/trading engine    | `sagequant`, `Nexural_Automation`, related repos                            | Trading research, validation, execution, and automation primitives.                   |
| Product proofs          | `Nexural`, Commerce Command OS, Voza, Jobcopilot, Trayd, Giggl, Learning OS | Real applications that prove the engines can ship products.                           |

## Brand Hierarchy

Sage Ideas is the umbrella. Nexural is not the umbrella.

| Name                          | Meaning                                         |
| ----------------------------- | ----------------------------------------------- |
| Sage Ideas                    | Company and public studio identity.             |
| Sage Ideas Engineering OS     | Internal platform/factory ecosystem.            |
| Athanor                       | AI app factory runtime.                         |
| Sage QA OS                    | Quality and evidence system.                    |
| Sage Warehouse / AI Warehouse | Resource and tool intelligence layer.           |
| Sage Agents                   | Agent runtime and templates.                    |
| Sage Voice Engine             | Reusable voice runtime.                         |
| SageQuant                     | Quant/trading research platform.                |
| Nexural                       | A trading/investment product and product proof. |

## What This Is Not

- Not a monorepo mandate.
- Not a public SaaS product by itself.
- Not a rebrand of every existing package.
- Not a reason to touch product internals before the registry proves the need.
- Not a marketing-only exercise.

## North Star

> Sage can start from an idea, choose a recipe, pull known-good engines, generate
> or scaffold the app, run QA, deploy it, capture evidence, and feed reusable
> lessons back into the registry.

## Phase Path

| Phase | Outcome                                                                        |
| ----- | ------------------------------------------------------------------------------ |
| 0     | Naming, constitution, and brand hierarchy are locked.                          |
| 1     | Ecosystem registry inventories all repos, engines, and capabilities.           |
| 2     | Maturity model scores every asset and exposes real gaps.                       |
| 3     | Service-level control plane syncs GitHub, QA, evidence, and registry data.     |
| 4     | Internal resource factory UI makes the registry usable every day.              |
| 5     | Golden path proves idea to deployed app to evidence.                           |
| 6     | Public proof layer on `sageideas.dev` shows the system safely.                 |
| 7     | Automation loops keep the ecosystem current through `pnpm ecosystem:maintain`. |
| 8     | Hardening brings the system to 95-99+ across the board.                        |

## Done For Phase 0

Phase 0 is complete when:

- Sage Ideas is the explicit umbrella.
- Nexural is explicitly scoped to the trading/investment product.
- Repo/package names are treated as historical implementation names unless an
  ADR says otherwise.
- Future phases can classify and score repos without reopening brand debates.
