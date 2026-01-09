import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Pagination Query Schema
export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    limit: z.coerce.number().int().min(1).max(100).default(10).openapi({ example: 10 }),
    search: z.string().optional().openapi({ example: 'search term', description: 'Search term (supports RegEx)' }),
}).openapi('PaginationQuery');

// Pagination Response Schema
export const PaginationSchema = z.object({
    page: z.number().int().openapi({ example: 1 }),
    pageSize: z.number().int().openapi({ example: 10 }),
    totalPage: z.number().int().openapi({ example: 10 }),
    totalCount: z.number().int().openapi({ example: 100 }),
}).openapi('Pagination');

// Generic Paginated Response factory
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T, name: string) => {
    return z.object({
        data: z.array(itemSchema),
        pagination: PaginationSchema,
    }).openapi(name);
};

// ID Parameter Schema
export const IdParamSchema = z.object({
    id: z.string().min(1).openapi({ example: '507f1f77bcf86cd799439011', description: 'MongoDB ObjectId' }),
}).openapi('IdParam');

// Delete Query Schema
export const DeleteQuerySchema = z.object({
    hard: z.coerce.boolean().default(false).openapi({ example: false, description: 'Set to true for permanent deletion' }),
}).openapi('DeleteQuery');

// Types
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
