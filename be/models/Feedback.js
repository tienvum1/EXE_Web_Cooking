const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Feedback', FeedbackSchema);