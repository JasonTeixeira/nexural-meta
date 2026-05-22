# recipes/

Signed, parameterized application recipes per ADR-0002 four-layer model
(Layer 2 — Composition).

## Catalog (v0.5.0)

| Recipe                            | Status  | Description                                                        |
| --------------------------------- | ------- | ------------------------------------------------------------------ |
| `saas-multitenant-baseline`       | shipped | Multi-tenant SaaS — Next.js + Supabase + Stripe + Sentry + PostHog |
| `saas-multitenant-baseline-cf`    | shipped | Cloudflare Pages + Workers + D1 escape variant                     |
| `saas-rag-chat`                   | Phase 6 | RAG-backed chat product                                            |
| `saas-rag-chat-qdrant`            | Phase 6 | Qdrant primary escape for >1M chunks                               |
| `saas-rag-chat-openai-first`      | Phase 6 | OpenAI-primary variant                                             |
| `saas-agent-platform`             | Phase 6 | Agent-as-a-service product                                         |
| `fintech-ledger-app`              | Phase 7 | Double-entry ledger SaaS                                           |
| `fintech-ledger-app-aws`          | Phase 7 | AWS Lambda + RDS escape for compliance posture                     |
| `internal-tool-dashboard`         | Phase 7 | Admin/internal tool sub-recipe                                     |
| `saas-multitenant-baseline-lemon` | Phase 7 | Lemon Squeezy escape for EU VAT                                    |

## Recipe structure

```
<recipe-name>/
├── recipe.yaml           # RecipeManifest per SCHEMA_AMENDMENTS §5
├── inputs.zod.ts         # Zod schema for forge-time inputs
├── THREAT_MODEL.md       # Per-recipe threat model (ADR-0008 §7)
├── DECISIONS.md          # Every opinion locked (ADR-0008 §7)
├── README.md             # Operator-facing docs
└── templates/            # Token-substituted source files emitted by `nx forge`
```

## Forge flow

```
nx forge <recipe-name> <app-name> [--<input>=<value>...]
  ↓
@nexural/factory:
  1. Fetch recipe tarball (signed) from GH Releases
  2. cosign verify-attestation per ADR-0006
  3. Check security/revoked-recipes.yaml per ADR-0009 §1.6
  4. Validate inputs against inputs.zod.ts
  5. Resolve secrets via op:// per ADR-0006
  6. SBOM + license + typosquat gates per ADR-0006, ADR-0009
  7. Emit templates with token substitution
  8. pnpm install --ignore-scripts per ADR-0009 §1.7
  9. Run qa-os --fast (≥80 required)
 10. Write .nexural/forged.lock.yaml
 11. git init + initial commit
```

## Discipline

Every recipe MUST:

- Pass `recipe-validity` nightly (per ADR-0008 §4)
- Ship a `THREAT_MODEL.md` + `DECISIONS.md` (per ADR-0008 §7)
- Declare `cost_envelope.hard_caps` (per ADR-0007)
- Declare `forge_sandbox` (per ADR-0009 §1.7)
- Get signed with cosign + SLSA L3 (per ADR-0006)
