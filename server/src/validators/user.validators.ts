import { z } from 'zod';

export const userQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    role: z.enum(['USER', 'LIBRARIAN', 'ADMIN']).optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(['USER', 'LIBRARIAN', 'ADMIN']),
  }),
});
