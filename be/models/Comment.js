const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe:  { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema); 