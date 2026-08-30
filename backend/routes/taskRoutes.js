const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get all tasks for a user
router.get('/user/:email', taskController.getTasksByUser);

// Create a new task
router.post('/', taskController.createTask);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Toggle task completion
router.patch('/:id/toggle', taskController.toggleTaskCompletion);

module.exports = router;