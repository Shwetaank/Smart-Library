import { z } from 'zod';

// Validate upload from URL request
export const uploadFromUrlSchema = z.object({
  body: z.object({
    url: z.url({
      message: 'A valid URL for the cover image must be provided.',
    }),
  }),
});