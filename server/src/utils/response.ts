import type { ApiResponse } from '../types/common.js';

export function buildResponse<T>(message: string, data: T | null = null, errors: Record<string, string[]> | null = null): ApiResponse<T> {
  return {
    success: !errors,
    message,
    data,
    errors,
  };
}
