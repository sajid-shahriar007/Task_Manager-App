import { Schema, model, Types } from 'mongoose';



const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 2000 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date, default: null },
    category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    userEmail: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

taskSchema.index({ userEmail: 1, dueDate: 1 });
taskSchema.index({ userEmail: 1, status: 1 });

export const Task = model('Task', taskSchema);
