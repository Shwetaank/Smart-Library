import { z } from 'zod';

export const auditQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    entity: z.string().optional(),
    userId: z.string().optional(),
  }),
});
