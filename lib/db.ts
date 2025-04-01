/**
 * Database client configuration and type exports
 */
import { PrismaClient } from '@prisma/client';

/**
 * Type definition for global Prisma instance
 */
interface GlobalWithPrisma {
  prisma: PrismaClient | undefined;
}

// Create a properly typed global object for Prisma singleton
const globalForPrisma = globalThis as unknown as GlobalWithPrisma;

/**
 * Prisma client singleton to prevent multiple instances during hot reloading
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Save the instance to the global object in non-production environments
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-export types from Prisma schema
// export { TaskPriority, TaskStatus, IconName } from '@prisma/client';
// export type { Prisma, Task, Label } from '@prisma/client';
export * from '@prisma/client';
