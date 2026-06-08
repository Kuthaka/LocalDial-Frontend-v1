import { z } from 'zod'

export const CategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .min(3, 'Category name must be at least 3 characters long')
    .max(50, 'Category name must be less than 50 characters'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .nullable(),
})
