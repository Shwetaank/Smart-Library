import { z } from 'zod';

export const createGenreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
  }),
});

export const updateGenreSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
  }),
});

export const genreQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
  }),
});
