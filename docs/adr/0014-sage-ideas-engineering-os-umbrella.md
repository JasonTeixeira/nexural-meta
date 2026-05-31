# ADR-0014: Use Sage Ideas Engineering OS as the ecosystem umbrella

## Status

Accepted

## Date

2026-05-31

## Deciders

Sage

## Context

The repository and package history use `nexural-*` and `@nexural/*` for parts
of the factory. Separately, Nexural is also the name of a trading/investment
application. This creates ambiguity: readers can confuse the product name with
the company, the app factory, the resource library, or the broader engineering
ecosystem.

The actual company identity is Sage Ideas. The broader system being organized is
an internal engineering operating system used by Sage to build future apps
quickly and to expose credible, redacted proof to employers and clients through
`sageideas.dev`.

Without an ADR, future cleanup could waste effort renaming repositories or,
worse, continue presenting Nexural as the whole ecosystem.

## Decision

Use **Sage Ideas Engineering OS** as the umbrella name for the service-level
ecosystem.

Use **Sage Ideas** as the company/public studio identity.

Use **Nexural** only for:

- the trading/investment product line;
- legacy repository/package namespaces that already exist;
- historical references where changing the name would break clone URLs,
  package names, or provenance.

Create these canonical Phase 0 documents:

- `docs/SAGE_IDEAS_ENGINEERING_OS.md`
- `docs/BRAND_ARCHITECTURE.md`
- `docs/ECOSYSTEM_CONSTITUTION.md`

Treat older `Nexural Federation` wording as historical implementation language
unless a current canonical document explicitly keeps it.

## Rationale

This preserves continuity while fixing the mental model:

- Sage Ideas is the durable company identity.
- Sage Ideas Engineering OS is the internal platform/factory.
- Athanor is the app factory runtime.
- QA OS, AI Warehouse, Sage Agents, Sage Voice Engine, and SageQuant are system
  layers or engines.
- Nexural is a product proof, not the umbrella.

The decision avoids a risky mass rename. The service-level registry can explain
roles before any code or package movement occurs.

## Consequences

### Positive

- Public and internal narratives become clearer.
- `sageideas.dev` can show the engineering OS without making Nexural look like
  the company.
- Future registry work can classify repos without reopening naming debates.
- Existing repo/package names remain stable.

### Negative

- Some existing docs will temporarily retain old umbrella language.
- Readers may see both `nexural-*` implementation names and Sage Ideas umbrella
  language until cleanup phases complete.
- Public proof pages must be careful to distinguish product proofs from platform
  components.

## Implementation Notes

Phase 0 updates only service-level docs and entry-point language. It does not
rename repos, packages, CLIs, env vars, or product code.

Phase 1 should introduce a machine-readable ecosystem registry that maps
historical repo names to canonical roles and maturity levels.

## Related Documents

- `docs/SAGE_IDEAS_ENGINEERING_OS.md`
- `docs/BRAND_ARCHITECTURE.md`
- `docs/ECOSYSTEM_CONSTITUTION.md`
- `docs/ECOSYSTEM.md`
- `docs/NAMING.md`
- `docs/adr/0013-multi-repo-ecosystem.md`
