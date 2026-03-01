#!/usr/bin/env bash
# ByteBox - First-time setup script
# Made with ❤️ by Pink Pixel
#
# Run this after cloning the repo:
#   bash scripts/setup.sh

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

log()  { echo -e "${CYAN}${BOLD}[setup]${RESET} $*"; }
ok()   { echo -e "${GREEN}  ✓ $*${RESET}"; }
warn() { echo -e "${YELLOW}  ⚠ $*${RESET}"; }
fail() { echo -e "${RED}  ✗ $*${RESET}"; exit 1; }

echo ""
echo -e "${BOLD}  ╔══════════════════════════════╗${RESET}"
echo -e "${BOLD}  ║   ByteBox - Setup Wizard     ║${RESET}"
echo -e "${BOLD}  ║   Made with ❤️  by Pink Pixel ║${RESET}"
echo -e "${BOLD}  ╚══════════════════════════════╝${RESET}"
echo ""

# ── 1. Node.js check ─────────────────────────────────────────────────────────
log "Checking Node.js..."
if ! command -v node &>/dev/null; then
  fail "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
fi
NODE_VER=$(node -e "process.stdout.write(process.version)")
ok "Node.js $NODE_VER found"

# ── 2. .env file ─────────────────────────────────────────────────────────────
log "Checking .env file..."
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    ok "Created .env from .env.example"
  else
    echo 'DATABASE_URL="file:./dev.db"' > .env
    ok "Created .env with default DATABASE_URL"
  fi
else
  ok ".env already exists"
fi

# ── 3. npm install ────────────────────────────────────────────────────────────
log "Installing dependencies..."
npm install
ok "Dependencies installed"

# ── 4. Prisma generate ───────────────────────────────────────────────────────
log "Generating Prisma client..."
npx prisma generate
ok "Prisma client generated"

# ── 5. Prisma migrations ─────────────────────────────────────────────────────
log "Running database migrations..."
npx prisma migrate deploy
ok "Database migrations applied"

# ── 6. Seed database ─────────────────────────────────────────────────────────
log "Seeding database with example data..."
npm run db:seed
ok "Database seeded"

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}  🎉 ByteBox is ready!${RESET}"
echo ""
echo -e "  Start the dev server with:  ${BOLD}npm run dev${RESET}"
echo ""
