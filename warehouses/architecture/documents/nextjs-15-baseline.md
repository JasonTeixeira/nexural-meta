# Next.js 15 baseline conventions

The architecture warehouse pins the Next.js 15 + App Router shape that every SaaS recipe inherits.

## Directory layout

```
app/
  layout.tsx               # root layout — providers, fonts, theme
  page.tsx                 # landing
  (auth)/                  # route group; no URL segment
    login/page.tsx
    callback/route.ts
  (app)/                   # protected route group
    dashboard/page.tsx
  api/
    health/route.ts        # GET — used by uptime + qa-os
lib/
  supabase/{client,server}.ts
middleware.ts              # auth gate via @supabase/ssr
instrumentation.ts         # Sentry init (server + edge)
sentry.client.config.ts
sentry.server.config.ts
sentry.edge.config.ts
```

## Locked decisions

- App Router only; no Pages Router carry-over.
- React Server Components by default; `"use client"` is opt-in and reviewed.
- Strict TypeScript (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`).
- `experimental.typedRoutes` on — every `<Link>` href is type-checked.
- Security headers in `next.config.mjs.headers()` are the floor; CSP comes from the security warehouse.

## Why not Pages Router

App Router is the only path with first-class streaming + server actions + route groups. Pages Router is in maintenance mode.
