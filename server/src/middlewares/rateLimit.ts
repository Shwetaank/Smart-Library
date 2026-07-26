import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { AppError } from '../utils/appError.js';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

// Create a simple in-memory rate limiter
export function createRateLimiter({ windowMs, maxRequests }: RateLimitOptions) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, _res: Response, next: NextFunction): void => {
    const now = Date.now();
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    const key = `${ip ?? 'unknown'}:${req.originalUrl}`;
    const current = buckets.get(key);

    // Create or reset the request bucket
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    current.count += 1;

    // Block requests exceeding the limit
    if (current.count > maxRequests) {
      next(new AppError('Too many requests, please try again later', 429));
      return;
    }

    next();
  };
}