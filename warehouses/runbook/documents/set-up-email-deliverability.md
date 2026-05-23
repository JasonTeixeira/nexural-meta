# Set Up Email Deliverability — Step-by-Step Runbook

> **Who this is for:** Developers and operators setting up a sending domain from scratch. Covers DKIM/SPF/DMARC, domain warm-up, reputation monitoring, and blacklist remediation.

---

## Prerequisites

- A dedicated sending domain (or subdomain) — ideally a subdomain of your main domain, e.g., `mail.yourdomain.com` or `send.clientdomain.com`
- Access to the domain's DNS settings (Cloudflare, Route53, GoDaddy, etc.)
- An email sending provider configured (Resend, Postmark, SendGrid, or Beehiiv custom domain)
- 4–6 weeks before first real campaign send

---

## Step 1 — DNS Authentication Setup

Authentication is mandatory before any warm-up or sending. A domain without DKIM/SPF/DMARC will be rejected or junk-filtered by modern mailbox providers.

### 1.1 — SPF Record

SPF (Sender Policy Framework) tells receiving servers which IPs are authorized to send email for your domain.

**Add a TXT record to your DNS:**

```
Name: @  (or your sending subdomain, e.g. mail)
Type: TXT
Value: v=spf1 include:[your-provider] ~all
```

Provider-specific SPF values:

- Resend: `include:spf.resend.com`
- Postmark: `include:spf.mtasv.net`
- SendGrid: `include:sendgrid.net`
- Beehiiv: check their domain settings panel

**Rules:**

- Use `~all` (softfail) not `-all` (hardfail) during initial setup; switch to `-all` once DMARC is enforced
- Keep SPF to ≤ 10 DNS lookups; each `include:` counts — hitting the limit silently breaks SPF
- If multiple services send on your behalf (e.g., Resend + HubSpot), combine in one record: `v=spf1 include:spf.resend.com include:_spf.hubspot.com ~all`

**Verify:** MXToolbox SPF checker (`tools/deliverability/mxtoolbox.md`) → should show "SPF record found" with no errors.

### 1.2 — DKIM Record

DKIM (DomainKeys Identified Mail) cryptographically signs outgoing email so receiving servers can verify it wasn't tampered with.

**How to get DKIM values:**

- Your sending provider generates a public/private key pair
- They give you a CNAME or TXT record to add to DNS
- Resend: Settings → Domains → Add domain → copy the DKIM CNAME record
- Postmark: Account Settings → Sender Signatures → copy DKIM TXT record

**Add the record provided by your provider to DNS.** It typically looks like:

```
Name: [selector]._domainkey.yourdomain.com  (CNAME) or
      [selector]._domainkey               (TXT)
Type: CNAME or TXT
Value: [provider-generated value]
```

**DNS propagation:** 15 minutes to 48 hours. Use MXToolbox DKIM lookup to verify.

### 1.3 — DMARC Record

DMARC (Domain-based Message Authentication, Reporting & Conformance) ties SPF and DKIM together and instructs receiving servers what to do with unauthenticated mail.

**Start with monitor-only policy (p=none):**

```
Name: _dmarc.yourdomain.com  (or _dmarc.mail.yourdomain.com for subdomain)
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; fo=1;
```

**Field explanation:**

- `p=none` — monitor only; take no action on failures (safe starting point)
- `rua=` — aggregate report destination (daily XML digest from every receiving server)
- `ruf=` — forensic report destination (individual failure reports)
- `fo=1` — send forensic report on any authentication failure (not just full failure)

**DMARC enforcement progression (4-week minimum between steps):**

| Week | Policy                  | Action                                                  |
| ---- | ----------------------- | ------------------------------------------------------- |
| 1–4  | `p=none`                | Monitor reports; identify all sending sources           |
| 5–8  | `p=quarantine; pct=25`  | Quarantine 25% of failing mail (test quarantine impact) |
| 9–12 | `p=quarantine; pct=100` | Quarantine all failing mail                             |
| 12+  | `p=reject`              | Reject all unauthenticated mail (maximum protection)    |

Do not rush to `p=reject` — if any legitimate service (CRM, helpdesk, marketing platform) sends on your domain without proper DKIM alignment, their mail will be rejected.

**Monitoring DMARC reports:** Use Valimail Monitor (free, `tools/deliverability/valimail.md`) or Postmark's free DMARC digest to parse aggregate XML reports into readable dashboards.

---

## Step 2 — Pre-Warm-Up Validation

Before starting warm-up, confirm:

```
[ ] SPF record present and valid (MXToolbox)
[ ] DKIM record verified by provider and MXToolbox
[ ] DMARC record set to p=none with rua= email configured
[ ] Mail-Tester score ≥ 8.5/10 with a test send
[ ] Google Postmaster Tools domain verified
[ ] Sending provider account in good standing (no pre-existing spam flags)
```

Do not proceed if any of these fail. Authentication issues don't go away with warm-up — they compound.

---

## Step 3 — Domain Warm-Up Schedule

Warm-up builds sender reputation by sending gradually increasing volume with high engagement signals. The goal is to teach Gmail/Outlook/Yahoo that your domain sends wanted mail.

### Volume Ramp (Daily Send Target)

| Day   | Daily Volume     | Notes                                                 |
| ----- | ---------------- | ----------------------------------------------------- |
| 1–3   | 50 emails/day    | Seed with your warmest contacts (people who know you) |
| 4–7   | 100 emails/day   | Continue with engaged list segments                   |
| 8–10  | 200 emails/day   | Monitor open rate; must stay > 25%                    |
| 11–14 | 350 emails/day   | Check Google Postmaster — reputation should appear    |
| 15–18 | 500 emails/day   | Maintain > 20% open rate                              |
| 19–21 | 750 emails/day   | If reputation is "High", can accelerate               |
| 22–25 | 1,000 emails/day | Standard newsletter volume reached                    |
| 26–28 | 2,000 emails/day | Full speed for most newsletters                       |

**For high-volume newsletters (10k+ per send):** Extend ramp to 6 weeks, not 4. Daily caps should approximate 10% of target send volume at the end of each week.

### Warm-Up Tool Options

- **Mailwarm** (`tools/deliverability/mailwarm.md`) — automates engagement with seed inbox network
- **Lemwarm** (`tools/deliverability/lemwarm.md`) — smart adaptive ramp, best for sales outreach domains
- **Warmbox** (`tools/deliverability/warmbox.md`) — manual cap control, cheapest entry point

**Important:** Warm-up tools add automated engagement but **do not replace** sending real emails to real subscribers. The best warm-up signal is organic opens and replies from actual humans on your list.

### Engagement During Warm-Up

- Send to your highest-engagement segment first (people who opted in recently, people who have replied to you before)
- Subject lines should be compelling — you need > 20% open rate during warm-up
- Ask subscribers to reply to the first email ("Hit reply and say hi") — replies are the strongest positive signal to mailbox providers
- Suppress re-sends to non-openers during warm-up; only send to engagers

---

## Step 4 — Ongoing Reputation Monitoring

### Weekly Checks (first 3 months)

- [ ] Google Postmaster Tools — check domain reputation (target: "High")
- [ ] Google Postmaster Tools — check spam rate (target: < 0.05%; alarm: > 0.08%)
- [ ] Resend/Postmark bounce dashboard — hard bounce rate should be < 2%
- [ ] Complaint rate — stay under 0.08%; Google mandates < 0.10% for bulk senders

### Monthly Checks (ongoing)

- [ ] MXToolbox blacklist check — verify not listed on any of the 100+ blacklists
- [ ] DMARC report review (via Valimail Monitor or Postmark DMARC digest)
- [ ] SPF record audit — has any new SaaS tool been added that sends email on your behalf?
- [ ] List hygiene — remove hard bounces immediately; suppress 6-month non-openers

---

## Step 5 — List Hygiene

Poor list quality is the most common cause of deliverability problems, regardless of authentication setup.

### Before First Send to Any Imported List

1. Run through email verification service (NeverBounce or Emailable)
2. Remove all hard bounces and risky addresses from the report
3. Segment by recency: contacts who haven't engaged in > 12 months are high-risk; warm up separately or suppress
4. Never purchase or rent email lists — this is a guaranteed path to blacklisting

### Ongoing Hygiene Rules

- Hard bounce → remove immediately, never retry
- Soft bounce → suppress after 3 consecutive soft bounces
- Unsubscribe → remove within 10 business days (legally required under CAN-SPAM; 3 days recommended)
- Non-openers (6+ months) → sunset campaign: "We miss you — confirm you want to stay"
- Spam complaint → remove immediately; never resend to complainers

---

## Step 6 — Blacklist Remediation

If your domain or IP appears on a blacklist:

1. **Identify:** MXToolbox Blacklist Check (`tools/deliverability/mxtoolbox.md`) — lists all blacklists where you appear
2. **Stop sending immediately** if you're on Spamhaus SBL, URIBL, or Barracuda — these affect delivery across major providers
3. **Investigate root cause** before requesting delisting:
   - Purchased list? Remove and never send to it again
   - Compromised account? Reset credentials, enable 2FA, rotate API keys
   - Content triggering spam filters? Use Mail-Tester to identify triggers
4. **Request delisting** — each blacklist has its own form; links provided by MXToolbox next to each listing
5. **Wait:** Most delistings process in 24–72 hours; some (Spamhaus) require evidence of remediation
6. **After delisting:** Do not resume at full volume — restart the warm-up ramp at week 2 levels

---

## Quick Reference: Red Lines

| Signal                | Threshold   | Action                                              |
| --------------------- | ----------- | --------------------------------------------------- |
| Gmail spam rate       | > 0.08%     | Stop sends immediately; audit list and content      |
| Gmail reputation      | Low or Bad  | Stop sends; investigate; do not resume until Medium |
| Hard bounce rate      | > 2%        | Pause; clean list before resuming                   |
| Complaint rate        | > 0.05%     | Review content and consent of recent opt-ins        |
| Blacklist (Spamhaus)  | Any listing | Stop immediately; remediate before any send         |
| DKIM/SPF failure rate | > 5%        | DNS misconfiguration; fix before sending            |

---

## Tools Referenced

- `tools/deliverability/mxtoolbox.md` — DNS and blacklist diagnostics
- `tools/deliverability/mail-tester.md` — pre-send spam scoring
- `tools/deliverability/google-postmaster-tools.md` — Gmail reputation monitoring
- `tools/deliverability/mailwarm.md` — inbox warm-up
- `tools/deliverability/lemwarm.md` — adaptive warm-up for outreach domains
- `tools/deliverability/warmbox.md` — manual-cap warm-up
- `tools/deliverability/glock-apps.md` — multi-provider inbox placement testing
- `tools/deliverability/valimail.md` — DMARC monitoring and enforcement
