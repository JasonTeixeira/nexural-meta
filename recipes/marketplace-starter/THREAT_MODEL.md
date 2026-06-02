# Threat Model

Primary risks:

- Fraudulent listings, payment abuse, and payout manipulation.
- Cross-tenant listing or offer visibility.
- Operator moderation actions without audit trail.
- Dispute records exposing private buyer/seller context.

Required controls:

- Tenant-scoped RLS for marketplace tables.
- Immutable audit events for moderation and payout state changes.
- Separate service-role-only payout transitions.
- Public-safe proof before external claims.
