# Decisions

- Extend `saas-multitenant-baseline` to keep auth, billing, observability, and deployment identical to the proven factory path.
- Model listings and offers first; payouts and disputes are tracked as operational records until provider-specific flows are implemented.
- Use Stripe Connect as the default payout assumption because it is the most common SaaS marketplace rail.
