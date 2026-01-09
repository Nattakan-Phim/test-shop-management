import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Base Category Schema
export const CategorySchema = z.object({
    _id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    name: z.string().openapi({ example: 'Electronics' }),
    description: z.string().optional().openapi({ example: 'Electronic devices and accessories' }),
    isDeleted: z.boolean().openapi({ example: false }),
    createdAt: z.string().datetime().optional().openapi({ example: '2026-01-09T10:00:00.000Z' }),
    updatedAt: z.string().datetime().optional().openapi({ example: '2026-01-09T10:00:00.000Z' }),
}).openapi('Category');

// Create Category DTO
export const CreateCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required').openapi({ example: 'Electronics' }),
    description: z.string().optional().openapi({ example: 'Electronic devices and accessories' }),
}).openapi('CreateCategory');

// Update Category DTO
export const UpdateCategorySchema = z.object({
    name: z.string().min(1).optional().openapi({ example: 'Updated Category' }),
    description: z.string().optional().openapi({ example: 'Updated description' }),
}).openapi('UpdateCategory');

// Types inferred from schemas
export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
