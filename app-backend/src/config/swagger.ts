import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
    CategorySchema,
    CreateCategorySchema,
    UpdateCategorySchema,
} from '../schemas/category.schema.js';
import {
    ProductSchema,
    CreateProductSchema,
    UpdateProductSchema,
} from '../schemas/product.schema.js';
import {
    PaginationQuerySchema,
    PaginationSchema,
    IdParamSchema,
    DeleteQuerySchema,
    createPaginatedResponseSchema,
} from '../schemas/common.schema.js';

// Create registry
const registry = new OpenAPIRegistry();

// Register schemas
registry.register('Category', CategorySchema);
registry.register('CreateCategory', CreateCategorySchema);
registry.register('UpdateCategory', UpdateCategorySchema);
registry.register('Product', ProductSchema);
registry.register('CreateProduct', CreateProductSchema);
registry.register('UpdateProduct', UpdateProductSchema);
registry.register('Pagination', PaginationSchema);

// Create paginated response schemas
const PaginatedCategoriesSchema = createPaginatedResponseSchema(CategorySchema, 'PaginatedCategories');
const PaginatedProductsSchema = createPaginatedResponseSchema(ProductSchema, 'PaginatedProducts');

// ============ CATEGORY ROUTES ============

// GET /categories
registry.registerPath({
    method: 'get',
    path: '/categories',
    tags: ['Categories'],
    summary: 'Get all categories',
    description: 'Retrieve all categories with pagination and optional RegEx search',
    request: {
        query: PaginationQuerySchema,
    },
    responses: {
        200: {
            description: 'List of categories with pagination',
            content: {
                'application/json': {
                    schema: PaginatedCategoriesSchema,
                },
            },
        },
    },
});

// GET /category/:id
registry.registerPath({
    method: 'get',
    path: '/category/{id}',
    tags: ['Categories'],
    summary: 'Get category by ID',
    description: 'Retrieve a single category by its ID',
    request: {
        params: IdParamSchema,
    },
    responses: {
        200: {
            description: 'Category details',
            content: {
                'application/json': {
                    schema: CategorySchema,
                },
            },
        },
        404: {
            description: 'Category not found',
        },
    },
});

// POST /category
registry.registerPath({
    method: 'post',
    path: '/category',
    tags: ['Categories'],
    summary: 'Create category',
    description: 'Create a new category',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateCategorySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Created category',
            content: {
                'application/json': {
                    schema: CategorySchema,
                },
            },
        },
        400: {
            description: 'Invalid input',
        },
        409: {
            description: 'Category name already exists',
        },
    },
});

// PUT /category/:id
registry.registerPath({
    method: 'put',
    path: '/category/{id}',
    tags: ['Categories'],
    summary: 'Update category',
    description: 'Update an existing category',
    request: {
        params: IdParamSchema,
        body: {
            content: {
                'application/json': {
                    schema: UpdateCategorySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Updated category',
            content: {
                'application/json': {
                    schema: CategorySchema,
                },
            },
        },
        404: {
            description: 'Category not found',
        },
        409: {
            description: 'Category name already exists',
        },
    },
});

// DELETE /category/:id
registry.registerPath({
    method: 'delete',
    path: '/category/{id}',
    tags: ['Categories'],
    summary: 'Delete category',
    description: 'Delete a category (soft delete by default, use ?hard=true for permanent deletion)',
    request: {
        params: IdParamSchema,
        query: DeleteQuerySchema,
    },
    responses: {
        200: {
            description: 'Category deleted successfully',
        },
        404: {
            description: 'Category not found',
        },
    },
});

// ============ PRODUCT ROUTES ============

// GET /products
registry.registerPath({
    method: 'get',
    path: '/products',
    tags: ['Products'],
    summary: 'Get all products',
    description: 'Retrieve all products with pagination and optional RegEx search',
    request: {
        query: PaginationQuerySchema,
    },
    responses: {
        200: {
            description: 'List of products with pagination',
            content: {
                'application/json': {
                    schema: PaginatedProductsSchema,
                },
            },
        },
    },
});

// GET /product/:id
registry.registerPath({
    method: 'get',
    path: '/product/{id}',
    tags: ['Products'],
    summary: 'Get product by ID',
    description: 'Retrieve a single product by its ID',
    request: {
        params: IdParamSchema,
    },
    responses: {
        200: {
            description: 'Product details',
            content: {
                'application/json': {
                    schema: ProductSchema,
                },
            },
        },
        404: {
            description: 'Product not found',
        },
    },
});

// POST /product
registry.registerPath({
    method: 'post',
    path: '/product',
    tags: ['Products'],
    summary: 'Create product',
    description: 'Create a new product',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateProductSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Created product',
            content: {
                'application/json': {
                    schema: ProductSchema,
                },
            },
        },
        400: {
            description: 'Invalid input',
        },
    },
});

// PUT /product/:id
registry.registerPath({
    method: 'put',
    path: '/product/{id}',
    tags: ['Products'],
    summary: 'Update product',
    description: 'Update an existing product',
    request: {
        params: IdParamSchema,
        body: {
            content: {
                'application/json': {
                    schema: UpdateProductSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Updated product',
            content: {
                'application/json': {
                    schema: ProductSchema,
                },
            },
        },
        404: {
            description: 'Product not found',
        },
    },
});

// DELETE /product/:id
registry.registerPath({
    method: 'delete',
    path: '/product/{id}',
    tags: ['Products'],
    summary: 'Delete product',
    description: 'Delete a product (soft delete by default, use ?hard=true for permanent deletion)',
    request: {
        params: IdParamSchema,
        query: DeleteQuerySchema,
    },
    responses: {
        200: {
            description: 'Product deleted successfully',
        },
        404: {
            description: 'Product not found',
        },
    },
});

// ============ HEALTH CHECK ============

registry.registerPath({
    method: 'get',
    path: '/',
    summary: 'Health check',
    description: 'Returns a welcome message',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'text/plain': {
                    schema: z.string().openapi({ example: 'Hello, TypeScript with Express!' }),
                },
            },
        },
    },
});

// Generate OpenAPI document
const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerDocument = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        title: 'Shop Management API',
        version: '1.0.0',
        description: 'API documentation for Shop Management application - Products and Categories',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    tags: [
        { name: 'Products', description: 'Product management endpoints' },
        { name: 'Categories', description: 'Category management endpoints' },
    ],
});
