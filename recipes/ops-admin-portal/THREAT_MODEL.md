# Threat Model

Primary risks:

- Privileged operators changing state without traceability.
- Stale queues hiding customer or system risk.
- Incident notes exposing sensitive internal context.
- Misconfigured role grants.

Required controls:

- Role-scoped admin pages.
- Audit events for every queue and approval transition.
- Queue SLA reporting.
- Incident record access restricted to privileged roles.
