import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Populated Category (when product includes category details)
const PopulatedCategorySchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string().optional(),
}).openapi('PopulatedCategory');

// Base Product Schema
export const ProductSchema = z.object({
    _id: z.string().openapi({ example: '507f1f77bcf86cd799439011' }),
    name: z.string().openapi({ example: 'Product Name' }),
    description: z.string().optional().openapi({ example: 'Product description' }),
    price: z.number().min(0).openapi({ example: 99.99 }),
    quantity: z.number().int().min(0).openapi({ example: 100 }),
    categoryId: PopulatedCategorySchema.openapi({ description: 'Populated category details' }),
    isDeleted: z.boolean().openapi({ example: false }),
    createdAt: z.string().datetime().optional().openapi({ example: '2026-01-09T10:00:00.000Z' }),
    updatedAt: z.string().datetime().optional().openapi({ example: '2026-01-09T10:00:00.000Z' }),
}).openapi('Product');

// Create Product DTO
export const CreateProductSchema = z.object({
    name: z.string().min(1, 'Product name is required').openapi({ example: 'New Product' }),
    description: z.string().optional().openapi({ example: 'Product description' }),
    price: z.number().min(0, 'Price cannot be negative').openapi({ example: 99.99 }),
    quantity: z.number().int().min(0).default(0).openapi({ example: 100 }),
    categoryId: z.string().min(1, 'Category ID is required').openapi({ example: '507f1f77bcf86cd799439011' }),
}).openapi('CreateProduct');

// Update Product DTO
export const UpdateProductSchema = z.object({
    name: z.string().min(1).optional().openapi({ example: 'Updated Product' }),
    description: z.string().optional().openapi({ example: 'Updated description' }),
    price: z.number().min(0).optional().openapi({ example: 149.99 }),
    quantity: z.number().int().min(0).optional().openapi({ example: 50 }),
    categoryId: z.string().optional().openapi({ example: '507f1f77bcf86cd799439011' }),
}).openapi('UpdateProduct');

// Types inferred from schemas
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
