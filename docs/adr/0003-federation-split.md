# ADR-0003: Federation Split — `nexural-factory` + `nexural-lifeops`

**Status:** Proposed
**Date:** 2026-05-21
**Deciders:** Sage
**Soak ends:** 2026-05-28
**Depends on:** ADR-0002

## Context

The original 32-warehouse roster mixes two categories that have nothing to do with each other:

- **Factory warehouses** (architecture, runbook, security, auth, payments, etc.) — patterns that go into apps.
- **Personal/strategic warehouses** (decision, network, health, mentoring, etc.) — patterns for running life and business.

Both are valuable. Neither should dilute the other. A factory whose registry is half-full of personal warehouses confuses its own identity for both human readers and routing agents.

## Decision

Split into two federations sharing the same control plane (`nexural-meta`) and the same `@nexural/*` package set, distinguished by GitHub topic on each warehouse repo.

### Federation rosters

**`nexural-factory` (GitHub topic: `nexural-factory`) — 30 warehouses:**

| Group         | Warehouses                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform (15) | architecture, auth, payments, database, storage, email, realtime, deployment, observability, security, dx, design, accessibility, performance, runbook |
| AI (6)        | agent, rag, eval, prompt, model-routing, safety                                                                                                        |
| Finance (4)   | ledger, compliance, market-data, accounting                                                                                                            |
| SaaS (5)      | billing, multi-tenancy, onboarding, admin, analytics                                                                                                   |

**`nexural-lifeops` (GitHub topic: `nexural-lifeops`) — 14 warehouses:**

decision, network, career, health, mentoring, interview, learning, failure, comms, vendor, finance-personal, legal-personal, principles, system-prompts

### Discovery

`nexural-meta/scripts/discover.mjs` accepts a `--federation` flag (default: both):

```bash
nx sync                    # syncs both federations
nx sync --federation=factory
nx sync --federation=lifeops
```

Discovery emits two registries: `registry-factory.yaml` and `registry-lifeops.yaml`. Each warehouse repo MUST carry exactly ONE of the two topics. Carrying both is a verify-all error.

### `nx` CLI scoping

```bash
nx ask "<q>"                       # asks both federations by default
nx ask --factory "<q>"             # factory only
nx ask --lifeops "<q>"             # lifeops only
nx forge <recipe>                  # only consults nexural-factory
nx health [--factory|--lifeops]    # health dashboard scoped
```

### Decay rates differ

Factory warehouses default to `decay_rate_days: 90` (tech changes fast).
Lifeops warehouses default to `decay_rate_days: 365` (principles change slowly).

## NAMING.md amendment

Add to §2 Reserved Namespaces:

```
### 2.5 GitHub topic taxonomy

Every warehouse MUST carry exactly one of:
  - `nexural-factory` — for app-building patterns
  - `nexural-lifeops` — for personal/strategic knowledge

`nexural-warehouse` (legacy) is deprecated in favor of these scoped topics.
Carrying both `nexural-factory` and `nexural-lifeops` is forbidden and
fails `verify-all`.
```

Also add to §13 Reserved Names: `nexural-factory`, `nexural-lifeops` as namespace identifiers.

## Consequences

**Positive:**

- Each federation has a clean identity and reason to exist.
- Tools and agents can scope to one federation, reducing noise.
- Lifeops can age at its own (slower) decay rate without affecting factory metrics.
- Future agents querying for "build" content automatically scope to factory.

**Negative:**

- Two registries to maintain (mitigated by shared discovery script).
- Mild cognitive overhead deciding which federation a new warehouse belongs to (mitigated by §13 decision tree in NAMING.md).

**Neutral:**

- Same control plane, same `@nexural/*` packages, same MCP router. Just topic-scoped views.

## Alternatives Considered

1. **One mixed federation.** Rejected — dilutes both identities.
2. **Separate control planes (two `nexural-meta` instances).** Rejected — duplicates infra work, breaks shared tooling.
3. **Folder-based split inside one federation.** Rejected — too implicit; GitHub topic gives a real, enforceable boundary.

## Soak

7 days, co-soak with ADR-0002.
