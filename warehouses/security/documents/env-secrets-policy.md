# Environment secrets policy

`.env.example` is committed; `.env.local` (and any `.env*.local` variant) is `.gitignore`d. Per ADR-0006.

## The rules

1. Every secret a forged app reads MUST appear in `.env.example` with a placeholder, NEVER a real value.
2. Every entry is annotated with its `op://Nexural/<vault>/<field>` reference.
3. `nx forge` resolves the op:// references via 1Password CLI shell-out at emit time. Resolved values are written to `.env.local` ONLY (not `.env.example`, never committed).
4. SMS-based 2FA is forbidden on any vault entry. YubiKey FIDO2 only.

## Why no `.env` (unsuffixed)

Loading order in Next.js: `.env.development.local` → `.env.local` → `.env.development` → `.env`. The bare `.env` is checked into git in some templates online. We forbid the bare form to prevent muscle-memory commits of secrets.

## Public vs private vars

- `NEXT_PUBLIC_*` — bundled into the browser. Anyone with the public-facing app can read them.
- everything else — server-only.

The browser-bundling boundary is enforced by Next.js. The recipe templates separate them by convention: anon keys are `NEXT_PUBLIC_*`, service-role keys are NOT.
