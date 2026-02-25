# Halal Travels Backend - Prisma Setup Script
# Run this script to initialize the database

Write-Host "🚀 Initializing Halal Travels Backend with Prisma..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file. Please update with your credentials!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Required: Update DATABASE_URL in .env file" -ForegroundColor Red
    Write-Host "Example: DATABASE_URL='postgresql://user:password@host:5432/database'" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "Press Enter to continue (after updating .env) or Ctrl+C to exit"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host ""
Write-Host "⚙️  Generating Prisma Client..." -ForegroundColor Cyan
npm run prisma:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Push schema to database
Write-Host ""
Write-Host "📊 Pushing schema to database..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push schema. Check your DATABASE_URL in .env" -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host ""
$seed = Read-Host "Seed database with sample data? (y/N)"
if ($seed -eq "y" -or $seed -eq "Y") {
    Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
    npm run prisma:seed
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Seeding failed, but you can continue" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. npm run dev          - Start development server" -ForegroundColor Gray
Write-Host "  2. npm run prisma:studio - Open Prisma Studio (DB GUI)" -ForegroundColor Gray
Write-Host ""
Write-Host "Database Schema Overview:" -ForegroundColor Cyan
Write-Host "  ✅ Users table" -ForegroundColor Green
Write-Host "  ✅ FlightBooking (with sId, bId mandatory)" -ForegroundColor Green
Write-Host "  ✅ FlightPassenger (Almosafer schema)" -ForegroundColor Green
Write-Host "  ✅ HotelBooking (with sId, pId, bId)" -ForegroundColor Green
Write-Host "  ✅ HotelGuest (PersonalDetails schema)" -ForegroundColor Green
Write-Host "  ✅ PaymentTransaction" -ForegroundColor Green
Write-Host "  ✅ ApiLog" -ForegroundColor Green
Write-Host ""
