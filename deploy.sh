#!/bin/bash
# =============================================================================
# Halal Travels — Server Deployment Script
# Usage: bash deploy.sh
# Run from the root of the cloned repo: /path/to/halal-travels/
# =============================================================================

set -e  # Exit immediately on any error

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✔] $1${NC}"; }
warn() { echo -e "${YELLOW}[!] $1${NC}"; }
fail() { echo -e "${RED}[✘] $1${NC}"; exit 1; }

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$REPO_DIR/backend"
FRONTEND_DIR="$REPO_DIR/frontend"

# =============================================================================
# 1. Install Node.js 20 (if not already installed)
# =============================================================================
if ! command -v node &>/dev/null; then
  log "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
else
  log "Node.js already installed: $(node -v)"
fi

# =============================================================================
# 2. Install PM2 globally (if not already installed)
# =============================================================================
if ! command -v pm2 &>/dev/null; then
  log "Installing PM2..."
  sudo npm install -g pm2
else
  log "PM2 already installed: $(pm2 -v)"
fi

# =============================================================================
# 3. Backend setup
# =============================================================================
log "Setting up backend..."
cd "$BACKEND_DIR"

# .env check
if [ ! -f .env ]; then
  warn ".env not found in backend/. Creating from template..."
  cat > .env <<'EOF'
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?connect_timeout=15"
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
ODIS_API_URL="https://api-sandbox.discoversaudi.sa"
ODIS_USERNAME=""
ODIS_PASSWORD=""
CCAVENUE_MERCHANT_ID=""
CCAVENUE_ACCESS_CODE=""
CCAVENUE_WORKING_KEY=""
CCAVENUE_REDIRECT_URL="https://halal.athryan.com/api/payments/callback"
CCAVENUE_CANCEL_URL="https://halal.athryan.com/payment/failed"
ALLOWED_ORIGINS="https://halal.athryan.com"
MOCK_FLIGHTS=false
PORT=5000
NODE_ENV=production
JWT_SECRET="CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"
FRONTEND_URL="https://halal.athryan.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
ADMIN_EMAIL=""
EOF
  warn "⚠️  backend/.env created with placeholders. Fill it in before continuing."
  warn "    nano $BACKEND_DIR/.env"
  echo ""
  read -p "Press ENTER once you have filled in backend/.env to continue..."
fi

npm install
log "Generating Prisma client..."
npx prisma generate
log "Running Prisma migrations..."
npx prisma migrate deploy
log "Building backend TypeScript..."
npm run build

# =============================================================================
# 4. Frontend setup
# =============================================================================
log "Setting up frontend..."
cd "$FRONTEND_DIR"

if [ ! -f .env.local ]; then
  warn ".env.local not found in frontend/. Creating from template..."
  cat > .env.local <<'EOF'
NEXT_PUBLIC_API_URL=https://halal.athryan.com/api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
EOF
  warn "⚠️  frontend/.env.local created with placeholders. Fill it in before continuing."
  warn "    nano $FRONTEND_DIR/.env.local"
  echo ""
  read -p "Press ENTER once you have filled in frontend/.env.local to continue..."
fi

npm install
log "Building frontend (Next.js)..."
npm run build

# =============================================================================
# 5. Start / restart with PM2
# =============================================================================
log "Starting services with PM2..."

# Stop existing instances if running (ignore error if they don't exist yet)
pm2 delete halal-backend  2>/dev/null || true
pm2 delete halal-frontend 2>/dev/null || true

cd "$BACKEND_DIR"
pm2 start dist/server.js --name halal-backend

cd "$FRONTEND_DIR"
pm2 start "npm start -- -p 3000" --name halal-frontend

pm2 save

# =============================================================================
# 6. PM2 startup (so services survive reboots)
# =============================================================================
warn "Run the command below to make PM2 start on server reboot:"
echo ""
pm2 startup | tail -1
echo ""

# =============================================================================
# Done
# =============================================================================
log "Deployment complete!"
echo ""
echo "  Backend  → http://localhost:5000  (https://halal.athryan.com/api)"
echo "  Frontend → http://localhost:3000  (https://halal.athryan.com)"
echo ""
echo "  Point your Nginx reverse proxy:"
echo "    /     → http://localhost:3000        (Next.js frontend)"
echo "    /api/ → http://localhost:5000/api/   (Express backend)"
echo ""
echo "  Check logs:  pm2 logs"
echo "  Status:      pm2 status"
