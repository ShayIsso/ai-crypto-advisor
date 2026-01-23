import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * 
 * This pattern ensures we only have one Prisma Client instance
 * throughout the application lifecycle, which is important for:
 * 
 * 1. Connection pooling - Avoid exhausting database connections
 * 2. Performance - Reuse existing connections
 * 3. Development - Prevent hot-reload from creating multiple instances
 */

// Add prisma to the global type to prevent TypeScript errors
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use existing instance if available (hot reload in dev), otherwise create new one
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Store instance globally in development to survive hot reloads
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Usage in other files:
 * 
 * import { prisma } from '../lib/prisma';
 * 
 * const users = await prisma.user.findMany();
 */
