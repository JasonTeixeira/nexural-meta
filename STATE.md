# Nexural Build State

> Single source of truth for "where is the build now?" Updated at end of every session. Read at start of every AI session. Per ADR-0008.

---

## Current state

- **Current phase:** **0 (Constitution + ADRs) — COMPLETE; PRE_FLIGHT walked mechanically**
- **Soak window:** WAIVED by Sage 2026-05-21. ADRs 0002–0010 locked.
- **Last tag:** none (no code yet; first tag `v0.1.0` lands at Phase 1 completion)
- **Last touched:** 2026-05-22 (AI yolo-mode pre-flight walkthrough)
- **Mode signal from Sage:** "yolo mode when you can" + "go into yolo mode real quick so you can work without me"
- **Plan locked 2026-05-22:** Sage will complete 4 interactive PRE_FLIGHT items tonight; Phase 1 begins this weekend.

## Sage's commitment (logged 2026-05-22)

- [ ] Tonight: 4 interactive items (gh ssh signing scope; op signin; FileVault on; YubiKey passkey check on github.com)
- [ ] This weekend: Phase 1 begins — AI scaffolds pnpm workspace + 6 @nexural/\* packages

When 4 interactive items complete, Sage appends below this section:

```
pre_flight: complete YYYY-MM-DD
proceed_to_phase_1: true
```

## What got done autonomously this session (2026-05-22)

### Constitution + Phase 0

- ✅ `SUCCESSION.md` merged from `~/Downloads/SUCCESSION (1).txt` — placeholder replaced with 568 lines of canonical content (Sage's source)
- ✅ All Phase 0 docs in place (24 files, ~6,800+ lines)

### Pre-flight walkthrough (mechanical items)

- ✅ All available CLI tools verified
- ✅ Installed via Homebrew: **age v1.3.1, sops 3.13.1, age-plugin-yubikey 0.5.1, rclone 1.74.1, cosign 3.0.6, op 2.34.0**
- ✅ Verified: pnpm 10.17.0, gh 2.86.0 (logged in as JasonTeixeira), terraform 1.9.8, git 2.50.1, jq 1.7.1, npm 10.8.2, brew 5.1.13
- ✅ Confirmed: `~/code/nexural/nexural-meta/` populated; `nexural-qa-os` cloned at `~/code/nexural/nexural-qa-os/`
- ✅ Confirmed: `~/code/nexural/` is NOT inside iCloud sync paths (no com.apple.cloud xattrs)
- ✅ Confirmed: `~/.nexural/` does not exist yet (correct; created by Phase 2 bootstrap)
- ✅ Confirmed: 231 GiB free disk space
- ✅ PRE_FLIGHT.md updated with full mechanical findings + clear red/yellow/green for Sage

## OUTSTANDING — Sage to do (Phase-1-blocking)

### Tier 1 — Sage-only interactive items (Phase-1-blocking)

1. **GitHub SSH signing scope**: `gh auth refresh -h github.com -s admin:ssh_signing_key` (opens browser)
2. **1Password CLI signin**: `op signin` (opens browser, links CLI to your account)
3. **FileVault**: System Settings → Privacy & Security → FileVault → Turn On. **CRITICAL — currently OFF.**
4. **YubiKey passkey verification** on GitHub: log in, Settings → Password and authentication → Passkeys → confirm both keys

### Already done by AI this session (no Sage action)

- ✅ Node 22 LTS pinned (v22.22.3 via brew + .bash_profile)
- ✅ corepack enabled; pnpm 10.17.0 active under node@22
- ✅ Installed: age, sops, age-plugin-yubikey, rclone, cosign, op
- ✅ EDITOR="code -w" set in .bash_profile
- ✅ SUCCESSION.md merged (568 lines, Sage's source)
- ✅ PRE_FLIGHT walked mechanically; all verifiable items marked

### Tier 2 — Account creation / purchases

7. Backblaze B2 account + `nexural-public-backup` bucket + application key
8. Cloudflare account + DNS for `nexural.dev`
9. `nexural.dev` domain registration ≥ 5 years
10. Anthropic API key with $200/mo cap
11. OpenAI API key with $50/mo cap
12. Resend account (or defer to Phase 4)
13. Vercel account
14. Supabase account
15. Stripe account (test mode initially)
16. Sentry account (free tier)
17. PostHog account (free tier)
18. **Two YubiKey 5C NFC keys** (order from yubico.com, ~$60 each)

### Tier 3 — Security hygiene (recommended; not strict Phase-1 blocker)

- DNS → 1.1.1.1 or NextDNS (currently 192.168.0.1)
- macOS firewall enabled
- Separate browser profile for `nexural-admin`
- Dedicated recovery email confirmed in 1Password

### Tier 4 — Reading confirmation

- Confirm ADRs 0001–0010 read end-to-end
- Confirm BUILD_PLAN v2.1 read
- Confirm VERIFICATION.md skimmed

## Phase 0 deliverables — FINAL STATUS

### Canonical constitution docs (in `docs/`)

- [x] ARCHITECTURE.md v1.1 (with §15 four-layer model)
- [x] THREAT_MODEL.md v1.1 (with §11 prompt-injection + §12 tier confinement)
- [x] SCHEMA_CHARTER.md v1.1 (with §13 referencing SCHEMA_AMENDMENTS.md)
- [x] NAMING.md v1.1 (with §15 topic taxonomy)
- [x] RETIREMENT.md v1.0
- [x] **SUCCESSION.md v1.0 — REAL CONTENT (568 lines, Sage's source)**

### Build/operational docs (in `docs/`)

- [x] BUILD_PLAN.md v2.1 (19–22 weekends; entry minimums ≥3; nx new in Phase 5)
- [x] VERIFICATION.md v1.0 (9 phases, mechanical gates)
- [x] PRE_FLIGHT.md v1.1 (mechanically walked 2026-05-22; CLI tools installed; Sage actions clearly red-flagged)
- [x] INDEX.md v1.0
- [x] SCHEMA_AMENDMENTS.md v1.0
- [x] OPS_CALENDAR.md v1.0
- [x] POST_V1_BACKLOG.md v1.0
- [x] STATE.md (this file)

### ADRs (in `docs/adr/`)

- [x] 0001 through 0010 — all 10 present

**TOTAL: 24 files, 6,800+ lines locked institutional-grade Phase 0 artifacts.**

## Next session start (Phase 1)

Once Tier 1 + Tier 2 outstanding items are green AND Sage signs off:

1. `git init` in `/Users/Sage/code/nexural/nexural-meta/`
2. Initial commit of all Phase 0 docs
3. **One Sage confirmation**: `gh repo create JasonTeixeira/nexural-meta --private`
4. Scaffold pnpm workspace + Turborepo at `packages/`
5. Build `@nexural/schema` (primitives → meta → frontmatter → index → mcp → telemetry → recipe-family → external-mcp → model-router → revocation)
6. Build `@nexural/sdk`, `@nexural/mcp-base`, `@nexural/qa-runners`, `@nexural/factory`, `@nexural/model-router`
7. Tests: 100% schema coverage + property-based via fast-check + ≥5 invalid fixtures
8. CI: changesets + vitest + tsup + eslint + prettier + tsc + Sigstore dry-run + SBOM
9. **One Sage confirmation**: tag `v0.1.0` (auto-publishes packages via GitHub Actions OIDC)

Estimated: 1–2 weekends of focused work.

## Soak waivers (per ADR-0009 §1.10 — ≤2 per quarter)

| Date       | What was waived              | Reason                 |
| ---------- | ---------------------------- | ---------------------- |
| 2026-05-21 | 7-day soak on ADRs 0002–0010 | Sage explicit override |

(2026-Q2 waiver count: 1)

## Notes

- All Phase 0 docs are LOCAL DRAFTS. No git repo yet. No GitHub repo yet. No npm package published.
- ai-warehouse stays separate per ADR-0005 — federated as external MCP.
- nexural-qa-os exists at v1.0.0 AND is now cloned locally at `~/code/nexural/nexural-qa-os/` (good — Phase 2 bootstrap path verified).
- Personal/strategic warehouses split into parallel `nexural-lifeops` federation per ADR-0003.
- AI installed system-level CLI tools via Homebrew (age, sops, age-plugin-yubikey, rclone, cosign, op). These are reversible via `brew uninstall` if needed.

## History

History rotates weekly into `STATE.history.md`. Recent entries:

- **2026-05-22:** Yolo-mode pre-flight walkthrough. SUCCESSION.md merged from Downloads. Installed 6 missing CLIs via brew (age, sops, age-plugin-yubikey, rclone, cosign, op). PRE_FLIGHT.md updated with mechanical findings. Found 1 critical security gap (FileVault off) and 6 Tier-1 Sage-only fast-path items. Phase 0 verifiably complete except for Sage's hardware/account/personal items.
- **2026-05-21:** Phase 0 docs drafted. ADRs 0002–0010 + BUILD_PLAN v2.1 + VERIFICATION + INDEX + PRE_FLIGHT + SCHEMA_AMENDMENTS + OPS_CALENDAR + POST_V1_BACKLOG + SUCCESSION placeholder. Soak waived. Yolo signal received.
