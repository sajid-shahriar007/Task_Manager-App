import { Response } from 'express';
import { Task } from '../models/Task';
import { AppError } from '../middleware/errorHandler';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import { AuthedRequest } from '../middleware/auth';

// GET /api/tasks?status=&priority=&category=&search=
export async function getTasks(req: AuthedRequest, res: Response) {
  const userEmail = req.user!.email;
  const { status, priority, category, search } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = { userEmail };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const tasks = await Task.find(filter).populate('category').sort({ createdAt: -1 });
  res.json(tasks);
}

// GET /api/tasks/notifications — tasks that are overdue or due within 24h
export async function getTaskNotifications(req: AuthedRequest, res: Response) {
  const userEmail = req.user!.email;
  const soon = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [overdue, dueSoon] = await Promise.all([
    Task.find({ userEmail, completed: false, dueDate: { $ne: null, $lt: new Date() } }).sort({ dueDate: 1 }),
    Task.find({ userEmail, completed: false, dueDate: { $gte: new Date(), $lte: soon } }).sort({ dueDate: 1 }),
  ]);

  res.json({ overdue, dueSoon, count: overdue.length + dueSoon.length });
}

export async function createTask(req: AuthedRequest, res: Response) {
  const data = createTaskSchema.parse(req.body);
  if (data.userEmail !== req.user!.email) {
    throw new AppError('Cannot create a task for another user', 403);
  }
  const task = await Task.create({
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  });
  res.status(201).json(task);
}

export async function updateTask(req: AuthedRequest, res: Response) {
  const data = updateTaskSchema.parse(req.body);
  const task = await Task.findOne({ _id: req.params.id, userEmail: req.user!.email });
  if (!task) throw new AppError('Task not found', 404);

  Object.assign(task, {
    ...data,
    dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : task.dueDate,
  });
  await task.save();
  res.json(task);
}

export async function deleteTask(req: AuthedRequest, res: Response) {
  const result = await Task.deleteOne({ _id: req.params.id, userEmail: req.user!.email });
  if (result.deletedCount === 0) throw new AppError('Task not found', 404);
  res.json({ message: 'Task deleted', deletedCount: result.deletedCount });
}

export async function toggleTaskCompletion(req: AuthedRequest, res: Response) {
  const task = await Task.findOne({ _id: req.params.id, userEmail: req.user!.email });
  if (!task) throw new AppError('Task not found', 404);

  task.completed = !task.completed;
  task.status = task.completed ? 'completed' : 'pending';
  await task.save();
  res.json(task);
}
