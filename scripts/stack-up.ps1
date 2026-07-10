$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$ComposeFile = Join-Path $Root "infrastructure\docker\docker-compose.yml"
$EnvFile = Join-Path $Root "infrastructure\docker\.env"
$EnvExample = Join-Path $Root "infrastructure\docker\.env.example"

if (-not (Test-Path $EnvFile)) {
    Copy-Item $EnvExample $EnvFile
    Write-Host "Created $EnvFile from example"
}

Write-Host "Starting Earn4U stack..."
docker compose -f $ComposeFile --env-file $EnvFile up -d --build

Write-Host ""
Write-Host "Earn4U stack is starting. Services:"
Write-Host "  API:          http://localhost:3000/api/v1/health"
Write-Host "  Swagger:      http://localhost:3000/docs"
Write-Host "  Admin:        http://localhost:3001/dashboard"
Write-Host "  Mailpit:      http://localhost:8025"
Write-Host "  MinIO:        http://localhost:9001"
Write-Host "  Prometheus:   http://localhost:9090"
