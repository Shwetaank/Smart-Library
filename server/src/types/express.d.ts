import type { DependencyContainer } from 'tsyringe';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      sub: string;
      email?: string | null;
      name?: string | null;
      role?: string;
    };
    container: DependencyContainer;
  }
}
