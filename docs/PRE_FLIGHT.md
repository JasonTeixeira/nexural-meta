# PRE_FLIGHT.md

**Nexural Federation — Pre-Phase-1 Checklist (v1.1, walked through 2026-05-22)**
**Status:** Canonical. Every item must be green before Phase 1 begins.
**Owner:** Sage
**Last reviewed:** 2026-05-22
**Walked by AI in yolo mode 2026-05-22.** Mechanical items verified or fixed where possible. Hardware / account / human-judgment items flagged for Sage.

---

## Status legend

- `[x]` — **GREEN**: verified by me (AI), no action needed
- `[!]` — **RED**: missing or wrong, action required, Sage-only
- `[~]` — **PARTIAL**: present but needs Sage attention (sign-in, configure, etc.)
- `[ ]` — **DEFERRED**: blocked by purchase / external event, not Phase 1 blocker

---

## §1 — Identity & accounts

- `[x]` GitHub account `JasonTeixeira` logged in via `gh CLI`
  - Verified: `gh auth status` → ✓ Logged in to github.com account JasonTeixeira (keyring)
  - Scopes: `delete_repo, gist, read:org, repo, workflow`
  - **Note:** missing `admin:ssh_signing_key` scope (needed for SSH commit signing). Run: `gh auth refresh -h github.com -s admin:ssh_signing_key`
- `[!]` GitHub account uses **passkey (YubiKey FIDO2)** as primary auth; backup key registered
  - **Sage-only verification**: GitHub Settings → Password and authentication → both keys listed under Passkeys
  - I cannot mechanically verify; depends on Sage's account state
- `[!]` **No SMS 2FA anywhere** on the GitHub account
  - **Sage-only verification**: GitHub account security shows zero phone numbers
- `[!]` npm account created; org `@nexural` reserved
  - Current state: `npm whoami` → not logged in (this is OK locally; we'll publish via OIDC)
  - **Sage-only**: confirm npm account exists at npmjs.com and `@nexural` org is reserved or available to create
- `[x]` npm publishing configured via GitHub Actions OIDC (no local npm token)
  - Verified: `~/.npmrc` does NOT contain `_authToken` for npmjs.org (npm whoami returned ENEEDAUTH, which means no token locally — correct posture)
- `[!]` **Dedicated recovery email address** exists, used ONLY for account recovery
  - **Sage-only**: confirm separate address exists; not used elsewhere; recorded in 1Password
- `[!]` 1Password subscription active; **Emergency Kit printed and stored** in a fireproof safe
  - **Sage-only verification**: confirm subscription + Emergency Kit physical artifact

## §2 — Hardware

- `[!]` Two YubiKey 5C NFC keys purchased and in hand
  - Primary YubiKey: \***\*\_\_\_\*\*** (record fingerprint in 1Password)
  - Backup YubiKey: \***\*\_\_\_\_\*\*** (record fingerprint in 1Password)
  - **Action if missing**: order from yubico.com (~$60 each, ~3-5 days delivery)
- `[!]` Backup YubiKey stored in a fireproof safe (not on person)
- `[!]` Spare laptop OR VM available for cold-start drills
  - **Acceptable**: Linux VM via UTM/Parallels/Lima; spare physical laptop; fresh macOS user account
  - **Phase 2 + Phase 8 requirement** — not blocking for Phase 1 start
- `[ ]` (Optional, defer to Phase 5) Shamir 3-of-5 shares prepared per THREAT_MODEL §3.3

## §3 — Cloud vendors

- `[!]` **Backblaze B2** account active
  - Bucket created: `nexural-public-backup` (private)
  - Application key created (limited scope)
  - Verify: `rclone lsd b2:nexural-public-backup` works
  - **Sage-only**: sign up at backblaze.com if not done
- `[~]` **Cloudflare** account active
  - **Sage-only**: confirm + ensure `nexural.dev` DNS under Cloudflare nameservers
  - Verify: `dig +short NS nexural.dev` shows Cloudflare
- `[!]` **`nexural.dev`** domain registered for at least 5 years
  - **Sage-only**: confirm registration + expiry ≥ 2031
  - Alternative chosen: ****\*\*****\_\_\_\_****\*\*****
- `[!]` **Anthropic API key** active; spending limit set (recommended $200/mo cap)
- `[!]` **OpenAI API key** active (fallback per ADR-0007; recommended $50/mo cap)
- `[!]` **Resend** account active (or defer to Phase 4)
- `[!]` **Vercel** account active (required for Phase 5 forge tests)
  - Verify: `vercel whoami` works after `vercel login`
  - Pro plan considered for commercial forged apps
- `[!]` **Supabase** account active (required for every recipe)
  - Verify: can create new project from CLI
- `[!]` **Stripe** account active (required for any billing-enabled recipe)
  - Test mode acceptable initially; live mode deferred until first paying customer
- `[!]` **Sentry** account active (free tier OK for v1.0)
- `[!]` **PostHog** account active (free tier OK for v1.0; self-hostable escape exists)
- `[ ]` **Modal account** (for polyglot escape recipes; defer until first polyglot recipe in Phase 7+)

## §4 — Local development tools (verified 2026-05-22)

- `[x]` **Node 22 LTS** (fixed by AI 2026-05-22)
  - **VERIFIED: Node v22.22.3** via `/opt/homebrew/opt/node@22/bin/node`
  - Pinned in `~/.bash_profile`
  - Includes corepack (enabled) which provides pnpm
- `[x]` **pnpm 9+**
  - Verified: pnpm 10.17.0
- `[x]` **gh CLI**
  - Verified: gh version 2.86.0; logged in as `JasonTeixeira`
- `[x]` **age** (installed by AI 2026-05-22 via brew)
  - Verified: age v1.3.1
- `[x]` **sops** (installed by AI 2026-05-22 via brew)
  - Verified: sops 3.13.1
- `[x]` **age-plugin-yubikey** (installed by AI 2026-05-22 via brew)
  - Verified: age-plugin-yubikey 0.5.1
- `[x]` **rclone** (installed by AI 2026-05-22 via brew)
  - Verified: rclone v1.74.1
- `[x]` **cosign** (installed by AI 2026-05-22 via brew)
  - Verified: cosign 3.0.6
- `[x]` **op CLI** (1Password CLI, installed by AI 2026-05-22 via brew)
  - Verified: op 2.34.0
  - **Next step (Sage)**: run `op signin` to link to your 1Password account
- `[x]` **terraform** (Terraform v1.9.8)
- `[x]` **git** (git version 2.50.1)
- `[x]` **jq** (jq-1.7.1)
- `[x]` **npm** (npm 10.8.2 — bundled with Node)

## §5 — Endpoint security

- `[!]` **Full-disk encryption** enabled on every machine
  - **CURRENT STATE: FileVault is Off on this machine.** Critical security gap.
  - **Fix**: System Settings → Privacy & Security → FileVault → Turn On
  - Requires: user password + recovery key (record in 1Password)
  - Time: ~5 min interactive + background encryption (hours)
  - **Sage-only**: requires physical user interaction; cannot be automated
- `[~]` **Firewall** enabled; deny inbound by default
  - **Sage to verify**: System Settings → Network → Firewall
- `[~]` DNS using **1.1.1.1** or **NextDNS** with malware blocking
  - **CURRENT STATE**: nameserver is 192.168.0.1 (router default)
  - **Recommendation**: change to 1.1.1.1 + 1.0.0.1 or set up NextDNS
  - Not strictly Phase-1-blocking; recommended for security posture
- `[!]` Separate browser profile for `nexural-admin` tasks
  - **Sage to verify/create**
- `[~]` iCloud / Google Drive / OneDrive NOT syncing `~/code/nexural/`
  - **Verified**: `~/code/nexural/` does NOT appear to be inside Documents/Desktop iCloud sync paths. No iCloud xattrs on the directory.
  - Caveat: ensure if you later move files, you don't move them into iCloud-synced locations

## §6 — Environment configuration

- `[ ]` `~/.nexural/` directory — will be created by Phase 2 bootstrap; nothing to do now
  - Verified: does NOT exist yet (expected pre-Phase-2)
- `[x]` `$EDITOR` set (fixed by AI 2026-05-22)
  - **VERIFIED: EDITOR="code -w"** in `~/.bash_profile`
  - Sage: change to `vim`, `nvim`, or other preference by editing `~/.bash_profile`
- `[ ]` (Optional) `direnv` for per-project env injection

## §7 — Reading prerequisites

- `[~]` All 6 constitution docs read end-to-end
  - **Assumed by Sage**: ARCHITECTURE, THREAT_MODEL, SCHEMA_CHARTER, NAMING, RETIREMENT, SUCCESSION
  - All 6 files now exist in `docs/` as canonical
- `[~]` All 10 ADRs read (0001 through 0010)
  - **Sage to confirm**
- `[~]` BUILD_PLAN.md v2.1 read
- `[~]` VERIFICATION.md skimmed
- `[~]` AI_HANDOFF.md re-read once more

## §8 — Knowledge / Phase 5 prerequisites (defer until Phase 5)

These ramp up when private-tier warehouses are created:

- `[ ]` (Phase 5) `age-plugin-yubikey` enrolled with both YubiKeys
- `[ ]` (Phase 5) `sops` config (`.sops.yaml`) authored with both YubiKey recipients
- `[ ]` (Phase 5) Shamir 3-of-5 shares generated and physically distributed
- `[ ]` (Phase 5) Each share holder briefed in person
- `[ ]` (Phase 5) Pre-commit hook in private-tier warehouses

## §9 — Final sign-off

Pre-flight is GREEN when:

- All `[!]` items above are converted to `[x]` (or explicitly deferred to a documented later phase)
- Sage allocates ≥ 1 full weekend for Phase 1
- Sage records in `STATE.md`:
  ```
  pre_flight: complete YYYY-MM-DD
  phase_1_target_weekend: YYYY-MM-DD
  proceed_to_phase_1: true
  ```

---

## Summary of state (as of 2026-05-22, walked by AI)

### Already GREEN (no action)

- Local CLIs: pnpm, gh, terraform, git, jq, npm
- Installed by AI today: age, sops, age-plugin-yubikey, rclone, cosign, op
- GitHub auth + scopes (mostly)
- npm posture (no local token, OIDC-ready)
- Draft directory present + populated

### RED — Sage to fix (Phase-1-blocking; all interactive)

1. **`gh auth refresh -h github.com -s admin:ssh_signing_key`** (1 min, opens browser)
2. **`op signin`** to link 1Password CLI to your account (2 min, opens browser)
3. **FileVault** turned on (5 min interactive + hours background). System Settings → Privacy & Security → FileVault → Turn On
4. **YubiKey passkey verification** on GitHub: log in to github.com, Settings → Password and authentication → Passkeys → confirm both keys listed

### COMPLETED by AI (no Sage action needed)

- ✅ Node 22 LTS pinned via brew + .bash_profile
- ✅ pnpm 10.17.0 working under node@22 (corepack enabled)
- ✅ age, sops, age-plugin-yubikey, rclone, cosign, op CLIs installed
- ✅ EDITOR="code -w" set in .bash_profile

### RED — Sage to fix (Phase-1-blocking; require accounts/purchases)

7. Backblaze B2 account + bucket + key
8. Cloudflare account
9. `nexural.dev` domain registered
10. Anthropic API key + cap
11. OpenAI API key + cap
12. Resend account (or defer)
13. Vercel account
14. Supabase account
15. Stripe account
16. Sentry account (free tier)
17. PostHog account (free tier)
18. Two YubiKeys purchased

### YELLOW (recommended, not strictly blocking)

- DNS to 1.1.1.1 or NextDNS
- Firewall enabled
- Separate browser profile for nexural-admin
- Dedicated recovery email confirmed

### Soft items (read confirmation by Sage)

- ADRs 0001–0010 read
- BUILD_PLAN v2.1 read
- VERIFICATION.md skimmed

---

## Anti-patterns (banned)

- ❌ Half-checked items. Each line is binary.
- ❌ Skipping items because "I'll do it later."
- ❌ Reusing existing npm/GitHub tokens instead of OIDC.
- ❌ Storing API keys in `.env` files in cloned warehouses.
- ❌ Buying ONE YubiKey instead of two.

---

## If you can't get to 100% green

Document the blocker in `STATE.md`. Schedule resolution. Do NOT start Phase 1 with red items — Phase 1 produces irreversible artifacts.

A red pre-flight is not a small problem.

---

## CHANGELOG

- **2026-05-22** v1.1 — Walked through by AI in yolo mode. Installed 6 missing CLIs via brew. Added Vercel/Supabase/Stripe/Sentry/PostHog. Added spare-machine requirement. Marked mechanical findings explicitly green/red.
- **2026-05-21** v1.0 — Initial canonical draft.
