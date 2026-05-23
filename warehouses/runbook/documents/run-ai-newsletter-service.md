# Run an AI Newsletter Service — Operating Runbook

> **Who this is for:** Solo operators or small agencies offering newsletter-as-a-service to clients. Covers everything from intake to invoice.

---

## Prerequisites

- Sending domain(s) warmed up (see `playbooks/set-up-email-deliverability.md`)
- Stack deployed: Resend + react-email + Listmonk OR Beehiiv account per client
- PostHog workspace set up for event tracking
- Brand voice prompt template drafted per client
- Linear workspace with newsletter project template
- Stripe setup for invoicing (or your preferred billing system)

---

## Phase 0 — Client Intake (Week 0)

### Intake Form (send via Typeform or Notion form)

Collect from the client before touching any tooling:

```
1. Publication name and tagline
2. Target audience (who reads this, in one sentence)
3. Send frequency (weekly / bi-weekly / monthly)
4. Newsletter goal (awareness / engagement / paid subs / lead gen)
5. Existing subscriber list? (CSV if yes, estimated size)
6. Competitor newsletters they admire (3–5 examples)
7. Topics to always include / always avoid
8. Brand guidelines (colors, fonts, logo — PDF or Figma link)
9. Content sources (Notion workspace, Google Drive folder, RSS feeds, URLs)
10. Approval chain (who approves drafts, what's the turnaround SLA)
11. Preferred send day and time
12. Do they want a paid subscriber tier? (Y/N)
```

### First Call (30 min)

- Walk through intake form answers
- Agree on scope: platforms, send frequency, number of sections per issue
- Set expectations on AI generation: "AI drafts, human edits, your approval before anything sends"
- Sign contract, collect first invoice payment before onboarding begins

---

## Phase 1 — Onboarding (Week 1–2)

### DNS and Deliverability Setup

1. Add client's sending domain to Resend (or Beehiiv custom domain)
2. Client implements DKIM, SPF, DMARC records (you provide the exact values)
3. Verify with MXToolbox (`tools/deliverability/mxtoolbox.md`)
4. Start warm-up via Mailwarm or Lemwarm
5. Set up Google Postmaster Tools (`tools/deliverability/google-postmaster-tools.md`) — requires client to verify domain in Google Search Console
6. Wait a minimum of 2 weeks before first real send if domain is new

### Subscriber List Import

1. Receive CSV from client
2. Run through NeverBounce or Emailable to remove invalid/risky addresses
3. Import cleaned list to Listmonk (or Beehiiv) with source tag
4. Set up double-opt-in flow for any new subscribers going forward

### Content Pipeline Setup

1. Create shared Notion database (or Google Drive folder) where client drops content briefs weekly
2. Set up Trigger.dev cron job to pull content on schedule (e.g., Monday 9AM)
3. Configure brand-voice system prompt using 3–5 sample issues provided by client
4. Test end-to-end with a draft issue: ingest → generate → react-email render → Mail-Tester check

### Linear Project Setup

- Create "Newsletter — [Client Name]" project
- Cycles = weekly/bi-weekly sends
- Issue template: `[YYYY-WW] Draft`, `[YYYY-WW] Review`, `[YYYY-WW] Approved`, `[YYYY-WW] Sent`

---

## Phase 2 — Weekly Operating Cadence (Ongoing)

### Monday: Content Pull + Draft Generation

- [ ] Cron job fires; content pulled from client source (automated)
- [ ] AI draft generated with brand-voice prompt
- [ ] Draft saved to Notion + posted as Linear issue in "Draft" status
- [ ] Email rendered via react-email; HTML file attached to Linear issue
- [ ] Mail-Tester score checked; must be ≥ 8.5/10 before review is requested
- [ ] Slack notification sent to `#newsletter-[client]` channel: "Draft ready for review"

### Tuesday/Wednesday: Client Review

- [ ] Client receives Slack notification with preview link and HTML preview
- [ ] SLA: 24-hour approval window (set in contract)
- [ ] If changes requested: update draft, re-render, re-test, notify client
- [ ] Client marks Linear issue "Approved" (or sends Slack approval emoji 👍)
- [ ] No "Approved" = no send. Check in if no response after 24h.

### Wednesday/Thursday: Pre-Send QA

- [ ] Verify DKIM/SPF/DMARC pass in Resend send test
- [ ] Check Google Postmaster Tools — domain reputation must be "High" or "Medium"
- [ ] If spam rate is trending up (> 0.05%), hold and investigate before sending
- [ ] Send internal test email to team inboxes (Gmail + Outlook) — verify visual rendering

### Thursday/Friday: Send

- [ ] Schedule send in Resend API or Beehiiv for agreed send time (e.g., Thursday 9AM client's timezone)
- [ ] Confirm send completed; monitor Resend dashboard for bounce/complaint spikes in first 30 min
- [ ] If bounce rate > 5% or complaint rate > 0.05% in first hour: pause campaign, investigate

### Monday (following week): Reporting Pull

- [ ] PostHog query: open rate, click rate, subscriber delta, unsubscribes, complaints
- [ ] Auto-generate weekly report (see report template below)
- [ ] Deliver report to client via email before 10AM

---

## Weekly Client Report Template

```
Subject: [Client Name] Newsletter Report — Week of [Date]

Hi [Name],

Here's your weekly newsletter performance summary:

DELIVERY
  Sent:           [number]
  Delivered:      [number] ([%])
  Bounced:        [number] ([%])

ENGAGEMENT
  Opens:          [number] ([%] open rate)
  Clicks:         [number] ([%] click rate)
  Unsubscribes:   [number] ([%])
  Complaints:     [number] ([%])

SUBSCRIBER GROWTH
  Start of week:  [number]
  New subs:       [number]
  Net change:     [+/-number]
  End of week:    [number]

DOMAIN HEALTH (Google Postmaster)
  Reputation:     [High / Medium / Low]
  Spam rate:      [%]

TOP PERFORMING LINK: [URL] — [clicks] clicks

NEXT ISSUE: Draft ready [date], send scheduled [date/time]

Questions? Reply here or grab time: [calendar link]

— [Your name]
```

---

## Phase 3 — Monthly Business Review

Schedule a 30-minute call with each client once per month:

- Review 30-day metrics trend (open rate, growth rate, revenue if paid tiers)
- Content strategy alignment: any topics to add/remove/emphasize
- Upcoming campaigns or special editions
- Renewal discussion if on a monthly contract

---

## Pricing Model (Reference)

| Tier        | Deliverables                                                         | Monthly Price |
| ----------- | -------------------------------------------------------------------- | ------------- |
| Starter     | 2 issues/mo, up to 5k subs, weekly report                            | $1,200/mo     |
| Standard    | 4 issues/mo, up to 25k subs, weekly report, strategy call            | $2,500/mo     |
| Growth      | 4 issues/mo, 25k+ subs, Beehiiv Boosts management, growth consulting | $4,500/mo     |
| White-label | Custom infrastructure, custom send domain, full tech ownership       | Custom        |

**Onboarding fee:** 1× monthly rate, covers weeks 1-2 setup (DNS, list cleaning, pipeline, brand voice prompt).

---

## Invoicing

- Invoice on 1st of month via Stripe (or Bonsai/Dubsado for freelancers)
- Net 7 terms; auto-suspend sends if payment is 14+ days overdue
- Onboarding fee collected before any work begins — non-refundable

---

## Escalation Scenarios

| Scenario                                               | Action                                                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Client approval not received 24h before scheduled send | Email + Slack reminder; if no response 2h before send, postpone send by 1 week                                                  |
| Spam complaint rate > 0.08%                            | Pause sends immediately; audit list for purchased/old contacts; remediate before resuming                                       |
| Gmail reputation drops to "Low"                        | Pause sends; consult deliverability playbook; do not resume until "Medium" restored                                             |
| AI draft quality poor (client flags)                   | Audit system prompt; add more few-shot examples from client's existing content; consider manual draft for next issue            |
| Client wants to cancel                                 | Export subscriber list (CSV) + all issue archives; provide to client within 24h of request; no data retention after offboarding |

---

## Tools Referenced

- `tools/newsletter/beehiiv.md` — newsletter platform
- `tools/newsletter/listmonk.md` — self-hosted list management
- `tools/email/resend.md` — delivery
- `tools/deliverability/google-postmaster-tools.md` — reputation monitoring
- `tools/deliverability/mxtoolbox.md` — DNS validation
- `tools/deliverability/mail-tester.md` — pre-send spam score
- `tools/deliverability/mailwarm.md` — inbox warm-up
- `stacks/ai-newsletter-saas.md` — full architecture reference
