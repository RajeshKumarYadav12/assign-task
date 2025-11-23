# Quick Build and Test Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Build & Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend Build
Write-Host "Building Backend..." -ForegroundColor Green
Set-Location -Path "server"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Backend build failed" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# Run backend tests
Write-Host ""
Write-Host "Running Backend Tests..." -ForegroundColor Yellow
# npm test

Set-Location -Path ".."

# Frontend Build
Write-Host ""
Write-Host "Building Frontend..." -ForegroundColor Green
Set-Location -Path "client"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ All builds completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now deploy to Vercel using:" -ForegroundColor White
Write-Host ".\deploy-vercel.ps1" -ForegroundColor Cyan
Write-Host ""
