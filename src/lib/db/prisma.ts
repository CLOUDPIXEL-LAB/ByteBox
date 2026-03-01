/**
 * ByteBox - Prisma Client Singleton
 * Made with ❤️ by Pink Pixel
 */

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'node:path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Strip the "file:" prefix Prisma uses in connection strings.
  // DATABASE_URL="file:./dev.db"  → "./dev.db"
  // DATABASE_URL="file:/data/..."  → "/data/..."
  const rawUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
  let dbPath = rawUrl.startsWith('file:') ? rawUrl.slice('file:'.length) : rawUrl;

  // Resolve relative paths from the project root (cwd)
  if (dbPath.startsWith('./') || dbPath.startsWith('../')) {
    dbPath = path.resolve(process.cwd(), dbPath);
  }
  
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
