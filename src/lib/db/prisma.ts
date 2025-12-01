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
  // Get the database path from env, removing 'file:' prefix if present
  // Default to bytebox.db in data directory for production-like setup
  let dbPath = process.env.DATABASE_URL?.replace('file:', '') || './data/bytebox.db';
  
  // If it's a relative path, resolve it from the project root
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
