import { Category } from '../models/Category.js';
import { Task } from '../models/Task.js';
import { AppError } from '../middleware/errorHandler.js';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema.js';

export async function getCategories(req, res) {
  const categories = await Category.find({ userEmail: req.user.email }).sort({ name: 1 });
  res.json(categories);
}

export async function createCategory(req, res) {
  const data = createCategorySchema.parse(req.body);
  if (data.userEmail !== req.user.email) {
    throw new AppError('Cannot create a category for another user', 403);
  }
  const category = await Category.create(data);
  res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const data = updateCategorySchema.parse(req.body);
  const category = await Category.findOne({ _id: req.params.id, userEmail: req.user.email });
  if (!category) throw new AppError('Category not found', 404);

  if (data.name !== undefined) category.name = data.name;
  if (data.color !== undefined) category.color = data.color;
  await category.save();
  res.json(category);
}

export async function deleteCategory(req, res) {
  const category = await Category.findOne({ _id: req.params.id, userEmail: req.user.email });
  if (!category) throw new AppError('Category not found', 404);

  await Category.deleteOne({ _id: category._id });
  await Task.updateMany({ category: category._id }, { $set: { category: null } });
  res.json({ message: 'Category deleted' });
}
