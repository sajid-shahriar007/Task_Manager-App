const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// Get all tasks for a specific user
exports.getTasksByUser = async (req, res) => {
  try {
    const db = getDB();
    const userEmail = req.params.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const tasks = await db.collection('tasks')
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const db = getDB();
    const { title, description, priority, dueDate, userEmail } = req.body;
    
    if (!userEmail || !title) {
      return res.status(400).json({ error: 'Title and user email are required' });
    }

    const newTask = {
      title,
      description: description || '',
      priority: priority || 'medium',
      status: 'pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: false,
      userEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('tasks').insertOne(newTask);
    const createdTask = { _id: result.insertedId, ...newTask };
    
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ error: 'Invalid Data' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const db = getDB();
    const taskId = req.params.id;
    const { title, description, priority, status, dueDate, completed } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) updateData.completed = completed;

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(taskId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(400).json({ error: 'Update Failed' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const db = getDB();
    const taskId = req.params.id;

    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(400).json({ error: 'Delete Failed' });
  }
};

// Toggle task completion
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const db = getDB();
    const taskId = req.params.id;

    const task = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { 
        $set: { 
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'pending',
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    res.json(updatedTask.value);
  } catch (error) {
    console.error('Toggle completion error:', error);
    res.status(400).json({ error: 'Toggle Failed' });
  }
};