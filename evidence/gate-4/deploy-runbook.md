# ADR-0011 gate 4 — live deploy runbook

The end-to-end runbook for shipping the first real `saas-multitenant-baseline` app. Closes gate 4 (the last unproven ADR-0011 gate); clears the path to V1.0.

**Prerequisites** — all `evidence/operational/sage-blockers.md` items 1–3 complete:

- npm token rotated with scope-create permission
- `op signin` working + Nexural vault populated with all 7 secrets
- Vercel + Supabase + Stripe (test mode) accounts created

---

## Step 1 — Create Supabase project

1. https://supabase.com/dashboard → New project
2. Name: `nexural-live-test-1`
3. Region: closest to you
4. Wait ~2 min for provisioning
5. Project Settings → API:
   - Copy `Project URL` → add to 1Password as `op://Nexural/Supabase/url`
   - Copy `anon` `public` key → `op://Nexural/Supabase/anon-key`
   - Copy `service_role` `secret` key → `op://Nexural/Supabase/service-role-key`
6. Verify: `op read op://Nexural/Supabase/anon-key` returns the key.

## Step 2 — Forge the app

```bash
cd /Users/Sage/code/nexural/nexural-meta

# Edit the fixture to match your actual values:
$EDITOR test/fixtures/saas-multitenant-baseline.inputs.json
# Set:
#   "appName": "nexural-live-test-1"
#   "displayName": "Nexural Live Test"
#   "rootDomain": "nexural-live-test-1.vercel.app"   (you'll get this URL after Vercel link)

# Real forge — NO --mock-secrets this time. op:// will resolve.
pnpm tsx apps/cli/src/bin/nx.ts forge \
  saas-multitenant-baseline nexural-live-test-1 \
  --inputs=test/fixtures/saas-multitenant-baseline.inputs.json \
  --out-dir=$HOME/code/apps/nexural-live-test-1
```

If `op read` fails, fix the vault entry and retry. Don't pass `--mock-secrets` — that would emit non-functional `.env.local` and the deploy would silently break.

Verify the emit was clean:

```bash
cd $HOME/code/apps/nexural-live-test-1
cat .env.local  # confirm real values populated, NOT MOCK_*
ls -la           # 27 files + .git/ + .nexural/
```

## Step 3 — Apply the database migration

```bash
cd $HOME/code/apps/nexural-live-test-1
pnpm install
pnpm dlx supabase login                        # one-time
pnpm dlx supabase link --project-ref <your-ref>  # the ref from your Supabase URL
pnpm dlx supabase db push                      # applies supabase/migrations/0001_init.sql
```

Verify in Supabase dashboard → Database → Tables: you should see `tenants`, `tenant_memberships`, `audit_events`. All have RLS enabled.

## Step 4 — Local smoke test

```bash
pnpm dev   # http://localhost:3000
```

Open the browser:

- `/` → "Welcome…" page renders
- Click "Sign in" → magic-link form appears
- Submit your email → "Check your email for a magic link" message
- Open your inbox → click the magic link → redirected to `/dashboard`

If the magic link doesn't arrive: Supabase Auth dashboard → Logs → Auth → check for SMTP failures. Default Supabase sender works for verified emails; production needs Resend SMTP config (we'll wire that post-V1.0).

## Step 5 — Deploy to Vercel

```bash
cd $HOME/code/apps/nexural-live-test-1
pnpm dlx vercel login        # one-time
pnpm dlx vercel link         # create new Vercel project; accept defaults
pnpm dlx vercel env pull .env.production.local  # downloads any pre-set env (probably empty)
```

Now set the production env vars on Vercel (one of two paths):

**Path A (Vercel dashboard):** Project Settings → Environment Variables → add each value from `.env.local`.

**Path B (CLI, faster):**

```bash
# For each line in .env.local that's not a comment + has a value:
grep -v '^#' .env.local | grep '=' | while IFS='=' read -r k v; do
  echo "$v" | pnpm dlx vercel env add "$k" production
done
```

Deploy:

```bash
pnpm dlx vercel --prod
# wait ~1 min
# note the production URL (e.g. https://nexural-live-test-1-xxxx.vercel.app)
```

## Step 6 — Production smoke test

Open the production URL in a fresh browser session (no cached auth):

- `/` loads
- Sign in flow works against PRODUCTION supabase
- Magic link arrives + works against production callback URL

If sign-in redirects fail: Supabase Auth → URL Configuration → add your Vercel URL to **Site URL** + **Redirect URLs**.

## Step 7 — Run `nx verify`

```bash
cd /Users/Sage/code/nexural/nexural-meta
pnpm tsx apps/cli/src/bin/nx.ts verify \
  https://<your-vercel-url> \
  --evidence-slug saas-multitenant-baseline-live-1
```

Expected output:

```
🔍 Verifying https://...
  ✓ root_reachable: HTTP 200
  ✓ hsts: strict-transport-security="max-age=63072000; includeSubDomains; preload"
  ✓ x_content_type_options: x-content-type-options="nosniff"
  ✓ referrer_policy: referrer-policy="strict-origin-when-cross-origin"
  ✓ x_frame_options: x-frame-options="DENY"
  ✓ permissions_policy: permissions-policy="camera=(), microphone=(), geolocation=()"
  ✓ no_powered_by: absent (correct)
  ✓ health_endpoint: HTTP 200; content-type=application/json

✅ 8/8 checks passed
   evidence: evidence/gate-5/saas-multitenant-baseline-live-1/report.json
```

If anything fails: that's a real gap — patch the relevant warehouse, re-forge, redeploy, re-verify. The whole point of the slice is to surface gaps.

## Step 8 — Mark recipe shipped

After all checks pass:

```bash
cd /Users/Sage/code/nexural/nexural-meta
# I'll update registry-recipes.yaml + STATE.md + commit + tag v0.9.5
```

Tell me "live verify passed" and the deploy URL — I'll close out gate 4 from there.

---

## What to do if Stripe isn't ready yet

Stripe checkout is wired in but isn't on the magic-link signup path. You can complete gate 4 WITHOUT a working Stripe → the recipe's claim is "multitenant baseline app deploys + auth flow works." Stripe webhook + checkout are validated separately when you actually run a transaction.

If you want to also validate Stripe live:

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://<your-vercel-url>/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
4. Copy the signing secret → 1Password as `op://Nexural/Stripe/webhook-secret`
5. Re-forge (or set env var on Vercel manually)
6. Test: Stripe → send test webhook from the dashboard → confirm 200 response

This is optional for gate 4.

---

## Common failure modes + fixes

| Failure                                       | Likely cause                                          | Fix                                                                       |
| --------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| `op read` returns empty                       | Vault entry exists but field name wrong               | `op://Nexural/<item>/<field>` — match field name exactly (case-sensitive) |
| `nx forge` errors `[forge-emit:secret_leak]`  | Real secret value accidentally pasted into a template | Find the template; replace with `process.env.X` reference                 |
| Vercel build fails on `next build`            | Some env var missing in production                    | Cross-check Vercel env vars against `.env.local`                          |
| Magic link works locally, fails in production | Supabase Site URL still set to localhost              | Update Supabase Auth → URL Configuration                                  |
| `nx verify` HSTS check fails                  | First request comes back as HTTP not HTTPS            | Vercel auto-redirects; check that your URL uses `https://`                |
| `nx verify` no_powered_by fails               | `poweredByHeader: false` not in next.config           | Already in the recipe; if missing, the warehouse template drifted         |
