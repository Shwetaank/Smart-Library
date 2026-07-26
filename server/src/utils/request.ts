import type { Request } from 'express-serve-static-core';
import type { AuthenticatedUser } from '../types/common.js';
import { AppError } from './appError.js';

export function getRequiredParam(req: Request, name: string): string {
  const value = req.params[name];
  const param = Array.isArray(value) ? value[0] : value;

  if (!param) {
    throw new AppError(`${name} is required`, 400);
  }

  return param;
}

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
  if (!req.user?.id) {
    throw new AppError('Authentication required', 401);
  }

  return {
    id: req.user.id,
    sub: req.user.sub,
    email: req.user.email ?? undefined,
    name: req.user.name ?? undefined,
    role: req.user.role,
  };
}
