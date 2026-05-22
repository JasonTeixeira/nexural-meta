# infra/repo-config/

Terraform module managing branch protection, required CI checks, and federation topic enforcement across every Nexural repo.

## When this runs

- **Manual:** Sage runs `terraform plan` + `apply` after creating any new warehouse repo.
- **Automated drift check:** `.github/workflows/repo-config.yml` runs weekly to detect drift between Terraform-declared config and actual GitHub state.

## Quick start

```bash
cd infra/repo-config
terraform init
terraform plan
terraform apply
```

## Required env

- `GITHUB_TOKEN` — PAT with `repo` + `admin:repo_hook` scope
- (default) `GH_OWNER=JasonTeixeira`

## What this enforces

Per `ARCHITECTURE.md §4.2`, every Nexural federation repo gets:

| Setting                          | Value                                                          | Source            |
| -------------------------------- | -------------------------------------------------------------- | ----------------- |
| Default branch                   | `main` (new) / `master` (legacy per ADR-0001)                  | ADR-0001          |
| Signed commits required          | yes                                                            | THREAT_MODEL §3.2 |
| Conversation resolution required | yes                                                            | quality           |
| Required CI checks               | typecheck, test, format, build, sbom-dry-run, sigstore-dry-run | ARCHITECTURE §10  |
| PR review required               | 0 reviewers (solo operator) but PR required                    | AI_HANDOFF #7     |
| Federation topic                 | exactly one of `nexural-factory` or `nexural-lifeops`          | ADR-0003          |
| Force-push                       | disabled                                                       | THREAT_MODEL      |
| Branch deletion                  | disabled on `main`                                             | THREAT_MODEL      |

## Drift detection

Terraform runs nightly in CI; any difference between declared state and actual GitHub state opens an issue. Per OPS_CALENDAR §3 monthly review, Sage triages drift.
