import { Router } from 'express';
import productRoutes from './product.routes.js';
import categoryRoutes from './category.routes.js';

const router = Router();

// Mount routes
router.use(productRoutes);
router.use(categoryRoutes);

export default router;
