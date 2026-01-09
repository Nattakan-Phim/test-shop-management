import type { Request, Response } from 'express';
import { productService } from '../services/product.service.js';
import {
    CreateProductSchema,
    UpdateProductSchema,
    type CreateProductDto,
    type UpdateProductDto,
} from '../schemas/product.schema.js';
import { PaginationQuerySchema, IdParamSchema, DeleteQuerySchema } from '../schemas/common.schema.js';
import { ZodError } from 'zod';

export class ProductController {
    /**
     * GET /products - Get all products with pagination
     */
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const query = PaginationQuerySchema.parse(req.query);
            const result = await productService.findAll(query);
            res.json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /product/:id - Get a single product
     */
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = IdParamSchema.parse(req.params);
            const product = await productService.findById(id);

            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            res.json(product);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * POST /product - Create a new product
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = CreateProductSchema.parse(req.body);
            const product = await productService.create(data);
            res.status(201).json(product);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /product/:id - Update a product
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = IdParamSchema.parse(req.params);
            const data = UpdateProductSchema.parse(req.body);

            const product = await productService.update(id, data);

            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            res.json(product);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * DELETE /product/:id - Delete a product (soft delete by default)
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = IdParamSchema.parse(req.params);
            const { hard } = DeleteQuerySchema.parse(req.query);

            const product = hard
                ? await productService.hardDelete(id)
                : await productService.softDelete(id);

            if (!product) {
                res.status(404).json({ message: 'Product not found' });
                return;
            }

            res.json({ message: 'Product deleted successfully', product });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const productController = new ProductController();
