import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { AppError } from '../utils/appError.js';
import { buildResponse } from '../utils/response.js';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json(buildResponse(error.message, null, error.details ?? { general: [error.message] }));
    return;
  }

  if (error instanceof Error) {
    res
      .status(500)
      .json(buildResponse('Internal server error', null, { general: [error.message] }));
    return;
  }

  res
    .status(500)
    .json(buildResponse('Internal server error', null, { general: ['Unknown error'] }));
};
