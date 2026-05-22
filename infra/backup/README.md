# infra/backup/

B2 + NAS backup configuration per THREAT_MODEL §3.7 (3-2-1 rule).

## Layers

| Layer             | Target                   | Cadence           | Tool                 |
| ----------------- | ------------------------ | ----------------- | -------------------- |
| 1 — GitHub origin | All repos                | real-time         | `git push`           |
| 2 — Backblaze B2  | All repos                | nightly 05:00 UTC | `rclone` via GHA     |
| 3 — Local NAS     | Private + internal tiers | weekly Sunday     | `rclone` from laptop |

## B2 buckets (per ADR-0009 §1.8 cost split)

- `nexural-public-backup` — public-tier git mirrors (free)
- `nexural-private-backup` — internal + private-tier git mirrors (encrypted at file level)
- `nexural-audit` — audit logs with ISOLATED credentials (separate B2 app key)
- `nexural-apps` — forged app backups per ADR-0010 §3.9

## Setup (one-time, Sage's hands)

1. Create the 4 buckets at https://secure.backblaze.com/b2_buckets.htm
2. Create separate B2 application keys per bucket (principle of least privilege)
3. Store all 8 values (account ID + app key per bucket) in 1Password vault `Nexural`
4. Set GitHub Actions secrets for each:

```bash
gh secret set B2_PUBLIC_ACCOUNT --repo JasonTeixeira/nexural-meta
gh secret set B2_PUBLIC_KEY     --repo JasonTeixeira/nexural-meta
gh secret set B2_PRIVATE_ACCOUNT --repo JasonTeixeira/nexural-meta
gh secret set B2_PRIVATE_KEY     --repo JasonTeixeira/nexural-meta
gh secret set B2_AUDIT_ACCOUNT --repo JasonTeixeira/nexural-meta
gh secret set B2_AUDIT_KEY     --repo JasonTeixeira/nexural-meta
gh secret set B2_APPS_ACCOUNT --repo JasonTeixeira/nexural-meta
gh secret set B2_APPS_KEY     --repo JasonTeixeira/nexural-meta
```

Backups don't fire until these secrets exist. The workflow gracefully no-ops if missing.

## Local NAS (weekly Sunday)

Configure manually in `~/.config/rclone/rclone.conf` and run:

```bash
rclone sync ~/code/nexural/ nas:nexural/ --filter-from infra/backup/nas-filter.txt
```

## Restore drill

Monthly per OPS_CALENDAR §3:

```bash
# Pick a random warehouse
rclone copy b2-public:nexural-public-backup/architecture-warehouse/ /tmp/restore-test/
# Verify hash matches GitHub
```

## Annual cross-region check (POST_V1_BACKLOG §3.5)

Currently single-region B2. v1.1+ adds cross-region replication or S3 Glacier as tertiary.
