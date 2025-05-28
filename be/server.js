require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');
const blogRoutes = require('./routes/blog');
const savedRecipeRoutes = require('./routes/savedRecipe');
const commentRoutes = require('./routes/comment');
const paymentRoutes = require('./routes/payment');
const transactionRoutes = require('./routes/transaction');
const notificationRoutes = require('./routes/notification');

// ... (các route khác nếu cần)

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: [ 'https://localhost:3001'],
  credentials: true
}));
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


// ... (các route khác nếu cần)

app.get('/', (req, res) => res.send('API is running!'));

// Kết nối MongoDB và khởi động server
const PORT = process.env.PORT || 4567;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cooking';

const sslOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

const httpsServer = https.createServer(sslOptions, app);
const io = new Server(httpsServer, { cors: { origin: ['https://localhost:3000', 'http://localhost:3000'], credentials: true } });
app.set('io', io);
global.io = io;

mongoose.connect(MONGO_URI)
  .then(() => {
    httpsServer.listen(PORT, () => {
      console.log(`Server running at https://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Socket.io connection
io.on('connection', (socket) => {
  // Nhận userId khi client connect
  socket.on('register', (userId) => {
    socket.join(userId);
  });
});