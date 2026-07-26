import type { NextFunction, Request, Response } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { z } from 'zod';
import { AppError } from '../utils/appError.js';

export function validateRequest(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req);
    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;
      next(new AppError('Validation failed', 400, flattened));
      return;
    }

    const parsedData = result.data as { body?: unknown; query?: ParsedQs };
    req.body = parsedData.body ?? req.body;
    if (parsedData.query) {
      Object.assign(req.query, parsedData.query);
    }
    next();
  };
}
