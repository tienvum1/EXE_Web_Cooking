const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');
const blogRoutes = require('./routes/blog');
const feedbackRoutes = require('./routes/feedback');
const healthRoutes = require('./routes/health');
const categoryRoutes = require('./routes/category');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => res.send('API is running!'));

module.exports = app;