param(
  [string]$ProjectName = "sage-client-intake-portal-staging",
  [string]$Region = "us-east-1",
  [string]$Size = "micro",
  [string]$Repo = "JasonTeixeira/nexural-meta"
)

$ErrorActionPreference = "Stop"

function ConvertFrom-SecureStringPlain {
  param([securestring]$Secure)
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

function New-DatabasePassword {
  $bytes = [byte[]]::new(30)
  [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  [Convert]::ToBase64String($bytes).Replace("+", "A").Replace("/", "b").Replace("=", "9")
}

function Invoke-SupabaseJson {
  param([string[]]$CliArgs)
  $output = & npx --yes supabase@latest @CliArgs -o json
  if ($LASTEXITCODE -ne 0) {
    throw "supabase $($CliArgs -join ' ') failed with exit $LASTEXITCODE"
  }
  ($output -join "`n") | ConvertFrom-Json
}

function Get-Items {
  param($Value, [string[]]$ContainerNames)
  if ($null -eq $Value) {
    return @()
  }
  if ($Value -is [array]) {
    return @($Value)
  }
  foreach ($name in $ContainerNames) {
    if ($null -ne $Value.$name) {
      return @($Value.$name)
    }
  }
  return @($Value)
}

function Get-Value {
  param($Object, [string[]]$Names)
  foreach ($name in $Names) {
    if ($null -ne $Object.$name -and "$($Object.$name)" -ne "") {
      return "$($Object.$name)"
    }
  }
  return $null
}

$privateDir = Join-Path (Get-Location) ".nexural/private"
New-Item -ItemType Directory -Force $privateDir | Out-Null
$logPath = Join-Path $privateDir "supabase-staging-setup.log"
Start-Transcript -Path $logPath -Force | Out-Null

try {
  Write-Host ""
  Write-Host "Opening Supabase access token page..."
  Start-Process "https://supabase.com/dashboard/account/tokens"
  Write-Host "Create a Personal Access Token with project/organization access."
  Write-Host "Paste it into this window. It will not be printed or committed."
  Write-Host ""

  $secureToken = Read-Host "Supabase access token" -AsSecureString
  $token = ConvertFrom-SecureStringPlain $secureToken
  if (-not $token) {
    throw "No Supabase token provided."
  }

  $oldSupabaseToken = $env:SUPABASE_ACCESS_TOKEN
  $env:SUPABASE_ACCESS_TOKEN = $token

  $orgs = @(Get-Items (Invoke-SupabaseJson -CliArgs @("orgs", "list")) @("organizations", "orgs"))
  if ($orgs.Count -eq 0) {
    throw "No Supabase organizations are available for this token."
  }

  $org = $orgs[0]
  if ($orgs.Count -gt 1) {
    Write-Host ""
    Write-Host "Available Supabase organizations:"
    for ($i = 0; $i -lt $orgs.Count; $i++) {
      $label = Get-Value $orgs[$i] @("name", "slug", "id")
      Write-Host "[$($i + 1)] $label"
    }
    $choice = Read-Host "Choose organization number"
    $index = [int]$choice - 1
    if ($index -lt 0 -or $index -ge $orgs.Count) {
      throw "Invalid organization selection."
    }
    $org = $orgs[$index]
  }

  $orgId = Get-Value $org @("id", "organization_id")
  $orgName = Get-Value $org @("name", "slug", "id")
  if (-not $orgId) {
    throw "Could not determine organization id."
  }

  Write-Host ""
  Write-Host "Using organization: $orgName"
  $projects = @(Get-Items (Invoke-SupabaseJson -CliArgs @("projects", "list")) @("projects"))
  $project = $projects | Where-Object { $_.name -eq $ProjectName } | Select-Object -First 1
  $dbPassword = $null

  if (-not $project) {
    $dbPassword = New-DatabasePassword
    Write-Host "Creating Supabase project: $ProjectName"
    $project = Invoke-SupabaseJson -CliArgs @(
      "projects",
      "create",
      $ProjectName,
      "--org-id",
      $orgId,
      "--db-password",
      $dbPassword,
      "--region",
      $Region,
      "--size",
      $Size
    )
  } else {
    Write-Host "Using existing Supabase project: $ProjectName"
  }

  $projectRef = Get-Value $project @("ref", "id")
  if (-not $projectRef) {
    Write-Host "Waiting for project to appear in project list..."
    for ($attempt = 1; $attempt -le 30; $attempt++) {
      Start-Sleep -Seconds 10
      $projects = @(Get-Items (Invoke-SupabaseJson -CliArgs @("projects", "list")) @("projects"))
      $project = $projects | Where-Object { $_.name -eq $ProjectName } | Select-Object -First 1
      $projectRef = Get-Value $project @("ref", "id")
      if ($projectRef) { break }
    }
  }
  if (-not $projectRef) {
    throw "Could not determine project ref for $ProjectName."
  }

  Write-Host "Project ref: $projectRef"
  Write-Host "Waiting for API keys..."
  $keys = @()
  for ($attempt = 1; $attempt -le 30; $attempt++) {
    try {
      $keys = @(Get-Items (Invoke-SupabaseJson -CliArgs @("projects", "api-keys", "--project-ref", $projectRef)) @("api_keys", "keys"))
      if ($keys.Count -gt 0) { break }
    } catch {
      Start-Sleep -Seconds 10
    }
  }

  $anon = $keys | Where-Object {
    "$($_.name) $($_.type)" -match "anon|publishable"
  } | Select-Object -First 1
  $service = $keys | Where-Object {
    "$($_.name) $($_.type)" -match "service"
  } | Select-Object -First 1

  $anonKey = Get-Value $anon @("api_key", "key", "value")
  $serviceKey = Get-Value $service @("api_key", "key", "value")
  if (-not $anonKey -or -not $serviceKey) {
    throw "Could not locate anon and service role API keys."
  }

  $projectUrl = "https://$projectRef.supabase.co"
  gh secret set NEXT_PUBLIC_SUPABASE_URL --repo $Repo --body $projectUrl | Out-Null
  gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --repo $Repo --body $anonKey | Out-Null
  gh secret set SUPABASE_SERVICE_ROLE_KEY --repo $Repo --body $serviceKey | Out-Null

  [pscustomobject]@{
    project_name = $ProjectName
    project_ref = $projectRef
    project_url = $projectUrl
    organization = $orgName
    region = $Region
    github_repo = $Repo
    secrets_written = @(
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY"
    )
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
  } | ConvertTo-Json -Depth 4 | Set-Content -Encoding utf8 (Join-Path $privateDir "supabase-staging.json")

  Write-Host ""
  Write-Host "Supabase staging is configured."
  Write-Host "Project URL: $projectUrl"
  Write-Host "GitHub secrets were written to $Repo."

  if ($dbPassword) {
    Write-Host "A new DB password was generated and used for project creation."
    Write-Host "It was not saved. Reset it from Supabase if you need direct DB access later."
  }
} finally {
  $env:SUPABASE_ACCESS_TOKEN = $oldSupabaseToken
  if ($token) {
    $token = $null
  }
  Stop-Transcript | Out-Null
}
