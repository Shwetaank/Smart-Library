import { z } from 'zod';

export const uploadFromUrlSchema = z.object({
  body: z.object({
    url: z.string().url('A valid URL for the cover image must be provided.'),
  }),
});
