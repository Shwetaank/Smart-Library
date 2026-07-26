import { z } from 'zod';

export const borrowLoanSchema = z.object({
  body: z.object({
    bookId: z.string().min(1),
  }),
});

export const returnLoanSchema = z.object({
  body: z.object({
    loanId: z.string().min(1),
  }),
});

export const renewLoanSchema = z.object({
  body: z.object({
    loanId: z.string().min(1),
  }),
});
