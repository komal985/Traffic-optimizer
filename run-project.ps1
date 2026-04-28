param(
    [switch]$SkipInstall,
    [switch]$WithDatabase
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "Backend"
$frontendDir = Join-Path $projectRoot "Frontend"

function Write-Step {
    param([string]$Message)
    Write-Host "[run-project] $Message" -ForegroundColor Cyan
}

function Test-Command {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Start-Database {
    if (-not (Test-Command "docker")) {
        Write-Warning "Docker not found. Skipping database startup."
        return $false
    }

    Write-Step "Starting MongoDB (Docker Compose)..."
    $composeFile = Join-Path $projectRoot "docker-compose.yml"
    if (-not (Test-Path $composeFile)) {
        Write-Warning "docker-compose.yml not found. Skipping database startup."
        return $false
    }

    # Prefer modern 'docker compose', fall back to 'docker-compose' if available.
    try {
        docker compose -f "$composeFile" up -d | Out-Host
    } catch {
        if (Test-Command "docker-compose") {
            docker-compose -f "$composeFile" up -d | Out-Host
        } else {
            throw
        }
    }

    return $true
}

if (-not (Test-Path $backendDir) -or -not (Test-Path $frontendDir)) {
    throw "Backend or Frontend directory not found. Run this script from project root."
}

if (-not (Test-Command "npm")) {
    throw "npm is not installed or not available in PATH."
}

if (-not $SkipInstall) {
    Write-Step "Installing backend Node dependencies..."
    npm install --legacy-peer-deps --ignore-scripts --prefix "$backendDir"

    if (Test-Command "py") {
        Write-Step "Installing backend Python dependencies..."
        py -3 -m pip install -r (Join-Path $backendDir "requirements.txt")
    } else {
        Write-Warning "Python launcher (py) not found. Backend may fail if Python packages are required."
    }

    Write-Step "Installing frontend Node dependencies..."
    npm install --legacy-peer-deps --prefix "$frontendDir"
} else {
    Write-Step "Skipping dependency installation."
}

$dbStarted = $false
if ($WithDatabase) {
    $dbStarted = Start-Database
}

Write-Step "Starting backend in a new terminal..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendDir'; npm start"
)

Write-Step "Starting frontend in a new terminal..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$frontendDir'; npm run dev"
)

Write-Host ""
Write-Host "Project launch complete." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend:  http://localhost:3000" -ForegroundColor Green
if ($WithDatabase -and $dbStarted) {
    Write-Host "Database: MongoDB on localhost:27017 (Docker)" -ForegroundColor Green
} else {
    Write-Host "Database: MongoDB required (install MongoDB or Docker Desktop)" -ForegroundColor Yellow
}
