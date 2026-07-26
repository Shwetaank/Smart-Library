import { z } from 'zod';

// Validate book creation request
export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    isbn: z.string().min(1),
    description: z.string().optional(),
    publishedYear: z.number().int().positive().optional(),
    genreId: z.string().min(1),
    coverUrl: z.url().optional(),
    quantity: z.number().int().positive().optional(),
  }),
});

// Validate book update request
export const updateBookSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    isbn: z.string().min(1).optional(),
    description: z.string().optional(),
    publishedYear: z.number().int().positive().optional(),
    genreId: z.string().min(1).optional(),
    coverUrl: z.url().nullable().optional(),
    quantity: z.number().int().positive().optional(),
  }),
});

// Validate book query parameters
export const bookQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    genreId: z.string().optional(),
    sortBy: z.enum(['createdAt', 'title', 'author', 'publishedYear']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
