const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

// Import Passport configuration
require('../config/passport')(passport);

// Import routes
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const recipeRoutes = require('../routes/recipe');
const blogRoutes = require('../routes/blog');
const savedRecipeRoutes = require('../routes/savedRecipe');
const commentRoutes = require('../routes/comment');
const paymentRoutes = require('../routes/payment');
const transactionRoutes = require('../routes/transactionRoutes');
const notificationRoutes = require('../routes/notification');
const chatgptRoutes = require('../routes/chatgpt');
const aiRoutes = require('../routes/ai');
const menuRoutes = require('../routes/menuRoutes');
const premiumRoutes = require('../routes/premiumRoutes');

const app = express();

// Basic error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something broke!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Passport and Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'tienvu113',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://exe-web-cooking.vercel.app', 'https://exe-web-cooking-fe.vercel.app']
    : ['https://localhost:3000', 'http://localhost:3000', 'https://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/saved-recipes', savedRecipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chatgpt', chatgptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/premium', premiumRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app; 