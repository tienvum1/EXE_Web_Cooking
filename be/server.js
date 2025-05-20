require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


// Import routes
const authRoutes = require('./routes/auth');
 const userRoutes = require('./routes/user');
 const recipeRoutes = require('./routes/recipe');
// ... (các route khác nếu cần)

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3002', 
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
 app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
// ... (các route khác nếu cần)

app.get('/', (req, res) => res.send('API is running!'));

// Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cooking';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });