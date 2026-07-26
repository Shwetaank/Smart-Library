import { z } from 'zod';

// Validate login request
export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string().min(8),
  }),
});

// Validate user registration request
export const registerSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Invalid email format' }),
    password: z.string().min(8),
    name: z.string().min(1).optional(),
  }),
});

// Validate profile update request
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.email({ message: 'Invalid email format' }).optional(),
  }),
});
