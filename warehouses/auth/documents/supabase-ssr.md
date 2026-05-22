# Supabase Auth + SSR patterns

Forged apps use `@supabase/ssr` for cookie-based session management across server components, route handlers, and middleware.

## Three clients

| Where you are                     | Client                                                              |
| --------------------------------- | ------------------------------------------------------------------- |
| Browser (`"use client"`)          | `createSupabaseBrowserClient()` from `lib/supabase/client.ts`       |
| Server Component or Route Handler | `await createSupabaseServerClient()` from `lib/supabase/server.ts`  |
| `middleware.ts`                   | Inline `createServerClient` with the request/response cookie wiring |

## Middleware is non-optional

Every request must pass through `middleware.ts` so the session cookie can be refreshed in-place. Skipping the middleware means clients see stale auth state until the next page load.

## OTP-only by default

The login template ships magic-link only. OAuth providers (Google, GitHub, etc.) opt in via `recipe.inputs.oauthProviders[]`. Password auth is intentionally NOT scaffolded — phishing surface, breach surface, support load.

## Token leak surface

Never expose the service-role key to the browser. The browser client uses anon-key only; service-role is a server-only env var (and the recipe `.env.example` enforces this convention).
