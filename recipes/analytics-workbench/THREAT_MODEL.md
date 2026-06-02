# Threat Model

Primary risks:

- Cross-tenant event leakage.
- Unapproved metric changes altering business reporting.
- Large exports exposing sensitive records.
- Dashboard queries becoming expensive or stale.

Required controls:

- Tenant-scoped RLS.
- Metric definition audit trail.
- Export-job ownership and expiry.
- Freshness checks in proof artifacts.
