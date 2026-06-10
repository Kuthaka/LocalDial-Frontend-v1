import { z } from 'zod'

export const MainCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
})

export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  main_category_id: z.string().uuid('Invalid Main Category ID').optional().nullable(),
  description: z.string().max(200).optional().nullable(),
})

export const SubCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  category_id: z.string().uuid('Invalid Category ID'),
})
