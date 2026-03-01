#!/bin/sh
# ByteBox - Docker entrypoint
# Made with ❤️ by Pink Pixel
#
# Runs database migrations then starts the Next.js production server.
# Migrations are idempotent — already-applied ones are skipped automatically.

set -e

echo ""
echo "  ╔══════════════════════════════╗"
echo "  ║        ByteBox               ║"
echo "  ║   Made with ♥ by Pink Pixel  ║"
echo "  ╚══════════════════════════════╝"
echo ""

# Apply any pending Prisma migrations (safe to run on every startup)
echo "[bytebox] Running database migrations..."
npx prisma migrate deploy
echo "[bytebox] Migrations complete."
echo ""

# Start the Next.js production server
echo "[bytebox] Starting server on port ${PORT:-3000}..."
exec node node_modules/next/dist/bin/next start \
  -p "${PORT:-3000}" \
  -H "${HOSTNAME:-0.0.0.0}"
