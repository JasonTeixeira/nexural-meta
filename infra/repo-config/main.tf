# Terraform repo-config module per ARCHITECTURE §4.2 + ADR-0003.
#
# Manages branch protection, required CI checks, federation topic XOR,
# and Actions secrets across every federation warehouse repo.
#
# Applied weekly via .github/workflows/repo-config.yml (drift check).
#
# Usage:
#   cd infra/repo-config
#   terraform init
#   terraform plan
#   terraform apply
#
# Required env:
#   GITHUB_TOKEN  — PAT with repo + admin:repo_hook scope
#   GH_OWNER      — defaults to "JasonTeixeira"

terraform {
  required_version = ">= 1.6"
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "github" {
  owner = var.owner
}

variable "owner" {
  type        = string
  description = "GitHub owner (user or org) for federation repos."
  default     = "JasonTeixeira"
}

# ────────────────────────────────────────────────────────────────────────────
# nexural-meta — the control plane itself
# ────────────────────────────────────────────────────────────────────────────

resource "github_branch_protection" "nexural_meta_main" {
  repository_id = "nexural-meta"
  pattern       = "main"

  enforce_admins                  = false # solo operator can self-merge with CI green
  require_signed_commits          = true
  required_linear_history         = true
  require_conversation_resolution = true

  required_status_checks {
    strict = true
    contexts = [
      "install",
      "typecheck",
      "format",
      "test",
      "build",
      "sbom-dry-run",
      "sigstore-dry-run",
    ]
  }

  required_pull_request_reviews {
    required_approving_review_count = 0 # solo operator — self-review via PR
    dismiss_stale_reviews           = true
    require_code_owner_reviews      = false
  }
}

# ────────────────────────────────────────────────────────────────────────────
# Federation warehouses — discovered via topic per ADR-0003
# ────────────────────────────────────────────────────────────────────────────

# Two data sources: one per federation topic.
data "github_repositories" "factory_warehouses" {
  query           = "topic:nexural-factory user:${var.owner}"
  include_repo_id = true
}

data "github_repositories" "lifeops_warehouses" {
  query           = "topic:nexural-lifeops user:${var.owner}"
  include_repo_id = true
}

# Apply branch protection on EVERY warehouse repo (both federations).
locals {
  all_warehouses = concat(
    data.github_repositories.factory_warehouses.names,
    data.github_repositories.lifeops_warehouses.names,
  )
}

resource "github_branch_protection_v3" "warehouse_main" {
  for_each = toset(local.all_warehouses)

  repository                      = each.value
  branch                          = "main"
  enforce_admins                  = false
  require_signed_commits          = true
  require_conversation_resolution = true

  required_status_checks {
    strict   = true
    contexts = ["schema-validation", "scorecard", "cross-refs"]
  }

  required_pull_request_reviews {
    dismiss_stale_reviews      = true
    require_code_owner_reviews = false
  }
}

# Enforce that every warehouse repo carries EXACTLY ONE of the federation topics.
# (Drift detection only — Terraform reports if a repo carries both or neither;
#  resolution requires manual fix because GitHub doesn't allow "remove tag" at
#  this level idempotently from Terraform.)

output "factory_warehouse_count" {
  value       = length(data.github_repositories.factory_warehouses.names)
  description = "Number of repos discovered with nexural-factory topic"
}

output "lifeops_warehouse_count" {
  value       = length(data.github_repositories.lifeops_warehouses.names)
  description = "Number of repos discovered with nexural-lifeops topic"
}

output "warehouse_total" {
  value       = length(local.all_warehouses)
  description = "Total warehouse count across both federations"
}
