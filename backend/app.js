const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Initialize Express
const app = express();

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Connect to DB
connectDB();

module.exports = app;