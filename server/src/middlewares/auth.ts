import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { Roles } from '../constants/roles.js';
import { container } from 'tsyringe';
import { AuthService } from '../services/auth.service.js';
import { AppError } from '../utils/appError.js';

// Verify the user's authentication token
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    next(new AppError('Authentication token is required', 401));
    return;
  }

  void (async () => {
    try {
      const authService = req.container?.resolve(AuthService) ?? container.resolve(AuthService);
      const user = await authService.getAuthenticatedUser(token);

      req.user = {
        id: user.id,
        sub: user.id,
        email: user.email,
        name: user.name ?? undefined,
        role: user.role,
      };
      next();
    } catch (error) {
      next(error);
    }
  })();
}

// Restrict access based on user roles
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    const role = req.user.role ?? Roles.USER;
    if (!roles.includes(role)) {
      next(new AppError('Forbidden', 403));
      return;
    }

    next();
  };
}
