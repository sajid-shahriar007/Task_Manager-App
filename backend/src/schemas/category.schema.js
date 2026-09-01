import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#6366f1'),
  userEmail: z.string().email(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
}).refine((data) => data.name !== undefined || data.color !== undefined, {
  message: 'At least one of name or color must be provided',
});
