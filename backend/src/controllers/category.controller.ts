import { Response } from 'express';
import { Category } from '../models/Category';
import { Task } from '../models/Task';
import { AppError } from '../middleware/errorHandler';
import { createCategorySchema } from '../schemas/category.schema';
import { AuthedRequest } from '../middleware/auth';

export async function getCategories(req: AuthedRequest, res: Response) {
  const categories = await Category.find({ userEmail: req.user!.email }).sort({ name: 1 });
  res.json(categories);
}

export async function createCategory(req: AuthedRequest, res: Response) {
  const data = createCategorySchema.parse(req.body);
  if (data.userEmail !== req.user!.email) {
    throw new AppError('Cannot create a category for another user', 403);
  }
  const category = await Category.create(data);
  res.status(201).json(category);
}

export async function deleteCategory(req: AuthedRequest, res: Response) {
  const category = await Category.findOne({ _id: req.params.id, userEmail: req.user!.email });
  if (!category) throw new AppError('Category not found', 404);

  await Category.deleteOne({ _id: category._id });
  await Task.updateMany({ category: category._id }, { $set: { category: null } });
  res.json({ message: 'Category deleted' });
}
