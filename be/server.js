// app.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
  }));
  
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('Healthy Cooking API is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });