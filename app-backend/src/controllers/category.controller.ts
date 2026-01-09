import type { Request, Response } from 'express';
import { categoryService } from '../services/category.service.js';
import {
    CreateCategorySchema,
    UpdateCategorySchema,
    type CreateCategoryDto,
    type UpdateCategoryDto,
} from '../schemas/category.schema.js';
import { PaginationQuerySchema, IdParamSchema, DeleteQuerySchema } from '../schemas/common.schema.js';
import { ZodError } from 'zod';

export class CategoryController {
    /**
     * GET /categories - Get all categories with pagination
     */
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const query = PaginationQuerySchema.parse(req.query);
            const result = await categoryService.findAll(query);
            res.json(result);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /category/:id - Get a single category
     */
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = IdParamSchema.parse(req.params);
            const category = await categoryService.findById(id);

            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }

            res.json(category);
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error fetching category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * POST /category - Create a new category
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const data = CreateCategorySchema.parse(req.body);
            const category = await categoryService.create(data);
            res.status(201).json(category);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            if ((error as { code?: number }).code === 11000) {
                res.status(409).json({ message: 'Category name already exists' });
                return;
            }
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /category/:id - Update a category
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = IdParamSchema.parse(req.params);
            const data = UpdateCategorySchema.parse(req.body);

            const category = await categoryService.update(id, data);

            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }

            res.json(category);
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            if ((error as { code?: number }).code === 11000) {
                res.status(409).json({ message: 'Category name already exists' });
                return;
            }
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * DELETE /category/:id - Delete a category (soft delete by default)
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = IdParamSchema.parse(req.params);
            const { hard } = DeleteQuerySchema.parse(req.query);

            const category = hard
                ? await categoryService.hardDelete(id)
                : await categoryService.softDelete(id);

            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }

            res.json({ message: 'Category deleted successfully', category });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ message: 'Validation error', errors: error.issues });
                return;
            }
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const categoryController = new CategoryController();
