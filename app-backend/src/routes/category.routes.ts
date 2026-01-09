import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';

const router = Router();

// GET /categories - Get all categories with pagination
router.get('/categories', (req, res) => categoryController.getAll(req, res));

// GET /category/:id - Get a single category
router.get('/category/:id', (req, res) => categoryController.getById(req, res));

// POST /category - Create a new category
router.post('/category', (req, res) => categoryController.create(req, res));

// PUT /category/:id - Update a category
router.put('/category/:id', (req, res) => categoryController.update(req, res));

// DELETE /category/:id - Delete a category
router.delete('/category/:id', (req, res) => categoryController.delete(req, res));

export default router;
