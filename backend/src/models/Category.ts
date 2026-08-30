import { Schema, model, Types } from 'mongoose';

export interface ICategory {
  name: string;
  color: string;
  userEmail: string;
  createdAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  color: { type: String, default: '#6366f1' },
  userEmail: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

categorySchema.index({ userEmail: 1, name: 1 }, { unique: true });

export const Category = model<ICategory>('Category', categorySchema);
