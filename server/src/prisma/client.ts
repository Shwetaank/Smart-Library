import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { env } from '../config/env.js';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Create a mock Prisma client for testing
function createPrismaStub(): PrismaClient {
  return new Proxy(
    {},
    {
      get(_target, prop: string | symbol) {
        // Mock Prisma lifecycle methods
        if (prop === '$connect' || prop === '$disconnect' || prop === '$on' || prop === '$use') {
          return async () => undefined;
        }

        // Mock Prisma transactions
        if (prop === '$transaction') {
          return async (operations: unknown) => {
            if (typeof operations === 'function') {
              return operations(createPrismaStub());
            }

            return Array.isArray(operations) ? Promise.all(operations) : undefined;
          };
        }

        // Mock all model operations
        return new Proxy(() => undefined, {
          apply: () => Promise.resolve(undefined),
          get: (_innerTarget, innerProp) => {
            if (innerProp === 'then') {
              return undefined;
            }
            return innerProp;
          },
        });
      },
    },
  ) as PrismaClient;
}

// Use the stub client during tests
const shouldUseStub = process.env.NODE_ENV === 'test' || process.env.PRISMA_SKIP_INIT === 'true';

// Create or reuse the Prisma client
export const prisma =
  globalForPrisma.prisma ??
  (shouldUseStub
    ? createPrismaStub()
    : new PrismaClient({
        adapter: new PrismaMssql(env.databaseUrl),
      }));

// Cache the Prisma client in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}