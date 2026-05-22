# SUCCESSION.md

**Nexural Federation — Continuity, Succession & Dead-Man Protocol (v1.0)**
**Status:** Canonical. Changes require ADR + 30-day soak (these mistakes are uncatchable).
**Owner:** Sage
**Last reviewed:** 2026-05-20
**Decay rate:** 180 days
**Review trigger:** also reviewed on any major life event (marriage, child, address change, health diagnosis, employer change, will revision)

---

## 0. Purpose

Nexural will outlast some chapter of your life — possibly all of it. This document defines:

1. What happens during **temporary absence** (vacation, illness, sabbatical)
2. What happens during **prolonged absence** (>180 days of inactivity)
3. What happens upon **incapacitation** (you're alive but cannot operate)
4. What happens upon **death**
5. Who gets **which keys** and **which data** under each scenario
6. The **dead-man switch** mechanics
7. The **handoff package** that a successor receives

This document is meant to be readable by **someone who has never seen Nexural before**. Assume your successor has the technical capacity of a mid-level engineer but no context.

---

## 1. North Star

> **"If I disappear tomorrow, the system safely:**
>
> 1. **Continues serving me while I'm absent (it just ages)**
> 2. **Notifies a designated person if I'm gone long enough**
> 3. **Hands off cleanly — keys, data, decisions about disposition — without lawyers needing to guess"**

If any scenario in this doc would leave the system in an undefined state, **that's a P0 bug in this document.**

---

## 2. Principles

1. **Default to graceful degradation.** No absence breaks the system; things just go stale.
2. **No surprises for the successor.** They get a single document with everything they need.
3. **Disposition is your decision, not theirs.** You specify what to do with each warehouse: keep, open-source, transfer, or destroy.
4. **Keys hand off, not data.** The successor gets the ability to access; what they then do with the data is constrained by your written wishes.
5. **Confidentiality survives you.** Private-tier content has post-mortem confidentiality rules. People mentioned have a right to not be exposed.
6. **Test the plan.** A plan never rehearsed is a plan that won't work.

---

## 3. Roles

You name specific people in `nexural-meta/SUCCESSION_CONTACTS.yaml.age` (sops-encrypted; only decryptable by you + Shamir reconstruction). The roles defined are role-based; the people filling them can change.

| Role                         | What they do                                                              | Required qualities                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Primary Successor**        | First contact on dead-man trigger; coordinates everything below           | Tech-comfortable; trusts you and is trusted by you; outlives you statistically (younger or same age in good health) |
| **Technical Executor**       | Operates the technical handoff: keys, repos, services                     | Engineer or developer; comfortable with CLI; can follow runbooks                                                    |
| **Legal Executor**           | The person already named in your will/trust as executor                   | Established legally; coordinates with Primary Successor                                                             |
| **Shamir Share Holders (5)** | Each holds 1 of 5 Shamir shares; 3 must combine to reconstruct master key | Geographically distributed; mix of personal + institutional                                                         |
| **Privacy Guardian**         | Reviews any disclosure of private-tier content involving third parties    | Discreet; ideally a lawyer or therapist; can refuse disclosure                                                      |

These can be the same person filling multiple roles, but **at least 3 distinct people** should exist across roles (no single-point-of-trust).

**Template `SUCCESSION_CONTACTS.yaml.age` (decrypted form):**

```yaml
schema_version: 1
last_updated: 2026-05-20

primary_successor:
  name: <Name>
  relationship: <relation>
  email: <email>
  phone: <phone>
  address: <address>
  knows_about_nexural: true | false   # have they been told?
  consent_to_role: true | false       # have they agreed?
  last_confirmed: <date>

technical_executor:
  name: <Name>
  ...

legal_executor:
  name: <Name>
  firm: <firm>
  ...

shamir_holders:
  - share_id: 1
    holder: SELF
    location: Home fireproof safe, sealed envelope
    notes: Combination to safe in 1Password Emergency Kit
  - share_id: 2
    holder: SELF
    location: Safety deposit box, <bank>, <city>
    notes: Key in 1Password; second key with Legal Executor
  - share_id: 3
    holder: <Legal Executor Name>
    location: Held by firm, sealed envelope
    notes: Release on death cert + Primary Successor request
  - share_id: 4
    holder: <Family Member Name>
    location: Their fireproof safe
    notes: They know it's "important Nexural envelope, don't open unless contacted by Legal Executor"
  - share_id: 5
    holder: SELF
    location: Encrypted cloud bucket
    credentials: In 1Password under "Shamir Cloud Share"
    notes: Air-gapped from primary credentials; recovery via Legal Executor

privacy_guardian:
  name: <Name>
  role: <attorney | therapist | other>
  ...
```

**Update cadence:** every major life event AND at least annually. Drift here is silent and catastrophic.

---

## 4. Absence Tiers

### 4.1 Short absence (0–30 days)

**What happens:**

- Nothing structural. Nightly automations continue.
- Warehouses age normally; most won't hit decay yet
- `nx ask` for any agent continues to work (uses cloud LLM + cached content)

**What you should set up before:**

- Auto-reply on email
- If traveling: bring primary YubiKey on person, backup stays in safe
- Optional: pause Renovate auto-PRs to avoid coming back to merge conflicts

**No action required from anyone else.**

### 4.2 Extended absence (30–180 days)

**What happens:**

- Some warehouses cross 1× decay → STALE warnings on MCP responses
- Some content past 3× decay → auto-deprecated PRs accumulate (unmerged, waiting for you)
- Weekly digest emails accumulate
- LLM API spend continues (within monthly cap)

**Optional pre-positioning:**

- Set `NEXURAL_SABBATICAL_MODE=1` in nexural-meta — disables auto-deprecate and stretches decay rates 2× during absence
- Pause weekly digest emails
- Notify Primary Successor: "I'll be off-grid until X. If you don't hear from me by Y, follow SUCCESSION.md."

### 4.3 Prolonged absence (180+ days)

**Dead-man timer activates.** See §5.

### 4.4 Incapacitation (alive but cannot operate)

**Detection:** typically third party (family, hospital) contacts Primary Successor.

**Immediate actions by Primary Successor:**

1. Open `nexural-meta/docs/runbooks/INCAPACITATION.md` (a slim runbook; mirrors this doc)
2. Suspend LLM API spend cap (set `NEXURAL_LLM_PROVIDER=ollama` or hard-disable) to prevent runaway cost
3. Activate `SABBATICAL_MODE` to halt automatic deprecations
4. Notify Shamir holders to be on standby (do not yet reconstruct)
5. Wait at minimum 30 days before any irreversible action (rotation, transfer, public disclosure) — incapacitation may be reversible

**Reversibility:** if you recover, no permanent change has been made; you resume operation.

**If incapacitation becomes permanent:** transitions to §6 (Death) protocols with Legal Executor coordination.

---

## 5. Dead-Man Switch

### 5.1 Mechanism

A GitHub Actions cron runs in `nexural-meta`:

```yaml
# .github/workflows/dead-man.yml
on:
  schedule:
    - cron: "0 12 * * *" # daily at noon UTC
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm tsx scripts/dead-man-check.ts
```

The script:

1. Queries `gh api` for recent commits across all `nexural-*` and `*-warehouse` repos
2. Counts days since most recent commit by Sage (across all repos)
3. Compares against thresholds:
   - **120 days:** sends advance-warning email to Sage (multiple channels: primary email, recovery email, push notification)
   - **150 days:** sends second warning + notifies Primary Successor that the timer is approaching trigger
   - **180 days:** **DEAD-MAN TRIGGER FIRES** — see §5.2
4. Any commit by Sage (verified via signed commit) resets the counter to 0

### 5.2 What the trigger does

The dead-man trigger is **NOT** destructive. It does these things:

1. **Sends sealed notification** to Primary Successor with:
   - Statement: "Sage has not committed to Nexural in 180+ days."
   - Instructions: "If Sage is alive and well, please contact them and ask them to commit, which resets this. If Sage is unreachable, follow steps below."
   - A link/path to the **Handoff Package** (§7) — encrypted; key only obtainable via Shamir reconstruction
2. **Notifies Legal Executor** with similar message
3. **Notifies Shamir Share Holders** (excluding self-held shares) — message: "If contacted by Legal Executor and presented with valid documentation, release your share."
4. **Activates extended SABBATICAL_MODE** — disables all automated lifecycle changes
5. **Continues serving content** in read-only mode (no writes)
6. **Logs the event prominently** in nexural-meta with timestamp and notification recipients
7. **Triggers a 30-day cool-down** before any further action — gives time for false-alarm resolution (you come back from a coma, etc.)

### 5.3 Resetting the trigger

- **Single signed commit** to any nexural repo by Sage = reset
- **Manual override** by Primary Successor (if they confirm Sage is fine but offline): documented action that resets and adjusts timer
- **Trigger fired in error** (e.g., long offline retreat): can be reset by Sage upon return; incident logged for tuning

### 5.4 Tuning the thresholds

Default 180 days is appropriate for someone with no planned long absences. If you take regular sabbaticals or do long retreats, adjust thresholds in `dead-man-check.ts` and update this doc.

---

## 6. Death Protocol

The Legal Executor learns first (death certificate is legally available). They contact Primary Successor and Technical Executor.

### Phase 1: Confirmation (Day 0–7)

1. Legal Executor obtains death certificate
2. Notifies Primary Successor and Technical Executor in writing
3. Notifies Shamir Share Holders with formal request to convene
4. Activates a 30-day **STASIS** mode: no irreversible actions for 30 days minimum

### Phase 2: Shamir Reconstruction (Day 7–14)

1. Legal Executor coordinates Shamir holders
2. Minimum 3 of 5 shares are presented (in person or via secure channel — defined in CONTACTS file)
3. Technical Executor reconstructs the master age identity using `ssss-combine` or equivalent
4. Master identity is loaded onto a fresh YubiKey (the **Successor YubiKey**)
5. Master identity copy from reconstruction is securely destroyed (only Successor YubiKey persists)

### Phase 3: Access (Day 14–30)

1. Technical Executor uses Successor YubiKey to:
   - Decrypt `SUCCESSION_DISPOSITION.yaml.age` (a separate doc from CONTACTS) — see §7
   - Decrypt the Handoff Package
2. Technical Executor inventories all warehouses, services, accounts
3. Reviews the Disposition document — your written wishes per warehouse

### Phase 4: Disposition (Day 30+)

Per warehouse, per your written wishes:

- **Keep private** — Technical Executor takes possession, continues to maintain (or shuts down quietly)
- **Open-source** — Public-tier warehouses already open; internal ones may be designated for open-sourcing (cost, dx, etc.) — Technical Executor publishes
- **Transfer** — Specific warehouses transferred to specific named recipients (e.g., `finance-warehouse` → spouse, `architecture-warehouse` → favorite mentee)
- **Destroy** — Specifically marked warehouses are deleted from all locations:
  - GitHub repos deleted
  - B2 backups deleted (Backblaze provides API for this)
  - Local NAS backups deleted
  - All cloud caches purged
  - Cryptographic destruction (the age identity is destroyed; encrypted content becomes mathematically inaccessible even if backups persist anywhere)
- **Limited disclosure** — Sensitive content (network, health) is handled by the Privacy Guardian who decides what gets shared with whom (e.g., specific contacts notified individually, not en masse)

### Phase 5: Wind-Down (ongoing)

1. Cancel paid subscriptions (B2, 1Password, LLM APIs, domain)
2. Transfer or delete domains (nexural.dev)
3. Transfer or delete GitHub repos
4. Close associated email accounts after final forwarding
5. Final incident report filed by Technical Executor in a final commit to `nexural-meta` (a memorial commit, before archiving the repo itself)
6. Memorial: optional public note acknowledging the system existed and is now retired

---

## 7. The Handoff Package

The single document a successor receives. Located at `nexural-meta/docs/SUCCESSION_DISPOSITION.yaml.age` (sops-encrypted).

**Contents (decrypted form):**

```yaml
schema_version: 1
last_updated: 2026-05-20
prepared_by: Sage
final_message: |
  If you're reading this, follow the steps below. Take your time.
  Nothing on this list is urgent in the first 30 days.
  Thank you for handling this.

inventory:
  github_account: JasonTeixeira
  recovery_email: <email>
  password_manager: 1Password (account: <email>)
  password_manager_emergency_kit_location: Home safe, upper left compartment
  primary_yubikey_location: With me (on body / desk)
  backup_yubikey_location: Home safe
  domain_registrar: Cloudflare (login in 1Password)
  domains:
    - nexural.dev (renew or release annually)
  paid_services:
    - github_pro
    - 1password
    - backblaze_b2
    - resend
    - cloudflare
    - anthropic_api
    - openai_api (fallback)
  monthly_cost_estimate: ~$100–$180/mo
  cancellation_procedure: See PROCEDURES.md in this package

dispositions:
  # Tier 1: Public — already open source, low decision cost
  architecture-warehouse: open_source_keep_published
  runbook-warehouse: open_source_keep_published
  security-warehouse: open_source_keep_published
  prompt-warehouse: open_source_keep_published
  # ... (all public tier)

  # Tier 2: Internal — decide per warehouse
  cost-warehouse: destroy_after_30_days
  monetization-warehouse: destroy_after_30_days
  sales-warehouse: destroy_after_30_days
  growth-warehouse: open_source_after_sanitization
    sanitization_notes: |
      Remove all references to specific clients, employers, or prospects.
      Aggregate metrics OK to publish.
  vendor-warehouse: destroy_after_30_days
  interview-warehouse: destroy_after_30_days_with_candidate_notification
    notes: |
      If any candidate is mentioned by name, Privacy Guardian must notify
      them with option to receive their notes or request destruction.
  learning-warehouse: open_source_keep_published
  failure-warehouse: open_source_after_anonymization
  research-warehouse: transfer_to: <name>
  content-warehouse: destroy
  comms-warehouse: destroy
  mentoring-warehouse: privacy_guardian_handles_individually
    notes: |
      Each mentee has a right to their own notes. Privacy Guardian contacts
      each, offers their notes, then destroys all copies.

  # Tier 3: Private-encrypted — highest sensitivity
  decision-warehouse: destroy
  finance-warehouse: transfer_to: <spouse | trustee>
    notes: Important for estate planning continuity
  network-warehouse: destroy
    notes: |
      DO NOT share contact lists. People in here did not consent to being
      cataloged. Privacy Guardian to verify destruction.
  career-warehouse: destroy
  legal-warehouse: transfer_to: <legal_executor>
    notes: Relevant to estate; may be needed during probate
  health-warehouse: destroy_after_estate_settled
    notes: |
      May contain info relevant to family hereditary risks; Primary Successor
      may extract specific items (with Privacy Guardian approval) before destruction.

infrastructure:
  nexural-meta:
    disposition: archive_then_delete_after_180_days
    notes: |
      Keep public for 180 days as the "tombstone" — others may have referenced
      it. Then delete.
  nexural-qa-os:
    disposition: open_source_keep_published_indefinitely
    notes: Useful to the ecosystem. Designate maintainer if possible.
  '@nexural/* packages':
    disposition: deprecate_on_npm_keep_published
    notes: |
      Mark deprecated with pointer to any successor; do not unpublish
      (would break consumers).

what_to_tell_people:
  public_announcement: |
    Optional. Suggested wording:
    "Sage's Nexural Federation is being wound down. Public warehouses
    remain available for historical reference."
  do_not_announce:
    - Any private-tier warehouse names
    - Any specifics about decisions, finance, network, health
  who_to_individually_notify:
    - <list of contacts who had a working relationship with Nexural>

personal_message_to_successor: |
  [A personal note. Write this. Update it annually.]

operational_checklist_path: docs/runbooks/SUCCESSION_RUNBOOK.md
```

### The Runbook

`docs/runbooks/SUCCESSION_RUNBOOK.md` is a step-by-step checklist a competent engineer can follow:

```markdown
# Succession Runbook

## Prerequisites checked

- [ ] Death certificate obtained (Legal Executor)
- [ ] 30-day stasis period observed
- [ ] Shamir reconstruction complete (3+ shares combined)
- [ ] Successor YubiKey created

## Step 1: Access verification

- [ ] Decrypt SUCCESSION_DISPOSITION.yaml.age — works
- [ ] Decrypt sample private-tier file — works
- [ ] List all repos visible to GitHub account

## Step 2: Inventory

- [ ] All 32 warehouses present
- [ ] All paid services accessible
- [ ] B2 backup accessible

## Step 3: Per-warehouse disposition (use checklist generated by `nx succession-plan`)

- [ ] architecture-warehouse: <action>
- [ ] runbook-warehouse: <action>
- ... (all 32)

## Step 4: Notifications

- [ ] Privacy Guardian contacted for each "individually_notify" warehouse
- [ ] Public announcement made (if any)

## Step 5: Infrastructure

- [ ] @nexural/\* packages deprecated on npm
- [ ] nexural-meta archived
- [ ] nexural-qa-os maintainer designated (if applicable)

## Step 6: Service cancellations

- [ ] GitHub Pro: \_\_\_\_
- [ ] 1Password: \_\_\_\_
- [ ] B2: \_\_\_\_ (after final backup verification)
- [ ] Resend: \_\_\_\_
- [ ] Cloudflare: \_\_\_\_
- [ ] Anthropic/OpenAI: \_\_\_\_

## Step 7: Final commit

- [ ] Memorial commit to nexural-meta
- [ ] Archive nexural-meta on GitHub
- [ ] Document this succession run in <archive location>

## Step 8: Key destruction

- [ ] Successor YubiKey securely wiped after all dispositions complete
- [ ] Master age identity confirmed unrecoverable
- [ ] Notify Shamir holders that shares may now be destroyed (optional; they may keep for historical record)
```

---

## 8. Disposition Categories (vocabulary)

These are the canonical disposition labels used in SUCCESSION_DISPOSITION.yaml.age. Restrict to this list — ambiguity here is catastrophic.

| Label                                   | Meaning                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| `open_source_keep_published`            | Already public; remains public; no further action                                           |
| `open_source_after_sanitization`        | Currently internal; convert to public after removing sensitive details (notes specify what) |
| `open_source_after_anonymization`       | Same but specifically removing personal/identifying info                                    |
| `transfer_to: <recipient>`              | Repo (or specific content) transferred to named recipient                                   |
| `destroy`                               | Repo deleted from all locations; encrypted content cryptographically destroyed              |
| `destroy_after_30_days`                 | Allows brief review window for legal/personal reasons                                       |
| `destroy_after_estate_settled`          | Held until estate process complete, then destroyed                                          |
| `destroy_after_candidate_notification`  | (Specific to interview-warehouse) Notify each subject first                                 |
| `privacy_guardian_handles_individually` | No bulk action; Privacy Guardian decides per item                                           |
| `archive_then_delete_after_180_days`    | Keep as tombstone for ecosystem, then remove                                                |
| `deprecate_on_npm_keep_published`       | (Packages only) Mark deprecated, never unpublish                                            |
| `transfer_then_destroy_origin`          | Hand off, then ensure origin doesn't retain                                                 |

---

## 9. Confidentiality of Mentioned Third Parties

People mentioned in network-warehouse, mentoring-warehouse, comms-warehouse, etc. did not consent to being cataloged about. The system has obligations to them in your absence:

1. **No bulk export** of any content mentioning third parties
2. **Individual review** by Privacy Guardian for any disclosure
3. **Right to be told and right to be removed** — anyone mentioned has the right (via Privacy Guardian outreach) to receive what was written about them and to have it destroyed
4. **Statute of limitations** — after 5 years, sanitized aggregate insights (e.g., "I learned X from mentoring 20 people") may be published without individual notification, provided no person is identifiable

This isn't legal advice — it's ethical hygiene. Your Legal Executor coordinates with the Privacy Guardian on specifics.

---

## 10. The "Sage Returns" Edge Case

If you fire the dead-man trigger and then return alive and well:

1. Make a signed commit immediately (resets timer)
2. Notify Primary Successor and Legal Executor: "False alarm; I'm here."
3. Notify Shamir holders: "False alarm; please do not release shares."
4. **If Shamir was already reconstructed:** treat as a key compromise event. Rotate master identity. Generate new Shamir 5-of-5 split. Re-encrypt all private content. Re-distribute new shares.
5. File an incident in `nexural-meta/incidents/` documenting the cause (extended absence with no commits) and adjust dead-man thresholds if appropriate

This is unlikely but possible. Plan for it; it's better than the alternative (Shamir holders unsure whether to act).

---

## 11. Pre-Mortem Reflection

A practice, not a procedure. Annually (e.g., on January 1), spend 30 minutes reviewing this document with these questions:

1. **If I died tomorrow, would my Primary Successor know what to do?** (Test: send them a friendly check-in — "Still good to be my Primary Successor?")
2. **Are all named contacts still alive, reachable, and consenting?**
3. **Do all named contacts still know they're named, in general terms?** (You don't have to tell them specifics; you do have to confirm they accept the role.)
4. **Have any of my Shamir holders moved, died, or become unreliable?**
5. **Has my disposition wish for any warehouse changed?** (As life evolves, what you want destroyed/published changes.)
6. **Is the Disposition document current with the actual warehouse list?**
7. **Have I added warehouses without specifying dispositions?** (`nx audit --succession` flags any warehouse without a disposition)
8. **Have I rehearsed the runbook with anyone?** (Even reading through it with Technical Executor once is enormously valuable.)

Log the reflection in `nexural-meta/drills/succession-pre-mortem-YYYY.md`.

---

## 12. Drills

| Drill                         | Cadence                  | What                                                                                                                            |
| ----------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Contacts confirmation**     | Annual                   | Email each named contact; confirm reachability + role acceptance                                                                |
| **Shamir share verification** | Annual                   | Touch each share, confirm readable, location verified                                                                           |
| **Runbook walk-through**      | Annual                   | Read SUCCESSION_RUNBOOK.md aloud; identify any unclear steps                                                                    |
| **Dead-man dry run**          | Biennial                 | Simulate trigger without firing notifications; verify automation works                                                          |
| **Disposition review**        | Annual (with pre-mortem) | Verify SUCCESSION_DISPOSITION.yaml.age covers all current warehouses                                                            |
| **Full handoff simulation**   | Every 5 years            | With Technical Executor present: actually decrypt the package and walk through inventory access (use a non-destructive sandbox) |

Each drill produces a file in `nexural-meta/drills/succession/`.

---

## 13. Anti-Patterns

- ❌ **Not telling anyone you're naming them** — they need to consent and at least roughly know what's coming
- ❌ **Concentrating Shamir shares** (e.g., 3 of 5 with people in the same household) — defeats geographic distribution
- ❌ **Updating SUCCESSION_DISPOSITION less than annually** — new warehouses without dispositions = undefined behavior
- ❌ **Using a single recovery email for everything** — including for the dead-man notification chain
- ❌ **Writing this doc once and never reading it** — the most likely failure mode; calendar it
- ❌ **Treating the dead-man as morbid and avoiding it** — it's a kindness to future-you and your people
- ❌ **Naming people who don't get along as joint executors** — coordination failure during grief
- ❌ **Assuming GitHub will exist forever** — succession plan should work even if GitHub is gone (B2 + NAS backups + Shamir)
- ❌ **Storing the master key recoverably anywhere outside Shamir** — defeats the whole layered model

---

## 14. Why This Document Matters More Than the Others

A bug in ARCHITECTURE.md costs you a weekend.
A bug in THREAT_MODEL.md costs you a breach.
A bug in NAMING.md costs you mild irritation.
A bug in SCHEMA_CHARTER.md costs you a migration.
A bug in RETIREMENT.md costs you a zombie warehouse.

A bug here costs your people clarity when they need it most.

Treat this document accordingly.

---

## 15. Document Maintenance

- Review every **180 days**
- Also review on any major life event (see header)
- Changes require ADR + **30-day soak**
- Annual pre-mortem reflection is the canonical maintenance ritual

## CHANGELOG

- **2026-05-20** v1.0 — Initial canonical draft.
