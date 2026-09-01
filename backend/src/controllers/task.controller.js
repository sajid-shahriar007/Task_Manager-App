import { Task } from '../models/Task.js';
import { AppError } from '../middleware/errorHandler.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';

// GET /api/tasks?status=&priority=&category=&search=&page=&limit=
export async function getTasks(req, res) {
  const userEmail = req.user.email;
  const { status, priority, category, search } = req.query;

  // Pagination defaults: page 1, 100 tasks per page
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 100));
  const skip = (page - 1) * limit;

  const filter = { userEmail };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('category').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// GET /api/tasks/notifications — tasks that are overdue or due within 24h
export async function getTaskNotifications(req, res) {
  const userEmail = req.user.email;
  const soon = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [overdue, dueSoon] = await Promise.all([
    Task.find({ userEmail, completed: false, dueDate: { $ne: null, $lt: new Date() } }).sort({ dueDate: 1 }),
    Task.find({ userEmail, completed: false, dueDate: { $gte: new Date(), $lte: soon } }).sort({ dueDate: 1 }),
  ]);

  res.json({ overdue, dueSoon, count: overdue.length + dueSoon.length });
}

export async function createTask(req, res) {
  const data = createTaskSchema.parse(req.body);
  if (data.userEmail !== req.user.email) {
    throw new AppError('Cannot create a task for another user', 403);
  }
  const task = await Task.create({
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  });
  res.status(201).json(task);
}

export async function updateTask(req, res) {
  const data = updateTaskSchema.parse(req.body);
  const task = await Task.findOne({ _id: req.params.id, userEmail: req.user.email });
  if (!task) throw new AppError('Task not found', 404);

  Object.assign(task, {
    ...data,
    dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : task.dueDate,
  });
  await task.save();
  res.json(task);
}

export async function deleteTask(req, res) {
  const result = await Task.deleteOne({ _id: req.params.id, userEmail: req.user.email });
  if (result.deletedCount === 0) throw new AppError('Task not found', 404);
  res.json({ message: 'Task deleted', deletedCount: result.deletedCount });
}

export async function toggleTaskCompletion(req, res) {
  const task = await Task.findOne({ _id: req.params.id, userEmail: req.user.email });
  if (!task) throw new AppError('Task not found', 404);

  task.completed = !task.completed;
  task.status = task.completed ? 'completed' : 'pending';
  await task.save();
  res.json(task);
}
