import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';

const router = Router();

// GET /products - Get all products with pagination
router.get('/products', (req, res) => productController.getAll(req, res));

// GET /product/:id - Get a single product
router.get('/product/:id', (req, res) => productController.getById(req, res));

// POST /product - Create a new product
router.post('/product', (req, res) => productController.create(req, res));

// PUT /product/:id - Update a product
router.put('/product/:id', (req, res) => productController.update(req, res));

// DELETE /product/:id - Delete a product
router.delete('/product/:id', (req, res) => productController.delete(req, res));

export default router;
