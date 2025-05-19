const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

mongoose.connect(config.MONGO_URI)
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });