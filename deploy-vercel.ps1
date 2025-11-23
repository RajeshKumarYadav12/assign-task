# Quick Deployment Script for Vercel
# Run this script to deploy both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Vercel Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✓ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✓ Vercel CLI already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Select Deployment Option:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Deploy Backend Only" -ForegroundColor White
Write-Host "2. Deploy Frontend Only" -ForegroundColor White
Write-Host "3. Deploy Both (Backend first, then Frontend)" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying Backend..." -ForegroundColor Green
        Set-Location -Path "server"
        vercel --prod
        Set-Location -Path ".."
        Write-Host ""
        Write-Host "✓ Backend deployment complete!" -ForegroundColor Green
        Write-Host "Don't forget to set environment variables in Vercel Dashboard!" -ForegroundColor Yellow
    }
    "2" {
        Write-Host ""
        Write-Host "Deploying Frontend..." -ForegroundColor Green
        Set-Location -Path "client"
        vercel --prod
        Set-Location -Path ".."
        Write-Host ""
        Write-Host "✓ Frontend deployment complete!" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "Step 1: Deploying Backend..." -ForegroundColor Green
        Set-Location -Path "server"
        vercel --prod
        Set-Location -Path ".."
        Write-Host ""
        Write-Host "✓ Backend deployed!" -ForegroundColor Green
        Write-Host ""
        $backendUrl = Read-Host "Enter your backend Vercel URL (e.g., https://your-api.vercel.app)"
        
        Write-Host ""
        Write-Host "Step 2: Updating frontend environment..." -ForegroundColor Yellow
        $envContent = "VITE_API_URL=$backendUrl/api/v1"
        Set-Content -Path "client\.env.production" -Value $envContent
        Write-Host "✓ Frontend environment updated" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Step 3: Deploying Frontend..." -ForegroundColor Green
        Set-Location -Path "client"
        vercel --prod
        Set-Location -Path ".."
        Write-Host ""
        Write-Host "✓ Frontend deployed!" -ForegroundColor Green
        Write-Host ""
        $frontendUrl = Read-Host "Enter your frontend Vercel URL (e.g., https://your-app.vercel.app)"
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "IMPORTANT: Update Backend CORS" -ForegroundColor Yellow
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Go to Vercel Dashboard → Backend Project → Settings → Environment Variables" -ForegroundColor White
        Write-Host "Update CLIENT_URL to: $frontendUrl" -ForegroundColor White
        Write-Host "Then redeploy the backend!" -ForegroundColor Yellow
        Write-Host ""
    }
    "4" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Set up MongoDB Atlas (if not done)" -ForegroundColor White
Write-Host "2. Configure environment variables in Vercel Dashboard" -ForegroundColor White
Write-Host "3. Test your deployed application" -ForegroundColor White
Write-Host "4. Update README.md with deployment URLs" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
