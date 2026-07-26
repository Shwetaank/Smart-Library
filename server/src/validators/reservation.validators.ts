import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    bookId: z.string().min(1),
  }),
});
