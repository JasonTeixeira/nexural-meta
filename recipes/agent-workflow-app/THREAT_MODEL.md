# Threat Model

Primary risks:

- Prompt injection causing unsafe tool calls.
- Tool output leaking between tenants.
- Unapproved automation mutating external systems.
- Eval artifacts giving false confidence.

Required controls:

- Tenant-scoped workflow run records.
- Human approval gate before mutating tools.
- Tool-call audit trail.
- Adversarial eval pack before hosted proof promotion.
