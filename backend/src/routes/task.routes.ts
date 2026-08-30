import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyFirebaseToken } from '../middleware/auth';
import {
  getTasks,
  getTaskNotifications,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '../controllers/task.controller';

const router = Router();

router.use(verifyFirebaseToken); // every route below requires a valid Firebase ID token

router.get('/', asyncHandler(getTasks));
router.get('/notifications', asyncHandler(getTaskNotifications));
router.post('/', asyncHandler(createTask));
router.put('/:id', asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));
router.patch('/:id/toggle', asyncHandler(toggleTaskCompletion));

export default router;
