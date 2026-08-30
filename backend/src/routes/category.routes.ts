import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyFirebaseToken } from '../middleware/auth';
import { getCategories, createCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();

router.use(verifyFirebaseToken);

router.get('/', asyncHandler(getCategories));
router.post('/', asyncHandler(createCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export default router;
