# THREAT_MODEL — `saas-rag-chat-openai-first`

Per ADR-0008 §7. Inherits from `saas-rag-chat/THREAT_MODEL.md`.

## Differences

Only the primary model provider changes. All other controls (envelope wrapping,
citation validation, cost caps, RLS, safe-link rewrite) are unchanged.

| Threat                                 | Defense                             |
| -------------------------------------- | ----------------------------------- |
| OpenAI prompt-injection susceptibility | Same envelope + citation discipline |
| OpenAI API outage                      | Anthropic fallback in model chain   |
| OpenAI cost spike                      | Same cost caps + streaming abort    |
