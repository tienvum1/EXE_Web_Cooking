const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://exe-web-cooking.vercel.app', 'https://exe-web-cooking-fe.vercel.app'],
  credentials: true
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true,
    sameSite: 'none'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Import and use routes
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app; 