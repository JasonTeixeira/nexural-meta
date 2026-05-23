# Sage operational blockers — checklist for V1.0 close

Items only you can do (account access, secrets, hardware). Work through these at your own pace; nothing here is sequential, but **all must clear before Phase 8 (live deploy)** can complete.

## Critical-path (blocks Phase 8 deploy)

### 1. Rotate npm token + grant scope-create on `@nexural`

The active token has intermittent scope-create permission. At v1.0.0 all 10 existing packages landed correctly (including the previously ghost-published `forge-emit` + `warehouse-base`). At v1.0.1, the brand-new `@nexural/warehouse-server@1.0.0` ghost-published again (changesets reported success; npm registry never received it). `@nexural/warehouse-base@1.1.0` did publish because it already existed.

**Pattern:** the token consistently can update existing packages but cannot reliably create new package names under the `@nexural` scope. This needs a fresh token with explicit "Manage scope packages" permission on `@nexural`.

**Steps:**

1. Go to https://www.npmjs.com/settings/jasonteixeira/tokens
2. Revoke the current active token
3. Create a new **Granular Access Token**:
   - **Permissions: Read + Write**
   - **Packages and scopes:** select `@nexural` and check **Manage scope packages** (the create-new-package permission)
   - **Bypass 2FA: ON** (required since the GitHub Actions runner can't pass 2FA)
   - **Expiration: 90 days** (rotate quarterly)
4. Update the GitHub secret: `gh secret set NPM_TOKEN`
5. Re-publish the ghost packages by re-tagging:
   ```bash
   git tag -d v1.0.1
   git push --delete origin v1.0.1
   git tag -a v1.0.1 -m "v1.0.1 — Phase 11.1 (re-tagged for warehouse-server publish)"
   git push origin v1.0.1
   ```
6. Verify: `npm view @nexural/warehouse-server version` should return `1.0.0`.

### 1b. Document the verify step for every future new package

Every time a new `@nexural/*` package is introduced (Phase 11+ will add `@nexural/ask-engine`, possibly `@nexural/dashboard-server`), the publish workflow's success log can be misleading — changesets reports "success" even when npm silently rejects. The verification step is:

```bash
npm view @nexural/<new-package>@<version> version
```

If this 404s after a successful publish workflow, the token doesn't have scope-create. Either rotate (above) OR run `npm publish --access public` from local once with a token that has UI-confirmed access; subsequent updates work fine via CI.

### 2. `op signin` — verify 1Password vault entries

The `op://Nexural/*` references the recipes use must resolve. Without these, real (non-`--mock-secrets`) forge fails.

**Steps:**

1. `op signin`
2. Verify each required entry exists. For `saas-multitenant-baseline`, you need:
   ```
   op://Nexural/Supabase/anon-key
   op://Nexural/Supabase/service-role-key
   op://Nexural/Stripe/secret-key
   op://Nexural/Stripe/webhook-secret
   op://Nexural/Resend/api-key
   op://Nexural/Sentry/dsn
   op://Nexural/PostHog/api-key
   ```
3. For each missing entry: `op item create --vault=Nexural --category="API Credential" --title=<provider> <key>=<value>`
4. Test resolution: `op read op://Nexural/Supabase/anon-key` should print the value.

### 3. Create Vercel + Supabase + Stripe accounts

- **Vercel:** Free tier is fine. Create a team or use personal. Note your team slug.
- **Supabase:** Create a new project. Note the project ref + URL + anon-key + service-role-key. **Add these to 1Password (step 2 above)** before you forget.
- **Stripe:** Use test mode for v0.9.5. Note `sk_test_*` (secret-key) + the webhook signing secret (you'll generate this once you have a live URL in Phase 8).

## Important but not blocking Phase 8

### 4. `gh auth refresh -h github.com -s admin:ssh_signing_key`

Needed for signed commits + future warehouse-repo creation (Phase 8.5, deferred to V1.1).

### 5. FileVault on

```
System Settings → Privacy & Security → FileVault → Turn On…
```

Critical security gap. Not federation-blocking but should clear before V1.0 announcement — your CLAUDE.md memory has been flagging this for months.

### 6. B2 buckets + GitHub secrets

For the `backup.yml` cron (Phase 2). No-ops until you set them.

```bash
# Create two B2 buckets named e.g. `nexural-factory-mirror` + `nexural-lifeops-mirror`
gh secret set B2_BUCKET_FACTORY
gh secret set B2_BUCKET_LIFEOPS
gh secret set B2_APPLICATION_KEY_ID
gh secret set B2_APPLICATION_KEY
```

### 7. YubiKey FIDO2 passkey check on github.com

You require this per memory but it's worth confirming the passkey is enrolled correctly:

```
https://github.com/settings/security → Passkeys → ensure YubiKey is listed
```

If SMS 2FA is still enabled anywhere, disable it (per your security policy).

## What to do when done

When 1–3 are complete, ping me with "Phase 8 ready" and I'll walk through the deploy runbook with you. Items 4–7 are sage-managed and don't gate me.
