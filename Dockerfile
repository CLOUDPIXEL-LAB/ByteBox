# ByteBox - Docker Production Build
# Made with ❤️ by Pink Pixel
#
# Usage:
#   docker compose up --build        # Build and start
#   docker compose up -d             # Run in background
#   docker compose down              # Stop
#   docker compose down -v           # Stop and delete data volume

# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# Build tools required to compile better-sqlite3 native module
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Install all dependencies (dev + prod — both needed for the build)
COPY package*.json ./
RUN npm ci

# Copy source and config
COPY . .

# DATABASE_URL must be present for prisma.config.ts to load (dotenv/config).
# The value here is a placeholder — the real path is set in the runtime stage.
ENV DATABASE_URL="file:/data/bytebox.db"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate the Prisma client
RUN npx prisma generate

# Build Next.js for production
RUN node scripts/next-with-env.cjs build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/data/bytebox.db"
ENV PORT=1334
ENV HOSTNAME="0.0.0.0"

# Copy compiled node_modules from builder (includes native better-sqlite3 binary
# compiled for this exact Node version + OS — do not reinstall here)
COPY --from=builder /app/node_modules ./node_modules

# Built Next.js output
COPY --from=builder /app/.next ./.next

# Static assets and config files needed at runtime
COPY --from=builder /app/public        ./public
COPY --from=builder /app/package.json  ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tsconfig.json  ./tsconfig.json
COPY --from=builder /app/prisma         ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/scripts       ./scripts

# Persistent data directory for SQLite database
RUN mkdir -p /data
VOLUME ["/data"]

EXPOSE 1334

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
