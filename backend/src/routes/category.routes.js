import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/', asyncHandler(getCategories));
router.post('/', asyncHandler(createCategory));
router.put('/:id', asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export default router;
