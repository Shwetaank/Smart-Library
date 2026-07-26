import type { NextFunction, Request, Response } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { z } from 'zod';
import { AppError } from '../utils/appError.js';

// Validate incoming request data using a Zod schema
export function validateRequest(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req);

    // Return validation errors if the request is invalid
    if (!result.success) {
      // Build fieldErrors from issues to avoid deprecated `flatten()` signature
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.length ? issue.path.join('.') : '_';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      }
      next(new AppError('Validation failed', 400, fieldErrors));
      return;
    }

    // Replace request data with validated values
    const parsedData = result.data as { body?: unknown; query?: ParsedQs };
    req.body = parsedData.body ?? req.body;

    if (parsedData.query) {
      Object.assign(req.query, parsedData.query);
    }

    next();
  };
}