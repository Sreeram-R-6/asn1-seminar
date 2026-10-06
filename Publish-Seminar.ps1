param(
    [string]$RepositoryName = 'asn1-seminar'
)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Invoke-CheckedCommand {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Executable failed with exit code $LASTEXITCODE. Publication stopped."
    }
}

Get-Command git, gh -ErrorAction Stop | Out-Null
& gh auth status
if ($LASTEXITCODE -ne 0) {
    Invoke-CheckedCommand -Executable 'gh' -Arguments @('auth', 'login', '--hostname', 'github.com', '--web', '--git-protocol', 'https')
}

$accountLogin = (& gh api user --jq '.login').Trim()
if ($LASTEXITCODE -ne 0 -or -not $accountLogin) {
    throw 'Could not identify the signed-in GitHub account.'
}
if ($accountLogin -ne 'Sreeram-R-6') {
    throw "Signed in as $accountLogin. Sign in as Sreeram-R-6 before publishing this seminar."
}

$repositoryPath = (Get-Location).Path.Replace('\', '/')
$safeDirectories = @(& git config --global --get-all safe.directory 2>$null)
if ($safeDirectories -notcontains $repositoryPath) {
    Invoke-CheckedCommand -Executable 'git' -Arguments @('config', '--global', '--add', 'safe.directory', $repositoryPath)
}

if (-not (Test-Path -LiteralPath '.git')) {
    Invoke-CheckedCommand -Executable 'git' -Arguments @('init', '-b', 'main')
}
Invoke-CheckedCommand -Executable 'git' -Arguments @('add', '--all')
& git diff --cached --quiet
$stagedStatus = $LASTEXITCODE
if ($stagedStatus -eq 1) {
    Invoke-CheckedCommand -Executable 'git' -Arguments @('commit', '-m', 'Add ASN.1 interactive seminar website')
} elseif ($stagedStatus -ne 0) {
    throw 'Unable to inspect the staged files.'
}

$repositorySlug = "$accountLogin/$RepositoryName"
$remoteNames = @(& git remote)
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to inspect Git remotes.'
}
if ($remoteNames -contains 'origin') {
    $existingRemote = & git remote get-url origin
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to read the origin URL.'
    }
    if ($existingRemote -notmatch ('github\.com[:/]' + [regex]::Escape($repositorySlug) + '(\.git)?$')) {
        throw "Origin points to another repository: $existingRemote. Publication stopped."
    }
    $visibility = & gh repo view $repositorySlug --json visibility --jq '.visibility'
    if ($LASTEXITCODE -ne 0 -or $visibility -ne 'PUBLIC') {
        throw 'Existing target repository is unavailable or is not public.'
    }
    Invoke-CheckedCommand -Executable 'git' -Arguments @('push', '-u', 'origin', 'HEAD')
} else {
    Invoke-CheckedCommand -Executable 'gh' -Arguments @(
        'repo', 'create', $repositorySlug, '--public', '--source=.', '--remote=origin', '--push',
        '--description', 'Interactive ASN.1 seminar with fullscreen slides, diagrams and textbook problem answers'
    )
}

Invoke-CheckedCommand -Executable 'gh' -Arguments @('repo', 'view', $repositorySlug, '--json', 'url,visibility,defaultBranchRef')
Invoke-CheckedCommand -Executable 'git' -Arguments @('status', '-sb')
Write-Output "Published: https://github.com/$repositorySlug"
