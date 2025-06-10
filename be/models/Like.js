const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create compound index to ensure a user can only like a recipe once
LikeSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema); 