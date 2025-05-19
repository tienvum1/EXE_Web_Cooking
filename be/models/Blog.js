const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
});
module.exports = mongoose.model('Blog', BlogSchema);