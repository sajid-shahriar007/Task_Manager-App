import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../middleware/auth.js';
import {
  getTasks,
  getTaskNotifications,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '../controllers/task.controller.js';

const router = Router();

router.use(verifyToken); // every route below requires a valid bearer token

router.get('/', asyncHandler(getTasks));
router.get('/notifications', asyncHandler(getTaskNotifications));
router.post('/', asyncHandler(createTask));
router.put('/:id', asyncHandler(updateTask));
router.delete('/:id', asyncHandler(deleteTask));
router.patch('/:id/toggle', asyncHandler(toggleTaskCompletion));

export default router;
