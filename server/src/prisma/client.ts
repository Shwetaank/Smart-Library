import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { env } from '../config/env.js';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaStub(): PrismaClient {
  return new Proxy(
    {},
    {
      get(_target, prop: string | symbol) {
        if (prop === '$connect' || prop === '$disconnect' || prop === '$on' || prop === '$use') {
          return async () => undefined;
        }

        if (prop === '$transaction') {
          return async (operations: unknown) => {
            if (typeof operations === 'function') {
              return operations(createPrismaStub());
            }

            return Array.isArray(operations) ? Promise.all(operations) : undefined;
          };
        }

        return new Proxy(() => undefined, {
          apply: () => Promise.resolve(undefined),
          get: (innerTarget, innerProp) => {
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

const shouldUseStub = process.env.NODE_ENV === 'test' || process.env.PRISMA_SKIP_INIT === 'true';

export const prisma =
  globalForPrisma.prisma ??
  (shouldUseStub
    ? createPrismaStub()
    : new PrismaClient({
        adapter: new PrismaMssql(env.databaseUrl),
      }));

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
